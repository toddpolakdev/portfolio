# Portfolio — toddpolak

Next.js 15 portfolio with a terminal/dev-native design, all copy served from
MongoDB through a GraphQL API, plus an authenticated admin portal for editing
it.

- **Public site** — server-rendered and statically generated. No client-side
  data fetching, no loading spinner, full HTML for crawlers.
- **Admin portal** at `/admin` — edit section copy, manage projects, upload
  screenshots to Cloudinary, and read contact-form messages.
- **Backend** — the separate [`my-portfolio-backend`](../my-portfolio-backend)
  repo, an Apollo Server on Vercel backed by MongoDB.

## Architecture

```
Browser ──► Next.js (Server Components)  ──► GraphQL API ──► MongoDB
                    │                             ▲
                    └── server actions ───────────┘
                        (Bearer ADMIN_API_TOKEN)
```

Public pages read through cache-tagged `fetch` calls. Admin writes go through
server actions that attach `ADMIN_API_TOKEN` — that token never reaches the
browser — and then revalidate the affected tags so the live site updates
without a deploy.

Auth is two independent layers:

1. **Who you are** — Auth.js v5 with GitHub OAuth, restricted to an allowlist.
2. **What the API trusts** — a shared bearer token between the Next server and
   the GraphQL API. Every admin resolver calls `requireAdmin`, and every server
   action re-checks the session before it runs.

## Setup

### 1. Environment

Copy the template and fill it in:

```bash
cp .env.example .env.local
```

| Variable | What it is |
| --- | --- |
| `GRAPHQL_ENDPOINT` | The GraphQL API. `http://localhost:4000/api/graphql` in dev. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL. Used for metadata and the sitemap. |
| `ADMIN_API_TOKEN` | Shared secret. **Must match the same variable in the backend.** |
| `AUTH_SECRET` | Session signing key. `openssl rand -hex 32`. |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | From the GitHub OAuth app below. |
| `ADMIN_EMAILS` | Comma-separated emails allowed into `/admin`. |
| `ADMIN_GITHUB_LOGINS` | Comma-separated GitHub usernames, for private-email accounts. |

If both allowlists are empty, **nobody** can sign in — that is deliberate.

### 2. GitHub OAuth app

Create one at <https://github.com/settings/developers> → *New OAuth App*:

- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

Copy the client ID and generated secret into `.env.local`. For production,
create a second OAuth app pointing at your real domain.

### 3. Cloudinary (image uploads)

Uploads are signed server-side, so the backend needs these set:

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Without them the admin still works; only the Upload button is disabled, and it
says so. Uploads are confined to the `portfolio/` folder prefix.

### 4. Run it

```bash
# terminal 1 — API
cd ../my-portfolio-backend && npm run dev

# terminal 2 — site
npm run dev
```

The site is at <http://localhost:3000>, the admin at
<http://localhost:3000/admin>.

## Content model

Two MongoDB collections drive everything:

- **`section`** — one document per page section, keyed by `id`
  (`hero`, `about`, `skills`, `experience`, `education`, `contact`). Each has a
  `type` that decides which editor the admin shows and which component renders
  it.
- **`project`** — one per portfolio project, with `status` (`draft` /
  `published`), `featured`, and `order`. Drafts are invisible to the public
  API, not just hidden in the UI.

To migrate the projects that were previously hardcoded:

```bash
cd ../my-portfolio-backend && npm run seed:projects
```

It upserts by slug and skips anything that already exists, so it is safe to
re-run.

## Design system

Tokens live in `src/app/globals.css`. Dark is the default; light is a pure
token swap under `:root[data-theme="light"]`, so no component knows which theme
is active. Adding a colour means editing one file.

Everything else is CSS Modules colocated with its component.

## Notable behaviour

- **⌘K / Ctrl+K** opens a command palette for jumping to sections, opening
  projects, and toggling the theme.
- **Scroll reveals** use one shared `IntersectionObserver`, and are disabled
  under `prefers-reduced-motion`. A `<noscript>` rule makes sure content is
  never invisible without JS.
- **The contact form** is a server action with a honeypot field and server-side
  validation; it does not trust the client.
