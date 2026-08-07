# Screenshots

This site ships with **CSS-rendered placeholders** for every visual, so it looks
intentional out of the box — no broken images. When you have real screenshots,
swap each placeholder in `index.html` for an `<img>` in one line.

## How to swap a placeholder for a real screenshot

Each visual is a `<figure>` containing a `<div class="shot__placeholder">`.
Replace that inner div with an `<img>` and keep the surrounding `<figure>`:

```html
<!-- Before (placeholder) -->
<figure class="feature__visual shot shot--mac" data-caption="Efforts — Mac">
  <div class="shot__placeholder">
    <span class="shot__label">Efforts</span>
    <span class="shot__hint">Mac · 1440×900</span>
  </div>
</figure>

<!-- After (real screenshot) -->
<figure class="feature__visual shot shot--mac" data-caption="Efforts — Mac">
  <img src="assets/screenshots/efforts-mac.png" alt="Efforts view on Mac">
</figure>
```

Drop the PNG into this folder (`assets/screenshots/`) and reference it by name.
The `.shot` frame (Mac window chrome, iOS device border, etc.) is applied by the
outer classes and wraps the image automatically.

## Recommended sizes

| Filename             | Used by                 | Size (px)      | Notes                                  |
| -------------------- | ----------------------- | -------------- | -------------------------------------- |
| `hero-collage.png`   | Hero                    | 1600 × 1200    | Mac + iPad + iPhone composite          |
| `efforts-mac.png`    | Efforts section         | 1440 × 900     | Sidebar + Effort list                   |
| `task-detail-mac.png`| Tasks section           | 1440 × 900     | Task detail pane                       |
| `workspace-mac.png`  | Three-pane (Mac tab)    | 1440 × 900     | Full three-pane layout                 |
| `workspace-ipad.png` | Three-pane (iOS tab)    | 1366 × 1024    | iPad three-pane                        |
| `sync-iphone.png`    | Sync section            | 1170 × 2532    | iPhone, can be a device shot or UI      |
| `quickfind-mac.png`  | Quick Find section      | 1440 × 900     | Quick Find open                         |

## Tips

- **2x / Retina:** export at 2× the listed size for crisp rendering on high-DPI
  screens, then set `width`/`height` attributes to the 1× size.
- **Device frames are optional.** The Mac frame adds a title bar with traffic
  lights; the iOS frame adds a phone bezel. If your screenshot already includes
  a device bezel, change the class from `shot--mac`/`shot--ios` to just `shot`
  to drop the chrome.
- **Dark mode:** if you export separate dark screenshots, name them
  `<name>-dark.png` and add a `<source>` inside a `<picture>` element, or just
  ship a single image that reads well on both backgrounds.
