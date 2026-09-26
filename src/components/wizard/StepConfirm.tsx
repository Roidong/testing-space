import type { FeeBreakdown, TimeType } from '../../types';
import { getStop } from '../../data/locations';

interface SummaryData {
  item: { name: string; category: string; weight: number; remark: string };
  sender: { stopId: string; detailAddress: string; phone: string };
  receiver: { stopId: string; detailAddress: string; phone: string };
  timeType: TimeType;
  scheduledAt: string;
  fee: FeeBreakdown;
  distanceMeters: number;
}

interface Props {
  data: SummaryData;
  onPay: () => void;
  paying: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  document: '文件',
  daily: '日用品',
  food: '食品',
  electronics: '电子产品',
  other: '其他',
};

export default function StepConfirm({ data, onPay, paying }: Props) {
  const senderStop = getStop(data.sender.stopId);
  const receiverStop = getStop(data.receiver.stopId);

  return (
    <div data-testid="step-confirm" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>物件信息</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>名称</span>
            <div data-testid="confirm-item-name">{data.item.name}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>类别</span>
            <div>{CATEGORY_LABELS[data.item.category] ?? data.item.category}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>重量</span>
            <div className="num">{data.item.weight.toFixed(1)} kg</div>
          </div>
          {data.item.remark && (
            <div>
              <span style={{ color: 'var(--text-muted)' }}>备注</span>
              <div>{data.item.remark}</div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>配送信息</div>
        <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <span style={{ color: 'var(--primary)', fontSize: 12 }}>发件</span>
            <div>
              {senderStop?.name ?? data.sender.stopId}
              {data.sender.detailAddress && (
                <span style={{ color: 'var(--text-dim)', marginLeft: 6 }}>{data.sender.detailAddress}</span>
              )}
            </div>
          </div>
          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 10 }}>
            <span style={{ color: 'var(--success)', fontSize: 12 }}>收件</span>
            <div>
              {receiverStop?.name ?? data.receiver.stopId}
              {data.receiver.detailAddress && (
                <span style={{ color: 'var(--text-dim)', marginLeft: 6 }}>{data.receiver.detailAddress}</span>
              )}
            </div>
          </div>
          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 10 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>时间</span>
            <div>
              {data.timeType === 'immediate'
                ? '立即配送'
                : `预约 ${data.scheduledAt ? new Date(data.scheduledAt).toLocaleString('zh-CN') : '—'}`}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>费用</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>起步价</span>
            <span className="num">¥{data.fee.base.toFixed(1)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>
              距离费（{(data.distanceMeters / 1000).toFixed(1)} km）
            </span>
            <span className="num">¥{data.fee.distance.toFixed(1)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>超重费</span>
            <span className="num">¥{data.fee.overweight.toFixed(1)}</span>
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
            <span className="num" style={{ color: 'var(--primary)', fontSize: 18 }}>
              ¥{data.fee.total.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <button
        data-testid="confirm-pay-btn"
        className="btn-primary"
        disabled={paying}
        onClick={onPay}
        style={{ width: '100%', padding: '14px 0', fontSize: 16, marginTop: 4 }}
      >
        {paying ? '支付中…' : `确认支付 ¥${data.fee.total.toFixed(1)}`}
      </button>
    </div>
  );
}
