import Captions from "@/docs/docs-site/examples/image-viewer/captions"
import captionsSrc from "@/docs/docs-site/examples/image-viewer/captions?raw"
import Controlled from "@/docs/docs-site/examples/image-viewer/controlled"
import controlledSrc from "@/docs/docs-site/examples/image-viewer/controlled?raw"
import Demo from "@/docs/docs-site/examples/image-viewer/demo"
import demoSrc from "@/docs/docs-site/examples/image-viewer/demo?raw"
import Gallery from "@/docs/docs-site/examples/image-viewer/gallery"
import gallerySrc from "@/docs/docs-site/examples/image-viewer/gallery?raw"
import ProfilePhoto from "@/docs/docs-site/examples/image-viewer/profile-photo"
import profilePhotoSrc from "@/docs/docs-site/examples/image-viewer/profile-photo?raw"
import Thumbnails from "@/docs/docs-site/examples/image-viewer/thumbnails"
import thumbnailsSrc from "@/docs/docs-site/examples/image-viewer/thumbnails?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const viewerOptions = 'Omit<ImageViewerProps, "images" | "isOpen" | "defaultOpen" | "onOpenChange" | "index" | "defaultIndex" | "onIndexChange">'

export default {
  description:
    "A full-screen, always-dark viewer for photos and scanned documents: zoom with buttons, keys, ctrl/⌘ + wheel or pinch, pan when zoomed, rotate, and step through a set with a counter, captions and an optional thumbnail strip. ViewableImage turns any image into a trigger; ImageGallery lays out a thumbnail grid.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/Modal.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { ImageGallery, ImageViewer, ViewableImage } from "@/components/ui/image-viewer"

// One image: a drop-in <img> that opens the viewer on itself
<ViewableImage src={student.photo} alt={student.name} className="size-12 rounded-md" />

// A set: thumbnail grid, viewer opens at the pressed image
<ImageGallery images={photos} aria-label="Field trip" viewerProps={{ showThumbnails: true }} />

// Your own trigger
<ImageViewer images={photos} isOpen={open} onOpenChange={setOpen} index={index} onIndexChange={setIndex} />`,
  examples: [
    {
      id: "profile-photo",
      title: "Profile photo",
      description: (
        <>
          <InlineCode>ViewableImage</InlineCode> replaces an <InlineCode>{"<img>"}</InlineCode>: size and corners go on <InlineCode>className</InlineCode>, the image
          fills the frame and inherits its corners. Pass a small <InlineCode>src</InlineCode> for the list and a large <InlineCode>fullSrc</InlineCode> for the
          viewer.
        </>
      ),
      component: ProfilePhoto,
      source: profilePhotoSrc,
    },
    {
      id: "gallery",
      title: "Gallery",
      description: (
        <>
          A responsive grid with as many 128dp-minimum columns as fit. Set a fixed count with <InlineCode>grid-cols-*</InlineCode> and the tile ratio with{" "}
          <InlineCode>itemClassName</InlineCode>. Tab reaches the grid once; arrow keys move between tiles and Enter opens one.
        </>
      ),
      component: Gallery,
      source: gallerySrc,
      className: "min-h-[160px] p-4",
    },
    {
      id: "controlled",
      title: "Controlled",
      description: (
        <>
          Open the viewer from any control with <InlineCode>isOpen</InlineCode> / <InlineCode>onOpenChange</InlineCode>, and pick or follow the image with{" "}
          <InlineCode>index</InlineCode> / <InlineCode>onIndexChange</InlineCode>.
        </>
      ),
      component: Controlled,
      source: controlledSrc,
    },
    {
      id: "thumbnails",
      title: "Thumbnails and download",
      description: (
        <>
          <InlineCode>showThumbnails</InlineCode> adds a strip under the image; arrow keys move through it. An image with a <InlineCode>downloadUrl</InlineCode>{" "}
          gets a download action. With <InlineCode>{"loop={false}"}</InlineCode>, previous and next stop at the ends.
        </>
      ),
      component: Thumbnails,
      source: thumbnailsSrc,
    },
    {
      id: "captions",
      title: "Captions",
      description: (
        <>
          <InlineCode>title</InlineCode> and <InlineCode>description</InlineCode> show under the image. The description wraps to two lines, and the caption area
          keeps the height of the tallest caption in the set so the image doesn't jump between slides.
        </>
      ),
      component: Captions,
      source: captionsSrc,
    },
  ],
  api: [
    {
      name: "ImageViewer",
      description: <>React Aria {c("ModalOverlay")} + {c("Modal")} + {c("Dialog")}. Without {c("isOpen")} or {c("defaultOpen")} it also works inside a React Aria {c("DialogTrigger")}.</>,
      props: [
        { name: "images", type: "ImageViewerItem[]", default: "—", description: "The set to browse. Renders nothing when empty." },
        { name: "isOpen", type: "boolean", default: "—", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "—", description: "Initial open state (uncontrolled)." },
        { name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—", description: "Called on close (Esc, the close button, a tap outside the image) and open." },
        { name: "index", type: "number", default: "—", description: "Controlled index of the image on screen. Clamped to the set." },
        { name: "defaultIndex", type: "number", default: "0", description: "Initial index (uncontrolled). Kept between opens." },
        { name: "onIndexChange", type: "(index: number) => void", default: "—", description: "Called when the user moves to another image." },
        { name: "showThumbnails", type: "boolean", default: "false", description: "Thumbnail strip under the image, for sets of two or more." },
        { name: "loop", type: "boolean", default: "true", description: "Previous on the first image goes to the last, and next on the last to the first." },
        { name: "maxZoom", type: "number", default: "8", description: "Largest zoom, as a multiple of the fitted size." },
        { name: "isDismissable", type: "boolean", default: "true", description: "Close when the empty area around the image is tapped or clicked." },
        { name: "aria-label", type: "string", default: '"Image viewer"', description: "Accessible name of the dialog." },
        { name: "className", type: "string", default: "—", description: "Classes for the full-screen dialog." },
      ],
    },
    {
      name: "ImageViewerItem",
      description: "One image in a set (a type, used by all three components).",
      props: [
        { name: "src", type: "string", default: "—", description: "Image shown in the viewer." },
        { name: "alt", type: "string", default: "—", description: "Alternative text. Also names the thumbnail and the announcement when the image changes." },
        { name: "title", type: "string", default: "—", description: "Caption title (title-medium)." },
        { name: "description", type: "string", default: "—", description: "Caption text (body-medium, up to two lines)." },
        { name: "thumbnailSrc", type: "string", default: "src", description: "Smaller image for the thumbnail strip and the gallery tiles." },
        { name: "downloadUrl", type: "string", default: "—", description: "Shows a download action. Cross-origin URLs open in a new tab instead of downloading (a browser rule)." },
        { name: "crossOrigin", type: '"anonymous" | "use-credentials"', default: "—", description: "CORS mode, as on <img crossorigin>." },
      ],
    },
    {
      name: "ViewableImage",
      description: <>A React Aria {c("Button")} around an {c("<img>")}. Other {c("<img>")} attributes (loading, width, height, srcSet…) go to the image.</>,
      props: [
        { name: "src", type: "string", default: "—", description: "Image shown in place." },
        { name: "alt", type: "string", default: "—", description: 'Alternative text; also the button\'s name ("View image" when empty).' },
        { name: "fullSrc", type: "string", default: "src", description: "Larger version shown in the viewer." },
        { name: "title · description · downloadUrl · crossOrigin", type: "string", default: "—", description: "Passed to the viewer item, as in ImageViewerItem." },
        { name: "className", type: "string", default: "—", description: "Classes for the pressable frame: size and corners. The image covers it and inherits the corners." },
        { name: "imageClassName", type: "string", default: "—", description: "Classes for the <img>, e.g. object-contain." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Shows the image without opening the viewer." },
        { name: "viewerProps", type: viewerOptions, default: "—", description: "Options for the viewer it opens (maxZoom, isDismissable…)." },
        { name: "ref", type: "Ref<HTMLButtonElement>", default: "—", description: "The button." },
      ],
    },
    {
      name: "ImageGallery",
      description: <>React Aria {c("GridList")} in grid layout; pressing a tile opens the viewer on it.</>,
      props: [
        { name: "images", type: "ImageViewerItem[]", default: "—", description: "Tiles show thumbnailSrc (or src)." },
        { name: "aria-label", type: "string", default: '"Gallery"', description: "Accessible name of the grid." },
        { name: "className", type: "string", default: "—", description: "Classes for the grid. Columns default to repeat(auto-fill, minmax(128dp, 1fr)); override with grid-cols-*." },
        { name: "itemClassName", type: "string", default: "—", description: "Classes for each tile, e.g. aspect-video (default aspect-square)." },
        { name: "viewerProps", type: viewerOptions, default: "—", description: "Options for the viewer it opens (showThumbnails, loop, maxZoom…)." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The viewer is a modal {c('role="dialog"')} named by {c("aria-label")}: focus moves into it, stays there, and returns to the trigger on close, and the page
        behind is inert and doesn't scroll. Every action is an icon button with a label and a tooltip that shows its shortcut. A polite live region announces the
        image's title (or alt text) and position, e.g. "Brown bear, 1 of 6", when it changes. Triggers ({c("ViewableImage")}, gallery tiles) are named by the
        image's alt text.
      </>
    ),
    keyboard: [
      { keys: ["←", "→"], description: "Previous / next image (mirrored in right-to-left layouts). When zoomed in, they pan instead." },
      { keys: ["↑", "↓"], description: "Pan up / down when zoomed in." },
      { keys: ["+", "−"], description: "Zoom in / out by 1.5×." },
      { keys: ["0"], description: "Reset zoom, pan and rotation." },
      { keys: ["R", "Shift+R"], description: "Rotate 90° clockwise / counter-clockwise." },
      { keys: ["Esc"], description: "Close the viewer." },
      { keys: ["Tab", "Shift+Tab"], description: "Move between the viewer's controls; focus can't leave it." },
      { label: "Thumbnail strip", description: "One tab stop; ← → move through the thumbnails and show each image. The shortcuts above (except the arrows) still work." },
      { label: "ImageGallery", description: "One tab stop; arrow keys move between tiles, Enter opens the focused one." },
    ],
    notes: [
      "Always give a meaningful alt. Thumbnails, the live announcement and ViewableImage's button all use it.",
      "Drag pans a zoomed image; at fit, a horizontal swipe moves to the previous or next image. Two fingers pinch to zoom; double-tap or double-click toggles fit and 2×.",
      <>
        The viewer reads direction from the locale (<TextLink to="/docs/direction">Direction</TextLink>): in RTL the arrows, swipes and the slide animation
        mirror.
      </>,
      "With reduced motion, zoom, pan, rotate and slides jump instead of animating; only the fades remain.",
    ],
  },
  spec: {
    description: "M3 has no lightbox component, so the viewer is assembled from M3 parts in a dark scheme.",
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Backdrop", <>{c("scrim")} at 100%</>],
          ["Colors", <>The app's own scheme in dark mode ({c("ThemeScope mode=\"dark\"")}), on light and dark pages alike</>],
          ["Top bar", <>64dp, {c("scrim")} 60% → 0% gradient; counter {c("title-medium")} {c("on-surface")}</>],
          ["Actions", <>Standard icon buttons S: 40dp, 24dp icons, {c("on-surface-variant")}</>],
          ["Previous / next", <>Tonal icon buttons, M (56dp) from 600dp, S (40dp) below; 16dp (8dp compact) from the edge</>],
          ["Image", "Fitted with a 16dp margin, never upscaled; zoom 1× (fit) to 8×, 1.5× per step, double-tap 2×"],
          ["Caption", <>{c("title-medium")} {c("on-surface")} · {c("body-medium")} {c("on-surface-variant")}, two lines, max 600dp wide</>],
          ["Thumbnails", <>56dp, 8dp apart, 12dp corners → 8dp pressed; others at 60% opacity; selected: 2dp {c("primary")} ring, 2dp gap</>],
          ["Gallery tiles", <>min 128dp, 8dp gap, 12dp corners → 8dp pressed, {c("surface-container-highest")} while loading</>],
          ["Tooltips", <>Plain tooltip on {c("secondary-fixed")} / {c("on-secondary-fixed")}, which stay light in both modes</>],
        ],
      },
    ],
    cards: [
      {
        title: "Motion",
        items: [
          "Zoom, pan, rotate and the snap back after a drag: FastSpatial spring (ζ 0.6, k 800, 374ms)",
          "Image enters at 0.92 scale, or slides 12% from the side it comes from, on FastSpatial; it fades in on FastEffects",
          "Backdrop fades in on DefaultEffects and out on FastEffects",
          "While a finger, mouse or wheel drives the image, it follows directly with no spring",
        ],
      },
      {
        title: "Shape",
        items: ["Thumbnails and tiles: corner medium (12dp), small (8dp) while pressed", "Icon buttons keep their own M3 Expressive press morph"],
      },
    ],
    source: <>androidx {c("ExpressiveMotionTokens")}, {c("ShapeTokens")} and the icon button tokens ({c("StandardIconButtonTokens")}, {c("FilledTonalIconButtonTokens")}).</>,
  },
} satisfies ComponentDoc
