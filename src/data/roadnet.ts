import type { RoutePath } from '../types';
import { STOPS, getStop } from './locations';

// 路网节点（含停靠点 + 关键路口）
interface RoadNode {
  id: string;
  x: number;
  y: number;
}

interface RoadEdge {
  from: string;
  to: string;
  meters: number; // 实际距离（米）
}

// 关键路口节点（非停靠点）
const INTERSECTIONS: RoadNode[] = [
  { id: 'I_NW', x: 200, y: 100 }, // 西北路口
  { id: 'I_NE', x: 800, y: 100 }, // 东北路口
  { id: 'I_SW', x: 200, y: 900 }, // 西南路口
  { id: 'I_SE', x: 800, y: 900 }, // 东南路口
  { id: 'I_CN', x: 500, y: 200 }, // 中北路口
  { id: 'I_CS', x: 500, y: 800 }, // 中南路口
  { id: 'I_CE', x: 800, y: 500 }, // 中东路口
  { id: 'I_CW', x: 200, y: 500 }, // 中西路口
  { id: 'I_CC', x: 500, y: 500 }, // 中心路口
];

const ALL_NODES: RoadNode[] = [
  ...STOPS.map((s) => ({ id: s.id, x: s.x, y: s.y })),
  ...INTERSECTIONS,
];

const NODE_MAP = new Map(ALL_NODES.map((n) => [n.id, n]));

// 边（双向）
const EDGES: RoadEdge[] = [
  // 校园北路（东西向）
  { from: 'GATE_N', to: 'I_CN', meters: 150 },
  { from: 'I_CN', to: 'I_NE', meters: 300 },
  { from: 'I_NE', to: 'I_NW', meters: 600 },
  { from: 'I_NW', to: 'GATE_N', meters: 300 },
  // 校园南路（东西向）
  { from: 'GATE_S', to: 'I_CS', meters: 150 },
  { from: 'I_CS', to: 'I_SE', meters: 300 },
  { from: 'I_SE', to: 'I_SW', meters: 600 },
  { from: 'I_SW', to: 'GATE_S', meters: 300 },
  // 校园东路（南北向）
  { from: 'I_NE', to: 'I_CE', meters: 400 },
  { from: 'I_CE', to: 'I_SE', meters: 400 },
  // 校园西路（南北向）
  { from: 'I_NW', to: 'I_CW', meters: 400 },
  { from: 'I_CW', to: 'I_SW', meters: 400 },
  // 中部南北主轴
  { from: 'I_CN', to: 'I_CC', meters: 300 },
  { from: 'I_CC', to: 'I_CS', meters: 300 },
  // 中部东西轴
  { from: 'I_CW', to: 'I_CC', meters: 300 },
  { from: 'I_CC', to: 'I_CE', meters: 300 },
  // 生活组团北区内部
  { from: 'I_CN', to: 'D8', meters: 80 },
  { from: 'D8', to: 'D9', meters: 40 },
  { from: 'D9', to: 'N_CANTEEN', meters: 60 },
  { from: 'N_CANTEEN', to: 'COURIER', meters: 100 },
  { from: 'COURIER', to: 'I_NW', meters: 120 },
  { from: 'I_NE', to: 'D12', meters: 80 },
  { from: 'D12', to: 'D13', meters: 40 },
  { from: 'D13', to: 'D14', meters: 100 },
  { from: 'D14', to: 'A1', meters: 80 },
  { from: 'A1', to: 'A2', meters: 40 },
  { from: 'A2', to: 'A3', meters: 40 },
  { from: 'A3', to: 'A4', meters: 40 },
  { from: 'A4', to: 'A5', meters: 40 },
  { from: 'A5', to: 'I_CE', meters: 120 },
  // 生活组团南区内部
  { from: 'I_CS', to: 'D1', meters: 80 },
  { from: 'D1', to: 'D2', meters: 40 },
  { from: 'D2', to: 'S_CANTEEN', meters: 80 },
  { from: 'S_CANTEEN', to: 'I_SE', meters: 120 },
  { from: 'I_CE', to: 'D5', meters: 80 },
  { from: 'D5', to: 'D6', meters: 40 },
  { from: 'D6', to: 'D7', meters: 40 },
  { from: 'D7', to: 'I_SE', meters: 80 },
  { from: 'D3', to: 'D4', meters: 40 },
  { from: 'D1', to: 'D3', meters: 100 },
  { from: 'D2', to: 'D4', meters: 100 },
  // 中心组团北区
  { from: 'I_CC', to: 'C6', meters: 180 },
  { from: 'C6', to: 'C7', meters: 100 },
  { from: 'C7', to: 'I_CE', meters: 120 },
  { from: 'I_CW', to: 'C8', meters: 100 },
  { from: 'C8', to: 'C9', meters: 100 },
  { from: 'C9', to: 'I_CC', meters: 120 },
  // 中心组团南区
  { from: 'I_CC', to: 'C3', meters: 100 },
  { from: 'C3', to: 'C4', meters: 60 },
  { from: 'C4', to: 'C5', meters: 60 },
  { from: 'C5', to: 'I_CS', meters: 100 },
  { from: 'I_CW', to: 'C1', meters: 180 },
  { from: 'C1', to: 'C2', meters: 60 },
  { from: 'C2', to: 'I_CC', meters: 180 },
  // 科研组团
  { from: 'I_CW', to: 'R1', meters: 80 },
  { from: 'R1', to: 'R2', meters: 60 },
  { from: 'R2', to: 'R3', meters: 60 },
  { from: 'R3', to: 'I_SW', meters: 120 },
  // 实验组团南区
  { from: 'I_SE', to: 'L1', meters: 80 },
  { from: 'L1', to: 'L2', meters: 100 },
  { from: 'L2', to: 'L3', meters: 100 },
  { from: 'L3', to: 'L4', meters: 60 },
  { from: 'L4', to: 'I_SE', meters: 120 },
  // 实验组团北区
  { from: 'I_NW', to: 'L5', meters: 80 },
  { from: 'L5', to: 'L6', meters: 100 },
  { from: 'L6', to: 'I_CN', meters: 120 },
  // 体育组团南区
  { from: 'I_SW', to: 'S1', meters: 80 },
  { from: 'S1', to: 'S2', meters: 100 },
  { from: 'S2', to: 'I_CS', meters: 120 },
  { from: 'I_SW', to: 'S3', meters: 100 },
  { from: 'S3', to: 'S4', meters: 100 },
  { from: 'S4', to: 'I_CS', meters: 140 },
  // 体育组团北区
  { from: 'I_NW', to: 'S5', meters: 80 },
  { from: 'S5', to: 'S6', meters: 100 },
  { from: 'S6', to: 'I_CN', meters: 120 },
  { from: 'I_NW', to: 'S7', meters: 100 },
  { from: 'S7', to: 'S8', meters: 100 },
  { from: 'S8', to: 'I_CN', meters: 140 },
  // 校门连接
  { from: 'GATE_E1', to: 'I_NE', meters: 100 },
  { from: 'GATE_E2', to: 'I_CE', meters: 100 },
  { from: 'GATE_E3', to: 'I_SE', meters: 100 },
  { from: 'GATE_W1', to: 'I_CW', meters: 100 },
  { from: 'GATE_W2', to: 'I_SW', meters: 100 },
  { from: 'GATE_W3', to: 'I_SW', meters: 120 },
];

// 构建邻接表
function buildAdjacency(): Map<string, { to: string; meters: number }[]> {
  const adj = new Map<string, { to: string; meters: number }[]>();
  for (const node of ALL_NODES) {
    adj.set(node.id, []);
  }
  for (const edge of EDGES) {
    adj.get(edge.from)!.push({ to: edge.to, meters: edge.meters });
    adj.get(edge.to)!.push({ to: edge.from, meters: edge.meters });
  }
  return adj;
}

const ADJ = buildAdjacency();

// Dijkstra 最短路径
export function shortestPath(fromId: string, toId: string): RoutePath | null {
  if (!NODE_MAP.has(fromId) || !NODE_MAP.has(toId)) return null;
  if (fromId === toId) {
    const stop = getStop(fromId);
    if (!stop) return null;
    return { stopIds: [fromId], pts: [{ x: stop.x, y: stop.y }], meters: 0 };
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const node of ALL_NODES) {
    dist.set(node.id, Infinity);
    prev.set(node.id, null);
  }
  dist.set(fromId, 0);

  while (true) {
    let u: string | null = null;
    let minDist = Infinity;
    for (const node of ALL_NODES) {
      if (!visited.has(node.id) && dist.get(node.id)! < minDist) {
        minDist = dist.get(node.id)!;
        u = node.id;
      }
    }
    if (u === null || u === toId) break;
    visited.add(u);

    for (const { to, meters } of ADJ.get(u)!) {
      const alt = dist.get(u)! + meters;
      if (alt < dist.get(to)!) {
        dist.set(to, alt);
        prev.set(to, u);
      }
    }
  }

  if (dist.get(toId) === Infinity) return null;

  // 回溯路径
  const path: string[] = [];
  let curr: string | null = toId;
  while (curr !== null) {
    path.unshift(curr);
    curr = prev.get(curr) ?? null;
  }

  // 提取停靠点序列
  const stopIds = path.filter((id) => getStop(id) !== undefined);

  // 生成坐标点
  const pts = path.map((id) => {
    const node = NODE_MAP.get(id)!;
    return { x: node.x, y: node.y };
  });

  return { stopIds, pts, meters: dist.get(toId)! };
}
