import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Star, Download } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export function VendorDashboard() {
  const [period, setPeriod] = useState('30d');
  
  // Fetch vendor data
  const { data: vendorReport } = trpc.marketplace.generateVendorReport.useQuery({
    vendorId: 'vendor_123',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  // Sales data
  const salesData = [
    { date: '01', sales: 2400, commission: 360, target: 2000 },
    { date: '02', sales: 1398, commission: 210, target: 2000 },
    { date: '03', sales: 9800, commission: 1470, target: 2000 },
    { date: '04', sales: 3908, commission: 586, target: 2000 },
    { date: '05', sales: 4800, commission: 720, target: 2000 },
    { date: '06', sales: 3800, commission: 570, target: 2000 },
    { date: '07', sales: 4300, commission: 645, target: 2000 },
  ];

  // Product performance
  const productData = [
    { name: 'Product A', sales: 4000, rating: 4.8, reviews: 120 },
    { name: 'Product B', sales: 3000, rating: 4.5, reviews: 98 },
    { name: 'Product C', sales: 2000, rating: 4.9, reviews: 156 },
    { name: 'Product D', sales: 2780, rating: 4.3, reviews: 72 },
    { name: 'Product E', sales: 1890, rating: 4.7, reviews: 95 },
  ];

  // Commission breakdown
  const commissionBreakdown = [
    { name: 'Earned', value: 4161 },
    { name: 'Pending', value: 1200 },
    { name: 'Paid', value: 2961 },
  ];

  const metrics = [
    {
      title: 'Total Sales',
      value: 'R$ 28.088',
      change: 12.5,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Commission',
      value: 'R$ 4.161',
      change: 8.2,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Orders',
      value: '156',
      change: 15.3,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Avg Rating',
      value: '4.64 ⭐',
      change: 2.1,
      icon: <Star className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Vendor Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your sales, commissions, and products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Request Payout</Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium">{metric.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
                <p className={`text-sm mt-2 ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}% from last period
                </p>
              </div>
              <div className={`${metric.color} p-3 rounded-lg text-white`}>
                {metric.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="sales">Sales & Commission</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales & Commission Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" />
                <Bar dataKey="commission" fill="#10b981" />
                <Bar dataKey="target" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Commission Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={commissionBreakdown} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: R$ ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {commissionBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Commission Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-slate-700">Commission Rate</span>
                  <span className="text-lg font-bold text-blue-600">15%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-slate-700">Total Earned</span>
                  <span className="text-lg font-bold text-green-600">R$ 4.161</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-slate-700">Already Paid</span>
                  <span className="text-lg font-bold text-purple-600">R$ 2.961</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-slate-700">Pending Payment</span>
                  <span className="text-lg font-bold text-orange-600">R$ 1.200</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Product</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Sales</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Rating</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-900">{product.name}</td>
                      <td className="text-right py-3 px-4 text-slate-900 font-semibold">R$ {product.sales}</td>
                      <td className="text-right py-3 px-4">
                        <span className="text-yellow-500">★ {product.rating}</span>
                      </td>
                      <td className="text-right py-3 px-4 text-slate-600">{product.reviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Payout History</h3>
            <div className="space-y-3">
              {[
                { date: '2024-05-01', amount: 1500, status: 'Completed', method: 'Bank Transfer' },
                { date: '2024-04-01', amount: 1461, status: 'Completed', method: 'Bank Transfer' },
                { date: '2024-03-01', amount: 1200, status: 'Pending', method: 'Bank Transfer' },
              ].map((payout, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900">{payout.date}</p>
                    <p className="text-sm text-slate-600">{payout.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">R$ {payout.amount}</p>
                    <p className={`text-sm ${payout.status === 'Completed' ? 'text-green-600' : 'text-orange-600'}`}>
                      {payout.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Satisfaction</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">5 Stars</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">4 Stars</span>
                    <span className="font-semibold">22%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">3 Stars</span>
                    <span className="font-semibold">7%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '7%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Below 3 Stars</span>
                    <span className="font-semibold">3%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '3%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-slate-600 text-sm">Avg Response Time</p>
                  <p className="text-2xl font-bold text-blue-600">2.4 hours</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-slate-600 text-sm">Return Rate</p>
                  <p className="text-2xl font-bold text-green-600">1.2%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-slate-600 text-sm">Repeat Customers</p>
                  <p className="text-2xl font-bold text-purple-600">34%</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
