import { useEffect } from 'react';

// Wires the Android system back button. On the menu, pressing back exits;
// in-game it returns to the menu. On non-Android (web) it's a no-op.
export function useBackButton({ inMenu, onMenu }) {
  useEffect(() => {
    let listenerHandle;
    let cancelled = false;

    (async () => {
      try {
        const { App } = await import('@capacitor/app');
        if (cancelled) return;
        listenerHandle = await App.addListener('backButton', () => {
          if (inMenu) {
            App.exitApp();
          } else {
            onMenu();
          }
        });
      } catch {
        // Not running in Capacitor — ignore.
      }
    })();

    return () => {
      cancelled = true;
      if (listenerHandle && typeof listenerHandle.remove === 'function') {
        listenerHandle.remove();
      }
    };
  }, [inMenu, onMenu]);
}
