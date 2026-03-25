import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("su_session");
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem("su_session", id);
  }
  return id;
}

export function usePageTracking(categorySlug?: string, businessId?: number) {
  const [location] = useLocation();
  const trackMutation = trpc.analytics.trackPageView.useMutation();
  const lastTracked = useRef("");

  useEffect(() => {
    const key = `${location}-${categorySlug}-${businessId}`;
    if (key === lastTracked.current) return;
    lastTracked.current = key;

    trackMutation.mutate({
      path: location,
      categorySlug,
      businessId,
      referrer: document.referrer || undefined,
      language: navigator.language,
      sessionId: getSessionId(),
    });
  }, [location, categorySlug, businessId]);
}

export function useTrackClick() {
  const trackMutation = trpc.analytics.trackClick.useMutation();

  return useCallback((eventType: string, businessId?: number, businessName?: string, categorySlug?: string) => {
    trackMutation.mutate({
      eventType,
      businessId,
      businessName,
      categorySlug,
      sessionId: getSessionId(),
    });
  }, []);
}

export function useTrackSearch() {
  const trackMutation = trpc.analytics.trackSearch.useMutation();

  return useCallback((query: string, resultsCount?: number, categorySlug?: string) => {
    if (query.length < 2) return;
    trackMutation.mutate({
      query,
      resultsCount,
      categorySlug,
      sessionId: getSessionId(),
    });
  }, []);
}
