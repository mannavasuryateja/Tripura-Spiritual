import React from 'react';
import { Sparkles, Compass, Sun, BookOpen, Award, Mail, Phone, MessageCircle, Quote } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';

export const About: React.FC = () => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-[#2C2421]">
      
      {/* Hero Header */}
      <ScrollReveal animation="fade-up">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9DD] text-[#3B234A] text-xs font-bold uppercase tracking-widest border border-[#D8CFBF]">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5E34]" />
            <span>Master's Direct Voice & Philosophy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2421]">
            About Tripura Spiritual
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-light">
            Bridging ancient Vedic wisdom, pranayama, and holistic energy healing to bring effortless clarity, stillness, and vitality into your daily modern life.
          </p>
        </div>
      </ScrollReveal>

      {/* Direct First-Person Master Showcase */}
      <ScrollReveal animation="hero-zoom" duration={850}>
        <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-[#E6E0D2] shadow-xl space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Master Image Frame */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative">
                <div className="w-56 h-72 sm:w-64 sm:h-80 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 border-4 border-[#E6E0D2] flex items-center justify-center shadow-xl overflow-hidden">
                  <img 
                    src="/instructor/gorli-peddi-raju.jpg" 
                    alt="Gorli Peddi Raju - Spiritual Master" 
                    className="w-full h-full object-cover img-zoom-hover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-full border-4 border-[#D8CFBF] flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-[#8B5E34]" />
                </div>
              </div>
            </div>

            {/* Master Direct Speech */}
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E34]">
                  Spiritual Guide & Healer
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2421]">
                  "I am Gorli Peddi Raju"
                </h2>
                <p className="text-sm font-semibold text-[#8B5E34]">
                  Life Spiritual Coach • Certified Reiki & Pranic Healer • Ho'oponopono Coach • Kriya Sadhaka
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-[#8B5E34] to-[#D1A559] rounded-full mt-2"></div>
              </div>

              {/* Direct First Person Narrative */}
              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  "Welcome to Tripura Spiritual. For over a decade, my life's single purpose has been to help sincere seekers pierce through mental restlessness and discover the boundless ocean of silence that already resides within."
                </p>
                <p>
                  "I do not teach spirituality as an abstract intellectual philosophy. True transformation happens when your breath aligns with your life force (Prana), when subconscious emotional trauma is released through sacred sound and Ho'oponopono forgiveness, and when you learn to abide as the calm witness of your daily thoughts."
                </p>
                <p>
                  "Whether you join me for our 11-day live masterclasses, listen to my chapter commentaries in the Book Library, or speak with me in a private 1-on-1 session, my promise is to provide practical, compassionate, and authentic guidance in both English and Telugu."
                </p>
              </div>

              <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E6E0D2] flex items-start gap-3 text-xs italic text-stone-800">
                <Quote className="w-5 h-5 text-[#8B5E34] shrink-0 mt-0.5" />
                <span>
                  "Spiritual awakening is not about escaping your family or career. It is about bringing 100% awareness and joyful presence into every single breath you take."
                </span>
              </div>
            </div>

          </div>

          {/* 3 Core Pillars in Master's Words */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#F0EBE1]">
            <div className="p-6 rounded-2xl bg-white border border-[#E6E0D2] shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C2421]">1. Authentic Wisdom</h3>
              <p className="text-stone-600 text-xs leading-relaxed font-light">
                I break down the profound Sanskrit secrets of Tripura Rahasya, Gita, and Yoga Vasistha into crystal-clear actionable principles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E6E0D2] shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C2421]">2. Daily Guided Practice</h3>
              <p className="text-stone-600 text-xs leading-relaxed font-light">
                I guide you every morning at 6:30 AM in live pranayama, Kriya postures, and dhyana, answering your personal questions directly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E6E0D2] shadow-xs space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C2421]">3. Permanent Transformation</h3>
              <p className="text-stone-600 text-xs leading-relaxed font-light">
                I give you lifelong inner anchors so you remain calm, emotionally unshakable, and centered in joy amidst all life situations.
              </p>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* Certifications & Healing Credentials */}
      <ScrollReveal animation="fade-up">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#E6E0D2] shadow-lg space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E34]">
              My Training & Certifications
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2C2421]">
              Holistic Disciplines & Lineages
            </h2>
            <p className="text-stone-600 text-sm font-light">
              My teaching is backed by rigorous traditional initiations, master certifications, and thousands of hours of guided student practice.
            </p>
          </div>

          <StaggerContainer staggerDelay={100} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Reiki Master Certification", desc: "Attuned in traditional Usui Reiki system for bio-energetic balancing and chakra clearing.", image: "/certificates/reiki-master.jpg" },
              { title: "Pranic Healing Practitioner", desc: "Certified in no-touch energy scanning, aura purification, and vital prana energization.", image: "/certificates/pranic-healing.jpg" },
              { title: "Ho'oponopono Hawaiian Healing", desc: "Master coach in Hawaiian subconscious forgiveness and emotional cleansing methodology.", image: "/certificates/hoopono-practitioner.jpg" },
              { title: "Classical Yoga & Pranayama", desc: "Rigorous training in Ashtanga breathwork, Bandhas, and subtle Nadi purification.", image: "/certificates/yoga-pranayama.jpg" },
              { title: "Advaita & Non-Dual Meditation", desc: "Direct lineage study of Tripura Rahasya and Nisargadatta Maharaj self-inquiry methods.", image: "/certificates/meditation-specialist.jpg" },
              { title: "Aura & Energy Analysis", desc: "Specialized in subtle body aura prediction, vitality assessment, and spiritual roadmaps.", image: "/certificates/advanced-training.jpg" }
            ].map((cert, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E6E0D2] shadow-xs space-y-3 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-[#EFE9DD] text-[#3B234A] flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h4 className="font-serif font-bold text-base text-[#2C2421]">{cert.title}</h4>
                <p className="text-xs text-stone-600 font-light leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </ScrollReveal>

      {/* Connect Directly With Master Gorli Peddi Raju Garu */}
      <ScrollReveal animation="fade-up">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#3B234A] text-white shadow-xl space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Open Avenues of Communication
            </span>
            <h3 className="font-serif text-3xl font-bold">
              Connect Directly With Me
            </h3>
            <p className="text-stone-300 text-sm font-light leading-relaxed">
              Whether you have a spiritual query, wish to schedule a 1-on-1 consultation, or seek advice regarding our upcoming masterclasses, I welcome you with open arms and high-frequency blessings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
            {/* Email */}
            <a href="mailto:g.peddiraju888@gmail.com" className="btn-spiritual flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 transition">
              <div className="h-12 w-12 rounded-xl bg-[#D1A559] text-stone-900 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-stone-300 uppercase tracking-wider font-semibold">Direct Email ID</p>
                <p className="text-amber-200 font-bold text-sm">g.peddiraju888@gmail.com</p>
              </div>
            </a>

            {/* Phone */}
            <a href="tel:+918919307373" className="btn-spiritual flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 transition">
              <div className="h-12 w-12 rounded-xl bg-[#D1A559] text-stone-900 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-stone-300 uppercase tracking-wider font-semibold">Phone & WhatsApp</p>
                <p className="text-amber-200 font-bold text-sm">+91 891-9307373</p>
              </div>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <a 
              href="https://chat.whatsapp.com/GHY78TripuraMasterclassLive" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-spiritual flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 font-bold text-xs tracking-wider uppercase text-white shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join WhatsApp Community</span>
            </a>

            <a 
              href="tel:+918919307373"
              className="btn-spiritual flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 font-bold text-xs tracking-wider uppercase text-white"
            >
              <Phone className="w-4 h-4" />
              <span>Call for Inquiries</span>
            </a>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};


