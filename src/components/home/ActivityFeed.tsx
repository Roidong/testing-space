import type { Order } from '../../types';
import { getStatusLabel } from '../../engine/orderMachine';

interface Props {
  orders: Order[];
  maxItems?: number;
}

export default function ActivityFeed({ orders, maxItems = 5 }: Props) {
  const allEvents = orders
    .flatMap((o) =>
      o.timeline.map((evt) => ({
        ...evt,
        orderId: o.id,
        itemName: o.item.name,
      }))
    )
    .sort((a, b) => b.at - a.at)
    .slice(0, maxItems);

  if (allEvents.length === 0) {
    return (
      <div data-testid="activity-feed" style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
        暂无动态
      </div>
    );
  }

  return (
    <div data-testid="activity-feed">
      {allEvents.map((evt, i) => (
        <div
          key={`${evt.orderId}-${i}`}
          style={{
            display: 'flex',
            gap: 10,
            padding: '10px 0',
            borderBottom: i < allEvents.length - 1 ? '1px solid var(--border)' : 'none',
            fontSize: 13,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i === 0 ? 'var(--primary)' : 'var(--border)',
              marginTop: 5,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div>
              <span style={{ fontWeight: 500 }}>{getStatusLabel(evt.status)}</span>
              <span style={{ color: 'var(--text-dim)', marginLeft: 6 }}>· {evt.itemName}</span>
            </div>
            {evt.note && <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{evt.note}</div>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }}>
            {new Date(evt.at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
}
