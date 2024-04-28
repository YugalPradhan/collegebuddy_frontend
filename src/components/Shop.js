import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from './Product'; // Import the Product component
import '../style/Product.css'; // Import your CSS for styling
import { useLocation } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('keyword');

  useEffect(() => {
    // Fetch products data from the backend when the component mounts
    const fetchProducts=async()=>{
      try {
        let response;
      if(!localStorage.getItem('token'))
      {response = await axios.get('https://collegebuddy-backend-69y1.onrender.com/product/allproducts');}
      else if(searchTerm)
      {response = await axios.get(`https://collegebuddy-backend-69y1.onrender.com/product/search?keyword=${searchTerm}`,{
        headers: {
          "auth-token":localStorage.getItem('token')
        }
      });}
      else {response = await axios.get('https://collegebuddy-backend-69y1.onrender.com/product/collegeproducts',{
        headers: {
          "auth-token":localStorage.getItem('token')
        }
      });}
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
    }
    fetchProducts();
  }, [searchTerm]); // Empty dependency array ensures useEffect runs only once when the component mounts
  return (
    <div className="home-container">
      <h2 className='p'>Products</h2>
      {products.length?
      <div className="products-list">
        {products.map(product => (
          <Product key={product._id} product={product}/>
        ))}
      </div>:<h2 style={{margin:"10px", color:'white',textAlign:"center"}}>No products to display :) , Tell your collegemates to sell some products</h2>}
    </div>
  );
};

export default Shop;
