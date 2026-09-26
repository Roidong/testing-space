import { useState, useMemo, useCallback } from 'react';
import type { ItemCategory, TimeType, FeeBreakdown } from '../../types';
import { shortestPath } from '../../data/roadnet';
import { quoteFee } from '../../lib/pricing';
import { createOrder } from '../../store/store';
import StepItem from './StepItem';
import type { ItemData } from './StepItem';
import StepAddress from './StepAddress';
import type { AddressData } from './StepAddress';
import StepTimeFee from './StepTimeFee';
import StepConfirm from './StepConfirm';
import PayAnimation from './PayAnimation';

interface Props {
  onClose: () => void;
  onOrderCreated?: (orderId: string) => void;
}

const STEP_LABELS = ['物件', '地址', '时间费用', '确认'];

export default function WizardShell({ onClose, onOrderCreated }: Props) {
  const [step, setStep] = useState(0);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  const [item, setItem] = useState<ItemData>({
    name: '',
    category: 'document' as ItemCategory,
    weight: 1.0,
    remark: '',
  });

  const [sender, setSender] = useState<AddressData>({
    stopId: '',
    detailAddress: '',
    phone: '',
  });

  const [receiver, setReceiver] = useState<AddressData>({
    stopId: '',
    detailAddress: '',
    phone: '',
  });

  const [timeType, setTimeType] = useState<TimeType>('immediate');
  const [scheduledAt, setScheduledAt] = useState('');

  const route = useMemo(() => {
    if (!sender.stopId || !receiver.stopId) return null;
    return shortestPath(sender.stopId, receiver.stopId);
  }, [sender.stopId, receiver.stopId]);

  const fee: FeeBreakdown | null = useMemo(() => {
    if (!route) return null;
    return quoteFee(route.meters, item.weight);
  }, [route, item.weight]);

  const distanceMeters = route?.meters ?? 0;

  const canNext = useCallback(() => {
    if (step === 0) return item.name.trim().length > 0;
    if (step === 1) return sender.stopId !== '' && receiver.stopId !== '';
    if (step === 2) {
      if (timeType === 'scheduled') return scheduledAt !== '' && fee !== null;
      return fee !== null;
    }
    return false;
  }, [step, item.name, sender.stopId, receiver.stopId, timeType, scheduledAt, fee]);

  const handleSwap = () => {
    const tmp = sender;
    setSender(receiver);
    setReceiver(tmp);
  };

  const handlePay = () => {
    setPaying(true);
  };

  const handlePayComplete = useCallback(() => {
    const scheduledTs = timeType === 'scheduled' && scheduledAt ? new Date(scheduledAt).getTime() : undefined;

    const order = createOrder({
      item: {
        name: item.name,
        category: item.category,
        weight: item.weight,
        remark: item.remark || undefined,
      },
      sender: {
        stopId: sender.stopId,
        detailAddress: sender.detailAddress,
        phone: sender.phone || undefined,
      },
      receiver: {
        stopId: receiver.stopId,
        detailAddress: receiver.detailAddress,
        phone: receiver.phone || undefined,
      },
      timeType,
      scheduledAt: scheduledTs,
    });

    setCreatedOrderId(order.id);
    setSuccess(true);
    onOrderCreated?.(order.id);
  }, [item, sender, receiver, timeType, scheduledAt, onOrderCreated]);

  if (success) {
    return (
      <div
        className="wizard-overlay"
        data-testid="wizard-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        <div style={{ fontSize: 48 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>下单成功</div>
        <div style={{ color: 'var(--text-dim)', fontSize: 14 }}>
          订单号：<span className="num">{createdOrderId}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button className="btn-ghost" onClick={onClose}>
            返回首页
          </button>
          <button className="btn-primary" onClick={() => onClose()}>
            立即追踪
          </button>
        </div>
      </div>
    );
  }

  if (paying) {
    return (
      <div
        className="wizard-overlay"
        data-testid="wizard-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'var(--bg)',
        }}
      >
        <PayAnimation onComplete={handlePayComplete} />
      </div>
    );
  }

  return (
    <div
      className="wizard-overlay"
      data-testid="wizard-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <button
          data-testid="wizard-back"
          onClick={step === 0 ? onClose : () => setStep(step - 1)}
          style={{ fontSize: 18, padding: '4px 8px', color: 'var(--text-dim)' }}
        >
          {step === 0 ? '✕' : '←'}
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
          {STEP_LABELS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  background: i <= step ? 'var(--primary)' : 'var(--border)',
                  color: i <= step ? '#0b1220' : 'var(--text-muted)',
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: i <= step ? 'var(--text)' : 'var(--text-muted)',
                }}
              >
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div
                  style={{
                    width: 20,
                    height: 1,
                    background: i < step ? 'var(--primary)' : 'var(--border)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div style={{ width: 30 }} />
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {step === 0 && <StepItem data={item} onChange={setItem} />}
        {step === 1 && (
          <StepAddress
            sender={sender}
            receiver={receiver}
            onSenderChange={setSender}
            onReceiverChange={setReceiver}
            onSwap={handleSwap}
          />
        )}
        {step === 2 && (
          <StepTimeFee
            timeType={timeType}
            scheduledAt={scheduledAt}
            fee={fee}
            distanceMeters={distanceMeters}
            onTimeTypeChange={setTimeType}
            onScheduledAtChange={setScheduledAt}
          />
        )}
        {step === 3 &&
          fee && (
            <StepConfirm
              data={{
                item,
                sender,
                receiver,
                timeType,
                scheduledAt,
                fee,
                distanceMeters,
              }}
              onPay={handlePay}
              paying={paying}
            />
          )}
      </div>

      {/* Next button (not shown on last step which has its own pay button) */}
      {step < 3 && (
        <div
          style={{
            padding: '12px 20px 20px',
            borderTop: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <button
            data-testid="wizard-next"
            className="btn-primary"
            disabled={!canNext()}
            onClick={() => setStep(step + 1)}
            style={{ width: '100%', padding: '12px 0', fontSize: 15 }}
          >
            下一步
          </button>
        </div>
      )}
    </div>
  );
}
