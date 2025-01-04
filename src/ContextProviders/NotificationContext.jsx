import { createContext, useMemo, useState, useContext } from 'react';

const NotificationContext = createContext();

export const AlertSeverity = {
  info: 'info',
  warning: 'warning',
  error: 'error',
  success: 'success'
}

export const AlertAutoHideDuration = {
  [AlertSeverity.info]: 10000,
  [AlertSeverity.warning]: 10000,
  [AlertSeverity.error]: 10000,
  [AlertSeverity.success]: 3000,
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