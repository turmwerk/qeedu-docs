# QeEdu Docs UI Redesign Plan

## Reference

- Source: `/root/edu-ai/sample/dieWehmut.github.io`
- Desktop pattern: fixed left sidebar, no desktop header, content starts at top with a narrow right reading rail.
- Mobile pattern: fixed top header, left navigation drawer, right TOC drawer.
- Shared pattern: green-accent thin scrollbar, bottom-right stacked floating controls, black/white theme variables, restrained motion.

## Component Scope

1. `AppLayout`
   - Keeps one shell that renders desktop sidebar, mobile header, mobile nav drawer, mobile TOC drawer, main content, and desktop TOC/landing aside.
   - Desktop must not render a header region.
   - Drawer state closes on route change and Escape.

2. `DocsSidebar`
   - Matches the reference sidebar weight: fixed on desktop, narrow, dark/black surface in dark mode, simple border, avatar/logo at top, grouped nav below.
   - Mobile drawer reuses the same sidebar at a smaller width.

3. `MobileHeader`
   - Visible only below the mobile breakpoint.
   - Fixed to the viewport top, with menu on the left and page TOC on the right.
   - Uses the active theme surface and a compact 62px height.

4. `Toc` and `DocsLandingAside`
   - Desktop only at the right edge of content.
   - Sticky, narrow, low visual noise, with progress and active heading state.
   - Mobile TOC is displayed inside the right drawer.

5. `FloatControls`
   - Bottom-right control stack copied from the reference behavior: settings, back-to-top, theme, language, and background toggle.
   - Back-to-top hides at the page top.
   - Expanded controls stack above settings without shifting page layout.

6. Theme, Scrollbar, Motion
   - Dark mode follows the reference black palette; light mode keeps a clean white variant.
   - Scrollbars use the green accent style from the reference.
   - Remove decorative ambient meshes, scan sweeps, node pulses, snow/ribbons, and other noisy effects.
   - Keep only small interaction transitions and drawer/progress feedback.

## Subtask Commits

1. Plan component boundaries.
2. Remove noisy decorative effects.
3. Align desktop/mobile shell with the reference layout.
4. Align theme palette, scrollbar, and floating controls.
5. Verify build and desktop/mobile rendering.
