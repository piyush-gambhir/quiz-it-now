# Node 26 tooling review

Reviewed on 26 October 2026 against `origin/release` at `cdeae5d`.

## Compatibility and scope

The queued upgrade was rebased onto the newer upstream security fixes. The strict lint checks, public URL validation and its tests, Next.js security release, and bounded Undici override remain intact. Upstream had already fixed the previously reported lint errors; no application source edits or new lint suppressions were needed.

Local development uses Node 26.12.1 through the existing `.nvmrc`. The package engine retains Node 24.22.1 for Vercel hosting. CI checks both versions, and the manual Vercel workflow keeps its Node 24 runtime. pnpm 12.15.0 and the existing pnpm lockfile remain the package-manager path.

The main typecheck generates Next route types and explicitly invokes TypeScript 7.0.2 through `@typescript/native`. TypeScript 6.0.3 remains for ESLint and Next's compiler API; `typecheck:compat` explicitly checks that compiler. Scripts avoid ambiguous bare `tsc` resolution.

Direct dependencies were checked against registry latest versions. Remaining compatibility holds are ESLint 9.39.5 for the React lint plugin peer range and TypeScript 6 for compiler API consumers. The separately installed native alias supplies TypeScript 7. Resizable panels stays on the latest policy-eligible 4.14.8: 4.15.0 was published at 2026-10-24T21:32:32.360Z and falls inside the current 24-hour release-age window. It becomes eligible at 2026-10-25T21:32:32.360Z (26 October, 03:02:32 IST). This is a temporary release-age hold, not an incompatibility. No new policy exception is added. The existing NextAuth 5 beta is preserved rather than downgraded to the stable 4.x channel.

## Verification

On both Node 24.22.1 and 26.12.1:

- ESLint passes with 37 existing warnings and zero errors.
- TypeScript 7 and TypeScript 6 compatibility checks pass.
- All three existing deployment URL tests pass.
- Production builds pass. Verification explicitly blanked provider, database and OAuth configuration, using a disposable local authentication secret and a localhost public URL. Environment validation was skipped only in those local verification processes; production configuration is not changed to skip it.

pnpm frozen installation and peer checks pass. Both full and production dependency audits report zero known advisories. This is dependency coverage, not an application security audit.

Isolated Chromium 155 production-browser checks pass:

- Homepage and login render without browser page errors.
- Submitting short text reaches the real API's 400 response and displays its minimum-word-count error.
- Anonymous file upload and protected quiz routes present their sign-in gates.
- The models endpoint returns seven local fallback models with no provider key.
- Valid-length text reaches the missing NVIDIA key response, without a provider request.

No live NVIDIA/OpenAI generation, OAuth exchange, AWS upload, audio transcription, MongoDB persistence, or authenticated quiz completion was exercised. No production data or credentials were used. A controlled performance benchmark was not run, so no speedup is claimed.

## Containers and deployment boundary

The Dockerfile pins Node 26.12.1, explicitly installs pnpm with its required install script enabled, and uses frozen installation. Environment files are excluded from build context. `NEXT_PUBLIC_APP_URL` is a public build argument with a localhost default; set it to the deployed origin when building. The rebuilt Linux arm64 image runs Node 26.12.1 and passes the same browser
validation and authentication-gate checks at a disposable localhost origin.
Its environment contains only disposable local authentication values; no
provider, database or OAuth credentials are supplied.

CI runs on release branch pushes and pull requests. The deployment workflow remains manual-only and was not invoked. Its pnpm version is aligned, but its Node 24 runtime and triggers remain unchanged. A separate Vercel Git integration may react to a future push; that connection was not inspected. No push, PR, tag, release, deployment, provider setup, or global configuration change was performed.

The measured outcome is current compatible dependencies and verified support for both hosting and development runtimes, plus an explicit native compiler path. Upstream already had a zero-advisory baseline, which is preserved.
