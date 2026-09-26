import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BarChart6m from '../components/profile/BarChart6m';
import TaskTabs from '../components/profile/TaskTabs';
import ProfileEditDialog from '../components/profile/ProfileEditDialog';
import ClearDataDialog from '../components/profile/ClearDataDialog';
import ProfilePage from '../pages/ProfilePage';
import type { Order, Profile, RoutePath, FeeBreakdown } from '../types';

// ─── Test helpers ──────────────────────────────────────────

function makeRoute(): RoutePath {
  return {
    stopIds: ['D12', 'C2'],
    pts: [{ x: 720, y: 180 }, { x: 320, y: 540 }],
    meters: 1800,
  };
}

function makeFee(): FeeBreakdown {
  return { base: 3, distance: 1.8, overweight: 0, total: 4.8 };
}

function makeOrder(overrides: Partial<Order> = {}): Order {
  const now = Date.now();
  return {
    id: 'RO12345',
    item: { name: '书籍', category: 'document', weight: 2.0 },
    sender: { stopId: 'D12', detailAddress: 'D12-503' },
    receiver: { stopId: 'C2', detailAddress: '图书馆前台' },
    timeType: 'immediate',
    fee: makeFee(),
    status: 'delivering',
    timeline: [{ status: 'paid', at: now - 3000, note: '已下单并支付' }],
    route: makeRoute(),
    robot: { progress: 900, direction: 'forward', atStopId: 'D12' },
    createdAt: now - 5000,
    paidAt: now - 3000,
    ...overrides,
  };
}

// ─── BarChart6m ────────────────────────────────────────────

describe('BarChart6m', () => {
  const data = [
    { label: '4月', amount: 10, count: 2 },
    { label: '5月', amount: 0, count: 0 },
    { label: '6月', amount: 25, count: 5 },
    { label: '7月', amount: 5, count: 1 },
    { label: '8月', amount: 0, count: 0 },
    { label: '9月', amount: 15, count: 3 },
  ];

  it('renders chart with 6 bars', () => {
    render(<BarChart6m data={data} />);
    expect(screen.getByTestId('bar-chart-6m')).toBeTruthy();
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`bar-${i}`)).toBeTruthy();
    }
  });

  it('shows month labels', () => {
    render(<BarChart6m data={data} />);
    expect(screen.getByText('4月')).toBeTruthy();
    expect(screen.getByText('9月')).toBeTruthy();
  });

  it('shows amounts', () => {
    render(<BarChart6m data={data} />);
    expect(screen.getByText('¥10')).toBeTruthy();
    expect(screen.getByText('¥25')).toBeTruthy();
  });

  it('handles all-zero data', () => {
    const zeroData = data.map((d) => ({ ...d, amount: 0 }));
    render(<BarChart6m data={zeroData} />);
    expect(screen.getByTestId('bar-chart-6m')).toBeTruthy();
  });
});

// ─── TaskTabs ──────────────────────────────────────────────

describe('TaskTabs', () => {
  it('renders three tabs', () => {
    render(<TaskTabs orders={[]} />);
    expect(screen.getByTestId('task-tab-active')).toBeTruthy();
    expect(screen.getByTestId('task-tab-completed')).toBeTruthy();
    expect(screen.getByTestId('task-tab-cancelled')).toBeTruthy();
  });

  it('shows empty state for active tab when no orders', () => {
    render(<TaskTabs orders={[]} />);
    expect(screen.getByTestId('task-empty-active')).toBeTruthy();
  });

  it('shows active orders by default', () => {
    const activeOrder = makeOrder({ status: 'delivering' });
    render(<TaskTabs orders={[activeOrder]} />);
    expect(screen.getByTestId('task-order-RO12345')).toBeTruthy();
  });

  it('switches to completed tab', () => {
    const completedOrder = makeOrder({ id: 'RO99999', status: 'delivered' });
    render(<TaskTabs orders={[completedOrder]} />);
    expect(screen.getByTestId('task-empty-active')).toBeTruthy();

    fireEvent.click(screen.getByTestId('task-tab-completed'));
    expect(screen.getByTestId('task-order-RO99999')).toBeTruthy();
  });

  it('switches to cancelled tab', () => {
    const cancelledOrder = makeOrder({ id: 'RO88888', status: 'cancelled' });
    render(<TaskTabs orders={[cancelledOrder]} />);

    fireEvent.click(screen.getByTestId('task-tab-cancelled'));
    expect(screen.getByTestId('task-order-RO88888')).toBeTruthy();
  });
});

// ─── ProfileEditDialog ─────────────────────────────────────

describe('ProfileEditDialog', () => {
  const defaultProfile: Profile = { nickname: 'Kevin', phone: '13800000000' };

  it('renders dialog with current values', () => {
    render(<ProfileEditDialog profile={defaultProfile} onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByTestId('profile-edit-dialog')).toBeTruthy();
    expect(screen.getByTestId('edit-nickname')).toHaveValue('Kevin');
    expect(screen.getByTestId('edit-phone')).toHaveValue('13800000000');
  });

  it('calls onSave with updated profile', () => {
    const onSave = vi.fn();
    render(<ProfileEditDialog profile={defaultProfile} onSave={onSave} onClose={vi.fn()} />);

    fireEvent.change(screen.getByTestId('edit-nickname'), { target: { value: 'NewName' } });
    fireEvent.click(screen.getByTestId('edit-save-btn'));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ nickname: 'NewName' })
    );
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    render(<ProfileEditDialog profile={defaultProfile} onSave={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText('取消'));
    expect(onClose).toHaveBeenCalled();
  });
});

// ─── ClearDataDialog ───────────────────────────────────────

describe('ClearDataDialog', () => {
  it('renders dialog', () => {
    render(<ClearDataDialog onConfirm={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByTestId('clear-data-dialog')).toBeTruthy();
  });

  it('confirm button is disabled until checkbox is checked', () => {
    render(<ClearDataDialog onConfirm={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByTestId('clear-confirm-btn')).toBeDisabled();

    fireEvent.click(screen.getByTestId('clear-acknowledge-checkbox'));
    expect(screen.getByTestId('clear-confirm-btn')).not.toBeDisabled();
  });

  it('calls onConfirm when confirmed', () => {
    const onConfirm = vi.fn();
    render(<ClearDataDialog onConfirm={onConfirm} onClose={vi.fn()} />);
    fireEvent.click(screen.getByTestId('clear-acknowledge-checkbox'));
    fireEvent.click(screen.getByTestId('clear-confirm-btn'));
    expect(onConfirm).toHaveBeenCalled();
  });
});

// ─── ProfilePage ───────────────────────────────────────────

describe('ProfilePage', () => {
  it('renders profile section', () => {
    render(<ProfilePage />);
    expect(screen.getByTestId('page-profile')).toBeTruthy();
    expect(screen.getByTestId('edit-profile-btn')).toBeTruthy();
  });

  it('renders settings section', () => {
    render(<ProfilePage />);
    expect(screen.getByTestId('settings-edit-profile')).toBeTruthy();
    expect(screen.getByTestId('settings-speed')).toBeTruthy();
    expect(screen.getByTestId('settings-clear')).toBeTruthy();
  });

  it('opens edit dialog when edit button clicked', () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByTestId('edit-profile-btn'));
    expect(screen.getByTestId('profile-edit-dialog')).toBeTruthy();
  });

  it('opens clear dialog when clear button clicked', () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByTestId('settings-clear'));
    expect(screen.getByTestId('clear-data-dialog')).toBeTruthy();
  });

  it('shows speed setting', () => {
    render(<ProfilePage />);
    expect(screen.getByText('×20')).toBeTruthy();
  });
});
