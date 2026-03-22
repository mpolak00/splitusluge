import { useMemo } from 'react';
import Fuse from 'fuse.js';

interface FuzzySearchOptions {
  threshold?: number;
  keys?: string[];
  includeScore?: boolean;
}

export function useFuzzySearch<T>(
  items: T[] | undefined,
  searchTerm: string,
  options: FuzzySearchOptions = {}
) {
  const {
    threshold = 0.4, // 0.4 allows for more typos, 0 is exact match
    keys = [],
    includeScore = false,
  } = options;

  const results = useMemo(() => {
    if (!items || !searchTerm.trim()) {
      return items || [];
    }

    const fuse = new Fuse(items, {
      keys,
      threshold,
      includeScore,
      minMatchCharLength: 2,
      shouldSort: true,
    });

    return fuse.search(searchTerm).map((result) => result.item);
  }, [items, searchTerm, threshold, keys, includeScore]);

  return results;
}
