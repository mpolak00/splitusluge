import { useEffect } from "react";
import type { SeoPayload } from "@shared/seo";
import { useSeoContext } from "@/contexts/SeoContext";

export function usePageSeo(payload: SeoPayload | null) {
  const { setOverride } = useSeoContext();

  useEffect(() => {
    setOverride(payload);

    return () => {
      setOverride(null);
    };
  }, [payload, setOverride]);
}
