import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { DeliveryTracking, Order } from '../../types';
import { Truck, Package, CheckCircle, Clock } from 'lucide-react';

export default function DeliveryTrackingManager() {
  const [deliveries, setDeliveries] = useState<(DeliveryTracking & { order?: Order })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTracking | null>(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select(`
          *,
          order:orders(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error: unknown) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId: string) => {
    if (!statusUpdate.trim()) {
      alert('Please enter a status update');
      return;
    }

    try {
      const { error } = await supabase
        .from('delivery_tracking')
        .update({
          status: statusUpdate,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', deliveryId);

      if (error) throw error;

      alert('Delivery status updated successfully');
      setStatusUpdate('');
      setNotes('');
      setSelectedDelivery(null);
      fetchDeliveries();
    } catch (error: unknown) {
      console.error('Error updating delivery:', error);
      alert('Failed to update delivery status');
    }
  };

  const createDeliveryTracking = async (orderId: string, deliveryMethod: string) => {
    try {
      const { error } = await supabase
        .from('delivery_tracking')
        .insert([{
          order_id: orderId,
          status: 'Order Confirmed',
          delivery_method: deliveryMethod as 'in_person' | 'dealer_delivery',
          notes: 'Delivery tracking initiated'
        }]);

      if (error) throw error;
      alert('Delivery tracking created successfully');
      fetchDeliveries();
    } catch (error: unknown) {
      console.error('Error creating delivery tracking:', error);
      alert('Failed to create delivery tracking');
    }
  };

  const getStatusIcon = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('delivered')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (lowerStatus.includes('transit') || lowerStatus.includes('shipped')) {
      return <Truck className="w-5 h-5 text-blue-500" />;
    } else if (lowerStatus.includes('confirmed') || lowerStatus.includes('preparing')) {
      return <Package className="w-5 h-5 text-yellow-500" />;
    } else {
      return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (selectedDelivery) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedDelivery(null)}
          className="mb-4 text-slate-600 hover:text-slate-800"
        >
          ← Back to Deliveries
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Update Delivery Status
          </h2>
          <div className="mb-4 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Order Number</p>
            <p className="font-semibold text-slate-800">
              {selectedDelivery.order?.order_number}
            </p>
            <p className="text-sm text-slate-600 mt-2">Current Status</p>
            <p className="font-semibold text-slate-800">
              {selectedDelivery.status}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New Status
              </label>
              <select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="">Select Status</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Preparing for Dispatch">Preparing for Dispatch</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Attempted Delivery">Attempted Delivery</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                rows={3}
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(selectedDelivery.id)}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
              >
                Update Status
              </button>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Delivery Tracking</h2>

      <div className="grid gap-4">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Order #{delivery.order?.order_number}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusIcon(delivery.status)}
                  <span className="font-medium text-slate-700">{delivery.status}</span>
                </div>
                {delivery.delivery_method && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {delivery.delivery_method === 'in_person'
                      ? 'In-Person Delivery'
                      : 'Dealer Delivery'}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedDelivery(delivery);
                  setStatusUpdate(delivery.status);
                  setNotes(delivery.notes || '');
                }}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
              >
                Update Status
              </button>
            </div>

            {delivery.notes && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Notes:</p>
                <p className="text-slate-800">{delivery.notes}</p>
              </div>
            )}

            <div className="mt-4 flex justify-between text-sm text-slate-500">
              <span>Last Updated: {new Date(delivery.updated_at).toLocaleString()}</span>
              <span>Created: {new Date(delivery.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {deliveries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-slate-500">No deliveries to track yet</p>
        </div>
      )}
    </div>
  );
}
