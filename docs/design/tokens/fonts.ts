/**
 * Brew & Co. font setup (next/font, self-hosted at build time).
 *
 * Use in app/layout.tsx:
 *
 *   import { bricolage, yellowtail } from "@/docs/design/tokens/fonts";
 *   <html lang="en" className={`${bricolage.variable} ${yellowtail.variable}`}>
 *
 * tokens.css maps --font-bricolage to `font-sans` / `font-display`
 * and --font-yellowtail to `font-script` (wordmark only).
 */
import { Bricolage_Grotesque, Yellowtail } from "next/font/google";

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  // Optical size lets one family serve 12px captions and 72px headlines.
  axes: ["opsz", "wdth"],
});

export const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yellowtail",
  display: "swap",
  preload: false, // only the logo uses it
});
