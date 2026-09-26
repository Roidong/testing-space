import { describe, it, expect, beforeEach, vi } from 'vitest';
import { startEngine, stopEngine } from '../engine/simulation';
import { transition, getStatusLabel, getStatusPillClass } from '../engine/orderMachine';
import { createOrder, getState, clearAll } from '../store/store';
import type { Order } from '../types';

describe('Phase 2: 仿真引擎', () => {
  beforeEach(() => {
    clearAll();
    stopEngine();
  });

  describe('订单状态机', () => {
    let order: Order;

    beforeEach(() => {
      order = createOrder({
        item: { name: '书籍', category: 'daily', weight: 2 },
        sender: { stopId: 'D12', detailAddress: 'D12-503' },
        receiver: { stopId: 'C2', detailAddress: '三楼自习区' },
        timeType: 'immediate',
      });
    });

    it('start_pickup 转换到 going_to_pickup', () => {
      const updated = transition(order, 'start_pickup');
      expect(updated).not.toBeNull();
      expect(updated!.status).toBe('going_to_pickup');
      expect(updated!.timeline.some((e) => e.status === 'going_to_pickup')).toBe(true);
    });

    it('arrive_pickup 转换到 at_pickup', () => {
      const going = transition(order, 'start_pickup')!;
      const arrived = transition(going, 'arrive_pickup');
      expect(arrived).not.toBeNull();
      expect(arrived!.status).toBe('at_pickup');
      expect(arrived!.robot.loadingUntil).toBeDefined();
    });

    it('finish_loading 转换到 delivering', () => {
      const going = transition(order, 'start_pickup')!;
      const arrived = transition(going, 'arrive_pickup')!;
      const delivering = transition(arrived, 'finish_loading');
      expect(delivering).not.toBeNull();
      expect(delivering!.status).toBe('delivering');
    });

    it('arrive_delivery 转换到 delivered', () => {
      const going = transition(order, 'start_pickup')!;
      const arrived = transition(going, 'arrive_pickup')!;
      const delivering = transition(arrived, 'finish_loading')!;
      const delivered = transition(delivering, 'arrive_delivery');
      expect(delivered).not.toBeNull();
      expect(delivered!.status).toBe('delivered');
      expect(delivered!.deliveredAt).toBeDefined();
    });

    it('cancel 转换到 returning', () => {
      const going = transition(order, 'start_pickup')!;
      const cancelled = transition(going, 'cancel');
      expect(cancelled).not.toBeNull();
      expect(cancelled!.status).toBe('returning');
    });

    it('无效转换返回 null', () => {
      const result = transition(order, 'arrive_delivery');
      expect(result).toBeNull();
    });

    it('已送达订单不能取消', () => {
      const going = transition(order, 'start_pickup')!;
      const arrived = transition(going, 'arrive_pickup')!;
      const delivering = transition(arrived, 'finish_loading')!;
      const delivered = transition(delivering, 'arrive_delivery')!;
      const result = transition(delivered, 'cancel');
      expect(result).toBeNull();
    });
  });

  describe('状态标签与样式', () => {
    it('getStatusLabel 返回中文标签', () => {
      expect(getStatusLabel('delivered')).toBe('已送达');
      expect(getStatusLabel('delivering')).toBe('配送中');
      expect(getStatusLabel('cancelled')).toBe('已取消 (已退回)');
    });

    it('getStatusPillClass 返回正确的 CSS 类', () => {
      expect(getStatusPillClass('delivered')).toBe('pill--done');
      expect(getStatusPillClass('returning')).toBe('pill--returning');
      expect(getStatusPillClass('cancelled')).toBe('pill--cancelled');
      expect(getStatusPillClass('delivering')).toBe('pill--active');
    });
  });

  describe('仿真循环', () => {
    it('startEngine 和 stopEngine 不报错', () => {
      expect(() => startEngine()).not.toThrow();
      expect(() => stopEngine()).not.toThrow();
    });

    it('多次 startEngine 不会重复启动', () => {
      startEngine();
      startEngine(); // 应该被忽略
      stopEngine();
    });

    it('tickOrders 推进订单状态', async () => {
      createOrder({
        item: { name: '书籍', category: 'daily', weight: 2 },
        sender: { stopId: 'D12', detailAddress: 'D12-503' },
        receiver: { stopId: 'C2', detailAddress: '三楼自习区' },
        timeType: 'immediate',
      });

      const stateBefore = getState();
      expect(stateBefore.orders[0].status).toBe('awaiting_pickup');

      // 手动 tick 大量时间以完成订单
      const { tickOrders } = await import('../store/store');
      tickOrders(1000000); // 1000 模拟秒

      const stateAfter = getState();
      expect(stateAfter.orders[0].status).toBe('delivered');
    });
  });
});
