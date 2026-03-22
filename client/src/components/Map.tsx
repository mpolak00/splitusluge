/// <reference types="@types/google.maps" />

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePersistFn } from "@/hooks/usePersistFn";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

function hasMapsConfig() {
  return Boolean(API_KEY && FORGE_BASE_URL);
}

function loadMapScript() {
  return new Promise<boolean>(resolve => {
    if (!hasMapsConfig()) {
      resolve(false);
      return;
    }

    if (window.google?.maps) {
      resolve(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps-proxy="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.google?.maps)), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.googleMapsProxy = "true";
    script.onload = () => {
      resolve(Boolean(window.google?.maps));
      script.remove();
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      resolve(false);
      script.remove();
    };
    document.head.appendChild(script);
  });
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 43.5081, lng: 16.4402 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);

  const init = usePersistFn(async () => {
    const isLoaded = await loadMapScript();
    if (!isLoaded) {
      setIsUnavailable(true);
      return;
    }

    if (!mapContainer.current) {
      console.error("Map container not found");
      return;
    }

    map.current = new window.google.maps.Map(mapContainer.current, {
      zoom: initialZoom,
      center: initialCenter,
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: true,
      mapId: "DEMO_MAP_ID",
    });

    if (onMapReady) {
      onMapReady(map.current);
    }
  });

  useEffect(() => {
    init();
  }, [init]);

  if (isUnavailable) {
    return (
      <div
        className={cn(
          "flex h-[500px] w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground",
          className
        )}
      >
        Karta trenutno nije dostupna jer Google Maps konfiguracija nije postavljena.
      </div>
    );
  }

  return <div ref={mapContainer} className={cn("h-[500px] w-full", className)} />;
}
