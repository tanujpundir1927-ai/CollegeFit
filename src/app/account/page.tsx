import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = { title: "Account | CollegeFit AI" };

export default function AccountPage() {
  return <AccountClient />;
}
