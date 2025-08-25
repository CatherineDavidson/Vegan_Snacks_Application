import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { OrdersAPI } from "../components/api";

export default function OrdersPage() {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(()=>{
    OrdersAPI.list(userId).then(setOrders).catch(e=>setError(e.message));
  }, [userId]);

  return (
    <div style={{padding:16}}>
      <h1>Orders</h1>
      {error && <p style={{color:"red"}}>{error}</p>}
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            #{o.id} — total {o.totalAmount} — {o.orderDate}
          </li>
        ))}
      </ul>
    </div>
  );
}
