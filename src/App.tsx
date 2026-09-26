import { useState, useEffect } from 'react';
import type { TabId } from './types';
import AppShell from './components/AppShell';
import WizardShell from './components/wizard/WizardShell';
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
        onTabChange={setTab}
        onOpenWizard={() => {
          setTab('delivery');
          setWizardOpen(true);
        }}
        onGoToDelivery={() => setTab('delivery')}
      />
      {wizardOpen && (
        <WizardShell onClose={() => setWizardOpen(false)} />
      )}
      <ToastHost />
    </>
  );
}
