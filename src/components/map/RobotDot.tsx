interface Props {
  x: number;
  y: number;
  heading: number;
  label?: string;
}

export default function RobotDot({ x, y, heading, label }: Props) {
  return (
    <g className="robot-dot" transform={`translate(${x}, ${y})`}>
      {/* 光晕 */}
      <circle r={12} fill="#22d3ee" opacity={0.3} />
      {/* 主体 */}
      <circle r={6} fill="#22d3ee" />
      {/* 朝向箭头 */}
      <polygon
        points="0,-10 6,4 0,0 -6,4"
        fill="#22d3ee"
        transform={`rotate(${(heading * 180) / Math.PI})`}
      />
      {label && (
        <text y={-16} textAnchor="middle" fill="#22d3ee" fontSize={10} fontWeight={600}>
          {label}
        </text>
      )}
    </g>
  );
}
