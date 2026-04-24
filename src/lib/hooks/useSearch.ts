"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import type { SearchResult, SearchLocale } from "@/types/search";

// Re-export para que SearchOverlay pueda importar desde aquí si prefiere
export type { SearchResult, SearchLocale };

// ── Normaliza: minúsculas + sin acentos ──────────────────────────────────────
function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

type LoadStatus = "idle" | "loading" | "ready" | "error";

export function useSearch(locale: SearchLocale) {
  const [isSearchOpen, setIsSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching]     = useState(false);
  const [allResults, setAllResults]       = useState<SearchResult[]>([]);
  const [loadStatus, setLoadStatus]       = useState<LoadStatus>("idle");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Carga toda la data UNA sola vez al abrir el search ───────────────────
  useEffect(() => {
    if (!isSearchOpen || loadStatus !== "idle") return;

    setLoadStatus("loading");
    setIsSearching(true);

    fetch(`/api/search/all?locale=${locale}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        setAllResults(json.results ?? []);
        setLoadStatus("ready");
      })
      .catch(() => {
        // Precarga falló → el filtrado local usará el fallback de /api/search
        setLoadStatus("error");
      })
      .finally(() => setIsSearching(false));
  }, [isSearchOpen, loadStatus, locale]);

  // ── Filtrado local (cuando la precarga fue exitosa) ───────────────────────
  // ── Fallback a /api/search?q= (cuando la precarga falló) ─────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const q = normalize(searchQuery);

      if (q.length < 2) {
        setSearchResults([]);
        return;
      }

      if (loadStatus === "ready") {
        // Filtrado local — sin red
        const filtered = allResults.filter(
          (r) =>
            normalize(r.title).includes(q) ||
            normalize(r.description).includes(q),
        );
        setSearchResults(filtered);
        return;
      }

      if (loadStatus === "error") {
        // Fallback: query al route seguro con sanitización en servidor
        setIsSearching(true);
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`,
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          setSearchResults(json.results ?? []);
        } catch {
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, allResults, loadStatus, locale]);

  // ── Escape cierra el search ───────────────────────────────────────────────
  useEffect(() => {
    if (!isSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isSearchOpen]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const handleSearchToggle = useCallback(() => {
    if (isSearchOpen) closeSearch();
    else setIsSearchOpen(true);
  }, [isSearchOpen, closeSearch]);

  return {
    isSearchOpen,
    searchQuery,
    searchResults,
    isSearching,
    loadStatus,         // "idle" | "loading" | "ready" | "error"
    setSearchQuery,
    closeSearch,
    handleSearchToggle,
  };
}



export function useHeroSearch(locale: SearchLocale) {
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching]     = useState(false);
  const [allResults, setAllResults]       = useState<SearchResult[]>([]);
  const [isReady, setIsReady]             = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Precarga al montar — sin esperar isSearchOpen
  useEffect(() => {
    fetch(`/api/search/all?locale=${locale}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((json) => { setAllResults(json.results ?? []); setIsReady(true); })
      .catch(() => setIsReady(false));
  }, [locale]);

  // Filtrado local con debounce + fallback a /api/search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const q = normalize(searchQuery);

      if (q.length < 2) { setSearchResults([]); return; }

      if (isReady) {
        setSearchResults(
          allResults.filter(
            (r) =>
              normalize(r.title).includes(q) ||
              normalize(r.description).includes(q),
          ),
        );
        return;
      }

      setIsSearching(true);
      try {
        const res  = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        setSearchResults(json.results ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, allResults, isReady, locale]);

  return { searchQuery, searchResults, isSearching, setSearchQuery };
}