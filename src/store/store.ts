import { useSyncExternalStore } from 'react';
import type { AppState, Order, OrderStatus, Profile, Settings } from '../types';
import { loadState, saveState } from './persist';
import { shortestPath } from '../data/roadnet';
import { reversePath } from '../lib/geo';
import { quoteFee } from '../lib/pricing';

let state: AppState = loadState();
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function notify() {
  for (const listener of listeners) {
    listener();
  }
  // 防抖保存
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveState(state);
  }, 300);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useApp<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state));
}

export function getState(): AppState {
  return state;
}

// 创建订单
export function createOrder(input: {
  item: Order['item'];
  sender: Order['sender'];
  receiver: Order['receiver'];
  timeType: Order['timeType'];
  scheduledAt?: number;
}): Order {
  const route = shortestPath(input.sender.stopId, input.receiver.stopId);
  if (!route) throw new Error('无法规划路线');

  const fee = quoteFee(route.meters, input.item.weight);
  const now = Date.now();

  const order: Order = {
    id: `RO${now.toString(36).toUpperCase()}`,
    item: input.item,
    sender: input.sender,
    receiver: input.receiver,
    timeType: input.timeType,
    scheduledAt: input.scheduledAt,
    fee,
    status: input.timeType === 'scheduled' ? 'waiting_dispatch' : 'awaiting_pickup',
    timeline: [
      { status: 'paid', at: now, note: '已下单并支付' },
    ],
    route,
    robot: {
      progress: 0,
      direction: 'forward',
      atStopId: input.sender.stopId,
    },
    createdAt: now,
    paidAt: now,
  };

  state = { ...state, orders: [...state.orders, order] };
  notify();
  return order;
}

// 取消订单
export function cancelOrder(orderId: string): void {
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return;
  if (order.status === 'delivered' || order.status === 'cancelled') return;

  const now = Date.now();
  const returnRoute = reversePath(order.route);

  state = {
    ...state,
    orders: state.orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: 'returning' as OrderStatus,
            route: returnRoute,
            robot: {
              ...o.robot,
              direction: 'returning',
              progress: 0,
              atStopId: o.robot.atStopId,
            },
            timeline: [
              ...o.timeline,
              { status: 'returning', at: now, note: '取消订单，机器人原路返回' },
            ],
          }
        : o
    ),
  };
  notify();
}

// 更新资料
export function updateProfile(profile: Profile): void {
  state = { ...state, profile };
  notify();
}

// 更新设置
export function updateSettings(settings: Settings): void {
  state = { ...state, settings };
  notify();
}

// 清空数据
export function clearAll(): void {
  state = {
    version: 1,
    orders: [],
    profile: { nickname: 'Kevin', phone: '' },
    settings: { speedMultiplier: 20 },
    lastTickAt: Date.now(),
  };
  saveState(state);
  notify();
}

// 仿真 tick（由 engine 调用）
export function tickOrders(dtSimMs: number): void {
  const now = Date.now();
  let changed = false;

  const updatedOrders = state.orders.map((order) => {
    if (order.status === 'delivered' || order.status === 'cancelled') return order;

    // 预约单：到点后自动开始
    if (order.status === 'waiting_dispatch' && order.scheduledAt && now >= order.scheduledAt) {
      changed = true;
      return {
        ...order,
        status: 'awaiting_pickup' as OrderStatus,
        timeline: [
          ...order.timeline,
          { status: 'awaiting_pickup', at: now, note: '预约时间到，开始配送' },
        ],
      };
    }

    // 装货停留
    if (order.robot.loadingUntil && now < order.robot.loadingUntil) {
      return order;
    }

    // 机器人移动
    const speed = 50; // 模拟速度：50 米/模拟秒
    const dtSimSec = dtSimMs / 1000;
    const distanceMoved = speed * dtSimSec;
    const newProgress = order.robot.progress + distanceMoved;

    // 到达终点
    if (newProgress >= order.route.meters) {
      changed = true;
      const isReturning = order.robot.direction === 'returning';
      const finalStatus: OrderStatus = isReturning ? 'cancelled' : 'delivered';
      const note = isReturning ? '已返回发件点，订单取消' : '已送达';

      return {
        ...order,
        status: finalStatus,
        robot: {
          ...order.robot,
          progress: order.route.meters,
          atStopId: isReturning ? order.sender.stopId : order.receiver.stopId,
        },
        timeline: [
          ...order.timeline,
          { status: finalStatus, at: now, note },
        ],
        deliveredAt: finalStatus === 'delivered' ? now : undefined,
        cancelledAt: finalStatus === 'cancelled' ? now : undefined,
      };
    }

    // 检查是否到达停靠点
    let atStopId = order.robot.atStopId;
    let loadingUntil = order.robot.loadingUntil;
    let newStatus = order.status;
    const newTimeline = [...order.timeline];

    // 简化：每前进 100 米检查一次是否到达路径上的停靠点
    for (const stopId of order.route.stopIds) {
      if (stopId === order.robot.atStopId) continue;
      // 找到该停靠点在路径中的位置
      const stopIndex = order.route.stopIds.indexOf(stopId);
      if (stopIndex < 0) continue;

      // 估算该停靠点距离起点的距离（简化：按停靠点索引比例）
      const stopProgress = (stopIndex / (order.route.stopIds.length - 1)) * order.route.meters;

      if (order.robot.progress < stopProgress && newProgress >= stopProgress) {
        // 到达停靠点
        atStopId = stopId;
        const isPickup = stopId === order.sender.stopId && order.robot.direction === 'forward';
        const isDelivery = stopId === order.receiver.stopId && order.robot.direction === 'forward';

        if (isPickup && order.status === 'going_to_pickup') {
          newStatus = 'at_pickup';
          loadingUntil = now + 3000; // 装货 3 秒
          newTimeline.push({ status: 'at_pickup', at: now, note: `到达${stopId}取件点，装货中` });
        } else if (isDelivery && order.status === 'delivering') {
          // 送达
          newStatus = 'delivered';
          newTimeline.push({ status: 'delivered', at: now, note: '已送达' });
          return {
            ...order,
            status: newStatus,
            robot: { ...order.robot, progress: newProgress, atStopId },
            timeline: newTimeline,
            deliveredAt: now,
          };
        }
        break;
      }
    }

    // 状态流转
    if (order.status === 'awaiting_pickup' && order.robot.direction === 'forward') {
      newStatus = 'going_to_pickup';
      if (!order.timeline.some((e) => e.status === 'going_to_pickup')) {
        newTimeline.push({ status: 'going_to_pickup', at: now, note: '机器人接单，前往取件点' });
      }
    } else if (order.status === 'at_pickup' && !loadingUntil) {
      newStatus = 'delivering';
      newTimeline.push({ status: 'delivering', at: now, note: '装货完成，开始配送' });
    }

    if (newStatus !== order.status) changed = true;

    return {
      ...order,
      status: newStatus,
      robot: { ...order.robot, progress: newProgress, atStopId, loadingUntil },
      timeline: newTimeline,
    };
  });

  if (changed) {
    state = { ...state, orders: updatedOrders, lastTickAt: now };
    notify();
  }
}
