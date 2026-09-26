import type { ItemCategory } from '../../types';

export interface ItemData {
  name: string;
  category: ItemCategory;
  weight: number;
  remark: string;
}

interface Props {
  data: ItemData;
  onChange: (data: ItemData) => void;
}

const CATEGORIES: { value: ItemCategory; label: string }[] = [
  { value: 'document', label: '文件' },
  { value: 'daily', label: '日用品' },
  { value: 'food', label: '食品' },
  { value: 'electronics', label: '电子产品' },
  { value: 'other', label: '其他' },
];

export default function StepItem({ data, onChange }: Props) {
  const update = (patch: Partial<ItemData>) => onChange({ ...data, ...patch });

  return (
    <div data-testid="step-item" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
          物件名称 *
        </label>
        <input
          type="text"
          data-testid="item-name"
          placeholder="如：书籍、外卖、笔记本…"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            fontSize: 14,
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
          类别
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              data-testid={`cat-${cat.value}`}
              style={{
                padding: '8px 14px',
                fontSize: 13,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: data.category === cat.value ? 'var(--primary)' : 'var(--border)',
                background: data.category === cat.value ? 'rgba(34,211,238,0.12)' : 'transparent',
                color: data.category === cat.value ? 'var(--primary)' : 'var(--text-dim)',
                fontWeight: data.category === cat.value ? 600 : 400,
              }}
              onClick={() => update({ category: cat.value })}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
          重量（kg）
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            data-testid="weight-dec"
            className="btn-ghost"
            disabled={data.weight <= 0.5}
            onClick={() => update({ weight: Math.max(0.5, data.weight - 0.5) })}
            style={{ width: 36, height: 36, fontSize: 18, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            −
          </button>
          <span data-testid="weight-value" className="num" style={{ fontSize: 20, fontWeight: 600, minWidth: 60, textAlign: 'center' }}>
            {data.weight.toFixed(1)}
          </span>
          <button
            data-testid="weight-inc"
            className="btn-ghost"
            disabled={data.weight >= 50}
            onClick={() => update({ weight: Math.min(50, data.weight + 0.5) })}
            style={{ width: 36, height: 36, fontSize: 18, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
          备注（选填）
        </label>
        <textarea
          data-testid="item-remark"
          placeholder="如：易碎品、请轻放…"
          value={data.remark}
          onChange={(e) => update({ remark: e.target.value })}
          rows={2}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            fontSize: 14,
            resize: 'vertical',
          }}
        />
      </div>
    </div>
  );
}
