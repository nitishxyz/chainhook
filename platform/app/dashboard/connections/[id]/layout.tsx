import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connection Details",
  description:
    "View and manage your database connection and its index subscriptions.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ConnectionDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
