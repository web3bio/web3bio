"use client";
import { GoogleAnalytics as GA } from "nextjs-google-analytics";

export default function GoogleAnalytics() {
  return <GA trackPageViews strategy="lazyOnload" />;
}
