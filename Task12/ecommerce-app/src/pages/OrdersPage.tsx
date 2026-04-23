import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function OrdersPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/orders' } })
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('userId', user?.id)
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  if (!user) return null

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'processing': return 'secondary'
      case 'delivered': return 'success'
      default: return 'outline'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
          <Link to="/products">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg">Start Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.title} x {item.quantity}</span>
                      <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rs. {order.totalPrice.toLocaleString()}</span>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Delivering to: {order.name}</p>
                  <p>{order.address}, {order.city}</p>
                  <p>Phone: {order.phone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
