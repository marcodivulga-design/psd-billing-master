import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { Gift, Trophy, Share2, Copy, Heart, Package, Clock } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export function CustomerDashboard() {
  const [copied, setCopied] = useState(false);

  // Fetch customer data
  const { data: loyaltyAccount } = trpc.gamification.getLoyaltyAccount.useQuery();
  const { data: badges } = trpc.gamification.getUserBadges.useQuery();
  const { data: achievements } = trpc.gamification.getUserAchievements.useQuery();
  const { data: referrals } = trpc.gamification.getMyReferrals.useQuery();

  // Points history
  const pointsHistory = [
    { date: '01', points: 100, action: 'Purchase' },
    { date: '02', points: 50, action: 'Review' },
    { date: '03', points: 25, action: 'Referral' },
    { date: '04', points: 200, action: 'Purchase' },
    { date: '05', points: 75, action: 'Share' },
    { date: '06', points: 150, action: 'Purchase' },
    { date: '07', points: 100, action: 'Birthday Bonus' },
  ];

  // Orders
  const orders = [
    { id: '#12345', date: '2024-05-01', total: 'R$ 250', status: 'Delivered', items: 2 },
    { id: '#12344', date: '2024-04-28', total: 'R$ 180', status: 'Delivered', items: 1 },
    { id: '#12343', date: '2024-04-20', total: 'R$ 450', status: 'Delivered', items: 3 },
    { id: '#12342', date: '2024-04-15', total: 'R$ 120', status: 'Delivered', items: 1 },
  ];

  // Tier progression
  const tierData = [
    { tier: 'Bronze', min: 0, max: 1000, current: 850 },
    { tier: 'Silver', min: 1000, max: 5000, current: 0 },
    { tier: 'Gold', min: 5000, max: 10000, current: 0 },
    { tier: 'Platinum', min: 10000, max: 99999, current: 0 },
  ];

  const referralCode = 'MARCO2024';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">My Account</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's your loyalty summary.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600">Current Tier</p>
          <p className="text-3xl font-bold text-amber-600">Bronze ⭐</p>
        </div>
      </div>

      {/* Loyalty Card */}
      <Card className="p-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-amber-100 text-sm font-semibold">LOYALTY POINTS</p>
            <p className="text-5xl font-bold mt-2">{loyaltyAccount?.points || 0}</p>
            <p className="text-amber-100 mt-2">Next tier: {1000 - (loyaltyAccount?.points || 0)} points</p>
          </div>
          <div className="text-right">
            <p className="text-amber-100 text-sm font-semibold">TIER PROGRESS</p>
            <div className="mt-4 w-48 bg-white bg-opacity-30 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all" 
                style={{ width: `${((loyaltyAccount?.points || 0) / 1000) * 100}%` }}
              ></div>
            </div>
            <p className="text-amber-100 mt-2 text-sm">{((loyaltyAccount?.points || 0) / 1000 * 100).toFixed(0)}% to Silver</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">R$ 2.850</p>
            </div>
            <Gift className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Badges Earned</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{badges?.length || 0}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Referrals</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{referrals?.length || 0}</p>
            </div>
            <Share2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="points" className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="points">Points & Rewards</TabsTrigger>
          <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="referral">Referral Program</TabsTrigger>
        </TabsList>

        {/* Points Tab */}
        <TabsContent value="points" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Points History</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={pointsHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="points" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">How to Earn Points</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-slate-700">Purchase</span>
                  <span className="font-bold text-blue-600">1 point per R$ 1</span>
                </div>
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-slate-700">Leave a Review</span>
                  <span className="font-bold text-green-600">50 points</span>
                </div>
                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-slate-700">Referral</span>
                  <span className="font-bold text-purple-600">100 points</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-slate-700">Birthday Bonus</span>
                  <span className="font-bold text-orange-600">100 points</span>
                </div>
                <div className="flex justify-between p-3 bg-pink-50 rounded-lg">
                  <span className="text-slate-700">Share Product</span>
                  <span className="font-bold text-pink-600">25 points</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Redeem Points</h3>
              <div className="space-y-3">
                <div className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900">R$ 10 Discount</p>
                      <p className="text-sm text-slate-600">100 points</p>
                    </div>
                    <Button size="sm" variant="outline">Redeem</Button>
                  </div>
                </div>
                <div className="p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer opacity-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900">R$ 25 Discount</p>
                      <p className="text-sm text-slate-600">250 points</p>
                    </div>
                    <Button size="sm" variant="outline" disabled>Redeem</Button>
                  </div>
                </div>
                <div className="p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer opacity-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900">Free Shipping</p>
                      <p className="text-sm text-slate-600">500 points</p>
                    </div>
                    <Button size="sm" variant="outline" disabled>Redeem</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Badges</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {badges?.map((badge, idx) => (
                <div key={idx} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="font-semibold text-slate-900 text-sm">{badge.name}</p>
                  <p className="text-xs text-slate-600 mt-1">Unlocked</p>
                </div>
              ))}
              <div className="text-center p-4 bg-slate-100 rounded-lg opacity-50">
                <div className="text-4xl mb-2">🎯</div>
                <p className="font-semibold text-slate-900 text-sm">Locked</p>
                <p className="text-xs text-slate-600 mt-1">Coming soon</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Achievements</h3>
            <div className="space-y-3">
              {achievements?.map((achievement, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">⭐</div>
                    <div>
                      <p className="font-semibold text-slate-900">{achievement.name}</p>
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{achievement.progress}%</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Order History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Total</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Items</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{order.id}</td>
                      <td className="py-3 px-4 text-slate-600">{order.date}</td>
                      <td className="text-right py-3 px-4 font-semibold text-slate-900">{order.total}</td>
                      <td className="text-center py-3 px-4 text-slate-600">{order.items}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          {order.status}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Button size="sm" variant="outline">Track</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Referral Tab */}
        <TabsContent value="referral" className="space-y-4">
          <Card className="p-8 bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <h3 className="text-2xl font-bold mb-4">Invite Friends & Earn Rewards</h3>
            <p className="text-green-50 mb-6">Share your referral code and earn 100 points for each friend who makes their first purchase!</p>
            
            <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-sm">
              <p className="text-green-100 text-sm mb-2">Your Referral Code</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={referralCode} 
                  readOnly 
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-slate-900 font-bold text-lg"
                />
                <Button 
                  onClick={copyToClipboard}
                  className="bg-white text-green-600 hover:bg-green-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Referral Rewards</h3>
            <div className="space-y-3">
              {referrals?.map((referral, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900">{referral.refereeEmail || 'Friend'}</p>
                    <p className="text-sm text-slate-600">{referral.claimedAt ? 'Completed' : 'Pending'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{referral.points} points</p>
                    <p className="text-sm text-slate-600">{referral.discount}% discount for friend</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
