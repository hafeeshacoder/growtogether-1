import { useCallback, useEffect, useState } from 'react';

/**
 * Loads all records from a repository into state, with a reload() function.
 * Pass reloadKey to force a reload when some external value changes.
 */
export function useCollection(repo, reloadKey) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const all = await repo.all();
      setItems(all);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo]);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, reloadKey]);

  return { items, loading, reload, setItems };
}

export default useCollection;
