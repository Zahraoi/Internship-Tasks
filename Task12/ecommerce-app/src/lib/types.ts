export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'client'
  created_at: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  categoryId: string
  images: string[]
  stock: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface OrderItem {
  productId: string
  title: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  userId: string | null
  products: OrderItem[]
  totalPrice: number
  name: string
  phone: string
  address: string
  city: string
  status: 'pending' | 'processing' | 'delivered'
  created_at: string
}
