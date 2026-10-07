import { ArrowRight, BadgeCheck, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import heroPosterImage from "@/assets/hero-background-poster.jpg";
import { PostCard } from "@/components/blog/post-card";
import { AffiliationsSection } from "@/components/sections/affiliations-section";
import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { CompanyStatisticsBand } from "@/components/sections/company-statistics-band";
import { HeroBackgroundVideo } from "@/components/sections/hero-background-video";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceCard } from "@/components/sections/service-card";
import { TrainingCourseCard } from "@/components/sections/training-course-card";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { Button } from "@/components/ui/button";
import { companyDetails } from "@/config/company-details";
import { industries } from "@/config/industries";
import { applyNowLink, requestServiceLink } from "@/config/navigation";
import { services } from "@/config/services";
import { featuredTrainingCourses } from "@/config/training-courses";
import { getPublicMediaUrl } from "@/lib/storage/public-media";
import { getGalleryPreviewImages } from "@/server/queries/gallery";
import { getLatestPublishedPosts } from "@/server/queries/posts";

// Rebuild the page in the background at most every 15 minutes, and straight
// away whenever an admin publishes a post or changes the gallery.
export const revalidate = 900;

const heroTrustPoints = [
  { label: "Licensed in Texas", icon: BadgeCheck },
  { label: "24/7 support", icon: Clock },
  { label: "Fully insured", icon: ShieldCheck },
];

function SectionLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-semibold text-gold-700 hover:text-navy-900"
    >
      {children}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}

export default async function HomePage() {
  const [latestPosts, galleryPreviewImages] = await Promise.all([
    getLatestPublishedPosts(3),
    getGalleryPreviewImages(6),
  ]);

  return (
    <>
      {/* Hero */}
      {/*
        Phones: the video plays in a full-width 16:9 band at the top, with no
        shading over it, and the text follows underneath on navy.
        Tablets and up: the video fills the whole hero behind the text.
      */}
      <section
        aria-labelledby="hero-heading"
        className="relative isolate flex flex-col overflow-hidden bg-navy-900 text-white md:min-h-[75vh] lg:min-h-[80vh]"
      >
        <div className="relative aspect-video w-full md:absolute md:inset-0 md:aspect-auto">
          <HeroBackgroundVideo
            largeScreenVideoSource="/videos/hero-background.mp4"
            smallScreenVideoSource="/videos/hero-background-mobile.mp4"
            posterImage={heroPosterImage}
          />
          {/* Phones: soft fade from the video into the navy text area. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-900 to-transparent md:hidden"
          />
          {/*
            Tablets and up: light shading behind the text on the left that
            fades out to the right, so the video stays clearly visible.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-navy-950/75 via-navy-950/35 to-transparent md:block"
          />
        </div>

        <div className="relative z-10 page-container flex flex-1 items-center pt-6 pb-12 md:py-16 lg:py-24">
          <div className="hero-entrance flex max-w-3xl flex-col gap-5 md:gap-6 md:[text-shadow:0_2px_16px_rgb(10_22_38/0.6)]">
            <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-400 uppercase">
              {companyDetails.motto}
            </p>
            <h1
              id="hero-heading"
              className="text-[2.5rem] leading-[1.05] font-bold uppercase sm:text-5xl lg:text-6xl"
            >
              Professional security you can{" "}
              <span className="draw-underline text-gold-400">trust</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
              Licensed unarmed and armed officers, personal protection, mobile
              patrol, fire watch and 24/7 emergency response for businesses and
              communities across {companyDetails.location.region}.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button asChild variant="accent" size="xl">
                <Link href={requestServiceLink.href}>
                  {requestServiceLink.label}
                </Link>
              </Button>
              <Button asChild variant="outlineOnDark" size="xl">
                <Link href={applyNowLink.href}>{applyNowLink.label}</Link>
              </Button>
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-100">
              {heroTrustPoints.map((trustPoint) => {
                const Icon = trustPoint.icon;
                return (
                  <li
                    key={trustPoint.label}
                    className="flex items-center gap-2"
                  >
                    <Icon aria-hidden="true" className="size-4 text-gold-400" />
                    {trustPoint.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="scanner-line relative z-10 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"
        />
      </section>

      <CompanyStatisticsBand />

      {/* Services */}
      <section
        aria-labelledby="services-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              id="services-heading"
              eyebrow="Our services"
              title="Complete protection, one trusted partner"
              description="Whatever you need to protect, we provide the people, plans and technology to do it properly."
            />
            <SectionLink href="/services">All services</SectionLink>
          </div>
          <ul
            data-reveal-stagger
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Industries */}
      <section aria-labelledby="industries-heading" className="section-spacing">
        <div className="page-container flex flex-col gap-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              id="industries-heading"
              eyebrow="Industries"
              title="Trusted across Texas industries"
            />
            <SectionLink href="/industries">
              How we help each industry
            </SectionLink>
          </div>
          {/* Centered wrap so a part-filled last row stays balanced. */}
          <ul
            data-reveal-stagger
            className="flex flex-wrap justify-center gap-4"
          >
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <li
                  key={industry.slug}
                  className="basis-[calc(50%-0.5rem)] sm:basis-[calc(33.333%-0.667rem)] lg:basis-[calc(20%-0.8rem)]"
                >
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="flex h-full flex-col items-center gap-3 rounded-lg border border-border p-5 text-center transition-colors hover:border-gold-500 hover:bg-paper"
                  >
                    <Icon aria-hidden="true" className="size-8 text-gold-600" />
                    <span className="font-heading text-base font-semibold text-navy-900 uppercase sm:text-lg">
                      {industry.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <WhyChooseUsSection />

      <AffiliationsSection />

      {/* Featured training */}
      <section
        aria-labelledby="training-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              id="training-heading"
              eyebrow="Training"
              title="Get licensed with the United States Security Academy"
              description="Texas Level II, III and IV licensing courses, plus renewals and specialized training through Deltacon Tactical Academy."
            />
            <SectionLink href="/training">All training courses</SectionLink>
          </div>
          <ul data-reveal-stagger className="grid gap-6 md:grid-cols-3">
            {featuredTrainingCourses.map((course) => (
              <li key={course.slug}>
                <TrainingCourseCard course={course} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest posts (hidden until the first post is published) */}
      {latestPosts.length > 0 && (
        <section
          aria-labelledby="latest-posts-heading"
          className="section-spacing"
        >
          <div className="page-container flex flex-col gap-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <SectionHeading
                id="latest-posts-heading"
                eyebrow="Blog & Media"
                title="Latest news and insights"
              />
              <SectionLink href="/blog">View all posts</SectionLink>
            </div>
            <ul data-reveal-stagger className="grid gap-6 md:grid-cols-3">
              {latestPosts.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Gallery preview (hidden until images are uploaded) */}
      {galleryPreviewImages.length > 0 && (
        <section
          aria-labelledby="gallery-preview-heading"
          className="bg-paper section-spacing"
        >
          <div className="page-container flex flex-col gap-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <SectionHeading
                id="gallery-preview-heading"
                eyebrow="Gallery"
                title="Deltacon in action"
              />
              <SectionLink href="/gallery">Open the gallery</SectionLink>
            </div>
            <ul
              data-reveal-stagger
              className="grid grid-cols-2 gap-4 md:grid-cols-3"
            >
              {galleryPreviewImages.map((image) => (
                <li
                  key={image.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-navy-900"
                >
                  <Image
                    src={getPublicMediaUrl(image.storagePath)}
                    alt={image.altText}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    placeholder={image.blurPlaceholder ? "blur" : "empty"}
                    blurDataURL={image.blurPlaceholder ?? undefined}
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CallToActionBand />
    </>
  );
}
