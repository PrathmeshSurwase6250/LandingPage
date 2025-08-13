import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="container">
      <h1>Product Catalog</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} />
            )}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price.toFixed(2)}</p>
            {/* Add to cart button to be implemented */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
