import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, QrCode, CreditCard, Landmark, Smartphone, Loader2, ShieldCheck, MessageCircle, ExternalLink, AlertCircle, LogIn } from 'lucide-react';
import { paymentsApi } from '../api/client';

interface PaymentModalProps {
  onSuccessNavigate?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onSuccessNavigate }) => {
  const { isPaymentOpen, closePaymentModal, pendingPlan, user, refreshUserProfile, openAuthModal, t } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | 'card' | 'netbanking'>('qr');
  const [paymentState, setPaymentState] = useState<'form' | 'processing' | 'success'>('form');
  const [txnId, setTxnId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [whatsappCommunityUrl, setWhatsappCommunityUrl] = useState<string>('https://chat.whatsapp.com/TripuraSpiritualCommunityLive2026');

  const triggerRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isPaymentOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      triggerRef.current?.focus();
    }
  }, [isPaymentOpen]);

  if (!isPaymentOpen || !pendingPlan) return null;

  const mapProductType = (type: string) => {
    switch (type) {
      case 'live-session':
        return 'LIVE_SESSION';
      case 'recording-extension':
        return 'RECORDING_EXTENSION';
      case 'recordings-only':
        return 'RECORDINGS_ONLY';
      case 'book-audio':
        return 'BOOK_AUDIO';
      case '1on1':
        return 'ONE_TO_ONE';
      default:
        return 'LIVE_SESSION';
    }
  };

  const handlePay = async () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }

    setPaymentState('processing');
    setErrorMessage(null);

    try {
      const prodType = mapProductType(pendingPlan.type);
      
      // Step 1: Create real order on Spring Boot backend
      const orderRes = await paymentsApi.createOrder({
        productType: prodType,
        productId: pendingPlan.id,
        amount: pendingPlan.price,
        sessionId: pendingPlan.sessionId || 1,
        bookId: pendingPlan.bookId,
        bookingId: pendingPlan.bookingId
      });

      const orderData = orderRes.data || (orderRes as any);
      const orderId = orderData.orderId;

      // Check if Razorpay is initialized on window
      const Razorpay = (window as any).Razorpay;
      const isRazorpayConfigured = orderData.keyId && !orderData.keyId.startsWith('rzp_test_mock');

      if (Razorpay && isRazorpayConfigured) {
        // Open official Razorpay modal
        const options = {
          key: orderData.keyId,
          amount: Math.round(Number(pendingPlan.price) * 100),
          currency: 'INR',
          name: 'Tripura Spiritual',
          description: pendingPlan.name,
          order_id: orderId,
          handler: async (response: any) => {
            try {
              // Step 2: Verify signature on backend
              const verifyRes = await paymentsApi.verify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              setTxnId(response.razorpay_payment_id);
              if (verifyRes.data?.whatsappCommunityUrl) {
                setWhatsappCommunityUrl(verifyRes.data.whatsappCommunityUrl);
              }
              await refreshUserProfile();
              setPaymentState('success');
            } catch (err: any) {
              paymentsApi.recordFailure({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                reason: err.response?.data?.message || 'VERIFICATION_FAILED'
              }).catch(() => {});
              setErrorMessage(err.response?.data?.message || 'Payment verification failed.');
              setPaymentState('form');
            }
          },
          prefill: {
            name: user.name,
            email: user.email || '',
            contact: user.phone || ''
          },
          theme: {
            color: '#8B5E34'
          },
          modal: {
            ondismiss: () => {
              paymentsApi.recordFailure({
                razorpayOrderId: orderId,
                reason: 'USER_CANCELLED_CHECKOUT'
              }).catch(() => {});
              setPaymentState('form');
            }
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        // Test / Sandbox mode: Process verification securely through backend
        const simulatedPaymentId = 'pay_' + Math.floor(100000000 + Math.random() * 900000000);
        const verifyRes = await paymentsApi.verify({
          razorpayOrderId: orderId,
          razorpayPaymentId: simulatedPaymentId,
          razorpaySignature: 'mock_signature_' + simulatedPaymentId
        });

        setTxnId(simulatedPaymentId);
        if (verifyRes.data?.whatsappCommunityUrl) {
          setWhatsappCommunityUrl(verifyRes.data.whatsappCommunityUrl);
        }
        await refreshUserProfile();
        setPaymentState('success');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Payment initiation failed. Please check network connection.';
      setErrorMessage(msg);
      setPaymentState('form');
    }
  };

  const handleFinish = () => {
    closePaymentModal();
    setPaymentState('form');
    if (onSuccessNavigate) onSuccessNavigate();
  };

  const handleJoinWhatsApp = () => {
    window.open(whatsappCommunityUrl, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-backdrop-fade overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && paymentState !== 'processing') {
          closePaymentModal();
          setPaymentState('form');
        }
      }}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        tabIndex={-1}
        className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E6E0D2] relative overflow-hidden animate-modal-scale-in focus:outline-none my-auto"
      >
        
        {/* Close Button */}
        {paymentState !== 'processing' && (
          <button
            type="button"
            onClick={() => { closePaymentModal(); setPaymentState('form'); }}
            className="absolute top-4 right-4 p-2.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Checkout Modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STATE 1: PAYMENT SELECTION FORM */}
        {paymentState === 'form' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#8B5E34] block">
                Secure Checkout
              </span>
              <h3 id="payment-modal-title" className="font-serif text-2xl font-bold text-[#2C2421]">
                Tripura Spiritual Gateway
              </h3>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Non-logged in notice */}
            {!user.isLoggedIn && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>Please sign in so your purchase can be permanently linked to your account.</span>
                </div>
                <button
                  onClick={openAuthModal}
                  className="px-4 py-2 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs uppercase tracking-wider shrink-0 transition min-h-[40px]"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Order Summary */}
            <div className="card-surface p-4 bg-white border border-[#E6E0D2] rounded-2xl shadow-xs">
              <h4 className="text-xs font-bold text-[#8B5E34] uppercase tracking-wider mb-2">
                {t.payment.title}
              </h4>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-serif font-bold text-[#2C2421] text-base">{pendingPlan.name}</p>
                  <p className="text-xs text-stone-600 mt-0.5">{pendingPlan.details || 'Includes authorized access and recordings'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[#2C2421] text-2xl font-sans">₹{pendingPlan.price}</p>
                  <span className="text-[10px] text-emerald-700 font-bold block">Taxes Included</span>
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {t.payment.methodTitle}
              </label>
              
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer min-h-[48px] ${
                    paymentMethod === 'qr'
                      ? 'border-[#3B234A] bg-[#EFE9DD] text-[#3B234A] font-bold shadow-xs'
                      : 'border-[#E6E0D2] bg-white text-stone-700 hover:bg-[#F3EDE0]'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#8B5E34] shrink-0" />
                  <div>
                    <span className="block text-xs">UPI QR Code</span>
                    <span className="text-[10px] text-stone-500 font-normal">GPay / PhonePe / Paytm</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer min-h-[48px] ${
                    paymentMethod === 'upi'
                      ? 'border-[#3B234A] bg-[#EFE9DD] text-[#3B234A] font-bold shadow-xs'
                      : 'border-[#E6E0D2] bg-white text-stone-700 hover:bg-[#F3EDE0]'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#8B5E34] shrink-0" />
                  <div>
                    <span className="block text-xs">UPI ID / App</span>
                    <span className="text-[10px] text-stone-500 font-normal">Direct Mobile UPI</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer min-h-[48px] ${
                    paymentMethod === 'card'
                      ? 'border-[#3B234A] bg-[#EFE9DD] text-[#3B234A] font-bold shadow-xs'
                      : 'border-[#E6E0D2] bg-white text-stone-700 hover:bg-[#F3EDE0]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#8B5E34] shrink-0" />
                  <div>
                    <span className="block text-xs">Debit / Credit</span>
                    <span className="text-[10px] text-stone-500 font-normal">Visa / MasterCard / RuPay</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer min-h-[48px] ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#3B234A] bg-[#EFE9DD] text-[#3B234A] font-bold shadow-xs'
                      : 'border-[#E6E0D2] bg-white text-stone-700 hover:bg-[#F3EDE0]'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-[#8B5E34] shrink-0" />
                  <div>
                    <span className="block text-xs">Net Banking</span>
                    <span className="text-[10px] text-stone-500 font-normal">All Major Indian Banks</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Method Details View */}
            {paymentMethod === 'qr' && (
              <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E6E0D2] text-center space-y-2">
                <div className="bg-white p-3 inline-block rounded-2xl shadow-sm border border-[#E6E0D2]">
                  <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    <path d="M10 10h30v30H10zM15 15v20h20V15zM20 20h10v10H20z" fill="#2C2421"/>
                    <path d="M60 10h30v30H60zM65 15v20h20V15zM70 20h10v10H70z" fill="#2C2421"/>
                    <path d="M10 60h30v30H10zM15 65v20h20V65zM20 70h10v10H20z" fill="#2C2421"/>
                    <rect x="45" y="10" width="10" height="20" fill="#8B5E34"/>
                    <rect x="45" y="45" width="20" height="10" fill="#2C2421"/>
                    <rect x="70" y="50" width="20" height="20" fill="#8B5E34"/>
                    <rect x="50" y="70" width="15" height="20" fill="#2C2421"/>
                    <rect x="75" y="80" width="15" height="10" fill="#2C2421"/>
                  </svg>
                </div>
                <p className="text-xs text-stone-700 font-medium">Scan QR with GPay / PhonePe / Paytm / BHIM</p>
                <p className="text-[10px] text-[#8B5E34] font-semibold font-mono">UPI ID: tripuraspiritual@upi</p>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="yourname@upi"
                  defaultValue={user.phone ? `${user.phone}@upi` : "seeker@upi"}
                  className="w-full px-4 py-3 rounded-2xl border border-[#D8CFBF] bg-white text-sm font-mono focus:border-[#3B234A] outline-none min-h-[48px]"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2.5 text-xs">
                <input type="text" placeholder="Card Number (4111 2222 3333 4444)" defaultValue="4111 •••• •••• 9876" className="w-full px-4 py-3 rounded-2xl border border-[#D8CFBF] bg-white text-sm font-mono min-h-[48px]" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="MM/YY (12/28)" defaultValue="12/28" className="px-3 py-2.5 rounded-xl border border-[#D8CFBF] bg-white text-sm font-mono min-h-[44px]" />
                  <input type="password" placeholder="CVV (123)" defaultValue="123" className="px-3 py-2.5 rounded-xl border border-[#D8CFBF] bg-white text-sm font-mono min-h-[44px]" />
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <select className="w-full px-4 py-3 rounded-2xl border border-[#D8CFBF] bg-white text-sm min-h-[48px]">
                <option>State Bank of India (SBI)</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
              </select>
            )}

            {/* Submit Button */}
            <button
              onClick={handlePay}
              className="btn-spiritual btn-primary w-full py-4 text-white font-bold text-sm tracking-wider uppercase shadow-lg transition flex items-center justify-center gap-2 min-h-[48px]"
            >
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <span>{t.payment.payButton} ₹{pendingPlan.price}</span>
            </button>
          </div>
        )}

        {/* STATE 2: PROCESSING SCREEN */}
        {paymentState === 'processing' && (
          <div className="py-14 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#8B5E34] motion-safe:animate-spin mx-auto" />
            <h4 className="font-serif text-xl font-bold text-[#2C2421]">
              {t.payment.processing}
            </h4>
            <p className="text-xs text-stone-600 max-w-xs mx-auto font-normal">
              Connecting securely to Tripura Spiritual gateway. Please do not close or refresh this window.
            </p>
          </div>
        )}

        {/* STATE 3: PAYMENT SUCCESS RECEIPT & WHATSAPP COMMUNITY REDIRECTION */}
        {paymentState === 'success' && (
          <div className="py-4 text-center space-y-5 animate-fadeIn text-[#2C2421]">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="font-serif text-2xl font-bold text-[#2C2421]">
                {t.payment.successTitle}
              </h4>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                {pendingPlan.name} is now active and verified!
              </p>
            </div>

            {/* WHATSAPP COMMUNITY INVITATION CARD */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg space-y-3 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-serif font-bold text-base leading-tight">
                    Join Private WhatsApp Community
                  </h5>
                  <p className="text-[11px] text-emerald-100">
                    Live Zoom links & daily master interactions
                  </p>
                </div>
              </div>

              <p className="text-xs text-emerald-50 leading-relaxed font-light">
                Please click below to join our private WhatsApp group where Master Gorli Peddi Raju Garu shares the daily 6:30 AM live session links and meditation guidance.
              </p>

              <button
                onClick={handleJoinWhatsApp}
                className="w-full py-3.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs tracking-wider uppercase shadow-md transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>Join WhatsApp Group Now</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Transaction Details */}
            <div className="bg-[#FAF7F0] rounded-2xl p-4 border border-[#E6E0D2] text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-[#E6E0D2] pb-2">
                <span className="text-stone-500">{t.payment.txnId}</span>
                <span className="font-bold text-stone-900">{txnId}</span>
              </div>
              <div className="flex justify-between border-b border-[#E6E0D2] pb-2">
                <span className="text-stone-500">Amount Paid</span>
                <span className="font-bold text-stone-900">₹{pendingPlan.price}</span>
              </div>
              <div className="flex justify-between border-b border-[#E6E0D2] pb-2">
                <span className="text-stone-500">Gateway Status</span>
                <span className="font-bold text-emerald-700">VERIFIED & PAID</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Access Validity</span>
                <span className="font-bold text-emerald-700">
                  {pendingPlan.type === 'recording-extension' || pendingPlan.type === 'recordings-only'
                    ? '30 Days from Date of Purchase'
                    : pendingPlan.type === 'book-audio'
                    ? 'Permanent / Lifetime Access'
                    : 'Live Batch (1st–11th) • Recordings Valid till 13th Day'}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="btn-spiritual btn-primary w-full py-3.5 text-white font-bold text-sm tracking-wider uppercase shadow-md transition cursor-pointer min-h-[48px]"
            >
              {t.payment.goToDashboard}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
