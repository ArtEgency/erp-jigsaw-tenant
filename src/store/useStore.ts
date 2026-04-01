"use client";

import { useState, useCallback } from "react";

export type ScreenId = "dashboard" | "products" | "purchase" | "sales" | "settings";

export function useAppStore() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("dashboard");
  const [navOpen, setNavOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<string | null>(null);

  const goScreen = useCallback((id: ScreenId) => {
    setCurrentScreen(id);
    setPanelOpen(false);
  }, []);

  const toggleNav = useCallback(() => {
    setNavOpen((v) => !v);
  }, []);

  const openPanel = useCallback((content: string) => {
    setPanelContent(content);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setTimeout(() => setPanelContent(null), 300);
  }, []);

  return {
    currentScreen,
    navOpen,
    panelOpen,
    panelContent,
    goScreen,
    toggleNav,
    openPanel,
    closePanel,
  };
}
