import {
  createServiceLineMetadata,
  ServiceLinePage,
} from "@/components/sections/service-line-page";
import { staffingServiceLine } from "@/config/service-lines";

export const metadata = createServiceLineMetadata(staffingServiceLine);

export default function StaffingPage() {
  return <ServiceLinePage serviceLine={staffingServiceLine} />;
}
