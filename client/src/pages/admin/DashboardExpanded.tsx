import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import {
  TrendingUp, Users, ShoppingCart, DollarSign, 
  Award, MessageSquare, Zap, Brain, Activity
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export function AdminDashboardExpanded() {
  const [period, setPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Fetch data from API
  const { data: aiStats } = trpc.aiAdvanced.getAIStats.useQuery();
  const { data: marketplaceStats } = trpc.marketplace.getMarketplaceStats.useQuery();
  const { data: gamificationStats } = trpc.gamification.getLoyaltyStats.useQuery();
  const { data: communityStats } = trpc.community.getCommunityStats.useQuery();

  // Revenue data
  const revenueData = [
    { date: '01', revenue: 4000, orders: 240, customers: 120 },
    { date: '02', revenue: 3000, orders: 221, customers: 110 },
    { date: '03', revenue: 2000, orders: 229, customers: 100 },
    { date: '04', revenue: 2780, orders: 200, customers: 95 },
    { date: '05', revenue: 1890, orders: 229, customers: 130 },
    { date: '06', revenue: 2390, orders: 200, customers: 98 },
    { date: '07', revenue: 3490, orders: 210, customers: 140 },
  ];

  // Conversion funnel
  const conversionData = [
    { stage: 'Visitantes', value: 10000 },
    { stage: 'Adicionaram Carrinho', value: 3500 },
    { stage: 'Iniciaram Checkout', value: 2100 },
    { stage: 'Completaram Compra', value: 1250 },
  ];

  // AI Predictions
  const aiPredictions = [
    { name: 'Churn Risk', value: 15, color: '#ef4444' },
    { name: 'High Value', value: 35, color: '#10b981' },
    { name: 'At Risk', value: 25, color: '#f59e0b' },
    { name: 'Loyal', value: 25, color: '#3b82f6' },
  ];

  // Marketplace performance
  const vendorPerformance = [
    { vendor: 'Vendor A', sales: 2400, commission: 360, rating: 4.8 },
    { vendor: 'Vendor B', sales: 1398, commission: 210, rating: 4.5 },
    { vendor: 'Vendor C', sales: 9800, commission: 1470, rating: 4.9 },
    { vendor: 'Vendor D', sales: 3908, commission: 586, rating: 4.3 },
    { vendor: 'Vendor E', sales: 4800, commission: 720, rating: 4.7 },
  ];

  // Gamification engagement
  const engagementData = [
    { week: 'W1', points: 5000, badges: 120, referrals: 45 },
    { week: 'W2', points: 7200, badges: 180, referrals: 62 },
    { week: 'W3', points: 6800, badges: 160, referrals: 58 },
    { week: 'W4', points: 8900, badges: 220, referrals: 85 },
  ];

  // Community activity
  const communityActivity = [
    { day: 'Mon', reviews: 45, posts: 23, shares: 67 },
    { day: 'Tue', reviews: 52, posts: 28, shares: 71 },
    { day: 'Wed', reviews: 48, posts: 25, shares: 68 },
    { day: 'Thu', reviews: 61, posts: 32, shares: 89 },
    { day: 'Fri', reviews: 55, posts: 29, shares: 76 },
    { day: 'Sat', reviews: 67, posts: 35, shares: 95 },
    { day: 'Sun', reviews: 72, posts: 38, shares: 102 },
  ];

  const metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: 'R$ 125.000',
      change: 12.5,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: '1.250',
      change: 8.2,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Active Customers',
      value: '850',
      change: 15.3,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: 2.1,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
    {
      title: 'Loyalty Points',
      value: `${gamificationStats?.totalPointsIssued || 0}`,
      change: 25.0,
      icon: <Award className="w-6 h-6" />,
      color: 'bg-pink-500',
    },
    {
      title: 'Community Posts',
      value: `${communityStats?.totalPosts || 0}`,
      change: 18.5,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-cyan-500',
    },
    {
      title: 'AI Predictions',
      value: `${aiStats?.totalPredictions || 0}`,
      change: 35.0,
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-indigo-500',
    },
    {
      title: 'Active Vendors',
      value: `${marketplaceStats?.approvedVendors || 0}`,
      change: 5.0,
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPeriod('7d')}>7 Days</Button>
          <Button variant="outline" onClick={() => setPeriod('30d')} className={period === '30d' ? 'bg-blue-500 text-white' : ''}>30 Days</Button>
          <Button variant="outline" onClick={() => setPeriod('90d')}>90 Days</Button>
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

      {/* Main Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="revenue">Revenue & Orders</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue & Orders Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Orders by Day</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Customers by Day</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="customers" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Funnel Tab */}
        <TabsContent value="conversion" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Funnel</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Segments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={aiPredictions} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {aiPredictions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-slate-700">Avg Churn Probability</span>
                  <span className="text-lg font-bold text-blue-600">{aiStats?.averageChurnProbability?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-slate-700">Total Predictions</span>
                  <span className="text-lg font-bold text-green-600">{aiStats?.totalPredictions || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-slate-700">Recommendations</span>
                  <span className="text-lg font-bold text-purple-600">{aiStats?.totalRecommendations || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-slate-700">Sentiment Analysis</span>
                  <span className="text-lg font-bold text-orange-600">{aiStats?.sentimentAnalysis?.positive || 0} Positive</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Vendor Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={vendorPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vendor" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" />
                <Bar dataKey="commission" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Marketplace Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-slate-600 text-sm">Total Vendors</p>
                <p className="text-2xl font-bold text-blue-600">{marketplaceStats?.totalVendors || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-slate-600 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">{marketplaceStats?.approvedVendors || 0}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-slate-600 text-sm">Total Sales</p>
                <p className="text-2xl font-bold text-purple-600">{marketplaceStats?.totalSales || 0}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-slate-600 text-sm">Commission Rate</p>
                <p className="text-2xl font-bold text-orange-600">{marketplaceStats?.averageCommissionRate?.toFixed(1) || 0}%</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Loyalty Engagement</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="badges" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="referrals" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Gamification Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg text-center">
                <p className="text-slate-600 text-sm">Members</p>
                <p className="text-2xl font-bold text-indigo-600">{gamificationStats?.totalMembers || 0}</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg text-center">
                <p className="text-slate-600 text-sm">Avg Points</p>
                <p className="text-2xl font-bold text-pink-600">{gamificationStats?.averagePointsPerMember || 0}</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg text-center">
                <p className="text-slate-600 text-sm">Redeemed</p>
                <p className="text-2xl font-bold text-cyan-600">{gamificationStats?.totalPointsRedeemed || 0}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Community Activity</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={communityActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reviews" fill="#3b82f6" />
                <Bar dataKey="posts" fill="#10b981" />
                <Bar dataKey="shares" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Community Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-slate-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{communityStats?.totalUsers || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-slate-600 text-sm">Reviews</p>
                <p className="text-2xl font-bold text-green-600">{communityStats?.totalReviews || 0}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-slate-600 text-sm">Posts</p>
                <p className="text-2xl font-bold text-purple-600">{communityStats?.totalPosts || 0}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-slate-600 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold text-orange-600">{communityStats?.averageRating?.toFixed(1) || 0}⭐</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
