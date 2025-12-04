import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

// Configuration constants for scroll behavior
const SCROLL_THRESHOLD = 10; // Minimum scroll distance to trigger hide/show
const INITIAL_SCROLL_OFFSET = 50; // Scroll position before hiding starts
const SCROLL_STOP_DELAY = 150; // Delay in ms to detect scroll stop

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
  const scrollStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrolling = useRef(false);

  const handleScroll = useCallback((event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    // Clear any existing scroll stop timer
    if (scrollStopTimer.current) {
      clearTimeout(scrollStopTimer.current);
    }

    // Mark as scrolling
    isScrolling.current = true;

    // Only update visibility if we've scrolled past the threshold
    if (Math.abs(scrollDiff) > SCROLL_THRESHOLD) {
      if (scrollDiff > 0 && currentScrollY > INITIAL_SCROLL_OFFSET) {
        // Scrolling down and past initial content - hide
        setIsVisible(false);
      }
      // Don't show immediately on scroll up - wait for scroll to stop
      lastScrollY.current = currentScrollY;
    }

    // Always show when at the top
    if (currentScrollY <= 0) {
      setIsVisible(true);
    } else {
      // Set a timer to detect when scrolling stops
      scrollStopTimer.current = setTimeout(() => {
        isScrolling.current = false;
        // Show the tab bar when scrolling stops
        setIsVisible(true);
      }, SCROLL_STOP_DELAY);
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
