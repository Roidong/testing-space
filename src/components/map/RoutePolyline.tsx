import type { RoutePath } from '../../types';

interface Props {
  route: RoutePath;
  progress: number;
  direction: 'forward' | 'returning';
}

export default function RoutePolyline({ route, progress, direction }: Props) {
  if (route.pts.length < 2) return null;

  const ptsStr = route.pts.map((p) => `${p.x},${p.y}`).join(' ');

  // 计算已走路径的点
  const traveledPts: { x: number; y: number }[] = [];
  let remaining = progress;
  for (let i = 1; i < route.pts.length; i++) {
    const dx = route.pts[i].x - route.pts[i - 1].x;
    const dy = route.pts[i].y - route.pts[i - 1].y;
    const segLen = Math.sqrt(dx * dx + dy * dy);

    if (remaining <= segLen) {
      const t = segLen > 0 ? remaining / segLen : 0;
      traveledPts.push({
        x: route.pts[i - 1].x + dx * t,
        y: route.pts[i - 1].y + dy * t,
      });
      break;
    }
    traveledPts.push(route.pts[i]);
    remaining -= segLen;
  }

  const traveledStr = traveledPts.length > 0
    ? [route.pts[0], ...traveledPts].map((p) => `${p.x},${p.y}`).join(' ')
    : '';

  return (
    <g className="route-polyline">
      {/* 未走路线（亮青色虚线） */}
      <polyline
        points={ptsStr}
        fill="none"
        stroke="#22d3ee"
        strokeWidth={4}
        strokeDasharray="8,4"
        opacity={0.6}
      />
      {/* 已走路线（暗色实线） */}
      {traveledStr && (
        <polyline
          points={traveledStr}
          fill="none"
          stroke="#0e7490"
          strokeWidth={4}
          opacity={0.8}
        />
      )}
    </g>
  );
}
