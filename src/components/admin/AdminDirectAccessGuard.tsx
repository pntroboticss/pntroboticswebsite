"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDirectAccessGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    // If the flag is not set in sessionStorage, it means the user 
    // hasn't visited any public page in this session and is trying
    // to access the admin panel directly via URL or bookmark.
    if (!sessionStorage.getItem("internal_nav_valid")) {
      router.replace("/");
    } else {
      setIsAllowed(true);
    }
  }, [router]);

  // Prevent flashing of admin content while checking
  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
