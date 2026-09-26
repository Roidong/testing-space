import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepItem from '../components/wizard/StepItem';
import type { ItemData } from '../components/wizard/StepItem';
import StepAddress from '../components/wizard/StepAddress';
import type { AddressData } from '../components/wizard/StepAddress';
import StopPicker from '../components/wizard/StopPicker';
import StepTimeFee from '../components/wizard/StepTimeFee';
import FeePanel from '../components/wizard/FeePanel';
import StepConfirm from '../components/wizard/StepConfirm';
import WizardShell from '../components/wizard/WizardShell';
import PayAnimation from '../components/wizard/PayAnimation';
import { quoteFee } from '../lib/pricing';
import * as store from '../store/store';

// ─── FeePanel ──────────────────────────────────────────────

describe('FeePanel', () => {
  it('shows placeholder when no fee', () => {
    render(<FeePanel fee={null} distanceMeters={0} />);
    expect(screen.getByText(/请选择发件和收件地址/)).toBeTruthy();
  });

  it('renders fee breakdown correctly', () => {
    const fee = quoteFee(1800, 2.0); // 1.8km, 2kg → 3 + 1.8 + 0 = 4.8
    render(<FeePanel fee={fee} distanceMeters={1800} />);
    expect(screen.getByText('¥3.0')).toBeTruthy();
    expect(screen.getByText('¥1.8')).toBeTruthy();
    expect(screen.getByText('¥0.0')).toBeTruthy();
    expect(screen.getByText('¥4.8')).toBeTruthy();
  });

  it('shows overweight fee when applicable', () => {
    const fee = quoteFee(1000, 8.0); // 1km, 8kg → 3 + 1 + 3 = 7
    render(<FeePanel fee={fee} distanceMeters={1000} />);
    const items = screen.getAllByText('¥3.0');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });
});

// ─── StepItem ──────────────────────────────────────────────

describe('StepItem', () => {
  const defaultItem: ItemData = { name: '', category: 'document', weight: 1.0, remark: '' };

  it('renders all fields', () => {
    const onChange = vi.fn();
    render(<StepItem data={defaultItem} onChange={onChange} />);
    expect(screen.getByTestId('step-item')).toBeTruthy();
    expect(screen.getByTestId('item-name')).toBeTruthy();
    expect(screen.getByTestId('weight-value').textContent).toBe('1.0');
    expect(screen.getByTestId('cat-document')).toBeTruthy();
    expect(screen.getByTestId('cat-daily')).toBeTruthy();
    expect(screen.getByTestId('cat-food')).toBeTruthy();
    expect(screen.getByTestId('cat-electronics')).toBeTruthy();
    expect(screen.getByTestId('cat-other')).toBeTruthy();
  });

  it('calls onChange when name is typed', async () => {
    const onChange = vi.fn();
    render(<StepItem data={defaultItem} onChange={onChange} />);
    const input = screen.getByTestId('item-name');
    fireEvent.change(input, { target: { value: '书籍' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: '书籍' }));
  });

  it('calls onChange when category is selected', () => {
    const onChange = vi.fn();
    render(<StepItem data={defaultItem} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('cat-food'));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ category: 'food' }));
  });

  it('increments and decrements weight', () => {
    const onChange = vi.fn();
    render(<StepItem data={{ ...defaultItem, weight: 2.0 }} onChange={onChange} />);

    fireEvent.click(screen.getByTestId('weight-inc'));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ weight: 2.5 }));

    fireEvent.click(screen.getByTestId('weight-dec'));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ weight: 1.5 }));
  });

  it('disables decrement at 0.5', () => {
    const onChange = vi.fn();
    render(<StepItem data={{ ...defaultItem, weight: 0.5 }} onChange={onChange} />);
    expect(screen.getByTestId('weight-dec')).toBeDisabled();
  });
});

// ─── StopPicker ────────────────────────────────────────────

describe('StopPicker', () => {
  it('renders zone groups when no search query', () => {
    const onChange = vi.fn();
    render(<StopPicker value="" onChange={onChange} label="选择停靠点" />);
    expect(screen.getByTestId('stop-chip-D8')).toBeTruthy();
    expect(screen.getByTestId('stop-chip-C2')).toBeTruthy();
    expect(screen.getByTestId('stop-chip-GATE_N')).toBeTruthy();
  });

  it('filters stops when searching', () => {
    const onChange = vi.fn();
    render(<StopPicker value="" onChange={onChange} label="选择停靠点" />);
    const input = screen.getByTestId('stop-picker-input');
    fireEvent.change(input, { target: { value: '图书馆' } });
    expect(screen.getByTestId('stop-picker-results')).toBeTruthy();
    expect(screen.getByTestId('stop-option-C2')).toBeTruthy();
  });

  it('calls onChange when a stop is selected', () => {
    const onChange = vi.fn();
    render(<StopPicker value="" onChange={onChange} label="选择停靠点" />);
    fireEvent.click(screen.getByTestId('stop-chip-D8'));
    expect(onChange).toHaveBeenCalledWith('D8');
  });

  it('calls onChange when search result is selected', () => {
    const onChange = vi.fn();
    render(<StopPicker value="" onChange={onChange} label="选择停靠点" />);
    fireEvent.change(screen.getByTestId('stop-picker-input'), { target: { value: 'D12' } });
    fireEvent.click(screen.getByTestId('stop-option-D12'));
    expect(onChange).toHaveBeenCalledWith('D12');
  });
});

// ─── StepAddress ───────────────────────────────────────────

describe('StepAddress', () => {
  const defaultSender: AddressData = { stopId: '', detailAddress: '', phone: '' };
  const defaultReceiver: AddressData = { stopId: '', detailAddress: '', phone: '' };

  it('renders sender and receiver cards', () => {
    render(
      <StepAddress
        sender={defaultSender}
        receiver={defaultReceiver}
        onSenderChange={vi.fn()}
        onReceiverChange={vi.fn()}
        onSwap={vi.fn()}
      />
    );
    expect(screen.getByTestId('step-address')).toBeTruthy();
    expect(screen.getByTestId('swap-addresses')).toBeTruthy();
    expect(screen.getByTestId('sender-detail')).toBeTruthy();
    expect(screen.getByTestId('receiver-detail')).toBeTruthy();
  });

  it('calls onSwap when swap button is clicked', () => {
    const onSwap = vi.fn();
    render(
      <StepAddress
        sender={defaultSender}
        receiver={defaultReceiver}
        onSenderChange={vi.fn()}
        onReceiverChange={vi.fn()}
        onSwap={onSwap}
      />
    );
    fireEvent.click(screen.getByTestId('swap-addresses'));
    expect(onSwap).toHaveBeenCalled();
  });

  it('calls onSenderChange when sender detail is typed', () => {
    const onSenderChange = vi.fn();
    render(
      <StepAddress
        sender={defaultSender}
        receiver={defaultReceiver}
        onSenderChange={onSenderChange}
        onReceiverChange={vi.fn()}
        onSwap={vi.fn()}
      />
    );
    fireEvent.change(screen.getByTestId('sender-detail'), { target: { value: 'D12-503' } });
    expect(onSenderChange).toHaveBeenCalledWith(expect.objectContaining({ detailAddress: 'D12-503' }));
  });
});

// ─── StepTimeFee ───────────────────────────────────────────

describe('StepTimeFee', () => {
  const fee = quoteFee(1800, 2.0);

  it('renders immediate and scheduled options', () => {
    render(
      <StepTimeFee
        timeType="immediate"
        scheduledAt=""
        fee={fee}
        distanceMeters={1800}
        onTimeTypeChange={vi.fn()}
        onScheduledAtChange={vi.fn()}
      />
    );
    expect(screen.getByTestId('step-time-fee')).toBeTruthy();
    expect(screen.getByTestId('time-immediate')).toBeTruthy();
    expect(screen.getByTestId('time-scheduled')).toBeTruthy();
  });

  it('shows datetime picker when scheduled is selected', () => {
    render(
      <StepTimeFee
        timeType="scheduled"
        scheduledAt=""
        fee={fee}
        distanceMeters={1800}
        onTimeTypeChange={vi.fn()}
        onScheduledAtChange={vi.fn()}
      />
    );
    expect(screen.getByTestId('scheduled-datetime')).toBeTruthy();
  });

  it('hides datetime picker when immediate is selected', () => {
    render(
      <StepTimeFee
        timeType="immediate"
        scheduledAt=""
        fee={fee}
        distanceMeters={1800}
        onTimeTypeChange={vi.fn()}
        onScheduledAtChange={vi.fn()}
      />
    );
    expect(screen.queryByTestId('scheduled-datetime')).toBeNull();
  });

  it('displays distance', () => {
    render(
      <StepTimeFee
        timeType="immediate"
        scheduledAt=""
        fee={fee}
        distanceMeters={1800}
        onTimeTypeChange={vi.fn()}
        onScheduledAtChange={vi.fn()}
      />
    );
    expect(screen.getByText('1.8 km')).toBeTruthy();
  });
});

// ─── StepConfirm ───────────────────────────────────────────

describe('StepConfirm', () => {
  const summaryData = {
    item: { name: '书籍', category: 'document', weight: 2.0, remark: '' },
    sender: { stopId: 'D12', detailAddress: 'D12-503', phone: '' },
    receiver: { stopId: 'C2', detailAddress: '图书馆前台', phone: '' },
    timeType: 'immediate' as const,
    scheduledAt: '',
    fee: quoteFee(1800, 2.0),
    distanceMeters: 1800,
  };

  it('renders order summary', () => {
    render(<StepConfirm data={summaryData} onPay={vi.fn()} paying={false} />);
    expect(screen.getByTestId('step-confirm')).toBeTruthy();
    expect(screen.getByTestId('confirm-item-name').textContent).toBe('书籍');
    expect(screen.getByTestId('confirm-pay-btn')).toBeTruthy();
  });

  it('calls onPay when pay button clicked', () => {
    const onPay = vi.fn();
    render(<StepConfirm data={summaryData} onPay={onPay} paying={false} />);
    fireEvent.click(screen.getByTestId('confirm-pay-btn'));
    expect(onPay).toHaveBeenCalled();
  });

  it('disables pay button when paying', () => {
    render(<StepConfirm data={summaryData} onPay={vi.fn()} paying={true} />);
    expect(screen.getByTestId('confirm-pay-btn')).toBeDisabled();
  });
});

// ─── PayAnimation ──────────────────────────────────────────

describe('PayAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders animation and calls onComplete after 1200ms', () => {
    const onComplete = vi.fn();
    render(<PayAnimation onComplete={onComplete} />);
    expect(screen.getByTestId('pay-animation')).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1200);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

// ─── WizardShell ───────────────────────────────────────────

describe('WizardShell', () => {
  it('renders step 1 (item) initially', () => {
    render(<WizardShell onClose={vi.fn()} />);
    expect(screen.getByTestId('wizard-page')).toBeTruthy();
    expect(screen.getByTestId('step-item')).toBeTruthy();
  });

  it('cannot advance without item name', () => {
    render(<WizardShell onClose={vi.fn()} />);
    const nextBtn = screen.getByTestId('wizard-next');
    expect(nextBtn).toBeDisabled();
  });

  it('advances to step 2 after entering item name', () => {
    render(<WizardShell onClose={vi.fn()} />);
    fireEvent.change(screen.getByTestId('item-name'), { target: { value: '书籍' } });
    fireEvent.click(screen.getByTestId('wizard-next'));
    expect(screen.getByTestId('step-address')).toBeTruthy();
  });

  it('cannot advance from step 2 without addresses', () => {
    render(<WizardShell onClose={vi.fn()} />);
    fireEvent.change(screen.getByTestId('item-name'), { target: { value: '书籍' } });
    fireEvent.click(screen.getByTestId('wizard-next'));
    expect(screen.getByTestId('wizard-next')).toBeDisabled();
  });

  it('goes back when back button is clicked', () => {
    render(<WizardShell onClose={vi.fn()} />);
    fireEvent.change(screen.getByTestId('item-name'), { target: { value: '书籍' } });
    fireEvent.click(screen.getByTestId('wizard-next'));
    expect(screen.getByTestId('step-address')).toBeTruthy();

    fireEvent.click(screen.getByTestId('wizard-back'));
    expect(screen.getByTestId('step-item')).toBeTruthy();
  });

  it('closes when close button is clicked on step 0', () => {
    const onClose = vi.fn();
    render(<WizardShell onClose={onClose} />);
    fireEvent.click(screen.getByTestId('wizard-back'));
    expect(onClose).toHaveBeenCalled();
  });

  it('full flow creates an order', async () => {
    vi.useFakeTimers();
    const createSpy = vi.spyOn(store, 'createOrder');
    render(<WizardShell onClose={vi.fn()} />);

    // Step 1: item
    fireEvent.change(screen.getByTestId('item-name'), { target: { value: '书籍' } });
    fireEvent.click(screen.getByTestId('wizard-next'));

    // Step 2: addresses - select stops
    const senderChips = screen.getAllByTestId('stop-chip-D12');
    fireEvent.click(senderChips[0]);
    const receiverChips = screen.getAllByTestId('stop-chip-C2');
    fireEvent.click(receiverChips[1]);

    fireEvent.click(screen.getByTestId('wizard-next'));

    // Step 3: time & fee
    fireEvent.click(screen.getByTestId('wizard-next'));

    // Step 4: confirm
    fireEvent.click(screen.getByTestId('confirm-pay-btn'));

    // Advance timers to trigger PayAnimation's setTimeout (1200ms)
    await vi.advanceTimersByTimeAsync(1500);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        item: expect.objectContaining({ name: '书籍' }),
      })
    );

    vi.useRealTimers();
  });
});
