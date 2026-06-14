import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "My Dashboard | CollegeFit AI",
  description: "Your saved colleges, searches, AI conversations, and personalized recommendations.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
