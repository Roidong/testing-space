import StopPicker from './StopPicker';

export interface AddressData {
  stopId: string;
  detailAddress: string;
  phone: string;
}

interface Props {
  sender: AddressData;
  receiver: AddressData;
  onSenderChange: (data: AddressData) => void;
  onReceiverChange: (data: AddressData) => void;
  onSwap: () => void;
}

export default function StepAddress({ sender, receiver, onSenderChange, onReceiverChange, onSwap }: Props) {
  return (
    <div data-testid="step-address" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>发件地址</span>
          <button
            data-testid="swap-addresses"
            onClick={onSwap}
            style={{
              fontSize: 16,
              padding: '4px 8px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-dim)',
            }}
            title="互换发件与收件地址"
          >
            ⇄
          </button>
        </div>
        <StopPicker
          value={sender.stopId}
          onChange={(stopId) => onSenderChange({ ...sender, stopId })}
          label="选择发件停靠点 *"
        />
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
            详细地址
          </label>
          <input
            type="text"
            data-testid="sender-detail"
            placeholder="如：D12-503"
            value={sender.detailAddress}
            onChange={(e) => onSenderChange({ ...sender, detailAddress: e.target.value })}
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
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
            联系电话（选填）
          </label>
          <input
            type="tel"
            data-testid="sender-phone"
            placeholder="手机号码"
            value={sender.phone}
            onChange={(e) => onSenderChange({ ...sender, phone: e.target.value })}
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
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', marginBottom: 12 }}>
          收件地址
        </div>
        <StopPicker
          value={receiver.stopId}
          onChange={(stopId) => onReceiverChange({ ...receiver, stopId })}
          label="选择收件停靠点 *"
        />
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
            详细地址
          </label>
          <input
            type="text"
            data-testid="receiver-detail"
            placeholder="如：C2-图书馆前台"
            value={receiver.detailAddress}
            onChange={(e) => onReceiverChange({ ...receiver, detailAddress: e.target.value })}
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
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>
            联系电话（选填）
          </label>
          <input
            type="tel"
            data-testid="receiver-phone"
            placeholder="手机号码"
            value={receiver.phone}
            onChange={(e) => onReceiverChange({ ...receiver, phone: e.target.value })}
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
      </div>
    </div>
  );
}
