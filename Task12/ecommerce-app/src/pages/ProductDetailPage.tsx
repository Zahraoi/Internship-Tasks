import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) setProduct(data)
    setLoading(false)
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      navigate('/cart')
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-20 text-center">Loading...</div>
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Product not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} className="object-cover w-full h-full rounded-lg" />
          ) : (
            <span className="text-muted-foreground">No Image</span>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl font-bold text-primary mb-6">Rs. {product.price.toLocaleString()}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <Button 
            size="lg" 
            onClick={handleAddToCart} 
            disabled={product.stock <= 0}
            className="w-full md:w-auto"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
