# KadyVerse

A quiet, editorial publication and private writing studio for thoughts, questions, observations and fragments of a life still unfolding.

## What is included

- `index.html`, `app.js`, and `styles.css` — the public website and shared visual system
- `studio.html` and `studio.js` — the private, mobile-first owner writing studio
- `supabase/migrations/` — database schema, owner policies, and private revision history
- `build.mjs` — static pre-renderer and studio bundler
- `assets/` — KadyVerse artwork and favicon
- `vercel.json`, `robots.txt`, and generated `sitemap.xml` — hosting and crawl configuration
- `dist/` — generated, deployable static website

## Design and local development

The site keeps its editorial ivory paper, charcoal typography, muted bronze details, Playfair Display, and DM Sans. Install dependencies and build the static output:

```bash
npm install
npm run build
python -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. The public website works without Supabase. `/studio/` displays a setup message until both Supabase build variables are configured.

## Supabase setup

The private studio requires a Supabase project:

1. Run `supabase/migrations/20261125160000_writing_studio.sql` in the Supabase SQL Editor.
2. Keep password sign-in enabled, but disable new user sign-ups in Supabase Auth settings. Invite/create the owner account yourself in the dashboard; the site has no registration flow.
3. Add that user's Auth UUID to the owner membership table from the SQL Editor:

   ```sql
   insert into public.studio_owner (owner_id)
   values ('<OWNER_AUTH_USER_UUID>');
   ```

4. In Supabase URL Configuration, set the website origin as the Site URL and allow the deployed `/studio/` URL for auth links.
5. Add the Supabase project URL and **anon/publishable** key as `SUPABASE_URL` and `SUPABASE_ANON_KEY` in the Vercel build environment, then redeploy.
6. Visit `/studio/` and sign in with the owner account.

The anon key is designed for browser use and is protected by RLS; it is included in the generated public configuration. Never put a Supabase service-role key in the repository, Vercel frontend build variables, or browser code. The build rejects a partial Supabase configuration.

RLS is enabled on entries, studio membership, and revisions. Anonymous requests can select published entries only; only the configured owner can access private entries and history or mutate writing. Membership is installed through the SQL Editor. The database, not the page's `noindex` metadata, is the security boundary.

## Studio and publishing

The studio includes owner login, autosave, manual save, local browser backup, sync-on-reconnect, conflict checks, search and status filters, version history, preview, and confirmed publish/unpublish actions. Entries support title, subtitle, long-form Markdown-style text, five dimensions, tags, dates, excerpt, and an optional cover-image URL. Cover image URLs should point to images intended for public display when the entry is published.

Drafts stay in Supabase and local browser storage; they are not shipped in public JavaScript or HTML. The public website requests only published rows, and RLS independently blocks anonymous access to drafts. Published pieces appear in the existing journal, search, archive, and dimension pages. Unpublishing removes a piece from public views while preserving it privately.

The studio route is excluded from the sitemap, marked `noindex`, and sent with `X-Robots-Tag` and `Cache-Control: no-store` headers. It remains crawlable so search engines can see and honor the no-index directive; the public route returns only the sign-in shell. Vercel rewrites newly published article slugs to the existing public renderer.

## Build and deployment notes

Run `npm run build`; Vercel should use that build command and `dist` as its output directory. The static build pre-renders existing public routes and creates a sitemap from statically known public routes. Database-published entries load at runtime and new article URLs use the Vercel fallback rewrite. Database-published slugs are not added to the static sitemap at publish time; use a dynamic sitemap endpoint or regenerate route data if you need those slugs listed there.

The static build cannot provision a Supabase project, owner account, membership row, or Vercel environment values. Those one-time dashboard steps are required for cloud authentication and sync. The website continues to use its existing domain and deployment.

Google Fonts are loaded from Google Fonts. For self-hosted fonts, add appropriately licensed local font files and update the font declarations.
