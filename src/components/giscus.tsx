"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElement = document.createElement("script");
    scriptElement.src = "https://giscus.app/client.js";
    scriptElement.async = true;
    scriptElement.crossOrigin = "anonymous";

    scriptElement.setAttribute("data-repo", "JangExpedition/my-blog");
    scriptElement.setAttribute("data-repo-id", "R_kgDOMo3Pqg");
    scriptElement.setAttribute("data-category", "General");
    scriptElement.setAttribute("data-category-id", "DIC_kwDOMo3Pqs4CiBRt");
    scriptElement.setAttribute("data-mapping", "pathname");
    scriptElement.setAttribute("data-strict", "0");
    scriptElement.setAttribute("data-reactions-enabled", "1");
    scriptElement.setAttribute("data-emit-metadata", "0");
    scriptElement.setAttribute("data-input-position", "bottom");
    scriptElement.setAttribute("data-theme", theme);
    scriptElement.setAttribute("data-lang", "ko");

    ref.current.appendChild(scriptElement);
  }, []);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app"
    );
  }, [theme]);

  return <section className="mt-24" ref={ref} />;
}
