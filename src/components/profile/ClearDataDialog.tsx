import { useState } from 'react';

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export default function ClearDataDialog({ onConfirm, onClose }: Props) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div
      data-testid="clear-data-dialog"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: 360, padding: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>清空全部数据</div>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 16, lineHeight: 1.6 }}>
          此操作将清除所有订单、统计和个人资料，且不可恢复。
        </div>

        <label
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}
        >
          <input
            type="checkbox"
            data-testid="clear-acknowledge-checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            style={{ accentColor: 'var(--primary)' }}
          />
          我已知悉，确认清空
        </label>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1, padding: '10px 0' }}>
            取消
          </button>
          <button
            className="btn-danger"
            data-testid="clear-confirm-btn"
            disabled={!acknowledged}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ flex: 1, padding: '10px 0' }}
          >
            确认清空
          </button>
        </div>
      </div>
    </div>
  );
}
