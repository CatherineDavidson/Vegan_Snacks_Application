import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductsAPI, CartAPI } from "../components/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(()=>{
    ProductsAPI.get(id).then(setP).catch(e=>setError(e.message));
  }, [id]);

  async function addToCart() {
    try {
      const userId = localStorage.getItem("userId") || "1";
      await CartAPI.add(userId, id, 1);
      setMsg("Added to cart");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  if (!p) return <div style={{padding:16}}>Loading...</div>;

  return (
    <div style={{padding:16}}>
      <h1>{p.name || p.title || p.productName}</h1>
      <p>{p.description}</p>
      <p><b>Price:</b> {p.price ?? p.unitPrice ?? p.amount ?? "-"}</p>
      <button onClick={addToCart}>Add to cart</button>
      {msg && <p>{msg}</p>}
      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
}
