"use client";

import { Pause, Play } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";

import { cn } from "@/lib/utils";

type HeroBackgroundVideoProps = {
  /** Video for tablets and desktops (a full URL or a path inside /public). */
  largeScreenVideoSource: string;
  /** Optional lighter video for phones; phones use the large one if not set. */
  smallScreenVideoSource?: string;
  /** Origin of an external video host, connected to early so the video starts sooner. */
  videoHostOrigin?: string;
  /** Still frame shown before the video plays, and instead of it when motion is reduced. */
  posterImage: StaticImageData;
};

type NetworkInformation = { saveData?: boolean };

/** Screens at least this wide get the large video. */
const largeScreenQuery = "(min-width: 768px)";

/**
 * Decorative, muted, looping video behind the home page hero.
 *
 * - The poster frame is part of the page, so the hero never looks empty.
 * - The video is added only after the page has loaded, so it never slows down
 *   the first paint, and phones get a smaller file when one is provided.
 * - If the video cannot load, the poster frame simply stays in place.
 * - It is not started automatically for visitors who ask for reduced motion
 *   or have data saver on; they can still start it with the play button.
 * - There is always a pause/play button (WCAG 2.2.2: moving content lasting
 *   more than five seconds must be pausable).
 */
export function HeroBackgroundVideo({
  largeScreenVideoSource,
  smallScreenVideoSource,
  videoHostOrigin,
  posterImage,
}: HeroBackgroundVideoProps) {
  // Open the connection to the video host while the page is still loading.
  if (videoHostOrigin) preconnect(videoHostOrigin);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  function chooseVideoSourceForScreen(): string {
    if (!smallScreenVideoSource) return largeScreenVideoSource;
    return window.matchMedia(largeScreenQuery).matches
      ? largeScreenVideoSource
      : smallScreenVideoSource;
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const connection = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection;
    const hasDataSaverOn = connection?.saveData === true;

    if (!prefersReducedMotion && !hasDataSaverOn) {
      // Deferred to after hydration on purpose (see comment above).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVideoSource(chooseVideoSourceForScreen());
    }
    // Runs once on mount; the sources never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function togglePlayback() {
    if (!videoSource) {
      setVideoSource(chooseVideoSourceForScreen());
      return; // autoPlay starts it once it has loaded
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }

  return (
    <>
      <Image
        src={posterImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {videoSource && (
        <video
          ref={videoRef}
          src={videoSource}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setIsVideoVisible(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            // Keep showing the poster frame if the video can't be loaded.
            setIsPlaying(false);
            setIsVideoVisible(false);
            setVideoSource(null);
          }}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            isVideoVisible ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      <button
        type="button"
        onClick={togglePlayback}
        className="absolute right-4 bottom-5 z-20 flex size-11 items-center justify-center rounded-full border border-white/40 bg-navy-950/60 text-white backdrop-blur transition-colors hover:border-gold-400 hover:text-gold-300"
      >
        {isPlaying ? (
          <Pause aria-hidden="true" className="size-5" />
        ) : (
          <Play aria-hidden="true" className="size-5" />
        )}
        <span className="sr-only">
          {isPlaying ? "Pause background video" : "Play background video"}
        </span>
      </button>
    </>
  );
}
