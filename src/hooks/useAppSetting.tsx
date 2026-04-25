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
