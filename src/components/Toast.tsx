import { useState, useCallback, useRef, useEffect } from 'react';

let showFn: ((msg: string) => void) | null = null;

export function showToast(msg: string) {
  showFn?.(msg);
}

export default function ToastHost() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2000);
  }, []);

  useEffect(() => {
    showFn = show;
    return () => { showFn = null; };
  }, [show]);

  if (!visible) return null;

  return (
    <div
      data-testid="toast"
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 20px',
        fontSize: 13,
        color: 'var(--text)',
        zIndex: 500,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        animation: 'robexpress-toast-in 0.2s ease-out',
      }}
    >
      {message}
      <style>{`
        @keyframes robexpress-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
