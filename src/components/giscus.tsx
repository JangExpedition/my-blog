"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";

const COMMENTS_ID = "comments-container";

export default function Giscus() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark_dimmed" : "light_protanopia";

  const LoadComments = useCallback(() => {
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://giscus.app/client.js";
    scriptElement.async = true;

    scriptElement.setAttribute("data-repo", "JangExpedition/my-blog");
    scriptElement.setAttribute("data-repo-id", "R_kgDOMo3Pqg");
    scriptElement.setAttribute("data-category", "Comments");
    scriptElement.setAttribute("data-category-id", "DIC_kwDOMo3Pqs4CiBRt");
    scriptElement.setAttribute("data-mapping", "pathname");
    scriptElement.setAttribute("data-strict", "0");
    scriptElement.setAttribute("data-reactions-enabled", "1");
    scriptElement.setAttribute("data-emit-metadata", "0");
    scriptElement.setAttribute("data-input-position", "bottom");
    scriptElement.setAttribute("data-theme", theme);
    scriptElement.setAttribute("data-lang", "ko");
    scriptElement.setAttribute("crossorigin", "anonymous");

    const comments = document.getElementById(COMMENTS_ID);
    if (comments) comments.appendChild(scriptElement);

    return () => {
      const comments = document.getElementById(COMMENTS_ID);
      if (comments) comments.innerHTML = "";
    };
  }, [theme]);

  useEffect(() => {
    LoadComments();
  }, [LoadComments]);

  return <section className="mt-24" id={COMMENTS_ID} />;
}
