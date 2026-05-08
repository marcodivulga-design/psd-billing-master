import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
  repeatCustomerRate: number;
}

interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  orders?: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export function AdminDashboard() {
  const [metrics] = useState<DashboardMetrics>({
    totalRevenue: 125000,
    totalOrders: 1250,
    totalCustomers: 850,
    conversionRate: 3.2,
    averageOrderValue: 100,
    repeatCustomerRate: 35,
  });

  const revenueData: ChartData[] = [
    { name: 'Jan', value: 8000, revenue: 8000 },
    { name: 'Feb', value: 12000, revenue: 12000 },
    { name: 'Mar', value: 15000, revenue: 15000 },
    { name: 'Apr', value: 18000, revenue: 18000 },
    { name: 'May', value: 22000, revenue: 22000 },
    { name: 'Jun', value: 25000, revenue: 25000 },
  ];

  const ordersData: ChartData[] = [
    { name: 'Jan', value: 120, orders: 120 },
    { name: 'Feb', value: 180, orders: 180 },
    { name: 'Mar', value: 220, orders: 220 },
    { name: 'Apr', value: 250, orders: 250 },
    { name: 'May', value: 280, orders: 280 },
    { name: 'Jun', value: 300, orders: 300 },
  ];

  const paymentMethodsData = [
    { name: 'Cartão de Crédito', value: 45 },
    { name: 'PIX', value: 35 },
    { name: 'Boleto', value: 15 },
    { name: 'Outros', value: 5 },
  ];

  const topProducts = [
    { id: 1, name: 'Faca Artesanal Premium', sales: 250, revenue: 45000 },
    { id: 2, name: 'Faca de Churrasco', sales: 180, revenue: 17100 },
    { id: 3, name: 'Faca de Chef', sales: 150, revenue: 18000 },
    { id: 4, name: 'Faca Santoku', sales: 120, revenue: 13200 },
    { id: 5, name: 'Faca de Pão', sales: 100, revenue: 8500 },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'João Silva', amount: 450, status: 'Delivered', date: '2024-05-08' },
    { id: 'ORD-002', customer: 'Maria Santos', amount: 320, status: 'Shipped', date: '2024-05-07' },
    { id: 'ORD-003', customer: 'Pedro Costa', amount: 580, status: 'Processing', date: '2024-05-06' },
    { id: 'ORD-004', customer: 'Ana Oliveira', amount: 250, status: 'Pending', date: '2024-05-05' },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-2">Bem-vindo ao seu painel de controle</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold mt-2">R$ {metrics.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">↑ 12% vs mês anterior</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold mt-2">{metrics.totalOrders.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">↑ 8% vs mês anterior</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold mt-2">{metrics.totalCustomers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">↑ 5% vs mês anterior</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="text-2xl font-bold mt-2">{metrics.conversionRate}%</p>
                <p className="text-xs text-green-600 mt-2">↑ 0.5% vs mês anterior</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Receita Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Receita" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Orders Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pedidos Mensais</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#10b981" name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Payment Methods */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Métodos de Pagamento</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Products */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h3>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} vendas</p>
                  </div>
                  <p className="font-semibold">R$ {product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Pedido</th>
                  <th className="text-left py-3 px-4">Cliente</th>
                  <th className="text-left py-3 px-4">Valor</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">R$ {order.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
