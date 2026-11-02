import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { defaultSettings, type Settings } from "@/lib/settings";

type Value = { settings: Settings; ready: boolean; save: (settings: Settings) => boolean };
const Context = createContext<Value | null>(null);
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    if (!user) return;
    try {
      const raw = JSON.parse(localStorage.getItem(`cc_settings_${user.id}`) || "{}");
      setSettings({ notifications: { ...defaultSettings.notifications, ...raw.notifications }, privacy: { ...defaultSettings.privacy, ...raw.privacy }, security: { ...defaultSettings.security, ...raw.security }, display: { ...defaultSettings.display, ...raw.display } });
    } catch { setSettings(defaultSettings); }
    setReady(true);
  }, [user?.id]);
  const save = (value: Settings) => {
    if (!user) return false;
    try {
      localStorage.setItem(`cc_settings_${user.id}`, JSON.stringify(value));
      const key = `cc_patient_profile_${user.id}`;
      const profile = JSON.parse(localStorage.getItem(key) || "{}");
      localStorage.setItem(key, JSON.stringify({ ...profile, consentAssessments: value.privacy.assessments, consentReminders: value.privacy.reminders, language: value.display.language }));
      setSettings(value); return true;
    } catch { return false; }
  };
  return <Context.Provider value={{ settings, ready, save }}>{children}</Context.Provider>;
}
export function useSettings() {
  const value = useContext(Context);
  if (!value) throw new Error("SettingsProvider manquant");
  return value;
}