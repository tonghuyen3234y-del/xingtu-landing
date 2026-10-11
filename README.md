# 醒图 / Xingtu landing page

A bilingual, static photo-editing promotional landing page. Built with HTML, CSS, JavaScript, Lenis and Three.js, with no server or runtime CDN dependencies.

## Preview

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. Serve over HTTP so the ES modules and GLB models can load.

## Features

- Chinese by default, with a full English version and persistent language selection.
- Language switching preserves the current section position and photo/style selection.
- Two 3D hand meshes, scroll-driven transforms, green/gray lighting and particles.
- Horizontal photography inspiration gallery.
- Keyboard/touch-accessible before/after slider and three CSS color previews.
- Five feature cards, App Store and Android store links.
- Responsive layout, reduced-motion presentation and static model fallback.

The comparison is a local CSS color preview, not a live Xingtu editing service. The UI labels it as a style preview. No image is uploaded and no AI endpoint is called.

## Files

- `index.html`: semantic content and sections.
- `i18n.js`: Chinese/English content and language selection.
- `script.js`: scroll timelines, gallery and preview interactions.
- `scene.js`: Three.js hands, camera, lights and particles.
- `styles.css`: reference layout and Xingtu bilingual theme.
- `vendor/`: local Lenis and Three.js runtimes with MIT licenses.
- `assets/`: app icon, photography, fonts, models and static fallback.

## GitHub Pages

Publish the repository root using GitHub Pages. `.nojekyll` is included. All local runtime assets use relative paths, supporting repository subdirectories. No build step is required. Enable Settings → Pages → Deploy from a branch → main → / (root).

## Content sources

Feature wording and download destinations were checked on 2026-10-11:

- App Store: https://apps.apple.com/cn/app/id1500526240
- Android listing: https://m.app.mi.com/details?id=com.xt.retouch
- Privacy and terms destinations are those listed by the app's App Store description.

See `assets/SOURCES.md` for asset provenance and redistribution notes. Public availability of an asset does not establish permission to redistribute it. Lenis and Three.js MIT licenses do not cover branding, fonts, photography or model assets.

### 新版影像交互

- 横向视频轨道包含斜向入场与轨道末尾的页内体验按钮。
- 独立人像影片章节支持暂停；照片章节分批入场，主照片通过固定过渡层移动到对比画布。
- 功能卡片保留错落布局，点击或按 Enter / Space 可展开原位动画详情；支持 Escape、关闭按钮与遮罩关闭。
- 鼠标影响手部姿态、灯光与按钮；开场每个浏览器会话播放一次，可跳过。
- 视频只在可见区域播放，同时最多解码两支；后台、减少动态或节省流量模式停止自动播放。
- 新增文案具有中英文版本；不新增路由或后端依赖。

静态预览仍可使用 `python3 -m http.server 8080`。视频来源与许可边界见 `assets/SOURCES.md`。

### 本轮保留的修改

仅保留七张不同环绕照片与悬停/点击说明、五张功能卡片的间距与交互预览，以及统一按钮反馈。相关补充交互位于 `interactions.js`。首屏、手部材质与灯光、背景、影片内容与章节滚动恢复此前版本。

### 首屏人像相册

`hero-album.js` manages four stacked portraits, pointer dragging, click/keyboard cycling, and a 5.8-second automatic cycle. Hover, focus, offscreen state and reduced-motion preference suspend the timer. The first portrait includes an illustrative color sweep. The album replaces the large English hero wordmark; the slogan sits below it.

### 首屏像素与标题互动

`hero-effects.js` is an original Canvas implementation of a fading ordered-dither cursor trail and sampled-glyph electric accents. Hovering or focusing the fixed brand area switches 醒图 to Hypic; leaving restores it. No React Bits Pro source is bundled. All four album cards have separate CSS color-preview layers, active only while in front. These previews illustrate color grading rather than real skin-retouching results.

## Source license and third-party assets

Original application code is available under the MIT license in `LICENSE`. Product names, branding, photographs, fonts, stock footage and hand models are excluded from that grant and retain their respective ownership and terms. This repository does not establish endorsement by Xingtu. See `assets/SOURCES.md` before reusing or redistributing media.
