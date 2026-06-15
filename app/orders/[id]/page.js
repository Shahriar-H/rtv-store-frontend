export const metadata = { title: 'Order Details' };
import OrderDetailClient from './OrderDetailClient';
export default function OrderDetailPage({ params }) { return <OrderDetailClient orderId={params.id} />; }
