import { createClient } from '@supabase/supabase-js';

const main = document.querySelector('#studio-main');
const dimensions = ['The Mind', 'The Heart', 'The World', 'The Imagination', 'The Journey'];
const backupKey = 'kadyverse-studio-local-v1';
const state = {
  client: null,
  user: null,
  entries: [],
  selectedId: null,
  filter: 'all',
  query: '',
  history: [],
  saving: new Map(),
  saveAgain: new Set(),
  loginMessage: ''
};

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);
const selectedEntry = () => state.entries.find(entry => entry.id === state.selectedId);
const localDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const formatTimestamp = value => value
  ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  : 'Not saved yet';

function showMessage(message, type = 'error') {
  const region = main.querySelector('[data-message]');
  if (!region) return;
  region.textContent = message;
  region.dataset.type = type;
  region.hidden = !message;
}

function renderConfigurationError() {
  main.innerHTML = `<section class="studio-login"><p class="eyebrow"><span class="eyebrow-line"></span>Private writing space</p><h1>Your studio is<br><em>almost ready.</em></h1><p class="studio-description">This deployment needs the public Supabase project URL and anon key in its build environment. No private drafts are stored in this site until Supabase is configured.</p><a class="text-link" href="/">Return to KadyVerse <span aria-hidden="true">→</span></a></section>`;
}

function renderLogin(error = '') {
  main.innerHTML = `<section class="studio-login">
    <p class="eyebrow"><span class="eyebrow-line"></span>Private writing space</p>
    <h1>Come in,<br><em>when you're ready.</em></h1>
    <p class="studio-description">A quiet place for drafts, fragments, and thoughts still finding their shape.</p>
    <form class="studio-login-form" id="studio-login-form">
      <label for="studio-email">Owner email</label>
      <input id="studio-email" name="email" type="email" autocomplete="username" inputmode="email" required>
      <label for="studio-password">Password</label>
      <input id="studio-password" name="password" type="password" autocomplete="current-password" required>
      <button class="button button-dark" type="submit">Sign in <span aria-hidden="true">↗</span></button>
      <p class="studio-login-error" data-message ${error ? '' : 'hidden'}>${escapeHTML(error)}</p>
    </form>
    <p class="studio-login-note">Access is limited to the KadyVerse owner. There is no public registration.</p>
  </section>`;
}

function makeId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function slugify(value) {
  const slug = String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
  return slug || `note-${Date.now().toString(36)}`;
}

function safeImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function entryPayload(entry) {
  return {
    slug: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    content: entry.content,
    excerpt: entry.excerpt,
    dimension: entry.dimension,
    tags: entry.tags,
    entry_date: entry.entry_date,
    cover_image_url: entry.cover_image_url,
    published: entry.published,
    published_at: entry.published_at
  };
}

function fromCloud(row) {
  return { ...row, _baseUpdatedAt: row.updated_at, _dirty: false, _conflict: false };
}

function readLocal() {
  try {
    const stored = JSON.parse(localStorage.getItem(backupKey) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error('Could not read the local writing backup.', error);
    return [];
  }
}

function storeLocal() {
  try {
    localStorage.setItem(backupKey, JSON.stringify(state.entries));
    return true;
  } catch (error) {
    console.error('Could not save the local writing backup.', error);
    showMessage('This device could not save a local backup. Check available browser storage before continuing.');
    return false;
  }
}

function sortEntries() {
  state.entries.sort((a, b) => String(b.updated_at || b.created_at).localeCompare(String(a.updated_at || a.created_at)));
}

async function loadEntries() {
  showLoading('Loading your writing…');
  const { data: membership, error: membershipError } = await state.client
    .from('studio_owner').select('owner_id').eq('owner_id', state.user.id).maybeSingle();
  if (membershipError) throw membershipError;
  if (!membership) {
    state.loginMessage = 'This account is not authorised for the KadyVerse studio.';
    await state.client.auth.signOut();
    state.user = null;
    return;
  }

  const { data: rows, error } = await state.client.from('writing_entries').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  const cloudEntries = rows.map(fromCloud);
  const byId = new Map(cloudEntries.map(entry => [entry.id, entry]));
  const merged = [...cloudEntries];
  for (const local of readLocal()) {
    if (!local._dirty && !local._deleted) continue;
    const cloud = byId.get(local.id);
    if (!cloud) {
      if (!local._baseUpdatedAt) merged.push(local);
      continue;
    }
    if (local._baseUpdatedAt === cloud.updated_at) {
      const index = merged.findIndex(entry => entry.id === local.id);
      if (index >= 0) merged[index] = local;
    } else {
      const index = merged.findIndex(entry => entry.id === local.id);
      if (index >= 0) merged[index] = { ...local, _conflict: true, _cloud: cloud };
    }
  }
  state.entries = merged;
  sortEntries();
  state.selectedId = state.entries.find(entry => !entry._deleted)?.id || null;
  storeLocal();
  renderStudio();
  if (navigator.onLine) syncDirtyEntries();
}

function showLoading(message) {
  main.innerHTML = `<p class="studio-loading" role="status">${escapeHTML(message)}</p>`;
}

function statusLabel(entry) {
  if (entry._conflict) return 'Conflict to resolve';
  if (entry._dirty) return 'Saved on this device · syncing';
  return entry.published ? 'Published' : 'Private draft';
}

function visibleEntries() {
  const query = state.query.trim().toLowerCase();
  return state.entries.filter(entry => {
    if (entry._deleted) return false;
    if (state.filter === 'drafts' && entry.published) return false;
    if (state.filter === 'published' && !entry.published) return false;
    return !query || [entry.title, entry.content, entry.excerpt, entry.dimension, ...(entry.tags || [])]
      .join(' ').toLowerCase().includes(query);
  });
}

function renderEntryChoices() {
  const entries = visibleEntries();
  return entries.length ? entries.map(entry => `<button class="studio-entry-choice ${entry.id === state.selectedId ? 'is-selected' : ''}" type="button" data-select="${escapeHTML(entry.id)}">
      <span class="studio-entry-choice-title">${escapeHTML(entry.title || 'Untitled thought')}</span>
      <span class="studio-entry-choice-meta">${escapeHTML(entry.dimension)} · ${entry.published ? 'Published' : 'Draft'}</span>
      <time datetime="${escapeHTML(entry.updated_at || entry.created_at || '')}">${escapeHTML(formatTimestamp(entry.updated_at || entry.created_at))}</time>
    </button>`).join('') : `<p class="studio-empty-list">${state.query || state.filter !== 'all' ? 'Nothing matches this view.' : 'Your notebook is empty. Start with one thought.'}</p>`;
}

function renderList() {
  const entries = visibleEntries();
  return `<aside class="studio-sidebar">
    <div class="studio-list-heading"><div><p class="eyebrow"><span class="eyebrow-line"></span>Your notebook</p><span>${entries.length} ${entries.length === 1 ? 'piece' : 'pieces'}</span></div></div>
    <label class="sr-only" for="studio-search">Search your writing</label>
    <input class="studio-search" id="studio-search" type="search" placeholder="Find a thought…" value="${escapeHTML(state.query)}" autocomplete="off">
    <label class="sr-only" for="studio-filter">Filter writing</label>
    <select class="studio-filter" id="studio-filter">
      <option value="all" ${state.filter === 'all' ? 'selected' : ''}>All writing</option>
      <option value="drafts" ${state.filter === 'drafts' ? 'selected' : ''}>Private drafts</option>
      <option value="published" ${state.filter === 'published' ? 'selected' : ''}>Published</option>
    </select>
    <div class="studio-entry-list">${renderEntryChoices()}</div>
  </aside>`;
}

function renderEditor() {
  const entry = selectedEntry();
  if (!entry || entry._deleted) return `<section class="studio-editor studio-editor-empty"><span class="studio-empty-mark" aria-hidden="true">K.</span><h2>A page for whatever<br><em>is on your mind.</em></h2><p>Choose a piece from your notebook, or begin a new one.</p><button class="button button-dark" type="button" data-action="new">New writing <span aria-hidden="true">↗</span></button></section>`;
  const conflict = entry._conflict ? `<div class="studio-conflict" role="alert"><p>This piece changed in another session. Choose which version to keep before syncing.</p><div><button class="button button-outline" type="button" data-action="use-cloud">Use cloud version</button><button class="button button-dark" type="button" data-action="keep-local">Keep this version</button></div></div>` : '';
  return `<section class="studio-editor">
    <div class="studio-editor-top">
      <button class="studio-back-button" type="button" data-action="back">← All writing</button>
      <div class="studio-save-label" id="studio-save-label" role="status">${escapeHTML(statusLabel(entry))}</div>
    </div>
    ${conflict}
    <form id="studio-entry-form" autocomplete="off">
      <label class="sr-only" for="entry-title">Title</label>
      <input class="studio-title-input" id="entry-title" name="title" type="text" maxlength="160" placeholder="A thought, still becoming…" value="${escapeHTML(entry.title)}">
      <div class="studio-meta-fields">
        <label>Dimension<select name="dimension">${dimensions.map(dimension => `<option ${dimension === entry.dimension ? 'selected' : ''}>${dimension}</option>`).join('')}</select></label>
        <label>Date<input name="entry_date" type="date" value="${escapeHTML(entry.entry_date)}"></label>
        <label>Tags<input name="tags" type="text" placeholder="memory, change, ..." value="${escapeHTML((entry.tags || []).join(', '))}"></label>
        <label>Slug<input name="slug" type="text" value="${escapeHTML(entry.slug)}" spellcheck="false"></label>
        <label class="studio-meta-wide">Short excerpt<input name="excerpt" type="text" maxlength="260" value="${escapeHTML(entry.excerpt)}" placeholder="A few words for the journal and search."></label>
        <label class="studio-meta-wide">Subtitle <span class="studio-optional">(optional)</span><input name="subtitle" type="text" maxlength="200" value="${escapeHTML(entry.subtitle)}"></label>
        <label class="studio-meta-wide">Cover image URL <span class="studio-optional">(optional)</span><input name="cover_image_url" type="url" inputmode="url" value="${escapeHTML(entry.cover_image_url)}" placeholder="https://…"></label>
      </div>
      <div class="studio-writing-label"><label for="entry-content">Your writing</label><span>Private until you choose to publish</span></div>
      <div class="studio-format-toolbar" role="toolbar" aria-label="Writing formats">
        <button type="button" data-format="bold" aria-label="Bold">B</button>
        <button type="button" data-format="italic" aria-label="Italic"><em>I</em></button>
        <button type="button" data-format="heading" aria-label="Heading">H₂</button>
        <button type="button" data-format="quote" aria-label="Quote">“ ”</button>
        <button type="button" data-format="list" aria-label="Bullet list">• List</button>
      </div>
      <label class="sr-only" for="entry-content">Write or edit your entry</label>
      <textarea class="studio-writing-area" id="entry-content" name="content" placeholder="Start anywhere. You can make sense of it later.">${escapeHTML(entry.content)}</textarea>
    </form>
    <div class="studio-editor-footer">
      <div class="studio-edit-timestamps"><span>Created ${escapeHTML(formatTimestamp(entry.created_at))}</span><span id="studio-updated-time">Last edited ${escapeHTML(formatTimestamp(entry.updated_at))}</span></div>
      <div class="studio-action-row">
        <button class="button button-outline" type="button" data-action="history">History</button>
        <button class="button button-outline" type="button" data-action="preview">Preview</button>
        <button class="button button-outline" type="button" data-action="save">Save</button>
        ${entry.published
          ? `<button class="button button-dark" type="button" data-action="unpublish">Unpublish</button>`
          : `<button class="button button-dark" type="button" data-action="publish">Publish</button>`}
        <button class="studio-delete-button" type="button" data-action="delete">Delete</button>
      </div>
    </div>
    <div id="studio-history" class="studio-history" hidden></div>
    <dialog class="studio-preview-dialog" id="studio-preview"><div class="studio-preview-content"><button class="studio-preview-close" type="button" data-action="close-preview" aria-label="Close preview">×</button><div id="studio-preview-body"></div></div></dialog>
  </section>`;
}

function renderStudio() {
  const hasSelection = Boolean(selectedEntry());
  main.innerHTML = `<div class="studio-dashboard">
    <header class="studio-dashboard-header">
      <div><p class="eyebrow"><span class="eyebrow-line"></span>Your private notebook</p><h1>Make room<br><em>for a thought.</em></h1><p class="studio-account">Signed in as ${escapeHTML(state.user.email || 'Kady')}</p></div>
      <div class="studio-dashboard-actions"><button class="button button-dark" type="button" data-action="new">New writing <span aria-hidden="true">＋</span></button><button class="studio-signout" type="button" data-action="signout">Sign out</button></div>
    </header>
    <div class="studio-message" data-message hidden></div>
    <div class="studio-workspace ${hasSelection ? 'has-selection' : ''}">${renderList()}${renderEditor()}</div>
    <p class="studio-privacy-note">Drafts are private to your owner account. Publishing is always a separate, confirmed action.</p>
  </div>`;
}

function setSaveLabel(text, error = false) {
  const label = main.querySelector('#studio-save-label');
  if (label) {
    label.textContent = text;
    label.classList.toggle('has-error', error);
  }
}

function updateLocalEntry(id, field, value) {
  const entry = state.entries.find(item => item.id === id);
  if (!entry) return;
  if (field === 'tags') value = value.split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 20);
  const updateSlug = field === 'title' && (!entry.title || entry.slug === slugify(entry.title));
  entry[field] = value;
  if (updateSlug) entry.slug = slugify(value);
  entry.updated_at = new Date().toISOString();
  entry._dirty = true;
  entry._deleted = false;
  storeLocal();
  setSaveLabel(navigator.onLine ? 'Saving…' : 'Saved on this device · offline');
  const timestamp = main.querySelector('#studio-updated-time');
  if (timestamp) timestamp.textContent = `Last edited ${formatTimestamp(entry.updated_at)}`;
  scheduleSave(id);
}

function scheduleSave(id) {
  clearTimeout(scheduleSave.timers.get(id));
  scheduleSave.timers.set(id, setTimeout(() => saveEntry(id), 750));
}
scheduleSave.timers = new Map();

async function syncEntry(entry, allowOverwrite = false) {
  const version = entry.updated_at;
  const payload = entryPayload(entry);
  if (!navigator.onLine) {
    setSaveLabel('Saved on this device · offline');
    return false;
  }
  if (!entry._baseUpdatedAt) {
    const { data, error } = await state.client.from('writing_entries')
      .insert({ ...payload, id: entry.id, owner_id: state.user.id }).select('*').single();
    if (error) throw error;
    acceptSavedRow(data, entry.id, version);
    return true;
  }
  let request = state.client.from('writing_entries').update(payload)
    .eq('id', entry.id).eq('owner_id', state.user.id);
  if (!allowOverwrite) request = request.eq('updated_at', entry._baseUpdatedAt);
  const { data, error } = await request.select('*').maybeSingle();
  if (error) throw error;
  if (!data) {
    const { data: cloud, error: readError } = await state.client.from('writing_entries')
      .select('*').eq('id', entry.id).maybeSingle();
    if (readError) throw readError;
    if (cloud) {
      const current = state.entries.find(item => item.id === entry.id);
      if (current) {
        current._conflict = true;
        current._cloud = fromCloud(cloud);
        current._dirty = true;
        storeLocal();
        renderStudio();
      }
      return false;
    }
    throw new Error('This writing could not be found in your cloud notebook. Your local copy is preserved.');
  }
  acceptSavedRow(data, entry.id, version);
  return true;
}

function acceptSavedRow(row, id, version) {
  const current = state.entries.find(item => item.id === id);
  if (!current) return;
  const saved = fromCloud(row);
  if (current.updated_at === version) {
    Object.assign(current, saved);
  } else {
    current._baseUpdatedAt = row.updated_at;
    current._dirty = true;
    current._conflict = false;
  }
  storeLocal();
  setSaveLabel(current._dirty ? 'Saving latest changes…' : 'All changes saved');
  const updated = main.querySelector('#studio-updated-time');
  if (updated && state.selectedId === id) updated.textContent = `Last edited ${formatTimestamp(current.updated_at)}`;
}

async function saveEntry(id) {
  if (state.saving.has(id)) {
    state.saveAgain.add(id);
    return state.saving.get(id);
  }
  const entry = state.entries.find(item => item.id === id);
  if (!entry || !entry._dirty || entry._conflict || entry._deleted) return;
  const operation = (async () => {
    try {
      const saved = await syncEntry(entry);
      if (saved && state.selectedId === id) setSaveLabel('All changes saved');
    } catch (error) {
      console.error('Could not sync writing to Supabase.', error);
      setSaveLabel(`On this device · cloud save failed: ${error.message}`, true);
    } finally {
      state.saving.delete(id);
      if (state.saveAgain.delete(id)) await saveEntry(id);
    }
  })();
  state.saving.set(id, operation);
  return operation;
}

async function syncDirtyEntries() {
  for (const entry of state.entries) {
    if (entry._dirty && !entry._conflict && !entry._deleted) await saveEntry(entry.id);
  }
}

function createEntry() {
  const now = new Date().toISOString();
  const entry = {
    id: makeId(), owner_id: state.user.id, slug: `note-${Date.now().toString(36)}`,
    title: '', subtitle: '', content: '', excerpt: '', dimension: 'The Journey',
    tags: [], entry_date: localDate(), cover_image_url: '', published: false, published_at: null,
    created_at: now, updated_at: now, _baseUpdatedAt: null, _dirty: true, _conflict: false
  };
  state.entries.unshift(entry);
  state.selectedId = entry.id;
  storeLocal();
  renderStudio();
  scheduleSave(entry.id);
  main.querySelector('#entry-title')?.focus();
}

function markdownHTML(text) {
  const escaped = escapeHTML(text);
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function renderPreview(entry) {
  const blocks = String(entry.content || '').split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
  const body = blocks.map(block => {
    if (block.startsWith('> ')) return `<blockquote>${markdownHTML(block.replace(/^>\s?/, '').replace(/\n>\s?/g, '\n'))}</blockquote>`;
    if (block.startsWith('## ')) return `<h2>${markdownHTML(block.slice(3))}</h2>`;
    if (/^(?:- |\* )/m.test(block)) return `<ul>${block.split('\n').filter(line => /^(?:- |\* )/.test(line)).map(line => `<li>${markdownHTML(line.replace(/^(?:- |\* )/, ''))}</li>`).join('')}</ul>`;
    return `<p>${markdownHTML(block).replace(/\n/g, '<br>')}</p>`;
  }).join('');
  const coverImage = safeImageUrl(entry.cover_image_url);
  const image = coverImage ? `<img src="${escapeHTML(coverImage)}" alt="">` : '';
  return `<article class="studio-preview-article">${image}<p class="eyebrow"><span class="eyebrow-line"></span>${escapeHTML(entry.dimension)} · ${escapeHTML(entry.entry_date)}</p><h1>${escapeHTML(entry.title || 'Untitled thought')}</h1>${entry.subtitle ? `<p class="studio-preview-subtitle">${escapeHTML(entry.subtitle)}</p>` : ''}<div class="studio-preview-body">${body || '<p>Your writing will appear here.</p>'}</div></article>`;
}

function beginFormat(button) {
  const area = main.querySelector('#entry-content');
  if (!area) return;
  const start = area.selectionStart;
  const end = area.selectionEnd;
  const selected = area.value.slice(start, end);
  const format = button.dataset.format;
  let before = '';
  let after = '';
  let replacement = selected;
  if (format === 'bold') { before = '**'; after = '**'; }
  if (format === 'italic') { before = '*'; after = '*'; }
  if (format === 'heading') { before = '## '; replacement = selected || 'Heading'; }
  if (format === 'quote') { before = '> '; replacement = (selected || 'A thought to keep').split('\n').join('\n> '); }
  if (format === 'list') { before = '- '; replacement = (selected || 'A point').split('\n').join('\n- '); }
  const next = `${area.value.slice(0, start)}${before}${replacement}${after}${area.value.slice(end)}`;
  area.value = next;
  area.focus();
  area.setSelectionRange(start + before.length, start + before.length + replacement.length);
  updateLocalEntry(state.selectedId, 'content', next);
}

async function publishEntry() {
  const entry = selectedEntry();
  if (!entry) return;
  if (!entry.title.trim() || !entry.content.trim()) {
    showMessage('Add a title and some writing before publishing.');
    return;
  }
  if (entry.cover_image_url && !/^https?:\/\/[^\s]+$/i.test(entry.cover_image_url)) {
    showMessage('Use a valid HTTP or HTTPS cover image URL, or clear the optional field.');
    return;
  }
  if (!confirm(`Publish “${entry.title}” to the public KadyVerse site? It will be visible to everyone.`)) return;
  try {
    if (entry._dirty) {
      clearTimeout(scheduleSave.timers.get(entry.id));
      await saveEntry(entry.id);
    }
    const current = selectedEntry();
    if (current?._conflict) return;
    if (!current || current._dirty) throw new Error('Save the latest changes before publishing.');
    const { data, error } = await state.client.from('writing_entries')
      .update({ published: true, published_at: new Date().toISOString() })
      .eq('id', current.id).eq('owner_id', state.user.id).eq('updated_at', current._baseUpdatedAt)
      .select('*').single();
    if (error) throw error;
    Object.assign(current, fromCloud(data));
    storeLocal();
    renderStudio();
    showMessage('Published. This writing is now visible in its KadyVerse dimension, journal, search, and archive.', 'success');
  } catch (error) {
    console.error('Could not publish writing.', error);
    showMessage(`Publishing failed: ${error.message}`);
  }
}

async function unpublishEntry() {
  const entry = selectedEntry();
  if (!entry || !confirm(`Unpublish “${entry.title}”? It will disappear from public pages but remain in your private studio.`)) return;
  try {
    if (entry._dirty) {
      clearTimeout(scheduleSave.timers.get(entry.id));
      await saveEntry(entry.id);
    }
    const current = selectedEntry();
    if (!current || current._dirty || current._conflict) throw new Error('Resolve unsaved changes before unpublishing.');
    const { data, error } = await state.client.from('writing_entries')
      .update({ published: false, published_at: null })
      .eq('id', current.id).eq('owner_id', state.user.id).eq('updated_at', current._baseUpdatedAt)
      .select('*').single();
    if (error) throw error;
    Object.assign(current, fromCloud(data));
    storeLocal();
    renderStudio();
    showMessage('Unpublished. The piece is private and remains in your notebook.', 'success');
  } catch (error) {
    console.error('Could not unpublish writing.', error);
    showMessage(`Unpublishing failed: ${error.message}`);
  }
}

async function deleteEntry() {
  let entry = selectedEntry();
  if (!entry || !confirm(`Delete “${entry.title || 'Untitled thought'}” and its saved history? This cannot be undone.`)) return;
  clearTimeout(scheduleSave.timers.get(entry.id));
  if (state.saving.has(entry.id)) await state.saving.get(entry.id);
  entry = selectedEntry();
  if (!entry) return;
  if (!entry._baseUpdatedAt) {
    state.entries = state.entries.filter(item => item.id !== entry.id);
    state.selectedId = state.entries.find(item => !item._deleted)?.id || null;
    storeLocal();
    renderStudio();
    return;
  }
  if (!navigator.onLine) {
    showMessage('Connect to the internet before deleting a cloud entry. Your writing has not been changed.');
    return;
  }
  try {
    const { data, error } = await state.client.from('writing_entries').delete()
      .eq('id', entry.id).eq('owner_id', state.user.id).eq('updated_at', entry._baseUpdatedAt).select('id').maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('This writing changed elsewhere. Reload it before deleting.');
    state.entries = state.entries.filter(item => item.id !== entry.id);
    state.selectedId = state.entries.find(item => !item._deleted)?.id || null;
    storeLocal();
    renderStudio();
  } catch (error) {
    console.error('Could not delete writing.', error);
    showMessage(`Delete failed: ${error.message}`);
  }
}

async function showHistory() {
  const entry = selectedEntry();
  if (!entry) return;
  const container = main.querySelector('#studio-history');
  if (!container) return;
  container.hidden = false;
  container.innerHTML = '<p class="studio-history-loading">Loading saved versions…</p>';
  try {
    const { data, error } = await state.client.from('writing_revisions')
      .select('id,created_at,snapshot').eq('entry_id', entry.id).order('created_at', { ascending: false }).limit(30);
    if (error) throw error;
    state.history = data;
    container.innerHTML = `<h2>Writing history</h2>${data.length ? `<ol>${data.map((revision, index) => `<li><span><strong>${escapeHTML(revision.snapshot.title || 'Untitled thought')}</strong><time>${escapeHTML(formatTimestamp(revision.created_at))}</time></span><button class="button button-outline" type="button" data-revision="${index}">Restore</button></li>`).join('')}</ol>` : '<p>No earlier saved versions yet. Changes are recorded as you save.</p>'}`;
  } catch (error) {
    console.error('Could not load writing history.', error);
    container.innerHTML = `<p class="studio-history-error">History could not be loaded: ${escapeHTML(error.message)}</p>`;
  }
}

function restoreRevision(index) {
  const revision = state.history[index];
  const entry = selectedEntry();
  if (!revision || !entry) return;
  if (!confirm('Restore this earlier version? Your current text will be saved as a new history version.')) return;
  const snapshot = revision.snapshot;
  for (const field of ['title', 'subtitle', 'content', 'excerpt', 'dimension', 'tags', 'entry_date', 'cover_image_url', 'slug']) {
    entry[field] = snapshot[field];
  }
  entry.updated_at = new Date().toISOString();
  entry._dirty = true;
  entry._conflict = false;
  renderStudio();
  storeLocal();
  scheduleSave(entry.id);
}

function resolveConflict(useCloud) {
  const entry = selectedEntry();
  if (!entry || !entry._conflict) return;
  if (useCloud) {
    const cloud = entry._cloud;
    Object.assign(entry, cloud);
  } else {
    entry._baseUpdatedAt = entry._cloud.updated_at;
    entry._conflict = false;
    entry._dirty = true;
    entry.updated_at = new Date().toISOString();
  }
  delete entry._cloud;
  storeLocal();
  renderStudio();
  if (!useCloud) saveEntry(entry.id);
}

main.addEventListener('submit', async event => {
  if (!event.target.matches('#studio-login-form')) return;
  event.preventDefault();
  const form = new FormData(event.target);
  const button = event.target.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Signing in…';
  try {
    const { error } = await state.client.auth.signInWithPassword({
      email: String(form.get('email')).trim(),
      password: String(form.get('password'))
    });
    if (error) {
      console.error('Studio sign-in failed.', error);
      renderLogin('Sign-in failed. Check your email and password, then try again.');
    }
  } catch (error) {
    console.error('Studio sign-in request failed.', error);
    renderLogin('Sign-in could not reach Supabase. Check your connection and try again.');
  }
});

main.addEventListener('input', event => {
  if (event.target.id === 'studio-search') {
    state.query = event.target.value;
    const list = main.querySelector('.studio-entry-list');
    const count = main.querySelector('.studio-list-heading > div > span');
    if (list) list.innerHTML = renderEntryChoices();
    if (count) count.textContent = `${visibleEntries().length} ${visibleEntries().length === 1 ? 'piece' : 'pieces'}`;
    return;
  }
  if (!event.target.closest('#studio-entry-form')) return;
  const field = event.target.name;
  if (!field) return;
  updateLocalEntry(state.selectedId, field, event.target.value);
});

main.addEventListener('change', event => {
  if (event.target.id === 'studio-filter') {
    state.filter = event.target.value;
    renderStudio();
    return;
  }
  if (!event.target.closest('#studio-entry-form') || !event.target.name) return;
  updateLocalEntry(state.selectedId, event.target.name, event.target.value);
});

main.addEventListener('click', async event => {
  const formatButton = event.target.closest('[data-format]');
  if (formatButton) return beginFormat(formatButton);
  const selection = event.target.closest('[data-select]');
  if (selection) {
    state.selectedId = selection.dataset.select;
    renderStudio();
    return;
  }
  const revisionButton = event.target.closest('[data-revision]');
  if (revisionButton) return restoreRevision(Number(revisionButton.dataset.revision));
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const entry = selectedEntry();
  switch (button.dataset.action) {
    case 'new': return createEntry();
    case 'back': state.selectedId = null; renderStudio(); return;
    case 'save':
      if (!entry) return;
      if (!entry._dirty) return setSaveLabel('All changes saved');
      setSaveLabel('Saving…');
      return saveEntry(entry.id);
    case 'preview': {
      if (!entry) return;
      const dialog = main.querySelector('#studio-preview');
      main.querySelector('#studio-preview-body').innerHTML = renderPreview(entry);
      dialog.showModal();
      return;
    }
    case 'close-preview': return main.querySelector('#studio-preview').close();
    case 'publish': return publishEntry();
    case 'unpublish': return unpublishEntry();
    case 'delete': return deleteEntry();
    case 'history': return showHistory();
    case 'use-cloud': return resolveConflict(true);
    case 'keep-local': return resolveConflict(false);
    case 'signout': {
      const { error } = await state.client.auth.signOut();
      if (error) {
        console.error('Could not sign out of the studio.', error);
        return showMessage(`Sign out failed: ${error.message}`);
      }
      state.user = null;
      state.loginMessage = '';
      state.entries = [];
      state.selectedId = null;
      renderLogin();
      return;
    }
  }
});

window.addEventListener('online', syncDirtyEntries);

async function start() {
  const config = window.KADYVERSE_SUPABASE;
  if (!config?.url || !config?.anonKey) return renderConfigurationError();
  state.client = createClient(config.url, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  const { data: { subscription } } = state.client.auth.onAuthStateChange((event, session) => {
    if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return;
    setTimeout(() => {
      state.user = session?.user || null;
      if (!state.user) {
        const message = state.loginMessage;
        state.loginMessage = '';
        return renderLogin(message);
      }
      loadEntries().catch(error => {
        console.error('Could not open the private studio.', error);
        renderLogin(`Your studio could not load: ${error.message}`);
      });
    }, 0);
  });
  window.addEventListener('pagehide', () => subscription.unsubscribe(), { once: true });
  const { data, error } = await state.client.auth.getSession();
  if (error) {
    console.error('Could not check the studio session.', error);
    return renderLogin('Your sign-in session could not be checked. Please try again.');
  }
  if (!data.session) {
    renderLogin();
    return;
  }
  state.user = data.session.user;
  try {
    await loadEntries();
  } catch (loadError) {
    console.error('Could not open the private studio.', loadError);
    renderLogin(`Your studio could not load: ${loadError.message}`);
  }
}

start().catch(error => {
  console.error('The private studio failed to start.', error);
  renderLogin('The studio could not start. Refresh the page or try again later.');
});
