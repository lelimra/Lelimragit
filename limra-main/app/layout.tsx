import Footer from "@/components/layout/Footer";
import Marquee from "@/components/layout/Marquee";
import ThemeProvider from "@/components/providers/ThemeProvider";
import ScrollProgress from "@/components/layout/ScrollProgress";
import FloatingActions from "@/components/layout/FloatingActions";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <ThemeProvider>
          <ScrollProgress />

          {children}

          <FloatingActions />

          <Marquee />

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}