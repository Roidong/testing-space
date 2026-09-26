import { getState, tickOrders } from '../store/store';
import { pointAtDistance, headingAt } from '../lib/geo';

let animationFrameId: number | null = null;
let lastTime: number | null = null;

// 启动仿真循环
export function startEngine(): void {
  if (animationFrameId !== null) return;
  lastTime = null;

  function loop(timestamp: number) {
    if (lastTime === null) {
      lastTime = timestamp;
    }

    const dtReal = timestamp - lastTime;
    lastTime = timestamp;

    const state = getState();
    const dtSim = dtReal * state.settings.speedMultiplier;

    tickOrders(dtSim);

    animationFrameId = requestAnimationFrame(loop);
  }

  animationFrameId = requestAnimationFrame(loop);
}

// 停止仿真循环
export function stopEngine(): void {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    lastTime = null;
  }
}

// 获取机器人当前位置（用于渲染）
export function getRobotPosition(orderId: string): { x: number; y: number; heading: number } | null {
  const state = getState();
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return null;

  const pos = pointAtDistance(order.route.pts, order.robot.progress);
  const heading = headingAt(order.route.pts, order.robot.progress);

  return { x: pos.x, y: pos.y, heading };
}
