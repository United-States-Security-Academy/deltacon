import {
  createServiceLineMetadata,
  ServiceLinePage,
} from "@/components/sections/service-line-page";
import { consultingServiceLine } from "@/config/service-lines";

export const metadata = createServiceLineMetadata(consultingServiceLine);

export default function ConsultingPage() {
  return <ServiceLinePage serviceLine={consultingServiceLine} />;
}
