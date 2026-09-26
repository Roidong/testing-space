import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatsCards from '../components/home/StatsCards';
import MiniMapThumb from '../components/home/MiniMapThumb';
import OrderCard from '../components/home/OrderCard';
import ActivityFeed from '../components/home/ActivityFeed';
import HomePage from '../pages/HomePage';
import type { Order, RoutePath, FeeBreakdown, TimelineEvent } from '../types';

// ─── Test helpers ──────────────────────────────────────────

function makeRoute(): RoutePath {
  return {
    stopIds: ['D12', 'C2'],
    pts: [
      { x: 720, y: 180 },
      { x: 320, y: 540 },
    ],
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
    timeline: [
      { status: 'paid', at: now - 3000, note: '已下单并支付' },
      { status: 'going_to_pickup', at: now - 2000, note: '机器人接单' },
    ],
    route: makeRoute(),
    robot: { progress: 900, direction: 'forward', atStopId: 'D12' },
    createdAt: now - 5000,
    paidAt: now - 3000,
    ...overrides,
  };
}

// ─── StatsCards ────────────────────────────────────────────

describe('StatsCards', () => {
  it('renders three stat cards', () => {
    render(<StatsCards activeCount={2} monthCompleted={5} monthSpending={24.0} />);
    expect(screen.getByTestId('stats-cards')).toBeTruthy();
    expect(screen.getByText('进行中')).toBeTruthy();
    expect(screen.getByText('本月完成')).toBeTruthy();
    expect(screen.getByText('本月消费')).toBeTruthy();
  });

  it('displays correct values', () => {
    render(<StatsCards activeCount={3} monthCompleted={10} monthSpending={45.5} />);
    expect(screen.getByText(/3/)).toBeTruthy();
    expect(screen.getByText(/10/)).toBeTruthy();
    expect(screen.getByText(/45\.5/)).toBeTruthy();
  });
});

// ─── MiniMapThumb ──────────────────────────────────────────

describe('MiniMapThumb', () => {
  it('renders an SVG', () => {
    const { container } = render(<MiniMapThumb route={makeRoute()} progress={500} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders with zero progress', () => {
    const { container } = render(<MiniMapThumb route={makeRoute()} progress={0} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});

// ─── OrderCard ─────────────────────────────────────────────

describe('OrderCard', () => {
  it('renders order info', () => {
    const order = makeOrder();
    render(<OrderCard order={order} onClick={vi.fn()} />);
    expect(screen.getByTestId('order-card-RO12345')).toBeTruthy();
    expect(screen.getByText('书籍')).toBeTruthy();
    expect(screen.getByText(/配送中/)).toBeTruthy();
  });

  it('shows progress percentage', () => {
    const order = makeOrder({ robot: { progress: 900, direction: 'forward' } });
    render(<OrderCard order={order} onClick={vi.fn()} />);
    expect(screen.getByText('50%')).toBeTruthy();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    const order = makeOrder();
    render(<OrderCard order={order} onClick={onClick} />);
    fireEvent.click(screen.getByTestId('order-card-RO12345'));
    expect(onClick).toHaveBeenCalled();
  });
});

// ─── ActivityFeed ──────────────────────────────────────────

describe('ActivityFeed', () => {
  it('shows empty state when no orders', () => {
    render(<ActivityFeed orders={[]} />);
    expect(screen.getByTestId('activity-feed')).toBeTruthy();
    expect(screen.getByText('暂无动态')).toBeTruthy();
  });

  it('renders events sorted by time', () => {
    const order = makeOrder();
    render(<ActivityFeed orders={[order]} />);
    expect(screen.getByTestId('activity-feed')).toBeTruthy();
    const items = screen.getByTestId('activity-feed').children;
    expect(items.length).toBe(2);
  });

  it('limits to maxItems', () => {
    const now = Date.now();
    const order = makeOrder({
      timeline: [
        { status: 'paid', at: now - 4000 },
        { status: 'going_to_pickup', at: now - 3000 },
        { status: 'at_pickup', at: now - 2000 },
        { status: 'delivering', at: now - 1000 },
        { status: 'delivered', at: now },
        { status: 'paid', at: now - 500 },
      ],
    });
    render(<ActivityFeed orders={[order]} maxItems={3} />);
    const items = screen.getByTestId('activity-feed').children;
    expect(items.length).toBe(3);
  });
});

// ─── HomePage ──────────────────────────────────────────────

describe('HomePage', () => {
  it('renders greeting and empty state when no orders', () => {
    render(<HomePage />);
    expect(screen.getByTestId('page-home')).toBeTruthy();
    expect(screen.getByTestId('home-empty-state')).toBeTruthy();
    expect(screen.getByTestId('home-empty-send-btn')).toBeTruthy();
  });

  it('renders stats cards', () => {
    render(<HomePage />);
    expect(screen.getByTestId('stats-cards')).toBeTruthy();
  });

  it('renders quick action buttons', () => {
    render(<HomePage />);
    expect(screen.getByTestId('home-send-btn')).toBeTruthy();
    expect(screen.getByTestId('home-map-btn')).toBeTruthy();
  });

  it('renders activity feed', () => {
    render(<HomePage />);
    expect(screen.getByTestId('activity-feed')).toBeTruthy();
  });

  it('calls onOpenWizard when send button clicked', () => {
    const onOpenWizard = vi.fn();
    render(<HomePage onOpenWizard={onOpenWizard} />);
    fireEvent.click(screen.getByTestId('home-send-btn'));
    expect(onOpenWizard).toHaveBeenCalled();
  });

  it('calls onGoToDelivery when map button clicked', () => {
    const onGoToDelivery = vi.fn();
    render(<HomePage onGoToDelivery={onGoToDelivery} />);
    fireEvent.click(screen.getByTestId('home-map-btn'));
    expect(onGoToDelivery).toHaveBeenCalled();
  });
});
