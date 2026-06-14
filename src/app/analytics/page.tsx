import type { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "College Analytics | CollegeFit AI",
  description: "Explore placement, fees, ROI, and branch availability trends across leading Indian engineering colleges.",
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
