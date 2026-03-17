'use client';

import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

const CheckoutForm = ({ shippingAddress, clientSecret }) => {
  const { theme } = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Create order in database
        const orderData = {
          shippingAddress,
          paymentIntentId: paymentIntent.id,
          items: cart.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor?.name || item.selectedColor,
            sku: item.sku,
            image: item.image || item.images?.[0]?.url || item.images?.[0]
          })),
          total: total + 200, // Matching API's expectation of total including shipping
        };

        const { data } = await axios.post('/api/orders', orderData);
        toast.success('Order placed successfully!');
        clearCart();
        router.push(`/orders/tracking?id=${data.order.orderId}`);
      }
    } catch (err) {
      console.error('Payment confirmation error:', err);
      toast.error('An error occurred during payment processing.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className={`p-6 border shadow-sm ${theme.utilities.bgSurface} ${theme.utilities.border}`}>
        <h3 className={`text-sm font-bold uppercase tracking-widest ${theme.utilities.textPrimary} mb-6`}>Payment Information</h3>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full ${theme.components.buttonPrimary} h-14 flex items-center justify-center space-x-3 disabled:opacity-50`}
      >
        <span>{loading ? 'Processing...' : `Pay Rs. ${(total + 200).toLocaleString()}`}</span>
      </button>
      
      <p className={`text-[10px] text-center ${theme.utilities.textMuted} uppercase tracking-widest leading-relaxed`}>
        Your payment is secured with 256-bit encryption. <br />
        By clicking pay, you agree to our terms and conditions.
      </p>
    </form>
  );
};

export default CheckoutForm;
