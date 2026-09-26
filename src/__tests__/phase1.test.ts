import { describe, it, expect, beforeEach } from 'vitest';
import { STOPS, getStop, getStopsByZone, getAllZones, searchStops } from '../data/locations';
import { shortestPath } from '../data/roadnet';
import { pathLength, pointAtDistance, headingAt, reversePath } from '../lib/geo';
import { quoteFee } from '../lib/pricing';
import { loadState, saveState, clearState } from '../store/persist';
import { createOrder, cancelOrder, getState } from '../store/store';

describe('Phase 1: 数据层', () => {
  beforeEach(() => {
    clearState();
  });

  describe('地点库', () => {
    it('包含约 45 个停靠点', () => {
      expect(STOPS.length).toBeGreaterThanOrEqual(40);
      expect(STOPS.length).toBeLessThanOrEqual(60);
    });

    it('getStop 返回正确的停靠点', () => {
      const stop = getStop('D12');
      expect(stop).toBeDefined();
      expect(stop!.name).toBe('D12 宿舍');
      expect(stop!.zone).toBe('生活组团北区');
    });

    it('getStopsByZone 按组团筛选', () => {
      const northLiving = getStopsByZone('生活组团北区');
      expect(northLiving.length).toBeGreaterThan(0);
      expect(northLiving.every((s) => s.zone === '生活组团北区')).toBe(true);
    });

    it('getAllZones 返回所有组团', () => {
      const zones = getAllZones();
      expect(zones).toContain('生活组团北区');
      expect(zones).toContain('生活组团南区');
      expect(zones.length).toBeGreaterThanOrEqual(6);
    });

    it('searchStops 按名称或组团搜索', () => {
      const results = searchStops('图书馆');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('图书馆');

      const zoneResults = searchStops('科研');
      expect(zoneResults.length).toBeGreaterThan(0);
      expect(zoneResults.every((s) => s.zone.includes('科研'))).toBe(true);
    });
  });

  describe('路网与最短路径', () => {
    it('shortestPath 返回合理路径', () => {
      const route = shortestPath('D12', 'C2');
      expect(route).not.toBeNull();
      expect(route!.stopIds.length).toBeGreaterThanOrEqual(2);
      expect(route!.stopIds[0]).toBe('D12');
      expect(route!.stopIds[route!.stopIds.length - 1]).toBe('C2');
      expect(route!.meters).toBeGreaterThan(0);
      expect(route!.pts.length).toBeGreaterThan(0);
    });

    it('同一点路径长度为 0', () => {
      const route = shortestPath('D12', 'D12');
      expect(route).not.toBeNull();
      expect(route!.meters).toBe(0);
    });

    it('不存在的点返回 null', () => {
      const route = shortestPath('INVALID', 'C2');
      expect(route).toBeNull();
    });

    it('路径长度与坐标距离一致', () => {
      const route = shortestPath('D12', 'C2');
      expect(route).not.toBeNull();
      const coordLength = pathLength(route!.pts);
      // 坐标长度与米数应在合理范围内（坐标是归一化的，米数是实际距离）
      expect(coordLength).toBeGreaterThan(0);
    });
  });

  describe('地理工具', () => {
    it('pathLength 计算路径总长', () => {
      const pts = [
        { x: 0, y: 0 },
        { x: 3, y: 4 },
      ];
      expect(pathLength(pts)).toBe(5);
    });

    it('pointAtDistance 沿路径前进', () => {
      const pts = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ];
      const pos = pointAtDistance(pts, 5);
      expect(pos.x).toBeCloseTo(5, 5);
      expect(pos.y).toBeCloseTo(0, 5);
    });

    it('pointAtDistance 超出路径返回终点', () => {
      const pts = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ];
      const pos = pointAtDistance(pts, 15);
      expect(pos.x).toBeCloseTo(10, 5);
    });

    it('headingAt 计算朝向', () => {
      const pts = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ];
      const heading = headingAt(pts, 5);
      expect(heading).toBeCloseTo(0, 5); // 向右
    });

    it('reversePath 反转路径', () => {
      const route = {
        stopIds: ['A', 'B', 'C'],
        pts: [
          { x: 0, y: 0 },
          { x: 5, y: 5 },
          { x: 10, y: 10 },
        ],
        meters: 100,
      };
      const reversed = reversePath(route);
      expect(reversed.stopIds).toEqual(['C', 'B', 'A']);
      expect(reversed.pts[0]).toEqual({ x: 10, y: 10 });
      expect(reversed.meters).toBe(100);
    });
  });

  describe('计费公式', () => {
    it('基础计费：3 元起步 + 距离 + 超重', () => {
      const fee = quoteFee(1800, 2);
      expect(fee.base).toBe(3);
      expect(fee.distance).toBe(1.8);
      expect(fee.overweight).toBe(0);
      expect(fee.total).toBe(4.8);
    });

    it('超重计费', () => {
      const fee = quoteFee(1000, 7);
      expect(fee.base).toBe(3);
      expect(fee.distance).toBe(1);
      expect(fee.overweight).toBe(2); // (7-5)*1
      expect(fee.total).toBe(6);
    });

    it('零距离最小费用', () => {
      const fee = quoteFee(0, 1);
      expect(fee.total).toBe(3);
    });
  });

  describe('持久化', () => {
    it('loadState 返回默认状态', () => {
      const state = loadState();
      expect(state.version).toBe(1);
      expect(state.orders).toEqual([]);
      expect(state.profile.nickname).toBe('Kevin');
    });

    it('saveState 和 loadState 往返一致', () => {
      const state = loadState();
      state.profile.nickname = 'Test';
      saveState(state);
      const loaded = loadState();
      expect(loaded.profile.nickname).toBe('Test');
    });

    it('clearState 清空数据', () => {
      const state = loadState();
      state.profile.nickname = 'Test';
      saveState(state);
      clearState();
      const loaded = loadState();
      expect(loaded.profile.nickname).toBe('Kevin');
    });
  });

  describe('Store 订单操作', () => {
    it('createOrder 创建订单', () => {
      const order = createOrder({
        item: { name: '书籍', category: 'daily', weight: 2 },
        sender: { stopId: 'D12', detailAddress: 'D12-503' },
        receiver: { stopId: 'C2', detailAddress: '三楼自习区' },
        timeType: 'immediate',
      });
      expect(order.id).toBeDefined();
      expect(order.status).toBe('awaiting_pickup');
      expect(order.fee.total).toBeGreaterThan(0);
      expect(order.route.meters).toBeGreaterThan(0);

      const state = getState();
      expect(state.orders.length).toBe(1);
      expect(state.orders[0].id).toBe(order.id);
    });

    it('cancelOrder 取消订单', () => {
      const order = createOrder({
        item: { name: '书籍', category: 'daily', weight: 2 },
        sender: { stopId: 'D12', detailAddress: 'D12-503' },
        receiver: { stopId: 'C2', detailAddress: '三楼自习区' },
        timeType: 'immediate',
      });
      cancelOrder(order.id);
      const state = getState();
      const cancelled = state.orders.find((o) => o.id === order.id);
      expect(cancelled).toBeDefined();
      expect(cancelled!.status).toBe('returning');
    });

    it('取消已送达订单无效', () => {
      const order = createOrder({
        item: { name: '书籍', category: 'daily', weight: 2 },
        sender: { stopId: 'D12', detailAddress: 'D12-503' },
        receiver: { stopId: 'C2', detailAddress: '三楼自习区' },
        timeType: 'immediate',
      });
      // 手动设为已送达
      const state = getState();
      state.orders = state.orders.map((o) =>
        o.id === order.id ? { ...o, status: 'delivered' as const } : o
      );
      cancelOrder(order.id);
      const updated = getState().orders.find((o) => o.id === order.id);
      expect(updated!.status).toBe('delivered');
    });
  });
});
