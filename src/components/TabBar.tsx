import type { TabId } from '../types';

interface Props {
  tab: TabId;
  onTabChange: (t: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: '首页' },
  { id: 'delivery', label: '配送' },
  { id: 'profile', label: '我的' },
];

export default function TabBar({ tab, onTabChange }: Props) {
  return (
    <nav className="tab-bar" data-testid="tab-bar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab-bar__item ${tab === t.id ? 'tab-bar__item--active' : ''}`}
          onClick={() => onTabChange(t.id)}
          data-testid={`tab-${t.id}`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
