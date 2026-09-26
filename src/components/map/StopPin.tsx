import type { Stop } from '../../types';

interface Props {
  stop: Stop;
  isSender?: boolean;
  isReceiver?: boolean;
  onClick?: () => void;
}

export default function StopPin({ stop, isSender, isReceiver, onClick }: Props) {
  const color = isSender ? '#3b82f6' : isReceiver ? '#34d399' : '#64748b';

  return (
    <g
      className="stop-pin"
      transform={`translate(${stop.x}, ${stop.y})`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <circle r={8} fill={color} opacity={0.8} />
      <circle r={4} fill="#fff" />
      {isSender && (
        <text y={-12} textAnchor="middle" fill="#3b82f6" fontSize={10} fontWeight={600}>
          发
        </text>
      )}
      {isReceiver && (
        <text y={-12} textAnchor="middle" fill="#34d399" fontSize={10} fontWeight={600}>
          收
        </text>
      )}
    </g>
  );
}
