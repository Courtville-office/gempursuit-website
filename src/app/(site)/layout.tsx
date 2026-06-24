import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Layout wrapper for the public marketing site only. The Sanity Studio
// at /studio lives outside this group so it doesn't inherit the
// header, footer, or the brand background.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-deco-radial">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
