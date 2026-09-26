import { useEffect, useRef } from 'react';

interface Props {
  onComplete: () => void;
}

export default function PayAnimation({ onComplete }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(onComplete, 1200);
    return () => clearTimeout(timerRef.current);
  }, [onComplete]);

  return (
    <div
      data-testid="pay-animation"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 20,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'robexpress-spin 0.8s linear infinite',
        }}
      />
      <div style={{ color: 'var(--text-dim)', fontSize: 14 }}>模拟支付中…</div>
      <style>{`
        @keyframes robexpress-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
