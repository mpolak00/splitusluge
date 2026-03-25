import { useEffect, useRef } from "react";
import type { SeoPayload } from "@shared/seo";
import { useSeoContext } from "@/contexts/SeoContext";

export function usePageSeo(payload: SeoPayload | null) {
  const { setOverride } = useSeoContext();
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  // Stabilize the dependency by serializing to a string key
  const stableKey = payload
    ? `${payload.title}|${payload.description}|${payload.canonicalUrl}`
    : "";

  useEffect(() => {
    setOverride(payloadRef.current);

    return () => {
      setOverride(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableKey, setOverride]);
}
