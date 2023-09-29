import { useState, useEffect, createContext, useMemo } from 'react';

export const GoogleContext = createContext();

export function GoogleProvider({ children }) {
  const [google, setGoogle] = useState(null);

  useEffect(() => {
    if (!google) {
      const { head } = document;
      let script = document.getElementById('googleChartsScript');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.id = 'googleChartsScript';
        script.onload = () => {
          if (window.google && window.google.charts) {
            window.google.charts.load('current', { packages: ['corechart', 'controls'] });

            window.google.charts.setOnLoadCallback(() => setGoogle(window.google));
          }
        };
        head.appendChild(script);
      } else if (window.google) {
        setGoogle(window.google);
      }
    }

    return () => {
      const script = document.getElementById('googleChartsScript');
      if (script) script.remove();
    };
  }, [google]);

  const providerValue = useMemo(() => [google, setGoogle], [google]);
  // return context provider
  return (
    <GoogleContext.Provider value={providerValue}>
      {children}
    </GoogleContext.Provider>
  );
}
