const dimensions = [
  { slug: "the-mind", number: "01", name: "The Mind", eyebrow: "Thought & inquiry", description: "Philosophy, consciousness, identity, psychology, and the questions that stay a little longer.", tone: "mind" },
  { slug: "the-heart", number: "02", name: "The Heart", eyebrow: "Feeling & belonging", description: "Emotions, relationships, memory, loneliness, joy, and the quiet work of feeling.", tone: "heart" },
  { slug: "the-world", number: "03", name: "The World", eyebrow: "People & place", description: "The human-made and natural worlds, observed with curiosity rather than certainty.", tone: "world" },
  { slug: "the-imagination", number: "04", name: "The Imagination", eyebrow: "Making & wondering", description: "Poetry, literature, art, stories, and the things that might exist if we imagine them.", tone: "imagination" },
  { slug: "the-journey", number: "05", name: "The Journey", eyebrow: "Change & becoming", description: "Learning, trying, getting it wrong, beginning again, and changing your mind.", tone: "journey" },
];

const contentEntries = [
  {
    slug: "the-small-art-of-noticing", title: "The small art of noticing", subtitle: "On paying attention to the ordinary, and finding it less ordinary than we thought.", dimension: "The World", tags: ["attention", "everyday life", "observation"], date: "2025-11-18", originalDate: "2025-11-12", readingTime: 1, status: "published", featured: true, tone: "noticing",
    excerpt: "A shaft of afternoon light, a stranger's kindness, the particular hush just before rain. What changes when we let the ordinary ask for our attention?",
    body: [
      ["p", "A sample reflection, offered as editable placeholder copy. Replace this piece with Kady's own words before publishing; the small details here are an invitation to shape the voice, not a claim about anyone's life."],
      ["p", "Some days seem to pass without leaving an outline. Then a window catches the late light. A neighbour holds a door. The tea goes cold because a thought took the longer way round. The day, when looked at closely, was not empty at all."],
      ["quote", "Perhaps attention is not a way of collecting the world, but a way of allowing the world to reach us."],
      ["p", "Noticing is a modest practice. It does not fix a difficult day or turn every inconvenience into a lesson. It simply makes room for what is already here, including the things that do not resolve neatly."],
      ["p", "I am trying to remember that there is a difference between moving through a day and meeting one. I don't always manage it. Perhaps the attempt is part of the noticing too."]
    ]
  },
  {
    slug: "a-question-i-carry", title: "A question I carry", subtitle: "Who are we when no one is asking us to be anything in particular?", dimension: "The Mind", tags: ["identity", "questions", "selfhood"], date: "2025-10-06", readingTime: 1, status: "published", featured: false, tone: "question",
    excerpt: "Identity feels less like a finished portrait than a pencil drawing, rubbed out and redrawn by time, other people, and the choices we make alone.",
    body: [
      ["p", "A sample reflection. This editable placeholder is not biographical and should be replaced or explicitly approved before publication."],
      ["p", "I keep returning to the idea that the self might be less like a fixed address and more like a direction of travel. It shifts with what we notice, what we remember, and what we are willing to question."],
      ["quote", "Maybe becoming yourself is not a discovery so much as a series of small permissions."],
      ["p", "I have no tidy conclusion. The question is still here, which may be one reason I keep writing it down."]
    ]
  },
  {
    slug: "the-shape-of-a-memory", title: "The shape of a memory", subtitle: "Some memories are less like photographs and more like rooms we keep returning to.", dimension: "The Heart", tags: ["memory", "time", "feeling"], date: "2025-08-21", readingTime: 1, status: "published", featured: false, tone: "memory",
    excerpt: "Memory edits as it goes. What we carry is not the whole scene, but the feeling of standing somewhere inside it.",
    body: [
      ["p", "A sample reflection for the KadyVerse content system. Replace with original writing before this entry is published."],
      ["p", "A memory changes with each return. The edges soften or sharpen; the background moves forward. Sometimes the detail we thought mattered disappears, and something small—a sound, a certain colour—remains."],
      ["p", "I wonder whether remembering is a kind of making. Not invention exactly, but a conversation between who we were and who we are now."],
      ["quote", "We do not visit the past unchanged. We bring the present with us."]
    ]
  },
  {
    slug: "notes-from-the-in-between", title: "Notes from the in-between", subtitle: "On the quiet, uncomfortable middle of becoming something new.", dimension: "The Journey", tags: ["change", "uncertainty", "growth"], date: "2025-06-02", readingTime: 1, status: "published", featured: false, tone: "inbetween",
    excerpt: "The middle rarely announces itself. There is only the gradual recognition that the old words no longer quite fit.",
    body: [
      ["p", "A sample essay placeholder—fictional, editable, and waiting for the author's own perspective."],
      ["p", "There is a particular kind of uncertainty in the middle: after one answer has stopped working, before another has arrived. It can feel like standing in a doorway with no clear instruction to move."],
      ["p", "I am learning not to treat every pause as a mistake. Some things need the time it takes to become legible."]
    ]
  },
  {
    slug: "what-the-city-keeps", title: "What the city keeps", subtitle: "An observation about shared streets and private worlds.", dimension: "The World", tags: ["cities", "humanity", "observation"], date: "2025-03-14", readingTime: 1, status: "published", featured: false, tone: "city",
    excerpt: "Every window holds a different hour. Still, for a moment, a pavement belongs to all of us.",
    body: [
      ["p", "Sample placeholder copy for demonstration. It makes no claim to describe the author's personal experience."],
      ["p", "A city asks strangers to share a small space without sharing a story. We pass close to one another carrying whole, invisible days: errands, worries, private jokes, things remembered too late."],
      ["quote", "Perhaps a place becomes ours not because it belongs to us, but because we have learned how to notice one another in it."]
    ]
  },
  {
    slug: "a-place-for-imagined-things", title: "A place for imagined things", subtitle: "What a story makes possible, even before we know what it means.", dimension: "The Imagination", tags: ["stories", "creativity", "possibility"], date: "2024-12-09", readingTime: 1, status: "published", featured: false, tone: "imagination",
    excerpt: "An imagined place does not have to be an escape. It can be a new window onto what was already here.",
    body: [
      ["p", "An editorial placeholder, intended to be replaced with a poem, essay, or original story by Kady."],
      ["p", "Stories let us borrow another set of eyes for a while. When we return to our own, the room may be the same, but we are looking from a slightly different angle."],
      ["p", "That small change is enough to make me curious about what imagination is for."]
    ]
  },
  {
    slug: "learning-to-begin-again", title: "Learning to begin again", subtitle: "A few notes on starting without pretending the last beginning never happened.", dimension: "The Journey", tags: ["learning", "beginnings", "practice"], date: "2024-09-27", readingTime: 1, status: "published", featured: false, tone: "beginning",
    excerpt: "A new beginning does not erase the old one. It arrives carrying everything we learned by trying.",
    body: [
      ["p", "An explicitly marked sample reflection. Replace it with approved original writing before publication."],
      ["p", "Starting again is not the same as starting over. We bring our imperfect notes, changed expectations, and a quieter sense of what matters."],
      ["p", "There is something generous in that. We get to keep what we learned, even when the plan has to change."]
    ]
  }
];
const articles = contentEntries
  .filter(article => article.status === "published")
  .map(article => ({
    ...article,
    coverImage: article.coverImage || "",
    seoTitle: article.seoTitle || `${article.title} — KadyVerse`,
    seoDescription: article.seoDescription || article.excerpt,
    relatedArticles: article.relatedArticles || []
  }));

const articleBySlug = new Map(articles.map(article => [article.slug, article]));
const categories = ["All", ...dimensions.map(dimension => dimension.name)];
let activeFilter = "All";
let visibleCount = 5;
let searchQuery = "";

const main = document.querySelector("#main");
const nav = document.querySelector(".primary-navigation");
const menuToggle = document.querySelector(".menu-toggle");
const sampleNote = `<p class="sample-note"><span class="sample-note-mark" aria-hidden="true">i</span> Sample writing &amp; placeholders are shown for this prototype. Personal essays are not fabricated; replace these examples with Kady's own writing before publication.</p>`;
const dimensionFor = name => dimensions.find(dimension => dimension.name === name);
const formatDate = date => new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
const shortDate = date => new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

function card(article, options = {}) {
  const dimension = dimensionFor(article.dimension);
  return `<article class="article-card ${options.featured ? "article-card-featured" : ""}">
    <a class="article-image art-${article.tone}" href="#/article/${article.slug}" aria-label="Read ${escapeHTML(article.title)}">
      ${article.coverImage ? `<img src="${escapeHTML(article.coverImage)}" alt="" loading="lazy">` : ""}
      <span class="art-grain" aria-hidden="true"></span>
      <span class="art-caption">${escapeHTML(article.dimension)}</span>
      <span class="art-mark" aria-hidden="true">${dimension ? dimension.number : "K."}</span>
    </a>
    <div class="article-card-copy">
      <div class="article-meta"><a class="category-link" href="#/explore/${dimension ? dimension.slug : ""}">${escapeHTML(article.dimension)}</a><span>${article.readingTime} min read</span></div>
      <h3><a href="#/article/${article.slug}">${escapeHTML(article.title)}</a></h3>
      <p>${escapeHTML(article.excerpt)}</p>
      <time datetime="${article.date}">${shortDate(article.date)}</time>
    </div>
  </article>`;
}

function dimensionLink(dimension, index = 0) {
  return `<a class="dimension-link dimension-${dimension.tone}" href="#/explore/${dimension.slug}">
    <span class="dimension-number">${dimension.number} <span aria-hidden="true">—</span> ${escapeHTML(dimension.eyebrow)}</span>
    <span class="dimension-link-main"><span class="dimension-title">${escapeHTML(dimension.name)}</span><span class="dimension-arrow" aria-hidden="true">↗</span></span>
    <span class="dimension-description">${escapeHTML(dimension.description)}</span>
    <span class="dimension-ghost" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
  </a>`;
}

function homePage() {
  const featured = articles.find(article => article.featured);
  return `<section class="hero">
    <div class="hero-copy">
      <p class="eyebrow hero-eyebrow"><span class="eyebrow-line"></span>A personal publication by Kady</p>
      <h1>KADYVERSE<span class="hero-period">.</span></h1>
      <p class="hero-tagline">A universe within a human.</p>
      <p class="hero-lede">Somewhere between who I am<br>and who I am becoming.</p>
      <p class="hero-description">A collection of thoughts, experiences, questions<br class="desktop-break"> and fragments of a life still unfolding.</p>
      <div class="hero-actions"><a class="button button-dark" href="#/explore">Enter the Universe <span aria-hidden="true">↗</span></a><a class="text-link" href="#/about">A little about Kady <span aria-hidden="true">→</span></a></div>
      <span class="hero-coordinate">A LIFE, STILL IN THE MAKING&nbsp; · &nbsp;VOL. 01</span>
    </div>
    <div class="hero-art" role="img" aria-label="An abstract human silhouette standing in a warm, shifting landscape">
      <img src="assets/inner-landscape.svg" alt="" fetchpriority="high">
      <span class="hero-art-label">A SELF-PORTRAIT IN POSSIBILITIES</span>
      <span class="hero-art-index">01 / ∞</span>
      <span class="hero-art-note">A universe is not always<br>somewhere else.</span>
    </div>
    <a class="scroll-cue" href="#introduction"><span class="scroll-cue-line"></span>SCROLL, TAKE YOUR TIME</a>
  </section>
  <section class="intro-section section-wrap" id="introduction">
    <p class="eyebrow"><span class="eyebrow-line"></span>Why this exists</p>
    <div class="intro-copy"><h2>One life, many<br><em>ways of seeing.</em></h2><div class="intro-body"><p>KadyVerse is a place to pay attention: to what it feels like to be human, to the world we share, and to the ideas that don't leave when the page is turned.</p><p>Not a collection of answers. More like an open notebook—with room for the uncertain parts, and for changing your mind.</p><a class="text-link" href="#/about">The story behind this place <span aria-hidden="true">→</span></a></div></div>
  </section>
  <section class="dimensions-section">
    <div class="section-wrap">
      <div class="section-heading"><div><p class="eyebrow"><span class="eyebrow-line"></span>Five ways in</p><h2>A life is not<br><em>one thing.</em></h2></div><p>Five open doors. Follow what draws you in; none of them leads to the whole story.</p></div>
      <div class="dimension-grid">${dimensions.map((dimension, index) => dimensionLink(dimension, index)).join("")}</div>
      <a class="text-link dimensions-more" href="#/explore">Wander through all five <span aria-hidden="true">→</span></a>
    </div>
  </section>
  <section class="journal-preview section-wrap">
    <div class="section-heading journal-heading"><div><p class="eyebrow"><span class="eyebrow-line"></span>From the journal</p><h2>Recently, <em>in words.</em></h2></div><a class="text-link" href="#/journal">All writing <span aria-hidden="true">→</span></a></div>
    <div class="article-grid">${articles.slice(0, 3).map(article => card(article)).join("")}</div>
    ${sampleNote}
  </section>
  <section class="thought-section">
    <div class="thought-orbit" aria-hidden="true"><span></span><i></i></div>
    <div class="thought-content"><p class="eyebrow"><span class="eyebrow-line"></span>A thought, for now</p><blockquote>“Perhaps we are not meant to arrive at ourselves. Perhaps the point is to keep becoming.”</blockquote><p class="thought-attribution">Editable sample thought · replace before publishing</p></div>
    <span class="thought-side-label">UNFINISHED, ON PURPOSE</span>
  </section>
  <section class="questions-section section-wrap">
    <div class="questions-title"><p class="eyebrow"><span class="eyebrow-line"></span>Room for the unresolved</p><h2>Questions<br><em>without answers.</em></h2><p>Not every question is a problem to solve. Some are simply a way of staying awake to the world.</p></div>
    <div class="question-list"><p>What would it mean to know yourself, and still keep changing?</p><p>Can a person belong somewhere without belonging to it completely?</p><p>When does a thought become a belief—and what makes us let one go?</p><a class="text-link" href="#/explore/the-mind">Follow a question <span aria-hidden="true">→</span></a></div>
  </section>
  <section class="archive-preview">
    <div class="section-wrap archive-preview-inner"><div><p class="eyebrow"><span class="eyebrow-line"></span>A record of becoming</p><h2>Time leaves<br><em>a trace.</em></h2></div><div class="archive-teaser-list">${articles.slice(0, 3).map(article => `<a href="#/article/${article.slug}"><time datetime="${article.date}">${shortDate(article.date)}</time><span>${escapeHTML(article.title)}</span><span class="archive-teaser-category">${escapeHTML(article.dimension)}</span><span aria-hidden="true">↗</span></a>`).join("")}<a class="text-link" href="#/archive">Enter the archive <span aria-hidden="true">→</span></a></div></div>
  </section>
  <section class="author-teaser section-wrap"><div class="author-initial" aria-hidden="true">K<span>.</span></div><div class="author-copy"><p class="eyebrow"><span class="eyebrow-line"></span>The person behind the pages</p><h2>Hello, <em>I'm Kady.</em></h2><p>Or, more accurately: I'm someone still figuring out what that sentence means. This is a place to do a little of that figuring in public.</p><a class="text-link" href="#/about">A little more about me <span aria-hidden="true">→</span></a></div><p class="author-aside">No final drafts<br>of being human.</p></section>`;
}

function pageIntro(eyebrow, title, description, extra = "") {
  return `<section class="page-intro section-wrap"><p class="eyebrow"><span class="eyebrow-line"></span>${eyebrow}</p><h1>${title}</h1><p class="page-intro-description">${description}</p>${extra}</section>`;
}

function explorePage(selectedSlug = "") {
  const selected = dimensions.find(dimension => dimension.slug === selectedSlug);
  if (selected) {
    const matching = articles.filter(article => article.dimension === selected.name);
    return `<section class="dimension-detail section-wrap"><a class="back-link" href="#/explore">← All five dimensions</a><p class="eyebrow"><span class="eyebrow-line"></span>${selected.number} / ${escapeHTML(selected.eyebrow)}</p><h1>${escapeHTML(selected.name)}<span class="hero-period">.</span></h1><p class="page-intro-description">${escapeHTML(selected.description)}</p><div class="dimension-detail-rule"></div><p class="eyebrow">Writing found in this dimension</p>${matching.length ? `<div class="article-grid">${matching.map(article => card(article)).join("")}</div>` : `<p class="empty-state">This corner is quiet for now. New writing will find its way here.</p>`}${sampleNote}</section>`;
  }
  return `${pageIntro("A map, not a set of borders", "Five dimensions.<br><em>One unfolding life.</em>", "KadyVerse is organised into ways of looking, not boxes to fit inside. A piece can belong to more than one place. So can a person.")}<section class="explore-grid section-wrap">${dimensions.map((dimension, index) => `<div class="explore-dimension"><span class="explore-index">${dimension.number} / 05</span>${dimensionLink(dimension, index)}<div class="explore-dimension-articles">${articles.filter(article => article.dimension === dimension.name).slice(0, 2).map(article => `<a href="#/article/${article.slug}"><span>${escapeHTML(article.title)}</span><span aria-hidden="true">↗</span></a>`).join("") || `<span class="coming-note">An open page, for now.</span>`}</div></div>`).join("")}</section><p class="explore-footnote section-wrap">These are starting points, never definitions. Everything here is still allowed to change.</p>${sampleNote}`;
}

function journalPage() {
  const filtered = articles.filter(article => activeFilter === "All" || article.dimension === activeFilter);
  const latest = filtered.slice(0, visibleCount);
  const featured = !searchQuery && activeFilter === "All" ? articles.find(article => article.featured) : null;
  return `${pageIntro("Writing, in no particular hurry", "The <em>Journal.</em>", "Essays, observations, and questions left open on the page. A growing record of one perspective, not the last word on anything.")}<section class="journal-content section-wrap">
    <div class="journal-tools"><div class="filter-row" role="group" aria-label="Filter writing by dimension">${categories.map(category => `<button class="filter-button ${activeFilter === category ? "is-active" : ""}" type="button" data-filter="${escapeHTML(category)}" aria-pressed="${activeFilter === category}">${escapeHTML(category)}</button>`).join("")}</div><a class="journal-search-link" href="#/search"><span>Search the journal</span><span aria-hidden="true">⌕</span></a></div>
    ${featured ? `<div class="featured-article"><div class="featured-copy"><p class="eyebrow"><span class="eyebrow-line"></span>Editor's first page · ${featured.readingTime} min read</p><h2><a href="#/article/${featured.slug}">${escapeHTML(featured.title)}</a></h2><p>${escapeHTML(featured.excerpt)}</p><a class="text-link" href="#/article/${featured.slug}">Read this reflection <span aria-hidden="true">→</span></a></div><a class="featured-image art-${featured.tone}" href="#/article/${featured.slug}" aria-label="Read ${escapeHTML(featured.title)}"><span class="art-grain"></span><span class="art-caption">A note on attention</span></a></div>` : ""}
    <div class="latest-heading"><p class="eyebrow"><span class="eyebrow-line"></span>${activeFilter === "All" ? "The latest pages" : escapeHTML(activeFilter)}</p><span>${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}</span></div>
    <div class="article-grid">${latest.map(article => card(article)).join("")}</div>
    ${filtered.length > visibleCount ? `<div class="load-more-wrap"><button class="button button-outline" type="button" data-load-more>Show more writing <span aria-hidden="true">↓</span></button></div>` : ""}
    ${filtered.length === 0 ? `<p class="empty-state">No writing in this dimension yet. Some pages are still waiting to be written.</p>` : ""}
    ${sampleNote}
  </section>`;
}

function articlePage(slug) {
  const article = articleBySlug.get(slug);
  if (!article) return notFoundPage();
  const index = articles.findIndex(item => item.slug === slug);
  const related = (article.relatedArticles.length
    ? article.relatedArticles.map(relatedSlug => articleBySlug.get(relatedSlug)).filter(Boolean)
    : articles.filter(item => item.slug !== slug && (item.dimension === article.dimension || item.tags.some(tag => article.tags.includes(tag))))
  ).slice(0, 2);
  const previous = articles[index + 1];
  const next = articles[index - 1];
  const body = article.body.map(([type, text]) => type === "quote" ? `<blockquote class="reading-quote">${escapeHTML(text)}</blockquote>` : `<p>${escapeHTML(text)}</p>`).join("");
  return `<div class="reading-progress" aria-hidden="true"><span></span></div><article class="article-page">
    <header class="article-header section-wrap"><a class="back-link" href="#/journal">← Back to the journal</a><p class="article-header-meta"><a href="#/explore/${dimensionFor(article.dimension).slug}">${escapeHTML(article.dimension)}</a><span>·</span><time datetime="${article.date}">${formatDate(article.date)}</time></p><h1>${escapeHTML(article.title)}</h1><p class="article-subtitle">${escapeHTML(article.subtitle)}</p><div class="article-byline"><span class="byline-avatar" aria-hidden="true">K.</span><span>Words by <strong>Kady</strong></span><span class="byline-divider"></span><span>${article.readingTime} min read</span></div></header>
    <figure class="article-cover art-${article.tone}">${article.coverImage ? `<img src="${escapeHTML(article.coverImage)}" alt="" fetchpriority="high">` : ""}<span class="art-grain"></span><span class="art-caption">${escapeHTML(article.dimension)} <span>·</span> A fragment of a life still unfolding</span><span class="cover-index">KADYVERSE&nbsp; / &nbsp;${String(index + 1).padStart(2, "0")}</span></figure>
    <div class="reading-layout"><aside class="reading-sidebar"><span>IN THIS PIECE</span><a href="#article-opening">Opening thought</a><a href="#article-reflection">A reflection</a><span class="reading-sidebar-rule"></span><button class="share-button" type="button" data-copy-link>Copy a link <span aria-hidden="true">↗</span></button><span class="copy-feedback" aria-live="polite"></span></aside>
      <div class="reading-body" id="article-opening"><p class="article-dropcap">${escapeHTML(article.body[0][1])}</p><span class="body-section-anchor" id="article-reflection"></span>${body.slice(body.indexOf("</p>") + 4)}<p class="article-ending">Still thinking about it.</p><div class="article-tags">${article.tags.map(tag => `<a href="#/search?q=${encodeURIComponent(tag)}">#${escapeHTML(tag)}</a>`).join("")}</div><div class="share-mobile"><button class="button button-outline" type="button" data-copy-link>Copy a link <span aria-hidden="true">↗</span></button><span class="copy-feedback" aria-live="polite"></span></div></div>
    </div>
    <nav class="article-pager section-wrap" aria-label="Adjacent articles">${previous ? `<a href="#/article/${previous.slug}"><span>← Earlier writing</span><strong>${escapeHTML(previous.title)}</strong></a>` : `<span></span>`}${next ? `<a class="pager-next" href="#/article/${next.slug}"><span>Later writing →</span><strong>${escapeHTML(next.title)}</strong></a>` : ""}</nav>
    ${related.length ? `<section class="related-section section-wrap"><div class="section-heading"><div><p class="eyebrow"><span class="eyebrow-line"></span>Stay a little longer</p><h2>Related <em>pages.</em></h2></div></div><div class="article-grid">${related.map(item => card(item)).join("")}</div></section>` : ""}
    ${sampleNote}
  </article>`;
}

function aboutPage() {
  return `${pageIntro("A note from the person behind the pages", "A little about the person<br>behind this <em>universe.</em>", "This is not a complete portrait. It is a small introduction to a place that is still becoming.")}<section class="about-body section-wrap"><aside class="about-side"><span class="about-initial" aria-hidden="true">K.</span><p>A human, not a finished thought.</p></aside><div class="about-copy">
    <section><p class="eyebrow"><span class="eyebrow-line"></span>01 / The person</p><h2>Who is <em>Kady?</em></h2><p>Kady is the person writing these pages. Beyond that, the honest answer is: a person in progress. This space is deliberately not a résumé. Personal details belong here only when Kady chooses to add them.</p><p class="placeholder-note">[Add a few personal details here, in your own words, if and when you want to.]</p></section>
    <section><p class="eyebrow"><span class="eyebrow-line"></span>02 / The reason</p><h2>Why this <em>exists.</em></h2><p>KadyVerse began with a simple thought: each of us carries an interior world too large for a neat introduction. This is a place to explore some of it in public—through writing, questions, experiences, learning, and attention to the world beyond the self.</p><p>Not to offer a system for living. Not to make every hard thing meaningful. Just to look carefully, stay curious, and leave room for the view to change.</p></section>
    <section><p class="eyebrow"><span class="eyebrow-line"></span>03 / The pages</p><h2>What you might <em>find here.</em></h2><p>Personal essays, fragments, observations, poems, half-formed questions, and things learned along the way. Some will feel certain. Others will disagree with something written here before. That is part of keeping an honest record.</p><a class="text-link" href="#/explore">Find your way in <span aria-hidden="true">→</span></a></section>
    <section><p class="eyebrow"><span class="eyebrow-line"></span>04 / A small promise</p><h2>Keep it <em>human.</em></h2><p>Writing here is a point of view, not an authority. It is okay to leave questions open, to change your mind, and to say “I don't know.” Nothing private belongs here by accident; public writing is chosen deliberately.</p></section>
    <blockquote class="about-note">“Thank you for meeting these thoughts as they are: unfinished, personal, and still becoming.”<span>— Kady</span></blockquote>
  </div></section>`;
}

function archivePage() {
  const grouped = articles.reduce((years, article) => {
    const [year, month] = article.date.split("-");
    years[year] ??= {};
    years[year][month] ??= [];
    years[year][month].push(article);
    return years;
  }, {});
  const months = new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" });
  return `${pageIntro("A record of the things that stayed", "The <em>Archive.</em>", "A timeline of words, moments, and shifting points of view. There is no straight line through a life; this is just one way to trace it.")}<section class="archive-content section-wrap"><div class="archive-filter-row"><label for="archive-year">Find a year</label><select id="archive-year"><option value="all">All years</option>${Object.keys(grouped).sort().reverse().map(year => `<option value="${year}">${year}</option>`).join("")}</select><span>${articles.length} pieces, and counting</span></div><div class="archive-timeline">${Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([year, byMonth]) => `<section class="archive-year" data-year="${year}"><h2>${year}</h2><div class="archive-year-months">${Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a)).map(([month, entries]) => `<div class="archive-month"><h3>${months.format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)))}</h3><div class="archive-entries">${entries.sort((a, b) => b.date.localeCompare(a.date)).map(article => `<a class="archive-entry" href="#/article/${article.slug}"><time datetime="${article.date}">${shortDate(article.date)}</time><span class="archive-entry-title">${escapeHTML(article.title)}</span><span class="archive-entry-category">${escapeHTML(article.dimension)}</span><span aria-hidden="true">↗</span></a>`).join("")}</div></div>`).join("")}</div></section>`).join("")}</div><p class="archive-evolution">The archive is not the story of getting it right.<br>It is the record of looking again.</p>${sampleNote}</section>`;
}

function searchPage(query = "") {
  const value = query || searchQuery;
  const safeQuery = escapeHTML(value);
  const matches = value.trim() ? articles.filter(article => [article.title, article.subtitle, article.excerpt, article.body.map(block => block[1]).join(" "), article.dimension, ...article.tags].join(" ").toLowerCase().includes(value.trim().toLowerCase())) : [];
  return `${pageIntro("An open index", "Search the <em>pages.</em>", "Look for a thought, a word, or a place to begin.")}<section class="search-content section-wrap"><form class="search-form" role="search"><label class="sr-only" for="site-search">Search titles, writing, dimensions and tags</label><input id="site-search" type="search" name="q" value="${safeQuery}" placeholder="A word, a question, a feeling…" autocomplete="off"><button type="submit" aria-label="Search"><span>Search</span><span aria-hidden="true">↗</span></button></form><p class="search-help">Titles, writing, dimensions, and tags—all considered.</p><div class="search-results" aria-live="polite">${value.trim() ? `<div class="latest-heading"><p class="eyebrow"><span class="eyebrow-line"></span>${matches.length ? `${matches.length} ${matches.length === 1 ? "page" : "pages"} found` : "Nothing found just yet"}</p><span>“${safeQuery}”</span></div>${matches.length ? `<div class="article-grid">${matches.map(article => card(article)).join("")}</div>` : `<p class="empty-state">No pages turned up for “${safeQuery}.” Try a different word, or come in through one of the dimensions instead.</p><a class="text-link" href="#/explore">Explore the dimensions <span aria-hidden="true">→</span></a>`}` : `<div class="search-empty"><span aria-hidden="true">⌕</span><p>Begin wherever your curiosity begins.</p><div>${["identity", "memory", "change"].map(term => `<a href="#/search?q=${term}">#${term}</a>`).join("")}</div></div>`}</div>${sampleNote}</section>`;
}

function notFoundPage() {
  return `<section class="not-found section-wrap"><p class="eyebrow"><span class="eyebrow-line"></span>A page still finding its way</p><h1>This page<br><em>isn't here.</em></h1><p>Maybe it hasn't been written yet. Or perhaps the link has wandered off.</p><a class="button button-dark" href="#/">Back to the beginning <span aria-hidden="true">↗</span></a></section>`;
}

function routeFromHash() {
  const hashRoute = decodeURIComponent(location.hash.slice(1) || "");
  const route = hashRoute.startsWith("/") ? hashRoute : (new URLSearchParams(location.search).get("route") || "/");
  if (route === "/") return { page: "home", title: "KadyVerse — A universe within a human", description: "A personal publication of thoughts, experiences, questions and fragments of a life still unfolding." };
  if (route === "/explore") return { page: "explore", title: "Explore — KadyVerse", description: "Five dimensions of one unfolding life: mind, heart, world, imagination, and journey." };
  if (route.startsWith("/explore/")) return { page: "explore", slug: route.split("/")[2], title: "A dimension of KadyVerse", description: "A collection of thoughts from one of the five dimensions of KadyVerse." };
  if (route === "/journal") return { page: "journal", title: "The Journal — KadyVerse", description: "Essays, observations, and questions left open on the page." };
  if (route.startsWith("/article/")) {
    const article = articleBySlug.get(route.split("/")[2]);
    return article ? { page: "article", slug: article.slug, title: article.seoTitle, description: article.seoDescription, article } : { page: "404", title: "Page not found — KadyVerse", description: "This page isn't here." };
  }
  if (route === "/about") return { page: "about", title: "About Kady — KadyVerse", description: "A little about the person behind this universe, and why KadyVerse exists." };
  if (route === "/archive") return { page: "archive", title: "The Archive — KadyVerse", description: "A chronological record of writing, questions, and changing perspectives." };
  if (route === "/search" || route.startsWith("/search?")) return { page: "search", title: "Search — KadyVerse", description: "Search KadyVerse writing by title, text, dimension, or tag.", query: new URLSearchParams(route.split("?")[1] || "").get("q") || "" };
  return { page: "404", title: "Page not found — KadyVerse", description: "This page isn't here." };
}

function render() {
  const route = routeFromHash();
  document.title = route.title;
  document.querySelector('meta[name="description"]').setAttribute("content", route.description);
  document.querySelector('meta[property="og:title"]').setAttribute("content", route.title);
  document.querySelector('meta[property="og:description"]').setAttribute("content", route.description);
  document.querySelector('meta[property="og:type"]').setAttribute("content", route.article ? "article" : "website");
  document.querySelector('meta[property="og:image"]').setAttribute("content", route.article && route.article.coverImage ? new URL(route.article.coverImage, location.href).href : "https://kadyverse.com/assets/inner-landscape.svg");
  const currentRoute = location.hash.slice(1).split("?")[0] || new URLSearchParams(location.search).get("route") || "/";
  const canonical = currentRoute === "/" ? "https://kadyverse.com/" : `https://kadyverse.com/?route=${encodeURIComponent(currentRoute)}`;
  document.querySelector('link[rel="canonical"]').setAttribute("href", canonical);
  document.querySelector('meta[property="og:url"]').setAttribute("content", canonical);
  const page = {
    home: homePage,
    explore: () => explorePage(route.slug),
    journal: journalPage,
    article: () => articlePage(route.slug),
    about: aboutPage,
    archive: archivePage,
    search: () => searchPage(route.query),
    404: notFoundPage
  };
  main.innerHTML = page[route.page]();
  document.body.classList.toggle("is-reading", route.page === "article");
  document.querySelectorAll(".primary-navigation a").forEach(link => {
    const linkPath = link.getAttribute("href").slice(1);
    const currentPath = location.hash.split("?")[0].slice(1) || "/";
    const active = linkPath !== "#/" && (currentPath === linkPath || (linkPath === "#/explore" && currentPath.startsWith("/explore")) || (linkPath === "#/journal" && (currentPath === "/journal" || currentPath.startsWith("/article/"))));
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector(".sr-only").textContent = "Open navigation";
  const structuredData = document.querySelector("#structured-data");
  structuredData.textContent = route.article ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: route.article.title,
    description: route.article.excerpt,
    datePublished: route.article.date,
    author: { "@type": "Person", name: "Kady" },
    publisher: { "@type": "Organization", name: "KadyVerse" },
    mainEntityOfPage: canonical,
    image: "https://kadyverse.com/assets/inner-landscape.svg"
  }) : "";
  if (route.page === "search") {
    const input = document.querySelector("#site-search");
    if (input) input.focus({ preventScroll: true });
  }
}

function updateReadingProgress() {
  const progress = document.querySelector(".reading-progress span");
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0}%`;
}

window.addEventListener("hashchange", () => {
  if (!location.hash.slice(1).startsWith("/")) return;
  render();
  window.scrollTo(0, 0);
});
window.addEventListener("scroll", updateReadingProgress, { passive: true });
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.querySelector(".sr-only").textContent = open ? "Close navigation" : "Open navigation";
  nav.classList.toggle("is-open", open);
});
nav.addEventListener("click", event => {
  if (!event.target.closest("a")) return;
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector(".sr-only").textContent = "Open navigation";
});
document.addEventListener("keydown", event => {
  if (event.key !== "Escape" || !nav.classList.contains("is-open")) return;
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector(".sr-only").textContent = "Open navigation";
  menuToggle.focus();
});
main.addEventListener("click", async event => {
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    activeFilter = filter.dataset.filter;
    visibleCount = 5;
    render();
    return;
  }
  if (event.target.closest("[data-load-more]")) {
    visibleCount += 5;
    render();
    return;
  }
  const copyButton = event.target.closest("[data-copy-link]");
  if (copyButton) {
    const feedback = copyButton.parentElement.querySelector(".copy-feedback");
    try {
      await navigator.clipboard.writeText(location.href);
      feedback.textContent = "Link copied.";
    } catch (error) {
      feedback.textContent = "Copy isn't available here. You can copy the address from your browser.";
    }
    return;
  }
  if (event.target.closest('a[href^="#"]')) nav.classList.remove("is-open");
});
main.addEventListener("submit", event => {
  if (!event.target.matches(".search-form")) return;
  event.preventDefault();
  const value = new FormData(event.target).get("q").trim();
  searchQuery = value;
  location.hash = `/search?q=${encodeURIComponent(value)}`;
});
main.addEventListener("change", event => {
  if (!event.target.matches("#archive-year")) return;
  document.querySelectorAll(".archive-year").forEach(year => {
    year.hidden = event.target.value !== "all" && year.dataset.year !== event.target.value;
  });
});
document.querySelector("#current-year").textContent = new Date().getFullYear();
render();
