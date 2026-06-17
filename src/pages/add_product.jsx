import { useState } from "react";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    price: "",
    orig: "",
    img: "",
    cat: "",
    subcat: "",
    desc: "",
    stock: "",
    badge: "",
    specs: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "30px auto" }}>
      <h2>Add Product</h2>

      <input
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
      />

      <input
        name="brand"
        placeholder="Brand"
        value={product.brand}
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
      />

      <input
        name="img"
        placeholder="Image URL"
        value={product.img}
        onChange={handleChange}
      />

      <textarea
        name="desc"
        placeholder="Description"
        value={product.desc}
        onChange={handleChange}
      />

      <button>Save Product</button>
    </div>
  );
}