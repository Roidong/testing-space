import { useState, useEffect } from 'react';
import type { TabId } from './types';
import AppShell from './components/AppShell';
import ToastHost from './components/Toast';
import { startEngine, stopEngine } from './engine/simulation';

export default function App() {
  const [tab, setTab] = useState<TabId>('home');
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    startEngine();
    return () => stopEngine();
  }, []);

  return (
    <>
      <AppShell
        tab={tab}
        wizardOpen={wizardOpen}
        onTabChange={setTab}
        onOpenWizard={() => setWizardOpen(true)}
        onCloseWizard={() => { setWizardOpen(false); setTab('delivery'); }}
        onGoToDelivery={() => setTab('delivery')}
      />
      <ToastHost />
    </>
  );
}
