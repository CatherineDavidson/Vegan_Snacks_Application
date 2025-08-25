import { useEffect, useState } from "react";
import { ProductsAPI } from "../api";

export default function Home() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    ProductsAPI.list().then(setItems).catch(e=>setError(e.message));
  }, []);

  return (
    <div style={{padding:16}}>
      <h1>Home</h1>
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
