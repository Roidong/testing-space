import type { RoutePath } from '../types';

// 计算路径总长度（米）
export function pathLength(pts: { x: number; y: number }[]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

// 沿路径前进 distance 米后的位置
export function pointAtDistance(
  pts: { x: number; y: number }[],
  distance: number
): { x: number; y: number; segmentIndex: number } {
  if (pts.length === 0) return { x: 0, y: 0, segmentIndex: 0 };
  if (pts.length === 1) return { x: pts[0].x, y: pts[0].y, segmentIndex: 0 };

  let remaining = distance;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    const segLen = Math.sqrt(dx * dx + dy * dy);

    if (remaining <= segLen) {
      const t = segLen > 0 ? remaining / segLen : 0;
      return {
        x: pts[i - 1].x + dx * t,
        y: pts[i - 1].y + dy * t,
        segmentIndex: i - 1,
      };
    }
    remaining -= segLen;
  }

  // 超出路径长度，返回终点
  const last = pts[pts.length - 1];
  return { x: last.x, y: last.y, segmentIndex: pts.length - 2 };
}

// 计算路径上某点的朝向角度（弧度）
export function headingAt(
  pts: { x: number; y: number }[],
  distance: number
): number {
  const pos = pointAtDistance(pts, distance);
  const nextDist = distance + 1;
  const nextPos = pointAtDistance(pts, nextDist);

  const dx = nextPos.x - pos.x;
  const dy = nextPos.y - pos.y;
  return Math.atan2(dy, dx);
}

// 反转路径
export function reversePath(route: RoutePath): RoutePath {
  return {
    stopIds: [...route.stopIds].reverse(),
    pts: [...route.pts].reverse(),
    meters: route.meters,
  };
}
