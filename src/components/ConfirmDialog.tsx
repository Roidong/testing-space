import { useState } from 'react';

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({ title, message, confirmLabel = '确认', danger = false, onConfirm, onClose }: Props) {
  return (
    <div
      data-testid="confirm-dialog"
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
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20, lineHeight: 1.6 }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1, padding: '10px 0' }}>
            取消
          </button>
          <button
            data-testid="confirm-dialog-btn"
            className={danger ? 'btn-danger' : 'btn-primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ flex: 1, padding: '10px 0' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
