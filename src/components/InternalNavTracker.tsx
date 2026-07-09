"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function InternalNavTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // If the user visits a public page (not starting with /admin),
    // we mark the session as having originated internally.
    if (!pathname?.startsWith("/admin")) {
      sessionStorage.setItem("internal_nav_valid", "true");
    }
  }, [pathname]);

  return null;
}
