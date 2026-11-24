import type { Metadata } from "next";
import { WorkIndex } from "@/components/work/work-index";

export const metadata: Metadata = {
  title: "Work",
  description: "Products, prototypes and client builds by Neel Sonawane, each shown on a real iPhone."
};

export default function WorkPage() {
  return <WorkIndex />;
}
