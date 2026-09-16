import type { Metadata } from "next";
import { Bricolage_Grotesque, Ubuntu } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Menfess.comp | Kesan & Pesan PKKMB FKOM UNIKU 2026",
  description:
    "Sampaikan kesan dan pesanmu setelah rangkaian PKKMB FKOM UNIKU 2026. Setiap pesan akan menghasilkan e-card resmi yang bisa kamu bagikan.",
  keywords: ["PKKMB", "FKOM", "UNIKU", "kesan pesan", "mahasiswa baru", "2026"],
  openGraph: {
    title: "Menfess.comp | Kesan & Pesan PKKMB FKOM UNIKU 2026",
    description: "Tinggalkan kesan dan pesanmu untuk PKKMB FKOM UNIKU 2026.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${bricolageGrotesque.variable} ${ubuntu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

