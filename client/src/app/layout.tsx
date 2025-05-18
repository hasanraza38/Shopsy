import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Alfa_Slab_One } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const poppins = Poppins({
   variable: "--font-poppins",
   weight:"400",
   subsets:["latin"]
})

const alfaSlabOne = Alfa_Slab_One({
  variable: "--font-alfa-slab-one",
  subsets: ["latin"],
  weight:"400"
});

export const metadata: Metadata = {
  title: "SHOPSY",
  description: "an fullstack e-commerce app (like olx)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${alfaSlabOne.variable} `} >
      <Providers>
          <main>{children}</main>
        </Providers>
      </body>

    </html>
  );
}
