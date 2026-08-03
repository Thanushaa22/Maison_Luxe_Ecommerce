'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Mail, Phone, User, MapPin, CreditCard, Lock, Check, ChevronRight } from 'lucide-react';

interface FormData {
  email: string;
  phone: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  paymentMethod: 'card' | 'cod';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

const steps = ['Contact', 'Shipping', 'Payment'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const total = getTotal();
  const shipping = total >= 10000 ? 0 : 500;
  const grandTotal = total + shipping;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    }

    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.address1) newErrors.address1 = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    }

    if (step === 2 && formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid card number';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiry is required';
      if (!formData.cardCvc) newErrors.cardCvc = 'CVC is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(2, prev + 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          shippingAddress: {
            name: formData.name,
            phone: formData.phone,
            line1: formData.address1,
            line2: formData.address2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
          },
          paymentMethod: formData.paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      useCartStore.getState().clearCart();
      router.push('/orders');
    } catch (err: unknown) {
      setErrors({ submit: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  };

  const inputClass = (field: string) =>
    `w-full bg-white/5 border rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 font-body ${
      errors[field] ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'
    }`;

  return (
    <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mb-4">
            Checkout
          </h1>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12 max-w-md mx-auto">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-amber-500 text-black'
                      : index === currentStep
                      ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-500'
                      : 'bg-white/5 border border-white/10 text-white/30'
                  }`}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                <span
                  className={`text-xs font-body mt-2 tracking-wider ${
                    index <= currentStep ? 'text-amber-500' : 'text-white/30'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-[1px] mx-2 mb-6 transition-colors duration-300 ${
                    index < currentStep ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-xl p-6 sm:p-8"
                >
                  <h2 className="font-display text-xl text-white mb-6 flex items-center gap-3">
                    <Mail size={18} className="text-amber-500" />
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className={`${inputClass('email')} pl-11`}
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className={`${inputClass('phone')} pl-11`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.phone}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-xl p-6 sm:p-8"
                >
                  <h2 className="font-display text-xl text-white mb-6 flex items-center gap-3">
                    <MapPin size={18} className="text-amber-500" />
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          className={`${inputClass('name')} pl-11`}
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        placeholder="Street address"
                        value={formData.address1}
                        onChange={(e) => updateField('address1', e.target.value)}
                        className={inputClass('address1')}
                      />
                      {errors.address1 && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.address1}</p>}
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment, suite, etc. (optional)"
                        value={formData.address2}
                        onChange={(e) => updateField('address2', e.target.value)}
                        className={inputClass('address2')}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="Mumbai"
                          value={formData.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          className={inputClass('city')}
                        />
                        {errors.city && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                          State
                        </label>
                        <input
                          type="text"
                          placeholder="Maharashtra"
                          value={formData.state}
                          onChange={(e) => updateField('state', e.target.value)}
                          className={inputClass('state')}
                        />
                        {errors.state && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.state}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                          Pincode
                        </label>
                        <input
                          type="text"
                          placeholder="400001"
                          value={formData.pincode}
                          onChange={(e) => updateField('pincode', e.target.value)}
                          className={inputClass('pincode')}
                        />
                        {errors.pincode && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.pincode}</p>}
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => updateField('country', e.target.value)}
                          className={`${inputClass('country')} opacity-60`}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-xl p-6 sm:p-8"
                >
                  <h2 className="font-display text-xl text-white mb-6 flex items-center gap-3">
                    <CreditCard size={18} className="text-amber-500" />
                    Payment Method
                  </h2>

                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => updateField('paymentMethod', 'card')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        formData.paymentMethod === 'card'
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <CreditCard size={24} className={formData.paymentMethod === 'card' ? 'text-amber-400' : 'text-white/40'} />
                      <span className={`text-sm font-body ${formData.paymentMethod === 'card' ? 'text-amber-400' : 'text-white/60'}`}>Credit / Debit Card</span>
                    </button>
                    <button
                      onClick={() => updateField('paymentMethod', 'cod')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        formData.paymentMethod === 'cod'
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={formData.paymentMethod === 'cod' ? 'text-amber-400' : 'text-white/40'}>
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                      <span className={`text-sm font-body ${formData.paymentMethod === 'cod' ? 'text-amber-400' : 'text-white/60'}`}>Cash on Delivery</span>
                    </button>
                  </div>

                  {formData.paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => updateField('cardNumber', formatCardNumber(e.target.value))}
                            className={`${inputClass('cardNumber')} pl-11`}
                            maxLength={19}
                          />
                        </div>
                        {errors.cardNumber && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={(e) => updateField('cardExpiry', formatExpiry(e.target.value))}
                            className={inputClass('cardExpiry')}
                            maxLength={5}
                          />
                          {errors.cardExpiry && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.cardExpiry}</p>}
                        </div>
                        <div>
                          <label className="block text-white/60 text-xs tracking-widest uppercase mb-2 font-body">
                            CVC
                          </label>
                          <div className="relative">
                            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                              type="text"
                              placeholder="123"
                              value={formData.cardCvc}
                              onChange={(e) => updateField('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                              className={`${inputClass('cardCvc')} pl-11`}
                              maxLength={4}
                            />
                          </div>
                          {errors.cardCvc && <p className="text-red-400 text-xs mt-1.5 font-body">{errors.cardCvc}</p>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 text-center">
                      <p className="text-white/70 font-body text-sm mb-2">Pay with cash upon delivery.</p>
                      <p className="text-white/40 font-body text-xs">Please keep the exact amount ready. Our delivery partner will collect the payment at your doorstep.</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-4 text-white/30 text-xs font-body">
                    <Lock size={12} />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              {currentStep > 0 ? (
                <motion.button
                  whileHover={{ x: -3 }}
                  onClick={handleBack}
                  className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-body transition-colors"
                >
                  <ChevronRight size={14} className="rotate-180" />
                  Back
                </motion.button>
              ) : (
                <Link href="/cart" className="text-white/50 hover:text-white text-sm font-body transition-colors">
                  Return to bag
                </Link>
              )}

              {currentStep < 2 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-2"
                >
                  Continue
                  <ChevronRight size={14} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold tracking-wider uppercase text-sm rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      Place Order
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-400 text-sm mt-4 font-body">{errors.submit}</p>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-96"
          >
            <div className="sticky top-24 glass rounded-xl p-6">
              <h2 className="font-display text-xl text-white mb-6">Your Order</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-700/5 border border-amber-500/10 flex items-center justify-center">
                      <span className="text-amber-500/40 font-display text-sm">
                        {item.product.brand.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-body truncate">{item.product.name}</p>
                      <p className="text-white/40 text-xs font-body">{item.size} × {item.quantity}</p>
                    </div>
                    <p className="text-white/70 text-sm font-body flex-shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/50">Subtotal</span>
                  <span className="text-white/80">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/50">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white/80'}>
                    {shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-body tracking-wider">Total</span>
                  <span className="text-amber-400 font-display text-2xl">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
