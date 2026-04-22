# Qiaomu Blog Open Source - Contributor Notes

## Stack

- Next.js 16
- React 19
- TypeScript
- OpenNext for Cloudflare
- Cloudflare D1 + R2
- Optional: KV / Queues / Workers AI / Vectorize

## Important

- This repo targets Cloudflare Workers, not Cloudflare Pages.
- The tracked `wrangler.toml` is a public template only.
- Real bindings must live in local `wrangler.local.toml`.
- Never commit private resource IDs, domains, secrets, tokens, or personal social links.

## Development Rules

- Read the relevant guide in `node_modules/next/dist/docs/` before changing Next.js-specific code.
- Keep `D1 + R2` as the only hard requirements.
- Optional capabilities must degrade cleanly when disabled.
- Reuse existing route helpers and settings helpers instead of duplicating server logic.
- Check mobile and desktop behavior for user-facing UI changes.

## Verification

- Quick check: `npm run verify:quick`
- Full check: `npm run verify`
- Worker preview: `npm run preview`
