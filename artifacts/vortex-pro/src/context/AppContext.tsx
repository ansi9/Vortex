import { createContext, useContext, useState, ReactNode } from "react";

interface AppState {
  isUnlocked: boolean;
  setIsUnlocked: (val: boolean) => void;
  isSosActive: boolean;
  setIsSosActive: (val: boolean) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (val: boolean) => void;
  showNotifDot: boolean;
  setShowNotifDot: (val: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showNotifDot, setShowNotifDot] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isUnlocked,
        setIsUnlocked,
        isSosActive,
        setIsSosActive,
        isAssistantOpen,
        setIsAssistantOpen,
        showNotifDot,
        setShowNotifDot,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
}
