import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

interface TabBarVisibilityContextType {
  isVisible: boolean;
  handleScroll: (event: { nativeEvent: { contentOffset: { y: number } } }) => void;
}

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType | undefined>(undefined);

interface TabBarVisibilityProviderProps {
  children: ReactNode;
}

export function TabBarVisibilityProvider({ children }: TabBarVisibilityProviderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show

  const handleScroll = useCallback((event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    // Only update visibility if we've scrolled past the threshold
    if (Math.abs(scrollDiff) > scrollThreshold) {
      if (scrollDiff > 0 && currentScrollY > 50) {
        // Scrolling down and past initial content - hide
        setIsVisible(false);
      } else if (scrollDiff < 0) {
        // Scrolling up - show
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    }

    // Always show when at the top
    if (currentScrollY <= 0) {
      setIsVisible(true);
    }
  }, []);

  return (
    <TabBarVisibilityContext.Provider value={{ isVisible, handleScroll }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  const context = useContext(TabBarVisibilityContext);
  if (context === undefined) {
    throw new Error('useTabBarVisibility must be used within a TabBarVisibilityProvider');
  }
  return context;
}
