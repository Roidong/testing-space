import type { TabId } from '../types';
import TabBar from './TabBar';
import SideNav from './SideNav';
import HomePage from '../pages/HomePage';
import DeliveryPage from '../pages/DeliveryPage';
import ProfilePage from '../pages/ProfilePage';
import WizardShell from './wizard/WizardShell';

interface Props {
  tab: TabId;
  wizardOpen: boolean;
  onTabChange: (t: TabId) => void;
  onOpenWizard: () => void;
  onCloseWizard: () => void;
  onGoToDelivery: () => void;
}

export default function AppShell({ tab, wizardOpen, onTabChange, onOpenWizard, onCloseWizard, onGoToDelivery }: Props) {
  return (
    <div className="app-shell" data-testid="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__logo">◉</span>
          <span className="app-header__title">校园 RoboExpress</span>
        </div>
        <div className="app-header__status">
          <span>3台在线</span>
        </div>
      </header>

      <div className="app-shell__desktop-nav">
        <SideNav tab={tab} onTabChange={onTabChange} />
      </div>

      <main className="app-shell__content">
        {wizardOpen ? (
          <WizardShell onClose={onCloseWizard} />
        ) : (
          <>
            {tab === 'home' && (
              <HomePage onGoToDelivery={onGoToDelivery} onOpenWizard={onOpenWizard} />
            )}
            {tab === 'delivery' && <DeliveryPage />}
            {tab === 'profile' && <ProfilePage />}
          </>
        )}
      </main>

      <div className="app-shell__mobile-nav">
        <TabBar tab={tab} onTabChange={onTabChange} />
      </div>
    </div>
  );
}
