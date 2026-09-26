import { useMemo } from 'react';
import { useApp } from '../store/store';
import StatsCards from '../components/home/StatsCards';
import OrderCard from '../components/home/OrderCard';
import ActivityFeed from '../components/home/ActivityFeed';

interface Props {
  onGoToDelivery?: () => void;
  onOpenWizard?: () => void;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 12) return '上午好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

export default function HomePage({ onGoToDelivery, onOpenWizard }: Props) {
  const orders = useApp((s) => s.orders);
  const profile = useApp((s) => s.profile);

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled'),
    [orders]
  );

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const stats = useMemo(() => {
    const monthOrders = orders.filter((o) => o.createdAt >= monthStart);
    const completed = monthOrders.filter((o) => o.status === 'delivered');
    const spending = completed.reduce((sum, o) => sum + o.fee.total, 0);
    return {
      active: activeOrders.length,
      monthCompleted: completed.length,
      monthSpending: Math.round(spending * 10) / 10,
    };
  }, [orders, activeOrders, monthStart]);

  const nickname = profile.nickname || '同学';

  return (
    <div className="page page--home" data-testid="page-home" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* A: 问候栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {getGreeting()}，{nickname}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            3 台机器人在线
          </div>
        </div>
        <div style={{ fontSize: 24, color: 'var(--primary)' }}>◉</div>
      </div>

      {/* B: 统计卡 */}
      <StatsCards
        activeCount={stats.active}
        monthCompleted={stats.monthCompleted}
        monthSpending={stats.monthSpending}
      />

      {/* C: 进行中订单 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text-dim)' }}>
          进行中订单
        </div>
        {activeOrders.length === 0 ? (
          <div
            className="card"
            data-testid="home-empty-state"
            style={{ padding: 32, textAlign: 'center' }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
            <div style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 12 }}>
              暂无进行中的订单
            </div>
            <button
              className="btn-primary"
              data-testid="home-empty-send-btn"
              onClick={onOpenWizard}
            >
              发第一单
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => onGoToDelivery?.()}
              />
            ))}
          </div>
        )}
      </div>

      {/* D: 快捷按钮 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button
          className="btn-primary"
          data-testid="home-send-btn"
          onClick={onOpenWizard}
          style={{ padding: '14px 0', fontSize: 14 }}
        >
          立即发件
        </button>
        <button
          className="btn-ghost"
          data-testid="home-map-btn"
          onClick={onGoToDelivery}
          style={{ padding: '14px 0', fontSize: 14 }}
        >
          全屏地图
        </button>
      </div>

      {/* E: 最近动态 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text-dim)' }}>
          最近动态
        </div>
        <div className="card" style={{ padding: '4px 14px' }}>
          <ActivityFeed orders={orders} maxItems={5} />
        </div>
      </div>
    </div>
  );
}
