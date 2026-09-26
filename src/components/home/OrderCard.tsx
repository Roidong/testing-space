import type { Order } from '../../types';
import { getStatusLabel, getStatusPillClass } from '../../engine/orderMachine';
import { getStop } from '../../data/locations';
import MiniMapThumb from './MiniMapThumb';

interface Props {
  order: Order;
  onClick: () => void;
}

function estimateETA(order: Order): string {
  if (order.status === 'delivered' || order.status === 'cancelled') return '';
  const remaining = order.route.meters - order.robot.progress;
  const speed = 50;
  const simSec = remaining / speed;
  const realSec = simSec / (order.robot.direction === 'returning' ? 1 : 1);
  if (realSec < 60) return `${Math.ceil(realSec)}秒`;
  if (realSec < 3600) return `${Math.ceil(realSec / 60)}分钟`;
  return `${(realSec / 3600).toFixed(1)}小时`;
}

export default function OrderCard({ order, onClick }: Props) {
  const senderStop = getStop(order.sender.stopId);
  const receiverStop = getStop(order.receiver.stopId);
  const progress = order.route.meters > 0 ? (order.robot.progress / order.route.meters) * 100 : 0;
  const eta = estimateETA(order);

  return (
    <div
      className="card"
      data-testid={`order-card-${order.id}`}
      onClick={onClick}
      style={{ padding: 14, cursor: 'pointer', transition: 'border-color 0.15s' }}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 80, height: 60, flexShrink: 0 }}>
          <MiniMapThumb route={order.route} progress={order.robot.progress} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span className="num" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              #{order.id.slice(-6)}
            </span>
            <span className={`pill ${getStatusPillClass(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{order.item.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {senderStop?.name ?? order.sender.stopId} → {receiverStop?.name ?? order.receiver.stopId}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--primary)',
              borderRadius: 2,
              transition: 'width 0.3s',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{progress.toFixed(0)}%</span>
          {eta && <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>ETA {eta}</span>}
        </div>
      </div>
    </div>
  );
}
