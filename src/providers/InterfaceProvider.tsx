import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { SIDEBAR_KEY } from '@/constants';

interface InterfaceContextState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const InterfaceContext = createContext<InterfaceContextState | undefined>(undefined);

export function InterfaceProvider({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    return stored === 'true';
  });

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(newState));
      return newState;
    });
  }, []);

  return (
    <InterfaceContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      {children}
    </InterfaceContext.Provider>
  );
}

export function useInterface() {
  const context = useContext(InterfaceContext);
  if (context === undefined) {
    throw new Error('useInterface must be used within InterfaceProvider');
  }
  return context;
}
