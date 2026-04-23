import { Link } from 'react-router-dom'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { totalItems } = useCart()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold">ShopHub</Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/products" className="hover:text-primary">Products</Link>
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/orders" className="hover:text-primary">My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-primary font-medium">Admin</Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </nav>

            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>

          {mobileOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link to="/products" onClick={() => setMobileOpen(false)}>Products</Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)}>
                  Cart ({totalItems})
                </Link>
                {user ? (
                  <>
                    <Link to="/orders" onClick={() => setMobileOpen(false)}>My Orders</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false) }}>Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>ShopHub E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
