import {
  createServiceLineMetadata,
  ServiceLinePage,
} from "@/components/sections/service-line-page";
import { custodialServiceLine } from "@/config/service-lines";

export const metadata = createServiceLineMetadata(custodialServiceLine);

export default function CustodialServicesPage() {
  return <ServiceLinePage serviceLine={custodialServiceLine} />;
}
