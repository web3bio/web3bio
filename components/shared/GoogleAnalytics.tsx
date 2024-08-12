"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GoogleAnalytics as GA, event } from "nextjs-google-analytics";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      event("page_view", {
        page_path: pathname,
      });
    }
  }, [pathname, searchParams]);

  return <GA strategy="lazyOnload" gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />;
}