import { useEffect, useState } from "react";
import { ProductsAPI } from "../components/api";

export default function ProductList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = q ? await ProductsAPI.search(q) : await ProductsAPI.list();
      setItems(data);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div style={{padding:16}}>
      <h1>Products</h1>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." />
      <button onClick={load}>Search</button>
      {error && <p style={{color:"red"}}>{error}</p>}
      <ul>
        {items.map(p => (
          <li key={p.productId}>
            <a href={`/products/${p.productId}`}>{p.name || p.title || p.productName}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
