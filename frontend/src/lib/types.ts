export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  weightLabel: string;
  imageUrl: string;
  isFeatured: boolean;
  stock: number;
  categoryName: string;
  categorySlug: string;
};

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  stock: number;
  quantity: number;
};

export type OrderItemResult = {
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderResult = {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  note: string | null;
  total: number;
  createdAt: string;
  items: OrderItemResult[];
  status?: string;
};

export type AdminSummary = {
  newOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  lowStock: number;
  productCount: number;
};

export type AdminProduct = {
  id: number;
  name: string;
  categoryName: string;
  unit: string;
  price: number;
  stock: number;
};

export type AdminOrder = {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  note: string | null;
  total: number;
  status: string;
  createdAt: string;
  items: {
    productId: number;
    productName: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
};

export type AdminCustomer = {
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
};
