import { CompanyLogo } from "@/components/layout/company-logo";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { MobileNavigationMenu } from "@/components/layout/mobile-navigation-menu";
import { StickyHeaderFrame } from "@/components/layout/sticky-header-frame";
import { TopContactBar } from "@/components/layout/top-contact-bar";

type SiteHeaderProps = {
  email: string;
  phoneDisplay: string;
  phoneInternational: string;
};

export function SiteHeader({
  email,
  phoneDisplay,
  phoneInternational,
}: SiteHeaderProps) {
  return (
    <>
      <TopContactBar
        email={email}
        phoneDisplay={phoneDisplay}
        phoneInternational={phoneInternational}
      />
      {/*
        Only the main navigation sticks; the contact bar scrolls away. Once the
        page is scrolled, the header becomes slimmer with a deeper shadow.
        Solid deep navy (the same as the contact bar) with fine gold pinstripes
        and a gold line along the bottom.
      */}
      <StickyHeaderFrame className="group/header sticky top-0 z-40 bg-navy-975 navbar-stripes shadow-lg shadow-black/30 transition-shadow duration-300 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-gold-500/70 after:to-transparent data-[scrolled=true]:shadow-xl data-[scrolled=true]:shadow-black/50">
        <div className="page-container flex h-24 items-center justify-between gap-3 transition-[height] duration-300 group-data-[scrolled=true]/header:h-20 sm:h-24 sm:gap-6 sm:group-data-[scrolled=true]/header:h-20 lg:h-[6.5rem] lg:group-data-[scrolled=true]/header:h-20">
          <CompanyLogo
            size="header"
            className="origin-left transition-[scale] duration-300 group-data-[scrolled=true]/header:scale-[0.82]"
          />
          <DesktopNavigation />
          <MobileNavigationMenu />
        </div>
      </StickyHeaderFrame>
    </>
  );
}
