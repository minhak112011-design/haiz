# Recommended external skills for this landing page

These are separate community/vendor skills. Read their source and choose only what your coding agent supports. The included `minh-human-portfolio` skill is a custom brief-specific skill; it does not contain copies of the external skill source.

## 1. Anthropic — frontend-design
Best for: choosing a distinctive visual direction and avoiding common AI-template patterns.
Source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
Install with the skills CLI: `npx skills add anthropics/skills --skill frontend-design`

## 2. UI/UX Pro Max
Best for: searching design styles, palette/font pairings and UX rules before implementation.
Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
For Claude Code: `npx ui-ux-pro-max-cli init --ai claude`
For a universal Agent Skills setup: `npx ui-ux-pro-max-cli init --ai universal`
Choose the matching target for your editor/agent.

## 3. Vercel — react-best-practices
Best for: React/Next.js bundle size, rendering and performance review.
Source: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
Install: `npx skills add vercel-labs/agent-skills --skill react-best-practices`

## 4. Vercel — web-design-guidelines
Best for: reviewing interface quality, accessibility and common UX issues after the page is built.
Source: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
Install: `npx skills add vercel-labs/agent-skills --skill web-design-guidelines`

## 5. OpenAI — Playwright skill (optional)
Best for: checking the actual page in a browser, taking screenshots and debugging key UI flows. This requires browser tooling and supported setup; installing the skill alone does not guarantee that the AI environment can launch a browser.
Source: https://github.com/openai/skills/tree/main/skills/.curated/playwright
Install: `npx skills add https://github.com/openai/skills --skill playwright`

## Suggested order
Start with `frontend-design` + `minh-human-portfolio`. Add `ui-ux-pro-max` if the agent can use its CLI/data, then use Vercel guidelines for the final audit. Add Playwright only when browser automation is available. Do not install every animation library or every skill just because it exists. If your AI tool cannot install skills, attach the custom skill file and paste the master prompt; ask it to follow both explicitly.
