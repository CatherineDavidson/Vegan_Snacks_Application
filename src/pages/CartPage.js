import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartAPI, OrdersAPI } from "../components/api";

export default function CartPage() {
  const { userId } = useParams();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      const data = await CartAPI.get(userId);
      setItems(data);
      setError("");
    } catch (e) { setError(e.message); }
  }

  useEffect(()=>{ load(); }, [userId]);

  async function placeOrder() {
    try {
      await OrdersAPI.place(userId);
      setMsg("Order placed");
      await load();
    } catch (e) { setError(e.message); }
  }

  return (
    <div style={{padding:16}}>
      <h1>Cart</h1>
      {error && <p style={{color:"red"}}>{error}</p>}
      <ul>
        {items.map(ci => (
          <li key={ci.cartItemId}>
            {(ci.product?.name) || (ci.productName) || "Item"} — qty {ci.quantity}
          </li>
        ))}
      </ul>
      <button onClick={placeOrder}>Place Order</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
