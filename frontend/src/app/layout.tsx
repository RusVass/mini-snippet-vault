import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Snippet Vault",
  description: "Save useful links, notes, and commands",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps): JSX.Element => {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
