import type { TabId } from '../types';

interface Props {
  tab: TabId;
  onTabChange: (t: TabId) => void;
}

const ITEMS: { id: TabId; label: string }[] = [
  { id: 'home', label: '首页' },
  { id: 'delivery', label: '配送' },
  { id: 'profile', label: '我的' },
];

export default function SideNav({ tab, onTabChange }: Props) {
  return (
    <nav className="side-nav" data-testid="side-nav">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className={`side-nav__item ${tab === item.id ? 'side-nav__item--active' : ''}`}
          onClick={() => onTabChange(item.id)}
          data-testid={`sidenav-${item.id}`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
