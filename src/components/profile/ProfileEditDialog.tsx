import { useState } from 'react';
import type { Profile } from '../../types';
import { getStop } from '../../data/locations';
import StopPicker from '../wizard/StopPicker';

interface Props {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onClose: () => void;
}

export default function ProfileEditDialog({ profile, onSave, onClose }: Props) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [phone, setPhone] = useState(profile.phone);
  const [defaultStopId, setDefaultStopId] = useState(profile.defaultStopId ?? '');
  const [defaultDetail, setDefaultDetail] = useState(profile.defaultDetail ?? '');

  const handleSave = () => {
    onSave({ nickname, phone, defaultStopId: defaultStopId || undefined, defaultDetail: defaultDetail || undefined });
    onClose();
  };

  const defaultStop = defaultStopId ? getStop(defaultStopId) : undefined;

  return (
    <div
      data-testid="profile-edit-dialog"
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
        style={{ width: '100%', maxWidth: 420, padding: 20, maxHeight: '80vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>编辑资料</span>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--text-dim)' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>昵称</label>
            <input
              type="text"
              data-testid="edit-nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>电话</label>
            <input
              type="tel"
              data-testid="edit-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>默认停靠点</label>
            <StopPicker value={defaultStopId} onChange={setDefaultStopId} label="" />
            {defaultStop && (
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                已选：{defaultStop.name}
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>默认详细地址</label>
            <input
              type="text"
              data-testid="edit-default-detail"
              value={defaultDetail}
              onChange={(e) => setDefaultDetail(e.target.value)}
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

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1, padding: '10px 0' }}>
            取消
          </button>
          <button
            className="btn-primary"
            data-testid="edit-save-btn"
            onClick={handleSave}
            style={{ flex: 1, padding: '10px 0' }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
