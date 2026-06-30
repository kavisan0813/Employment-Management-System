import { useState } from 'react';

export function useCommunication() {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'templates' | 'settings'>('broadcast');
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  return {
    activeTab,
    setActiveTab,
    toastMessage,
    showToast
  };
}
