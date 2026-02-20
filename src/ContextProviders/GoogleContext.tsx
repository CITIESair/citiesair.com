import { useState, useEffect, createContext, useMemo, useContext, ReactNode } from 'react';

type Google = {
  charts: {
    load: (version?: string, options?: { packages?: string[] }) => void;
    setOnLoadCallback: (cb: () => void) => void;
  };
  visualization?: {
    DataTable?: any;
    ChartWrapper?: any;
  };
  [key: string]: any;
};

const GoogleContext = createContext<Google | null>(null);

export function GoogleProvider({ children }: { children: ReactNode }) {
  const [google, setGoogle] = useState<Google | null>(null);

  useEffect(() => {
    if (!google) {
      const { head } = document;
      let script = document.getElementById('googleChartsScript') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.id = 'googleChartsScript';
        script.onload = () => {
          const win = window as Window & { google?: any };
          if (win.google && win.google.charts) {
            win.google.charts.load('current', { packages: ['corechart', 'controls'] });

            win.google.charts.setOnLoadCallback(() => setGoogle(win.google as Google));
          }
        };
        head.appendChild(script);
      } else {
        const win = window as Window & { google?: any };
        if (win.google) {
          setGoogle(win.google as Google);
        }
      }
    }

    return () => {
      const script = document.getElementById('googleChartsScript');
      if (script) script.remove();
    };
  }, [google]);

  const providerValue = useMemo(() => google, [google]);

  return (
    <GoogleContext.Provider value={providerValue}>
      {children}
    </GoogleContext.Provider>
  );
}

export const useGoogle = (): Google | null => {
  return useContext(GoogleContext);
};