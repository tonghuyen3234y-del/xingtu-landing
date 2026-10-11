# Asset sources

## App icon

`xingtu-icon.jpg`: artworkUrl512 from https://itunes.apple.com/lookup?id=1500526240&country=cn, retrieved 2026-10-11. App Store product: https://apps.apple.com/cn/app/id1500526240. This is product branding, not an original logo or evidence of site authorization.

## Photography

Downloaded 2026-10-11 from the public Unsplash image CDN, resized to 1000 px with quality 85. These are inspiration photos, not verified output from Xingtu.

- `photos/portrait.jpg`: https://images.unsplash.com/photo-1534528741775-53994a69daeb
- `photos/fashion.jpg`: https://images.unsplash.com/photo-1515886657613-9f3515b0c78f
- `photos/landscape.jpg`: https://images.unsplash.com/photo-1470770841072-f978cf4d019e
- `photos/city.jpg`: https://images.unsplash.com/photo-1519608487953-e999c86e7455
- `photos/nature.jpg`: https://images.unsplash.com/photo-1500530855697-b586d89ba3ee

Review source attribution and applicable license terms before public redistribution: https://unsplash.com/license.

## Hand models and static fallback

`models/arm.glb` and `models/arm2.glb` originated at https://lenis.dev/models/arm.glb and https://lenis.dev/models/arm2.glb, retrieved 2026-10-09. `hand-fallback.png` is a static render of the second model. These assets have no redistribution license confirmed in this project. Obtain permission or replace them before publishing to a public repository.

The project recreates scroll motion using observed position, rotation and scale states. The GLB files contain meshes, not skeletons or animation clips.

## Fonts and archived reference assets

Anton and Roboto font files and Panchang were acquired during the Lenis reference build. Confirm their respective font redistribution terms before release. The old Lenis wordmark, mark and website showcase thumbnails are no longer referenced by the page; they remain local reference assets and should be excluded from public release.

## Libraries

Lenis: MIT (`vendor/LICENSE-LENIS`). Three.js 0.160.0 and GLTFLoader: MIT (`vendor/three/LICENSE`).

## Motion journey update — 2026-10-11

Video excerpts are stored locally, without audio, encoded as H.264 with fast-start metadata. Poster images are extracted from the corresponding excerpts. They are visual inspiration footage, not recordings of Xingtu processing results.

| Local file | Source |
| --- | --- |
| `videos/portrait-film.mp4`, `videos/city.mp4` | [Young stylish woman in a sports car — Mixkit 44541](https://mixkit.co/free-stock-video/young-stylish-woman-in-a-sports-car-44541/) |
| `videos/portrait.mp4` | [Model turns to pose as a photographer takes photos in a studio — Mixkit 50641](https://mixkit.co/free-stock-video/model-turns-to-pose-as-a-photographer-takes-photos-in-50641/) |
| `videos/fashion.mp4` | [Urban trendy girl walking to the camera — Mixkit 1227](https://mixkit.co/free-stock-video/urban-trendy-girl-walking-to-the-camera-1227/) |
| `videos/landscape.mp4` | [Waterfall in forest — Mixkit 2213](https://mixkit.co/free-stock-video/waterfall-in-forest-2213/) |
| `videos/nature.mp4` | [Going down a curved highway through a mountain range — Mixkit 41576](https://mixkit.co/free-stock-video/going-down-a-curved-highway-through-a-mountain-range-41576/) |

These source pages identify the footage under the [Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree). Stock media retain their original terms; the code license does not cover them. Review redistribution terms before including downloadable stock files in a public source repository.

No React Bits component source was copied. Card transforms, entry paths, modal transitions and scene interpolation are authored in the project's plain JavaScript/CSS/Three.js stack.

## Photographic refinement — 2026-10-11

Seven distinct editorial photographs are stored at 1600px in `assets/editorial/`. Source image IDs (Unsplash):

- `street.jpg`: `photo-1483985988355-763728e1935b`
- `coast.jpg`: `photo-1475924156734-496f6cac6ec1`
- `interior.jpg`: `photo-1600210492486-724fe5c67fb0`
- `backlight.jpg`: `photo-1506794778202-cad84cf45f1d`
- `creative.jpg`: `photo-1490750967868-88aa4486c946`
- `mountain.jpg`: `photo-1464822759023-fed622ff2c3b`
- `portrait.jpg`: `photo-1524504388940-b1c1722653e1`

Original image URLs use `https://images.unsplash.com/` followed by the image ID. These are inspiration photographs under the Unsplash license; the website's color and exposure examples are authored illustrations, not evidence of actual Xingtu retouching or AI generation.

The full-screen `videos/portrait-film.mp4` was restored to the previous 10-second excerpt of Mixkit clip 44541. Its poster is taken at 3 seconds.

Hero album: `editorial/hero-man.jpg` uses Unsplash image `photo-1519085360753-af0119f7cbe7` (1000px). The other three cards reuse the existing portrait sources. The brief color sweep is a CSS grading illustration, not a recorded Xingtu retouching result.
