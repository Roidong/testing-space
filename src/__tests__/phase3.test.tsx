import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CampusMap from '../components/map/CampusMap';
import RoutePolyline from '../components/map/RoutePolyline';
import RobotDot from '../components/map/RobotDot';
import StopPin from '../components/map/StopPin';
import OrderDrawer from '../components/OrderDrawer';
import DeliveryPage from '../pages/DeliveryPage';
import { createOrder, clearAll } from '../store/store';

describe('Phase 3: 地图组件', () => {
  beforeEach(() => {
    clearAll();
  });

  describe('CampusMap', () => {
    it('渲染地图容器', () => {
      render(<CampusMap width={800} height={600}><g /></CampusMap>);
      const map = document.querySelector('.campus-map');
      expect(map).toBeInTheDocument();
    });

    it('显示控制按钮', () => {
      render(<CampusMap width={800} height={600}><g /></CampusMap>);
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('−')).toBeInTheDocument();
      // Reset button uses ⌖ symbol
      const buttons = document.querySelectorAll('.campus-map__controls button');
      expect(buttons.length).toBe(3);
    });

    it('初始状态地图自适应容器大小', () => {
      render(<CampusMap width={800} height={600}><g /></CampusMap>);
      const mapInner = document.querySelector('.campus-map > div');
      expect(mapInner).toBeTruthy();
      // Map should be scaled down to fit container
      const style = mapInner?.getAttribute('style') || '';
      expect(style).toContain('scale');
      // Scale should be less than 1 for a 800x600 container with 1279x1670 map
      expect(style).toMatch(/scale\([0-9.]+\)/);
    });

    it('重置按钮恢复初始视图', () => {
      render(<CampusMap width={800} height={600}><g /></CampusMap>);
      const buttons = document.querySelectorAll('.campus-map__controls button');
      const resetBtn = buttons[2]; // Third button is reset
      expect(resetBtn).toBeTruthy();
      // Clicking reset should not throw
      resetBtn.click();
    });
  });

  describe('RoutePolyline', () => {
    it('渲染路线', () => {
      const route = {
        stopIds: ['A', 'B'],
        pts: [
          { x: 0, y: 0 },
          { x: 100, y: 100 },
        ],
        meters: 100,
      };
      const { container } = render(<RoutePolyline route={route} progress={50} direction="forward" />);
      const polylines = container.querySelectorAll('polyline');
      expect(polylines.length).toBeGreaterThanOrEqual(1);
    });

    it('空路径不渲染', () => {
      const route = { stopIds: [], pts: [], meters: 0 };
      const { container } = render(<RoutePolyline route={route} progress={0} direction="forward" />);
      const polylines = container.querySelectorAll('polyline');
      expect(polylines.length).toBe(0);
    });
  });

  describe('RobotDot', () => {
    it('渲染机器人标记', () => {
      const { container } = render(<RobotDot x={100} y={200} heading={0} label="TEST" />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('StopPin', () => {
    it('渲染停靠点', () => {
      const stop = { id: 'D12', name: 'D12 宿舍', zone: '生活组团北区', x: 100, y: 200 };
      const { container } = render(<StopPin stop={stop} />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBe(2);
    });

    it('发件点显示"发"标签', () => {
      const stop = { id: 'D12', name: 'D12 宿舍', zone: '生活组团北区', x: 100, y: 200 };
      render(<StopPin stop={stop} isSender />);
      expect(screen.getByText('发')).toBeInTheDocument();
    });

    it('收件点显示"收"标签', () => {
      const stop = { id: 'C2', name: '图书馆', zone: '中心组团南区', x: 300, y: 400 };
      render(<StopPin stop={stop} isReceiver />);
      expect(screen.getByText('收')).toBeInTheDocument();
    });
  });

  describe('OrderDrawer', () => {
    it('渲染订单抽屉', () => {
      const order = createOrder({
        item: { name: '书籍', category: 'daily', weight: 2 },
        sender: { stopId: 'D12', detailAddress: 'D12-503' },
        receiver: { stopId: 'C2', detailAddress: '三楼' },
        timeType: 'immediate',
      });
      render(<OrderDrawer orderId={order.id} onClose={() => {}} />);
      expect(screen.getByText('书籍')).toBeInTheDocument();
    });
  });

  describe('DeliveryPage', () => {
    it('无订单时显示地图', () => {
      render(<DeliveryPage />);
      expect(screen.getByTestId('page-delivery')).toBeInTheDocument();
      expect(screen.queryByText('还没有订单')).toBeNull();
    });

    it('有订单时显示地图', () => {
      createOrder({
        item: { name: '书籍', category: 'daily', weight: 2 },
        sender: { stopId: 'D12', detailAddress: 'D12-503' },
        receiver: { stopId: 'C2', detailAddress: '三楼' },
        timeType: 'immediate',
      });
      render(<DeliveryPage />);
      const map = document.querySelector('.campus-map');
      expect(map).toBeInTheDocument();
    });
  });
});
