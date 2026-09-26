import type { TabId } from '../types';
import TabBar from './TabBar';
import SideNav from './SideNav';
import HomePage from '../pages/HomePage';
import DeliveryPage from '../pages/DeliveryPage';
import ProfilePage from '../pages/ProfilePage';

interface Props {
  tab: TabId;
  onTabChange: (t: TabId) => void;
  onOpenWizard: () => void;
  onGoToDelivery: () => void;
}

export default function AppShell({ tab, onTabChange, onOpenWizard, onGoToDelivery }: Props) {
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
        {tab === 'home' && (
          <HomePage onGoToDelivery={onGoToDelivery} onOpenWizard={onOpenWizard} />
        )}
        {tab === 'delivery' && <DeliveryPage onOpenWizard={onOpenWizard} />}
        {tab === 'profile' && <ProfilePage />}
      </main>

      <div className="app-shell__mobile-nav">
        <TabBar tab={tab} onTabChange={onTabChange} />
      </div>
    </div>
  );
}
