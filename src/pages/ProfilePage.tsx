import { useState, useMemo } from 'react';
import { useApp, updateProfile, updateSettings, clearAll } from '../store/store';
import { getStop } from '../data/locations';
import type { Profile, Settings } from '../types';
import BarChart6m from '../components/profile/BarChart6m';
import TaskTabs from '../components/profile/TaskTabs';
import ProfileEditDialog from '../components/profile/ProfileEditDialog';
import ClearDataDialog from '../components/profile/ClearDataDialog';

export default function ProfilePage() {
  const profile = useApp((s) => s.profile);
  const orders = useApp((s) => s.orders);
  const settings = useApp((s) => s.settings);

  const [editOpen, setEditOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  const stats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter((o) => o.status === 'delivered').length;
    const totalSpending = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + o.fee.total, 0);
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, totalSpending: Math.round(totalSpending * 10) / 10, rate };
  }, [orders]);

  const chartData = useMemo(() => {
    const now = new Date();
    const months: { label: string; amount: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = d.getTime();
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
      const monthOrders = orders.filter(
        (o) => o.status === 'delivered' && o.createdAt >= monthStart && o.createdAt < monthEnd
      );
      const amount = monthOrders.reduce((sum, o) => sum + o.fee.total, 0);
      months.push({
        label: `${d.getMonth() + 1}月`,
        amount: Math.round(amount * 10) / 10,
        count: monthOrders.length,
      });
    }
    return months;
  }, [orders]);

  const defaultStop = profile.defaultStopId ? getStop(profile.defaultStopId) : undefined;

  const cycleSpeed = () => {
    const speeds: Settings['speedMultiplier'][] = [10, 20, 60];
    const idx = speeds.indexOf(settings.speedMultiplier);
    const next = speeds[(idx + 1) % speeds.length];
    updateSettings({ speedMultiplier: next });
  };

  return (
    <div className="page page--profile" data-testid="page-profile" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 个人资料卡 */}
      <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          👤
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{profile.nickname || '未设置'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            {profile.phone || '未设置电话'}
            {defaultStop && ` · ${defaultStop.name}`}
          </div>
        </div>
        <button
          className="btn-ghost"
          data-testid="edit-profile-btn"
          onClick={() => setEditOpen(true)}
          style={{ fontSize: 12, padding: '6px 12px' }}
        >
          编辑
        </button>
      </div>

      {/* 累计统计 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <div className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>累计消费</div>
          <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'var(--warning)' }}>
            ¥{stats.totalSpending}
          </div>
        </div>
        <div className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>总单数</div>
          <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
            {stats.total}
          </div>
        </div>
        <div className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>完成率</div>
          <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>
            {stats.rate}%
          </div>
        </div>
      </div>

      {/* 近 6 月消费柱状图 */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-dim)' }}>
          近 6 个月消费
        </div>
        <BarChart6m data={chartData} />
      </div>

      {/* 任务列表 */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-dim)' }}>
          订单归档
        </div>
        <TaskTabs orders={orders} />
      </div>

      {/* 设置 */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 600, padding: '14px 16px 8px', color: 'var(--text-dim)' }}>
          设置
        </div>
        <button
          data-testid="settings-edit-profile"
          onClick={() => setEditOpen(true)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '12px 16px',
            fontSize: 13,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span>编辑资料</span>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </button>
        <button
          data-testid="settings-speed"
          onClick={cycleSpeed}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '12px 16px',
            fontSize: 13,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span>模拟速度</span>
          <span className="num" style={{ color: 'var(--primary)' }}>×{settings.speedMultiplier}</span>
        </button>
        <button
          data-testid="settings-clear"
          onClick={() => setClearOpen(true)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            padding: '12px 16px',
            fontSize: 13,
            color: 'var(--danger)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span>清空全部数据</span>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
        </button>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 16px',
            fontSize: 13,
            color: 'var(--text-dim)',
          }}
        >
          <span>关于</span>
          <span style={{ color: 'var(--text-muted)' }}>v1.0</span>
        </div>
      </div>

      {/* 弹窗 */}
      {editOpen && (
        <ProfileEditDialog
          profile={profile}
          onSave={(p: Profile) => updateProfile(p)}
          onClose={() => setEditOpen(false)}
        />
      )}
      {clearOpen && (
        <ClearDataDialog
          onConfirm={() => clearAll()}
          onClose={() => setClearOpen(false)}
        />
      )}
    </div>
  );
}
