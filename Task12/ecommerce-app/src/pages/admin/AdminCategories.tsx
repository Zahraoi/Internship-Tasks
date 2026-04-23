import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminCategories() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchCategories()
  }, [user])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false })
    if (data) setCategories(data)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return
    
    await supabase.from('categories').insert({ name: newCategory })
    setNewCategory('')
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This may affect products in this category.')) {
      await supabase.from('categories').delete().eq('id', id)
      fetchCategories()
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-4">
            <Input 
              placeholder="Category name" 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <span className="font-medium">{category.name}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleDelete(category.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
