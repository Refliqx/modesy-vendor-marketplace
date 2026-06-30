"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("PWA update available");
              }
            });
          }
        });
      })
      .catch(() => {
        // sw registration failed silently
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
