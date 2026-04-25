import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAppSetting(key: string, fallback = "") {
  const [value, setValue] = useState<string>(fallback);

  useEffect(() => {
    let active = true;
    supabase
      .from("app_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data?.value) setValue(data.value);
      });
    return () => {
      active = false;
    };
  }, [key]);

  return value;
}

export function useAppSettings(keys: string[], fallbacks: Record<string, string> = {}) {
  const [values, setValues] = useState<Record<string, string>>(fallbacks);
  const [loading, setLoading] = useState(true);
  const keyStr = keys.join(",");

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .from("app_settings")
      .select("key, value")
      .in("key", keys)
      .then(({ data }) => {
        if (!active) return;
        const map: Record<string, string> = { ...fallbacks };
        (data ?? []).forEach((row) => {
          if (row.value != null) map[row.key] = row.value;
        });
        setValues(map);
        setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyStr]);

  return { values, loading };
}
