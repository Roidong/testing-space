import type { Order, OrderStatus } from '../types';

// 订单状态机转换
export function transition(
  order: Order,
  event: 'start_pickup' | 'arrive_pickup' | 'finish_loading' | 'arrive_delivery' | 'cancel'
): Order | null {
  const now = Date.now();
  const timeline = [...order.timeline];

  switch (event) {
    case 'start_pickup':
      if (order.status !== 'awaiting_pickup') return null;
      timeline.push({ status: 'going_to_pickup', at: now, note: '机器人接单，前往取件点' });
      return { ...order, status: 'going_to_pickup', timeline };

    case 'arrive_pickup':
      if (order.status !== 'going_to_pickup') return null;
      timeline.push({ status: 'at_pickup', at: now, note: `到达${order.sender.stopId}取件点，装货中` });
      return {
        ...order,
        status: 'at_pickup',
        robot: { ...order.robot, loadingUntil: now + 3000 },
        timeline,
      };

    case 'finish_loading':
      if (order.status !== 'at_pickup') return null;
      timeline.push({ status: 'delivering', at: now, note: '装货完成，开始配送' });
      return { ...order, status: 'delivering', timeline };

    case 'arrive_delivery':
      if (order.status !== 'delivering') return null;
      timeline.push({ status: 'delivered', at: now, note: '已送达' });
      return {
        ...order,
        status: 'delivered',
        deliveredAt: now,
        timeline,
      };

    case 'cancel':
      if (order.status === 'delivered' || order.status === 'cancelled') return null;
      timeline.push({ status: 'returning', at: now, note: '取消订单，机器人原路返回' });
      return {
        ...order,
        status: 'returning',
        timeline,
      };

    default:
      return null;
  }
}

// 获取状态的中文标签
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    paid: '已下单',
    waiting_dispatch: '等待出发',
    awaiting_pickup: '待取件',
    going_to_pickup: '前往取件',
    at_pickup: '到达取件',
    delivering: '配送中',
    delivered: '已送达',
    returning: '退回中',
    cancelled: '已取消 (已退回)',
  };
  return labels[status];
}

// 获取状态的 pill 样式类
export function getStatusPillClass(status: OrderStatus): string {
  if (status === 'delivered') return 'pill--done';
  if (status === 'returning') return 'pill--returning';
  if (status === 'cancelled') return 'pill--cancelled';
  return 'pill--active';
}
