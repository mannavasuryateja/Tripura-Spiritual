import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactSection: React.FC = () => {
  const { t } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setIsSubmitted(false);
      }, 6000);
    }, 800);
  };

  return (
    <section id="contact-us" className="max-w-6xl mx-auto px-6 sm:px-8">
      <div className="bg-[#141210] text-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative radial background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D1A559]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3B234A]/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 relative z-10 items-start">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
                {t.contactSection?.heading || 'Get in touch'}
              </h2>
              <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed mt-4 max-w-md">
                {t.contactSection?.subheading ||
                  'If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day.'}
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email Card */}
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center shrink-0 text-stone-200">
                    <Mail className="w-5 h-5 text-[#D1A559]" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-xs font-semibold text-white">
                      {t.contactSection?.emailLabel || 'Email'}
                    </span>
                    <a
                      href="mailto:contact@tripuraspiritual.com"
                      className="block text-xs text-stone-400 hover:text-amber-200 transition truncate mt-0.5"
                    >
                      {t.contactSection?.emailValue || 'contact@tripuraspiritual.com'}
                    </a>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center shrink-0 text-stone-200">
                    <Phone className="w-5 h-5 text-[#D1A559]" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-xs font-semibold text-white">
                      {t.contactSection?.phoneLabel || 'Phone'}
                    </span>
                    <a
                      href="tel:+919876543210"
                      className="block text-xs text-stone-400 hover:text-amber-200 transition truncate mt-0.5"
                    >
                      {t.contactSection?.phoneValue || '+91 98765 43210'}
                    </a>
                  </div>
                </div>

              </div>

              {/* Address Card */}
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-white/[0.07] border border-white/10 flex items-center justify-center shrink-0 text-stone-200">
                  <MapPin className="w-5 h-5 text-[#D1A559]" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white">
                    {t.contactSection?.addressLabel || 'Address'}
                  </span>
                  <span className="block text-xs text-stone-400 mt-0.5">
                    {t.contactSection?.addressValue || 'Hyderabad, Telangana, India'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-6 bg-black/40 rounded-2xl p-6 sm:p-8 border border-white/10 backdrop-blur-sm">
            
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif text-white font-medium">Message Sent Successfully!</h3>
                <p className="text-stone-300 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                  {t.contactSection?.successMessage ||
                    'Thank you for reaching out! We will get back to you within 1 business day.'}
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-stone-300 mb-1.5">
                    {t.contactSection?.nameLabel || 'Name'} <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0F0D0B] border border-white/15 text-white placeholder-stone-600 focus:outline-none focus:border-[#D1A559] focus:ring-1 focus:ring-[#D1A559] transition text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-stone-300 mb-1.5">
                    {t.contactSection?.emailFieldLabel || 'Email'} <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0F0D0B] border border-white/15 text-white placeholder-stone-600 focus:outline-none focus:border-[#D1A559] focus:ring-1 focus:ring-[#D1A559] transition text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-stone-300 mb-1.5">
                    {t.contactSection?.phoneFieldLabel || 'Phone'}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 Mobile number"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0F0D0B] border border-white/15 text-white placeholder-stone-600 focus:outline-none focus:border-[#D1A559] focus:ring-1 focus:ring-[#D1A559] transition text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-stone-300 mb-1.5">
                    {t.contactSection?.messageLabel || 'Message'} <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help or guide your spiritual journey?"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0F0D0B] border border-white/15 text-white placeholder-stone-600 focus:outline-none focus:border-[#D1A559] focus:ring-1 focus:ring-[#D1A559] transition text-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-lg bg-[#E5E5E5] hover:bg-white text-black font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>{t.contactSection?.sendingBtn || 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.contactSection?.submitBtn || 'Submit'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
