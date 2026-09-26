import { useState, useEffect } from 'react';
import type { TabId } from './types';
import AppShell from './components/AppShell';
import WizardShell from './components/wizard/WizardShell';
import ToastHost from './components/Toast';
import { startEngine, stopEngine } from './engine/simulation';

export default function App() {
  const [tab, setTab] = useState<TabId>('home');

  useEffect(() => {
    startEngine();
    return () => stopEngine();
  }, []);

  const handleWizardClose = () => {
    setTab('delivery');
  };

  return (
    <>
      <AppShell
        tab={tab === 'wizard' ? 'delivery' : tab}
        onTabChange={setTab}
        onOpenWizard={() => setTab('wizard')}
        onGoToDelivery={() => setTab('delivery')}
      />
      {tab === 'wizard' && (
        <WizardShell onClose={handleWizardClose} />
      )}
      <ToastHost />
    </>
  );
}
