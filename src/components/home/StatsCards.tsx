interface Props {
  activeCount: number;
  monthCompleted: number;
  monthSpending: number;
}

export default function StatsCards({ activeCount, monthCompleted, monthSpending }: Props) {
  const cards = [
    { label: '进行中', value: activeCount, unit: '单', color: 'var(--primary)' },
    { label: '本月完成', value: monthCompleted, unit: '单', color: 'var(--success)' },
    { label: '本月消费', value: monthSpending, unit: '¥', color: 'var(--warning)' },
  ];

  return (
    <div data-testid="stats-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {cards.map((card) => (
        <div key={card.label} className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6 }}>{card.label}</div>
          <div className="num" style={{ fontSize: 22, fontWeight: 700, color: card.color }}>
            {card.unit === '¥' ? '¥' : ''}
            {card.value}
            {card.unit !== '¥' ? card.unit : ''}
          </div>
        </div>
      ))}
    </div>
  );
}
