/**
 * Home page hero video, served from the "deltacon-media" GitHub repository
 * through the jsDelivr CDN.
 *
 * To change the video, upload the new file to that repository and update the
 * URL below. If a lighter phone-sized version is uploaded too, set
 * smallScreenVideoUrl and phones will use it; otherwise every screen uses the
 * main video.
 */
export const heroVideo = {
  /** Origin of the video host; the page connects to it early to start faster. */
  hostOrigin: "https://cdn.jsdelivr.net",
  /** Used on tablets and desktops (and on phones if no phone version is set). */
  largeScreenVideoUrl:
    "https://cdn.jsdelivr.net/gh/United-States-Security-Academy/deltacon-media@main/delta11.mp4",
  /** Optional lighter version for phones. */
  smallScreenVideoUrl: undefined as string | undefined,
};
