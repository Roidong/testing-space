import type { Stop } from '../types';

// PRD §2: ~45 个停靠点，坐标为归一化 0-1000 网格（对照 campus-map.jpg 目测标定）
export const STOPS: Stop[] = [
  // 生活组团北区 D8-D14
  { id: 'D8', name: 'D8 宿舍', zone: '生活组团北区', x: 520, y: 180 },
  { id: 'D9', name: 'D9 宿舍', zone: '生活组团北区', x: 520, y: 220 },
  { id: 'D10', name: 'D10 宿舍', zone: '生活组团北区', x: 620, y: 180 },
  { id: 'D11', name: 'D11 宿舍', zone: '生活组团北区', x: 620, y: 220 },
  { id: 'D12', name: 'D12 宿舍', zone: '生活组团北区', x: 720, y: 180 },
  { id: 'D13', name: 'D13 宿舍', zone: '生活组团北区', x: 720, y: 220 },
  { id: 'D14', name: 'D14 宿舍', zone: '生活组团北区', x: 820, y: 200 },
  // 教师公寓 A1-A5
  { id: 'A1', name: 'A1 教师公寓', zone: '生活组团北区', x: 820, y: 280 },
  { id: 'A2', name: 'A2 教师公寓', zone: '生活组团北区', x: 820, y: 320 },
  { id: 'A3', name: 'A3 教师公寓', zone: '生活组团北区', x: 820, y: 360 },
  { id: 'A4', name: 'A4 教师公寓', zone: '生活组团北区', x: 820, y: 400 },
  { id: 'A5', name: 'A5 教师发展中心', zone: '生活组团北区', x: 820, y: 440 },
  // 北区食堂、快递站
  { id: 'N_CANTEEN', name: '北区食堂', zone: '生活组团北区', x: 520, y: 280 },
  { id: 'COURIER', name: '快递站/超市', zone: '生活组团北区', x: 420, y: 200 },
  // 生活组团南区 D1-D7
  { id: 'D1', name: 'D1 宿舍', zone: '生活组团南区', x: 620, y: 580 },
  { id: 'D2', name: 'D2 宿舍', zone: '生活组团南区', x: 620, y: 620 },
  { id: 'D3', name: 'D3 宿舍', zone: '生活组团南区', x: 720, y: 580 },
  { id: 'D4', name: 'D4 宿舍', zone: '生活组团南区', x: 720, y: 620 },
  { id: 'D5', name: 'D5 宿舍', zone: '生活组团南区', x: 820, y: 580 },
  { id: 'D6', name: 'D6 宿舍', zone: '生活组团南区', x: 820, y: 620 },
  { id: 'D7', name: 'D7 宿舍', zone: '生活组团南区', x: 820, y: 660 },
  { id: 'S_CANTEEN', name: '南区食堂', zone: '生活组团南区', x: 720, y: 700 },
  // 中心组团南区 C1-C5
  { id: 'C1', name: '会议中心/行政中心', zone: '中心组团南区', x: 320, y: 480 },
  { id: 'C2', name: '图书馆', zone: '中心组团南区', x: 320, y: 540 },
  { id: 'C3', name: '教学一号楼', zone: '中心组团南区', x: 420, y: 480 },
  { id: 'C4', name: '教学二号楼', zone: '中心组团南区', x: 420, y: 540 },
  { id: 'C5', name: '科教美育中心', zone: '中心组团南区', x: 420, y: 600 },
  // 中心组团北区 C6-C9
  { id: 'C6', name: '教学三号楼', zone: '中心组团北区', x: 320, y: 320 },
  { id: 'C7', name: '教学四号楼', zone: '中心组团北区', x: 420, y: 320 },
  { id: 'C8', name: '音乐厅', zone: '中心组团北区', x: 320, y: 380 },
  { id: 'C9', name: '教学五号楼', zone: '中心组团北区', x: 420, y: 380 },
  // 科研组团 R1-R3
  { id: 'R1', name: '科研一号楼', zone: '科研组团', x: 220, y: 420 },
  { id: 'R2', name: '科研二号楼', zone: '科研组团', x: 220, y: 480 },
  { id: 'R3', name: '科研三号楼', zone: '科研组团', x: 220, y: 540 },
  // 实验组团 L1-L6
  { id: 'L1', name: '实验一号楼', zone: '实验组团南区', x: 720, y: 820 },
  { id: 'L2', name: '实验二号楼', zone: '实验组团南区', x: 820, y: 820 },
  { id: 'L3', name: '实验三号楼', zone: '实验组团南区', x: 920, y: 820 },
  { id: 'L4', name: '实验四号楼', zone: '实验组团南区', x: 920, y: 880 },
  { id: 'L5', name: '实验五号楼', zone: '实验组团北区', x: 220, y: 120 },
  { id: 'L6', name: '实验六号楼', zone: '实验组团北区', x: 320, y: 120 },
  // 体育组团 S1-S8
  { id: 'S1', name: '400 米运动场', zone: '体育组团南区', x: 220, y: 780 },
  { id: 'S2', name: '篮球馆', zone: '体育组团南区', x: 320, y: 780 },
  { id: 'S3', name: '训练馆', zone: '体育组团南区', x: 220, y: 840 },
  { id: 'S4', name: '游泳馆', zone: '体育组团南区', x: 320, y: 840 },
  { id: 'S5', name: '足球场', zone: '体育组团北区', x: 220, y: 220 },
  { id: 'S6', name: '排球场', zone: '体育组团北区', x: 320, y: 220 },
  { id: 'S7', name: '网球场', zone: '体育组团北区', x: 220, y: 280 },
  { id: 'S8', name: '篮球场', zone: '体育组团北区', x: 320, y: 280 },
  // 校门
  { id: 'GATE_N', name: '北门', zone: '校门', x: 500, y: 50 },
  { id: 'GATE_S', name: '南门', zone: '校门', x: 500, y: 950 },
  { id: 'GATE_E1', name: '东门', zone: '校门', x: 950, y: 300 },
  { id: 'GATE_E2', name: '东 2 门', zone: '校门', x: 950, y: 500 },
  { id: 'GATE_E3', name: '东 3 门', zone: '校门', x: 950, y: 700 },
  { id: 'GATE_W1', name: '西门', zone: '校门', x: 50, y: 500 },
  { id: 'GATE_W2', name: '西 2 门', zone: '校门', x: 50, y: 600 },
  { id: 'GATE_W3', name: '西 3 门', zone: '校门', x: 50, y: 700 },
];

export const STOP_MAP = new Map(STOPS.map((s) => [s.id, s]));

export function getStop(id: string): Stop | undefined {
  return STOP_MAP.get(id);
}

export function getStopsByZone(zone: string): Stop[] {
  return STOPS.filter((s) => s.zone === zone);
}

export function getAllZones(): string[] {
  return [...new Set(STOPS.map((s) => s.zone))];
}

export function searchStops(query: string): Stop[] {
  const q = query.toLowerCase();
  return STOPS.filter(
    (s) => s.name.toLowerCase().includes(q) || s.zone.toLowerCase().includes(q)
  );
}
