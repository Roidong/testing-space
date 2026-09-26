import { useState, useMemo } from 'react';
import CampusMap from '../components/map/CampusMap';
import RoutePolyline from '../components/map/RoutePolyline';
import RobotDot from '../components/map/RobotDot';
import StopPin from '../components/map/StopPin';
import OrderDrawer from '../components/OrderDrawer';
import { useApp } from '../store/store';
import { getStop } from '../data/locations';
import { pointAtDistance, headingAt } from '../lib/geo';

export default function DeliveryPage() {
  const allOrders = useApp((s) => s.orders);
  const orders = useMemo(
    () => allOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled'),
    [allOrders]
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id ?? null);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? orders[0];

  if (!selectedOrder) {
    return (
      <div className="page page--delivery" data-testid="page-delivery" style={{ height: '100%', position: 'relative' }}>
        <CampusMap width={800} height={600}>
          {null}
        </CampusMap>
      </div>
    );
  }

  const robotPos = pointAtDistance(selectedOrder.route.pts, selectedOrder.robot.progress);
  const robotHeading = headingAt(selectedOrder.route.pts, selectedOrder.robot.progress);
  const senderStop = getStop(selectedOrder.sender.stopId);
  const receiverStop = getStop(selectedOrder.receiver.stopId);

  return (
    <div className="page page--delivery" data-testid="page-delivery" style={{ height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, display: 'flex', gap: 8 }}>
        {orders.map((o) => (
          <button
            key={o.id}
            className={`btn-ghost ${o.id === selectedOrderId ? 'btn-ghost--active' : ''}`}
            style={{ fontSize: 12, padding: '6px 12px' }}
            onClick={() => setSelectedOrderId(o.id)}
          >
            #{o.id.slice(-6)} {o.item.name}
          </button>
        ))}
      </div>

      <CampusMap width={800} height={600}>
        <RoutePolyline
          route={selectedOrder.route}
          progress={selectedOrder.robot.progress}
          direction={selectedOrder.robot.direction}
        />
        {senderStop && <StopPin stop={senderStop} isSender />}
        {receiverStop && <StopPin stop={receiverStop} isReceiver />}
        <RobotDot x={robotPos.x} y={robotPos.y} heading={robotHeading} label={selectedOrder.id.slice(-6)} />
      </CampusMap>

      <OrderDrawer orderId={selectedOrder.id} onClose={() => setSelectedOrderId(null)} />
    </div>
  );
}
