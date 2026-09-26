import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppShell from '../components/AppShell';

const defaultProps = {
  tab: 'home' as const,
  onTabChange: () => {},
  onOpenWizard: () => {},
  onGoToDelivery: () => {},
};

describe('Phase 0: AppShell', () => {
  it('renders header with brand and status', () => {
    render(<AppShell {...defaultProps} />);
    expect(screen.getByText('校园 RoboExpress')).toBeInTheDocument();
    expect(screen.getByText('3台在线')).toBeInTheDocument();
  });

  it('renders 3 mobile tabs', () => {
    render(<AppShell {...defaultProps} />);
    expect(screen.getByTestId('tab-home')).toBeInTheDocument();
    expect(screen.getByTestId('tab-delivery')).toBeInTheDocument();
    expect(screen.getByTestId('tab-profile')).toBeInTheDocument();
  });

  it('renders 3 desktop nav items', () => {
    render(<AppShell {...defaultProps} />);
    expect(screen.getByTestId('sidenav-home')).toBeInTheDocument();
    expect(screen.getByTestId('sidenav-delivery')).toBeInTheDocument();
    expect(screen.getByTestId('sidenav-profile')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    render(<AppShell {...defaultProps} tab="delivery" />);
    const deliveryTab = screen.getByTestId('tab-delivery');
    expect(deliveryTab.className).toContain('tab-bar__item--active');
    const homeTab = screen.getByTestId('tab-home');
    expect(homeTab.className).not.toContain('tab-bar__item--active');
  });

  it('calls onTabChange when a tab is clicked', () => {
    const handler = vi.fn();
    render(<AppShell {...defaultProps} onTabChange={handler} />);
    fireEvent.click(screen.getByTestId('tab-delivery'));
    expect(handler).toHaveBeenCalledWith('delivery');
  });

  it('renders the correct page for each tab', () => {
    const { rerender } = render(<AppShell {...defaultProps} tab="home" />);
    expect(screen.getByTestId('page-home')).toBeInTheDocument();

    rerender(<AppShell {...defaultProps} tab="delivery" />);
    expect(screen.getByTestId('page-delivery')).toBeInTheDocument();

    rerender(<AppShell {...defaultProps} tab="profile" />);
    expect(screen.getByTestId('page-profile')).toBeInTheDocument();
  });
});
