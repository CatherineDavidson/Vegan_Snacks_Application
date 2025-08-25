import React, { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";
import { Eye } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return <p className="text-center py-10">Loading orders...</p>;

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold mb-4">No Orders Found</h1>
        <p className="text-gray-500">Start shopping and your orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-xl shadow-md p-6">
            {/* Order Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-semibold">Order #{order.orderId}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()} — {order.status}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium text-lg">₹{order.totalAmount}</p>
                <button
                  onClick={() => toggleExpand(order.orderId)}
                  className="flex items-center gap-1 text-emerald-600 hover:underline"
                >
                  <Eye className="w-4 h-4" />
                  {expandedOrder === order.orderId ? "Hide Items" : "View Items"}
                </button>
              </div>
            </div>

            {/* Order Items */}
            {expandedOrder === order.orderId && (
              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.imageUrl || "https://via.placeholder.com/60"}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">₹{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
