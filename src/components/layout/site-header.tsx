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
      */}
      <StickyHeaderFrame className="group/header sticky top-0 z-40 border-b border-navy-800 bg-navy-900/95 shadow-lg shadow-navy-950/20 backdrop-blur transition-shadow duration-300 data-[scrolled=true]:shadow-xl data-[scrolled=true]:shadow-navy-950/40 supports-[backdrop-filter]:bg-navy-900/85">
        <div className="page-container flex h-20 items-center justify-between gap-6 transition-[height] duration-300 group-data-[scrolled=true]/header:h-16">
          <CompanyLogo
            badgeHeight={52}
            className="origin-left transition-[scale] duration-300 group-data-[scrolled=true]/header:scale-[0.82]"
          />
          <DesktopNavigation />
          <MobileNavigationMenu />
        </div>
      </StickyHeaderFrame>
    </>
  );
}
