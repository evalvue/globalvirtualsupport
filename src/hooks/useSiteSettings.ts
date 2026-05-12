import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string | null;
};

const DEFAULTS: SiteSettings = {
  id: "",
  phone: "+1 (404) 382-0137",
  email: "info@globalvirtualsupport.com",
  address: "1234 Peachtree St NE, Atlanta, GA 30309, USA",
  whatsapp: null,
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) setSettings(data as SiteSettings);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { settings, loading, refresh };
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;