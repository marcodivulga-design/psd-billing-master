import React, { useState } from 'react';
import { useRouter } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutState {
  step: 'cart' | 'address' | 'payment' | 'confirmation';
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  loading: boolean;
  error: string | null;
}

export function CheckoutPage() {
  const [, navigate] = useRouter();
  const [state, setState] = useState<CheckoutState>({
    step: 'cart',
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    paymentMethod: 'credit_card',
    loading: false,
    error: null,
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'BR',
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, step: 'payment' }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Aqui você chamaria a API de pagamento
      // const response = await trpc.payments.create.mutate({...})

      // Simulação
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setState((prev) => ({
        ...prev,
        step: 'confirmation',
        loading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'Payment failed',
      }));
    }
  };

  const handleBackStep = () => {
    setState((prev) => {
      const steps: CheckoutState['step'][] = ['cart', 'address', 'payment'];
      const currentIndex = steps.indexOf(prev.step);
      return {
        ...prev,
        step: currentIndex > 0 ? steps[currentIndex - 1] : 'cart',
      };
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Step {state.step === 'cart' ? '1' : state.step === 'address' ? '2' : state.step === 'payment' ? '3' : '4'} of 4
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cart Step */}
            {state.step === 'cart' && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {state.items.length === 0 ? (
                    <p className="text-muted-foreground">Your cart is empty</p>
                  ) : (
                    state.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center pb-4 border-b">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))
                  )}
                </div>
                <Button
                  onClick={() => setState((prev) => ({ ...prev, step: 'address' }))}
                  className="w-full mt-6"
                  disabled={state.items.length === 0}
                >
                  Continue to Address
                </Button>
              </Card>
            )}

            {/* Address Step */}
            {state.step === 'address' && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="number">Number</Label>
                      <Input
                        id="number"
                        value={formData.number}
                        onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="complement">Complement</Label>
                      <Input
                        id="complement"
                        value={formData.complement}
                        onChange={(e) => setFormData((prev) => ({ ...prev, complement: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={handleBackStep} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Payment Step */}
            {state.step === 'payment' && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <RadioGroup
                    value={state.paymentMethod}
                    onValueChange={(value: any) =>
                      setState((prev) => ({ ...prev, paymentMethod: value }))
                    }
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                        Credit Card
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex-1 cursor-pointer">
                        PIX
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="boleto" id="boleto" />
                      <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                        Boleto
                      </Label>
                    </div>
                  </RadioGroup>

                  {state.error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                      {state.error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={handleBackStep} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" disabled={state.loading} className="flex-1">
                      {state.loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Complete Purchase'
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Confirmation Step */}
            {state.step === 'confirmation' && (
              <Card className="p-6 mb-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your purchase. You will receive an email confirmation shortly.
                </p>
                <Button onClick={() => navigate('/')} className="w-full">
                  Continue Shopping
                </Button>
              </Card>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {state.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>R$ {state.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>R$ {state.tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>R$ {state.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
