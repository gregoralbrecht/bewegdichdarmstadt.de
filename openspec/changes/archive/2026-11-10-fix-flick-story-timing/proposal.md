# Proposal

## Why

The `Flick` story in `MenuDrawer.stories.tsx` fails in CI now and then, and each failure blocks the deploy. `useSheetDrag` counts a release as a flick by speed, taken from `event.timeStamp`. The `drag` browser command in `web/vitest.config.ts` sends real Playwright mouse moves with real waits, so every slow CDP round trip on a busy runner shows up as a slower finger. If a step takes over ~40ms, the 60px flick drops below the 0.5 px/ms threshold. Locally that never happens. This was reproduced: with 100ms gaps between steps, Flick fails the way it does in CI.

## What Changes

- `drag` sends mouse and touch events through CDP (`Input.dispatchMouseEvent` / `Input.dispatchTouchEvent`), each with a `timestamp` from a clock that moves forward by exactly `interval` per step and `rest` before letting go. So `event.timeStamp`, and with it the speed the hook sees, comes from the options and not from runner load. Checked: Chrome uses these timestamps for `event.timeStamp`. With them, Flick passes even with 100ms real gaps.
- It still waits in real time between steps, so CSS state and animations move on as before.
- Story options and the hook stay the same.

Out of scope: changing the flick threshold or any drawer behavior.

Decisions:

- Synthetic timestamps over a bigger margin in the story (faster or longer flick), because any margin still depends on runner speed.
- CDP for the mouse too, over keeping `page.mouse`, because `page.mouse` can't set timestamps. Touch already goes through CDP.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. Test tooling only (`skip_specs: true`).

## Impact

`web/vitest.config.ts` (`drag` command). This affects every story that drags: `SwipeAway`, `Flick`, `ShortDrag`, `SwipeFromList`.
