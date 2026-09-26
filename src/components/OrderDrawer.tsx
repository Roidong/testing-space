import { useState } from 'react';
import { getStatusLabel, getStatusPillClass } from '../engine/orderMachine';
import { useApp, cancelOrder } from '../store/store';
import ConfirmDialog from './ConfirmDialog';
import { showToast } from './Toast';

interface Props {
  orderId: string;
  onClose: () => void;
}

export default function OrderDrawer({ orderId, onClose }: Props) {
  const [stage, setStage] = useState<'collapsed' | 'half' | 'full'>('half');
  const [cancelOpen, setCancelOpen] = useState(false);
  const order = useApp((s) => s.orders.find((o) => o.id === orderId));

  if (!order) return null;

  const progress = order.route.meters > 0 ? (order.robot.progress / order.route.meters) * 100 : 0;
  const canCancel = order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'returning';

  return (
    <div
      className="order-drawer"
      data-testid="order-drawer"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
        borderRadius: '14px 14px 0 0',
        transition: 'height 0.3s',
        height: stage === 'collapsed' ? 60 : stage === 'half' ? 200 : 400,
        overflow: 'hidden',
      }}
    >
      <div
        style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => setStage(stage === 'collapsed' ? 'half' : stage === 'half' ? 'full' : 'collapsed')}
      >
        <div>
          <span className={`pill ${getStatusPillClass(order.status)}`}>{getStatusLabel(order.status)}</span>
          <span style={{ marginLeft: 12, fontSize: 13 }}>{order.item.name}</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{stage === 'collapsed' ? '▲' : '▼'}</span>
      </div>

      {stage !== 'collapsed' && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>进度</div>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)' }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{progress.toFixed(0)}%</div>
          </div>

          {stage === 'full' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>状态时间轴</div>
                {order.timeline.map((event, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <div>{getStatusLabel(event.status)}</div>
                      <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>{event.note}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{new Date(event.at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                <div>
                  <div style={{ color: 'var(--text-dim)' }}>发件</div>
                  <div>{order.sender.stopId} · {order.sender.detailAddress}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)' }}>收件</div>
                  <div>{order.receiver.stopId} · {order.receiver.detailAddress}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)' }}>物件</div>
                  <div>{order.item.name} · {order.item.weight}kg</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)' }}>费用</div>
                  <div className="num">¥{order.fee.total}</div>
                </div>
              </div>

              {canCancel && (
                <button
                  className="btn-danger"
                  data-testid="cancel-order-btn"
                  style={{ width: '100%', marginTop: 16, padding: '10px 0' }}
                  onClick={() => setCancelOpen(true)}
                >
                  取消订单
                </button>
              )}
            </>
          )}
        </div>
      )}

      {cancelOpen && (
        <ConfirmDialog
          title="取消订单"
          message="取消后机器人将原路返回发件点，此操作不可撤销。"
          confirmLabel="确认取消"
          danger
          onConfirm={() => {
            cancelOrder(orderId);
            showToast('订单已取消，机器人正在返回');
          }}
          onClose={() => setCancelOpen(false)}
        />
      )}
    </div>
  );
}
