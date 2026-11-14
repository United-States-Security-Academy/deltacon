"use client";

import { ChevronDown, MapPin, Pause, Phone, Play, Search } from "lucide-react";
import { useDeferredValue, useId, useState } from "react";

import { useIsInBrowser } from "@/lib/use-is-in-browser";
import { cn } from "@/lib/utils";

/** The ticker repeats its names this many times so the loop never shows a gap. */
const tickerCopies = 3;

function alphabetical(names: string[]): string[] {
  return [...names].sort((first, second) => first.localeCompare(second));
}

/** Case- and accent-insensitive text for matching what the visitor types. */
function searchable(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * "Places we serve" in a location page's hero: a slow ticker of the cities,
 * a summary line, and a button that slides open the full list of counties
 * and cities with a search box.
 *
 * The full list is always in the page HTML (search engines read it); while
 * closed it is `inert`, so keyboards and screen readers skip it. The ticker
 * is decorative (the list holds the same names), pauses on hover, focus or
 * its pause button, and is hidden for visitors who prefer reduced motion.
 */
export function PlacesServed({
  areaName,
  counties,
  citiesAndTowns,
  headquartersCity,
  phoneDisplay,
  phoneInternational,
}: {
  /** e.g. "the Houston metro area". */
  areaName: string;
  counties: string[];
  citiesAndTowns: string[];
  /** Marked "HQ" in the list. */
  headquartersCity?: string;
  phoneDisplay: string;
  phoneInternational: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = searchable(useDeferredValue(query));
  const isInBrowser = useIsInBrowser();
  const panelId = useId();
  const searchId = useId();

  const sortedCounties = alphabetical(counties);
  const sortedCities = alphabetical(citiesAndTowns);
  const matches = (name: string) =>
    deferredQuery === "" || searchable(name).includes(deferredQuery);
  const matchingCounties = sortedCounties.filter(matches);
  const matchingCities = sortedCities.filter(matches);
  const hasNoMatches =
    matchingCounties.length === 0 && matchingCities.length === 0;

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4 rounded-xl border border-white/10 bg-navy-950/60 p-4 sm:p-5">
      {/* Ticker (decorative) */}
      <div
        data-paused={isTickerPaused}
        className="marquee places-ticker flex items-center gap-3"
      >
        <div aria-hidden="true" className="marquee-row min-w-0 flex-1">
          <ul
            data-looping={isInBrowser}
            className="marquee-track"
            style={{ "--marquee-duration": "120s" } as React.CSSProperties}
          >
            {Array.from({ length: isInBrowser ? tickerCopies : 1 }, (_, copy) =>
              sortedCities.map((city) => (
                <li
                  key={`${copy}-${city}`}
                  className="flex shrink-0 items-center gap-3 pr-3 text-sm font-medium text-navy-100"
                >
                  <span className="size-1.5 rounded-full bg-gold-500" />
                  {city}
                </li>
              )),
            )}
          </ul>
        </div>
        <button
          type="button"
          onClick={() => setIsTickerPaused((wasPaused) => !wasPaused)}
          className="marquee-pause-button flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-navy-100 transition-colors hover:border-gold-400 hover:text-white"
        >
          {isTickerPaused ? (
            <Play aria-hidden="true" className="size-3.5" />
          ) : (
            <Pause aria-hidden="true" className="size-3.5" />
          )}
          <span className="sr-only">
            {isTickerPaused
              ? "Play scrolling list of cities"
              : "Pause scrolling list of cities"}
          </span>
        </button>
      </div>

      {/* Summary and toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-start gap-2 font-sans text-base leading-snug font-medium text-white normal-case">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-gold-400"
          />
          <span>
            Serving{" "}
            <strong className="text-gold-300">
              {counties.length} counties
            </strong>{" "}
            and{" "}
            <strong className="text-gold-300">
              {citiesAndTowns.length} cities &amp; towns
            </strong>{" "}
            across {areaName}
          </span>
        </h2>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((wasOpen) => !wasOpen)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-gold-500/60 px-4 py-2 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-500 hover:text-navy-950"
        >
          {isOpen ? "Hide places we serve" : "See all places we serve"}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 transition-transform motion-reduce:transition-none",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Full list: slides open */}
      <div
        id={panelId}
        inert={!isOpen}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-6 border-t border-white/10 pt-5">
            <div className="relative max-w-sm">
              <label htmlFor={searchId} className="sr-only">
                Find your city or county
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-navy-200"
              />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find your city or county"
                autoComplete="off"
                className="h-10 w-full rounded-md border border-white/20 bg-white/5 pr-3 pl-9 text-base text-white placeholder:text-navy-200 focus-visible:border-gold-400 focus-visible:ring-3 focus-visible:ring-gold-500/30 focus-visible:outline-none"
              />
            </div>

            {hasNoMatches ? (
              <p role="status" className="text-navy-100">
                No match for &ldquo;{query.trim()}&rdquo;. We may still be able
                to help: call{" "}
                <a
                  href={`tel:${phoneInternational}`}
                  className="inline-flex items-center gap-1 font-semibold text-gold-300 underline hover:text-white"
                >
                  <Phone aria-hidden="true" className="size-3.5" />
                  {phoneDisplay}
                </a>{" "}
                to ask about your location.
              </p>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                <PlaceGroup
                  title="Counties"
                  total={counties.length}
                  places={matchingCounties}
                  nameSuffix=" County"
                />
                <PlaceGroup
                  title="Cities & towns"
                  total={citiesAndTowns.length}
                  places={matchingCities}
                  highlightedPlace={headquartersCity}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceGroup({
  title,
  total,
  places,
  nameSuffix = "",
  highlightedPlace,
}: {
  title: string;
  total: number;
  places: string[];
  nameSuffix?: string;
  highlightedPlace?: string;
}) {
  if (places.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-heading text-sm font-semibold tracking-[0.2em] text-gold-400 uppercase">
        {title}{" "}
        <span className="text-navy-200">
          ({places.length === total ? total : `${places.length} of ${total}`})
        </span>
      </h3>
      <ul className="flex flex-wrap gap-2">
        {places.map((place) => (
          <li
            key={place}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm",
              place === highlightedPlace
                ? "border-gold-500 bg-gold-500/15 font-semibold text-white"
                : "border-white/15 bg-white/5 text-navy-100",
            )}
          >
            {place}
            {nameSuffix}
            {place === highlightedPlace && (
              <>
                <span
                  aria-hidden="true"
                  className="rounded-sm bg-gold-500 px-1.5 text-[0.65rem] font-bold tracking-wider text-navy-950"
                >
                  HQ
                </span>
                <span className="sr-only"> (our headquarters)</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
