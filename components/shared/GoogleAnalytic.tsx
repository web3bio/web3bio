"use client";
import { GoogleAnalytics } from "nextjs-google-analytics";
export default function GoogleAnalytic() {
  return <GoogleAnalytics strategy="lazyOnload" />;
}
