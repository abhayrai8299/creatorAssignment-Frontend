import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <div className="border rounded shadow p-4">
    <img src={product.image} alt={product.title} className="h-40 mx-auto mb-4" />
    <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
    <p className="text-gray-700 mb-2">${product.price}</p>
    <Link to={`/products/${product.id}`} className="text-blue-500 hover:underline">View Details</Link>
  </div>
);

export default ProductCard;
