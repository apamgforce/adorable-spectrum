"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Private or personal areas are never counted.
const SKIP = /^\/(admin|gallery-admin|api|certificate|verified|v\/|volunteer\/portal)/;

function send(kind: string, path: string) {
  try {
    const data = JSON.stringify({ kind, path });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([data], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body: data, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  } catch {}
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && !SKIP.test(pathname)) send("pageview", pathname);
  }, [pathname]);

  useEffect(() => {
    const here = () => window.location.pathname;
    const onClick = (e: MouseEvent) => {
      try {
        const a = (e.target as HTMLElement | null)?.closest?.("a");
        const href = a?.getAttribute("href") || "";
        if (!href || SKIP.test(here())) return;
        if (/givesendgo\.com/i.test(href)) send("givesendgo_click", here());
        else if (/^\/donate/.test(href)) send("donate_click", here());
        else if (/wa\.me|whatsapp\.com/i.test(href)) send("whatsapp_click", here());
        else if (/^\/apply/.test(href)) send("apply_click", here());
      } catch {}
    };
    const onSubmit = () => {
      const p = here();
      if (p.startsWith("/apply")) send("apply_submit", p);
      else if (p.startsWith("/volunteer")) send("volunteer_submit", p);
      else if (p.startsWith("/contact")) send("contact_submit", p);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("submit", onSubmit); };
  }, []);

  return null;
}
