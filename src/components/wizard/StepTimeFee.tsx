import type { TimeType } from '../../types';
import type { FeeBreakdown } from '../../types';
import FeePanel from './FeePanel';

interface Props {
  timeType: TimeType;
  scheduledAt: string;
  fee: FeeBreakdown | null;
  distanceMeters: number;
  onTimeTypeChange: (t: TimeType) => void;
  onScheduledAtChange: (v: string) => void;
}

export default function StepTimeFee({
  timeType,
  scheduledAt,
  fee,
  distanceMeters,
  onTimeTypeChange,
  onScheduledAtChange,
}: Props) {
  return (
    <div data-testid="step-time-fee" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>
          配送时间
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            data-testid="time-immediate"
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: 14,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid',
              borderColor: timeType === 'immediate' ? 'var(--primary)' : 'var(--border)',
              background: timeType === 'immediate' ? 'rgba(34,211,238,0.12)' : 'transparent',
              color: timeType === 'immediate' ? 'var(--primary)' : 'var(--text-dim)',
              fontWeight: timeType === 'immediate' ? 600 : 400,
            }}
            onClick={() => onTimeTypeChange('immediate')}
          >
            立即配送
          </button>
          <button
            data-testid="time-scheduled"
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: 14,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid',
              borderColor: timeType === 'scheduled' ? 'var(--primary)' : 'var(--border)',
              background: timeType === 'scheduled' ? 'rgba(34,211,238,0.12)' : 'transparent',
              color: timeType === 'scheduled' ? 'var(--primary)' : 'var(--text-dim)',
              fontWeight: timeType === 'scheduled' ? 600 : 400,
            }}
            onClick={() => onTimeTypeChange('scheduled')}
          >
            预约时间
          </button>
        </div>

        {timeType === 'scheduled' && (
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
              预约时间 *
            </label>
            <input
              type="datetime-local"
              data-testid="scheduled-datetime"
              value={scheduledAt}
              onChange={(e) => onScheduledAtChange(e.target.value)}
              min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                fontSize: 14,
                colorScheme: 'dark',
              }}
            />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>
          路线距离：
          <span className="num" style={{ color: 'var(--text)' }}>
            {distanceMeters > 0 ? `${(distanceMeters / 1000).toFixed(1)} km` : '—'}
          </span>
        </div>
        <FeePanel fee={fee} distanceMeters={distanceMeters} />
      </div>
    </div>
  );
}
