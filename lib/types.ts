export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface Category {
  name: string
  description: string
  product_count: number
}

export interface Inventory {
  id: number
  product_id: string
  quantity: number
}

export interface User {
  id: string
  name: string | null
  email: string
  role: string
}

export interface UserWithPassword extends User {
  password: string
}

export interface Order {
  id: string
  user_id: string
  status: string
  total: number
  created_at: Date
}

export interface OrderItem {
  id: number
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  price: number
}
