import { createContext, useMemo, useState, useContext } from 'react';

const NotificationContext = createContext();

export const AlertSeverity = {
  severe: 'severe',
  info: 'info',
  warning: 'warning',
  error: 'error',
  success: 'success'
}

export function NotificationProvider({ children }) {
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState(AlertSeverity.severe);

  const contextValue = useMemo(() => ({
    showNotification, setShowNotification,
    message, setMessage,
    severity, setSeverity
  }), [showNotification, message, severity]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook 
export const useNotificationContext = () => useContext(NotificationContext);