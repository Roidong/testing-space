// 全局类型定义（PRD §5）

export type OrderStatus =
  | 'paid'
  | 'waiting_dispatch'
  | 'awaiting_pickup'
  | 'going_to_pickup'
  | 'at_pickup'
  | 'delivering'
  | 'delivered'
  | 'returning'
  | 'cancelled';

export type ItemCategory = 'document' | 'daily' | 'food' | 'electronics' | 'other';

export type TimeType = 'immediate' | 'scheduled';

export interface Stop {
  id: string;
  name: string;
  zone: string;
  x: number; // 0-1000 归一化坐标
  y: number;
}

export interface OrderItem {
  name: string;
  category: ItemCategory;
  weight: number; // kg
  remark?: string;
}

export interface OrderEndpoint {
  stopId: string;
  detailAddress: string;
  phone?: string;
}

export interface FeeBreakdown {
  base: number;
  distance: number;
  overweight: number;
  total: number;
}

export interface RoutePath {
  stopIds: string[];
  pts: { x: number; y: number }[];
  meters: number;
}

export interface TimelineEvent {
  status: OrderStatus;
  at: number; // 时间戳 ms
  note?: string;
}

export interface RobotState {
  progress: number; // 沿路径的米数
  direction: 'forward' | 'returning';
  atStopId?: string;
  loadingUntil?: number; // 装货停留截止时间
}

export interface Order {
  id: string;
  item: OrderItem;
  sender: OrderEndpoint;
  receiver: OrderEndpoint;
  timeType: TimeType;
  scheduledAt?: number;
  fee: FeeBreakdown;
  status: OrderStatus;
  timeline: TimelineEvent[];
  route: RoutePath;
  robot: RobotState;
  createdAt: number;
  paidAt: number;
  deliveredAt?: number;
  cancelledAt?: number;
}

export interface Profile {
  nickname: string;
  phone: string;
  defaultStopId?: string;
  defaultDetail?: string;
}

export interface Settings {
  speedMultiplier: 10 | 20 | 60;
}

export interface AppState {
  version: 1;
  orders: Order[];
  profile: Profile;
  settings: Settings;
  lastTickAt: number;
}

export type TabId = 'home' | 'delivery' | 'profile';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  paid: '已下单',
  waiting_dispatch: '等待出发',
  awaiting_pickup: '待取件',
  going_to_pickup: '前往取件',
  at_pickup: '到达取件',
  delivering: '配送中',
  delivered: '已送达',
  returning: '退回中',
  cancelled: '已取消(已退回)',
};

export const STATUS_PILL_CLASS: Record<OrderStatus, string> = {
  paid: 'pill--active',
  waiting_dispatch: 'pill--active',
  awaiting_pickup: 'pill--active',
  going_to_pickup: 'pill--active',
  at_pickup: 'pill--active',
  delivering: 'pill--active',
  delivered: 'pill--done',
  returning: 'pill--returning',
  cancelled: 'pill--cancelled',
};
