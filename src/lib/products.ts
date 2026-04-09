import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  product_id: string | null;
  product_name: string;
  payment_method: string;
  status: string;
  created_at: string;
}

// ============ Products ============

export async function getProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  return (data || []) as Product[];
}

export async function addProduct(product: Omit<Product, "id" | "created_at">): Promise<void> {
  await supabase.from("products").insert({
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.image_url,
    category: product.category,
    in_stock: product.in_stock,
  });
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const update: any = {};
  if (product.name !== undefined) update.name = product.name;
  if (product.description !== undefined) update.description = product.description;
  if (product.price !== undefined) update.price = product.price;
  if (product.image_url !== undefined) update.image_url = product.image_url;
  if (product.category !== undefined) update.category = product.category;
  if (product.in_stock !== undefined) update.in_stock = product.in_stock;
  await supabase.from("products").update(update).eq("id", id);
}

export async function deleteProduct(id: string): Promise<void> {
  await supabase.from("products").delete().eq("id", id);
}

// ============ Orders ============

export async function getOrders(): Promise<Order[]> {
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return (data || []) as Order[];
}

export async function createOrder(order: {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  product_id: string;
  product_name: string;
  payment_method: string;
}): Promise<void> {
  await supabase.from("orders").insert(order);
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await supabase.from("orders").update({ status }).eq("id", id);
}

export async function deleteOrder(id: string): Promise<void> {
  await supabase.from("orders").delete().eq("id", id);
}
