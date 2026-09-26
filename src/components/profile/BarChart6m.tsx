interface MonthData {
  label: string;
  amount: number;
  count: number;
}

interface Props {
  data: MonthData[];
}

export default function BarChart6m({ data }: Props) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const barWidth = 100 / data.length;

  return (
    <div data-testid="bar-chart-6m" style={{ padding: '12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 120, gap: 4 }}>
        {data.map((d, i) => {
          const h = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0;
          return (
            <div
              key={i}
              data-testid={`bar-${i}`}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <div
                style={{
                  width: '60%',
                  maxWidth: 32,
                  height: `${Math.max(h, 2)}%`,
                  background: d.amount > 0 ? 'var(--primary)' : 'var(--border)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s',
                  minHeight: 2,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
            {d.label}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-dim)' }} className="num">
            {d.amount > 0 ? `¥${d.amount.toFixed(0)}` : ''}
          </div>
        ))}
      </div>
    </div>
  );
}
