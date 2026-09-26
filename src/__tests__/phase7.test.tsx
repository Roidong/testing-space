import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ToastHost, { showToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import OrderDrawer from '../components/OrderDrawer';
import App from '../App';

// ─── Toast ─────────────────────────────────────────────────

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows toast message when showToast is called', () => {
    render(<ToastHost />);
    act(() => { showToast('测试消息'); });
    expect(screen.getByTestId('toast')).toBeTruthy();
    expect(screen.getByText('测试消息')).toBeTruthy();
  });

  it('hides toast after 2 seconds', () => {
    render(<ToastHost />);
    act(() => { showToast('测试消息'); });
    expect(screen.getByTestId('toast')).toBeTruthy();

    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.queryByTestId('toast')).toBeNull();
  });
});

// ─── ConfirmDialog ─────────────────────────────────────────

describe('ConfirmDialog', () => {
  it('renders title and message', () => {
    render(
      <ConfirmDialog
        title="测试标题"
        message="测试内容"
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByTestId('confirm-dialog')).toBeTruthy();
    expect(screen.getByText('测试标题')).toBeTruthy();
    expect(screen.getByText('测试内容')).toBeTruthy();
  });

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        title="确认"
        message="确定吗？"
        onConfirm={onConfirm}
        onClose={vi.fn()}
      />
    );
    fireEvent.click(screen.getByTestId('confirm-dialog-btn'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onClose when cancel clicked', () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        title="确认"
        message="确定吗？"
        onConfirm={vi.fn()}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByText('取消'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders danger button when danger prop is true', () => {
    render(
      <ConfirmDialog
        title="危险操作"
        message="确认删除？"
        danger
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />
    );
    const btn = screen.getByTestId('confirm-dialog-btn');
    expect(btn.className).toContain('btn-danger');
  });
});

// ─── App integration ───────────────────────────────────────

describe('App integration', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('app-shell')).toBeTruthy();
  });

  it('shows home page by default', () => {
    render(<App />);
    expect(screen.getByTestId('page-home')).toBeTruthy();
  });

  it('navigates to delivery tab', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('tab-delivery'));
    expect(screen.getByTestId('page-delivery')).toBeTruthy();
  });

  it('navigates to profile tab', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('tab-profile'));
    expect(screen.getByTestId('page-profile')).toBeTruthy();
  });

  it('opens wizard from home page send button', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('home-send-btn'));
    expect(screen.getByTestId('wizard-overlay')).toBeTruthy();
  });

  it('opens wizard from delivery page + button', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('tab-delivery'));
    fireEvent.click(screen.getByTestId('open-wizard-btn'));
    expect(screen.getByTestId('wizard-overlay')).toBeTruthy();
  });
});
