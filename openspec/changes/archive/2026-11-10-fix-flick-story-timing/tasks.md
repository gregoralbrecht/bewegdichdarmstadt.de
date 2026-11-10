# Tasks

## 1. Drag command

- [x] 1.1 In `web/vitest.config.ts`, have `drag` send every event through one CDP session: `Input.dispatchMouseEvent` (move to start, press, moves, release, left button) or `Input.dispatchTouchEvent`. Each event gets a `timestamp` (seconds) on a clock that starts at `Date.now() / 1000`, moves forward `interval` per step and `rest` before the release. Keep the real `waitForTimeout` between steps and before the release, and update the comment. Verify `pnpm check` passes.
- [x] 1.2 Verify the clock is what counts: temporarily raise the real wait between steps to 100ms and confirm `Flick` passes (`pnpm exec vitest run src/components/MainMenu/MenuDrawer.stories.tsx -t Flick` in `web/`). Then revert the wait.

## 2. Checks

- [x] 2.1 Verify all seven `MenuDrawer` stories pass 10 runs in a row locally, and that `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build` pass.
- [x] 2.2 After pushing, verify the CI run is green with `gh run watch` (ci + deploy).

## Log

- The mouse helper sends `button: "left"` on every event and tracks `buttons` (0 before the press, 1 while held, 0 after), so moves during the drag report the held button as `page.mouse` did.
- `format:check` and `lint` are root scripts, not `web/` ones; run them from the repo root.
- No design.md: nothing beyond the proposal's one-liners.
