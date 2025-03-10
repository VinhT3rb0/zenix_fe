"use client";

import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";
import { useServerInsertedHTML } from "next/navigation";
import React, { useState, useEffect } from "react";

// suppress useLayoutEffect warnings when running outside a browser
if (!process.browser) React.useLayoutEffect = React.useEffect;

export function AntdProvider({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => createCache());
  const render = <>{children}</>;
  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `</script>${extractStyle(cache)}<script>`,
        }}
      />
    );
  });

  if (typeof window !== "undefined") {
    return render;
  }

  return (
    <StyleProvider hashPriority="high" cache={cache}>
      {render}
    </StyleProvider>
  );
}
