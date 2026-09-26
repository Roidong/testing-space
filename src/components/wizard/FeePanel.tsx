import type { FeeBreakdown } from '../../types';

interface Props {
  fee: FeeBreakdown | null;
  distanceMeters: number;
}

export default function FeePanel({ fee, distanceMeters }: Props) {
  if (!fee) {
    return (
      <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: 12 }}>
        请选择发件和收件地址以估算费用
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>费用明细</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-dim)' }}>起步价</span>
          <span className="num">¥{fee.base.toFixed(1)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-dim)' }}>
            距离费（{(distanceMeters / 1000).toFixed(1)} km）
          </span>
          <span className="num">¥{fee.distance.toFixed(1)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-dim)' }}>超重费</span>
          <span className="num">¥{fee.overweight.toFixed(1)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border)',
            paddingTop: 8,
            marginTop: 4,
            fontWeight: 600,
          }}
        >
          <span>合计</span>
          <span className="num" style={{ color: 'var(--primary)', fontSize: 16 }}>
            ¥{fee.total.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
