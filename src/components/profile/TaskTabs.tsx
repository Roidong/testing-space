import { useState } from 'react';
import type { Order } from '../../types';
import { getStatusLabel, getStatusPillClass } from '../../engine/orderMachine';
import { getStop } from '../../data/locations';

type FilterTab = 'active' | 'completed' | 'cancelled';

interface Props {
  orders: Order[];
  onOrderClick?: (orderId: string) => void;
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'active', label: '进行中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

function filterOrders(orders: Order[], tab: FilterTab): Order[] {
  if (tab === 'active') return orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  if (tab === 'completed') return orders.filter((o) => o.status === 'delivered');
  return orders.filter((o) => o.status === 'cancelled');
}

export default function TaskTabs({ orders, onOrderClick }: Props) {
  const [tab, setTab] = useState<FilterTab>('active');
  const filtered = filterOrders(orders, tab);

  return (
    <div data-testid="task-tabs">
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            data-testid={`task-tab-${t.key}`}
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: 13,
              color: tab === t.key ? 'var(--primary)' : 'var(--text-dim)',
              borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: tab === t.key ? 600 : 400,
            }}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div data-testid={`task-empty-${tab}`} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
          暂无{tab === 'active' ? '进行中' : tab === 'completed' ? '已完成' : '已取消'}订单
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((order) => {
            const senderStop = getStop(order.sender.stopId);
            const receiverStop = getStop(order.receiver.stopId);
            return (
              <div
                key={order.id}
                data-testid={`task-order-${order.id}`}
                className="card"
                style={{ padding: 12, cursor: onOrderClick ? 'pointer' : 'default' }}
                onClick={() => onOrderClick?.(order.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="num" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    #{order.id.slice(-6)}
                  </span>
                  <span className={`pill ${getStatusPillClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{order.item.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  {senderStop?.name ?? order.sender.stopId} → {receiverStop?.name ?? order.receiver.stopId}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
