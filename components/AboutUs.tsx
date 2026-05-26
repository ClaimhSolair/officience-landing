import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
}

const R2 = 'https://pub-4f84cf40db4548bdaa61d64bc4aeba8a.r2.dev';

/* ── tiny SVG person (reused for stats) ── */
const PersonIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 20 28" className="w-[28px] h-[35px]">
    <circle cx="10" cy="7" r="5" fill={color} />
    <path d="M1 26c0-5 4-9 9-9s9 4 9 9" fill={color} />
  </svg>
);

const AboutUs: React.FC<AboutUsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* ─── Sticky Header ─── */}
            <div className="sticky top-0 z-10 bg-[#1F49BF] px-8 py-5 flex justify-between items-center">
              <h2
                className="font-sans font-bold text-white"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
              >
                About Officience
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 transition-colors text-white flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* ─── Scrollable Body ─── */}
            <div className="flex-1 overflow-y-auto bg-[#F7F7F7]">

              {/* ════════ SECTION 1 — WHO WE ARE ════════ */}
              <section className="bg-white">
                <div
                  className="bg-[#1F49BF] text-white px-8 py-4 font-sans font-bold"
                  style={{ fontSize: 'clamp(18px, 2.5vw, 30px)' }}
                >
                  Officience – Solutions To Support Your Growth
                </div>

                <div className="flex flex-col md:flex-row gap-7 items-stretch px-8 py-6">
                  <div className="flex-1 flex items-center py-4">
                    <p className="text-sm text-gray-800 leading-[1.8] italic">
                      <strong className="italic font-bold">Officience</strong> is a global IT player
                      born in Paris (2006). Since 20 years, our 270+ talented doers provide solutions
                      to empower international businesses. We analyze, design, and code with AI —
                      bringing Vietnamese agility to speed up your growth.
                    </p>
                  </div>
                  <div className="md:flex-[0_0_48%]">
                    <img
                      src={`${R2}/Office_view.png`}
                      alt="Officience Office — F Central"
                      className="w-full h-full object-cover block"
                    />
                  </div>
                </div>
              </section>

              {/* ════════ SECTION 2 — MAP + BULLETS + CAUSES ════════ */}
              <section className="bg-white px-8 py-8">
                <div className="flex flex-col md:flex-row gap-7 items-start">
                  <div className="flex-1">
                    <ul className="space-y-3">
                      {[
                        'Made in Vietnam – the faster tech hub in ASEAN (+6.5% yearly)',
                        'Serving 50+ corporates across 12 countries inc. FR, USA, SGP, JPN',
                        'Small teams, people magic 💚',
                        'Dedicated to our 5 Causes, with impact at heart',
                      ].map((text, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-800 leading-[1.7] font-medium">
                          <span className="w-2 h-2 bg-[#1F49BF] rounded-full flex-shrink-0 mt-[7px]" />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:flex-[0_0_50%]">
                    <img
                      src={`${R2}/location%20map.png`}
                      alt="Global Presence"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* 5 Causes */}
                <div className="flex flex-wrap justify-between gap-3 mt-7">
                  {[
                    { img: 'Social%20Entrepreneurship.png', label: 'Social Entrepreneurship' },
                    { img: 'Sharing%20Knowledge.png', label: 'Sharing Knowledge' },
                    { img: 'Sustainability.png', label: 'Sustainability' },
                    { img: 'Tech%20for%20Good.png', label: 'Tech for Good' },
                    { img: 'Developing%20Vietnam.png', label: 'Developing Vietnam' },
                  ].map((c) => (
                    <div key={c.label} className="text-center flex-1 min-w-[80px]">
                      <img
                        src={`${R2}/${c.img}`}
                        alt={c.label}
                        className="w-[52px] h-[52px] object-contain mx-auto mb-1.5"
                      />
                      <span className="text-[11px] text-gray-600 font-semibold leading-tight block">
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ════════ SECTION 3 — SOFT POWER / TEAM ════════ */}
              <section className="bg-white">
                {/* Title bar with "Meet our team" on right */}
                <div
                  className="bg-[#1F49BF] text-white px-8 py-4 font-sans font-bold flex justify-between items-center"
                  style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
                >
                  <span>SOFT POWER MADE IN VIETNAM</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    Meet our team
                    <div className="w-9 h-9 bg-[#1F49BF] border-2 border-white/40 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5 px-8 py-5">
                  {/* Left 65% — stats + diagrams (all centered) */}
                  <div className="md:flex-[0_0_65%] flex flex-col items-center justify-center">
                    {/* Stats row */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center mb-3">
                      {/* 220 members */}
                      <div>
                        <div className="flex flex-wrap gap-[1px]">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <PersonIcon key={`o${i}`} color="#F39C12" />
                          ))}
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="font-sans text-[35px] font-extrabold text-gray-900">220</span>
                          <span className="text-[18px] text-gray-500">members</span>
                        </div>
                      </div>

                      <span className="text-[19px] text-gray-400 font-medium">with</span>

                      {/* 2/3 women */}
                      <div>
                        <div className="flex flex-wrap gap-[1px]">
                          {[...Array(4)].map((_, i) => (
                            <PersonIcon key={`t${i}`} color="#5BC0BE" />
                          ))}
                          {[...Array(2)].map((_, i) => (
                            <PersonIcon key={`g${i}`} color="#ccc" />
                          ))}
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="font-sans text-[35px] font-extrabold text-gray-900">2/3</span>
                          <span className="text-[18px] text-gray-500">women</span>
                        </div>
                      </div>
                    </div>

                    {/* Diagrams */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                      <img
                        src={`${R2}/Cosmic.png`}
                        alt="Cosmic Values"
                        className="max-h-[200px] object-contain"
                      />
                      <img
                        src={`${R2}/3%20core.jpg`}
                        alt="Purpose, Autonomy, Mastery"
                        className="max-h-[200px] object-contain"
                      />
                    </div>
                  </div>

                  {/* Right 35% — portrait + quote */}
                  <div className="flex-1 flex flex-col gap-2.5 items-center">
                    <img
                      src={`${R2}/Team.jpg`}
                      alt="Team portrait"
                      className="w-3/4 rounded-[10px]"
                    />
                    <div className="text-xs text-gray-800 leading-relaxed border-l-[3px] border-[#c0392b] pl-2.5">
                      From Paris to Ho Chi Minh City
                      <br />
                      <strong className="text-[#1F49BF]">stylish &amp; energetic :)</strong>
                    </div>
                  </div>
                </div>
              </section>

              {/* ════════ SECTION 4 — FULL STACK SERVICES ════════ */}
              <section className="bg-[#F7F7F7]">
                {/* Title bar with ISO badge */}
                <div
                  className="bg-[#1F49BF] text-white px-8 py-4 font-sans font-bold flex justify-between items-center"
                  style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
                >
                  <span>FULL STACK SERVICES</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={`${R2}/ISO.png`}
                      alt="ISO 27001"
                      className="h-11 bg-white rounded-md p-1"
                    />
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                      Coming soon
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-8 py-6">
                  {[
                    {
                      icon: 'Creative%20Tribe.png',
                      name: 'Creative Tribe',
                      desc: 'Simply design & present your business online.',
                      tags: ['Brand Identity', 'UX/UI', 'Pro-images', 'Motion'],
                    },
                    {
                      icon: 'IT%20Craft.png',
                      name: 'IT Craft',
                      desc: 'Leverage your business with software & automation.',
                      tags: ['Website', 'Easy-commerce', 'Mobile apps', 'Enterprise apps'],
                    },
                    {
                      icon: 'Crunch.png',
                      name: 'Crunch',
                      desc: 'Build, process & scale your data factory.',
                      tags: ['Entry', 'Collect', 'Process', 'Support'],
                    },
                    {
                      icon: 'Analytics.png',
                      name: 'Analytics',
                      desc: 'Streamline operations and let your data perform.',
                      tags: ['Standardize', 'Analyze', 'Drive', 'Innovate'],
                    },
                    {
                      icon: 'IT%20Super.png',
                      name: 'IT Super',
                      desc: 'Keeping your tech stable & supervised.',
                      tags: ['System', 'Service', 'Support', 'Supervision'],
                    },
                    {
                      icon: 'People%20Operations.png',
                      name: 'People Operations',
                      desc: 'Unearthing Viet gems for your dream team.',
                      tags: ['HR operation', 'Social hiring', 'Culture', 'Viet talents'],
                    },
                  ].map((svc) => (
                    <div
                      key={svc.name}
                      className="bg-white rounded-2xl p-[18px] border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <img
                          src={`${R2}/${svc.icon}`}
                          alt=""
                          className="w-10 h-10 object-contain flex-shrink-0"
                        />
                        <h4 className="text-sm font-bold text-gray-900 font-sans">{svc.name}</h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-2.5 font-semibold">
                        {svc.desc}
                      </p>
                      <div className="flex flex-wrap gap-[5px]">
                        {svc.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-[3px] bg-[#f0f4ff] text-[#1F49BF] rounded-md font-bold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ════════ SECTION 5 — BORN & RAISED IN PARIS ════════ */}
              <section className="bg-white">
                <div
                  className="bg-[#1F49BF] text-white px-8 py-4 font-sans font-bold"
                  style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
                >
                  BORN &amp; RAISED IN PARIS
                </div>

                <div className="px-8 py-7">
                  <div className="flex flex-col md:flex-row gap-7 items-center mb-6">
                    <div className="flex-1">
                      <h3
                        className="font-sans font-extrabold text-gray-300 mb-2.5"
                        style={{ fontSize: '50px' }}
                      >
                        Officience
                      </h3>
                      <p className="text-[25px] text-gray-800 leading-relaxed">
                        Digital Services Company
                        <br />
                        at the heart of the French Tech ecosystem
                      </p>
                    </div>
                    <div className="md:flex-[0_0_48%]">
                      <img
                        src={`${R2}/France%20render1.png`}
                        alt="Station F — Paris"
                        className="w-full rounded-xl"
                      />
                      <p className="text-[13px] text-gray-500 leading-[1.7] italic mt-3">
                        In Paris, <em>'les Eco-workers du 47'</em> gather our network of{' '}
                        <strong className="font-bold text-gray-800">400+ consultants</strong>{' '}
                        dedicated to innovation. Design, tech, data, product, infrastructure,
                        organisation, coaching – ready to start with you.
                      </p>
                    </div>
                  </div>

                  {/* Partner logos — 2-row stacked left */}
                  <div className="flex flex-col items-start gap-5">
                    <div className="flex gap-8 items-center">
                      {[
                        { file: 'image23.png', alt: 'Women in Tech' },
                        { file: 'image26.png', alt: 'Le Wagon' },
                      ].map((p) => (
                        <img
                          key={p.file}
                          src={`${R2}/${p.file}`}
                          alt={p.alt}
                          className="h-[52px] w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                        />
                      ))}
                    </div>
                    <div className="flex gap-8 items-center">
                      {[
                        { file: 'image24.png', alt: 'Campus Cyber' },
                        { file: 'image25.png', alt: 'Passerelles Numériques' },
                        { file: 'image27.png', alt: 'Silicon Sentier' },
                      ].map((p) => (
                        <img
                          key={p.file}
                          src={`${R2}/${p.file}`}
                          alt={p.alt}
                          className="h-[52px] w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ════════ SECTION 6 — OUR CLIENTS ════════ */}
              <section className="bg-[#F7F7F7]">
                <div
                  className="bg-[#1F49BF] text-white px-8 py-4 font-sans font-bold"
                  style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
                >
                  OUR CLIENTS – You're In Good Company
                </div>

                <div className="px-8 py-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Team working photo */}
                    <div className="md:flex-[0_0_40%] rounded-2xl overflow-hidden">
                      <img
                        src={`${R2}/Office%20render%201.png`}
                        alt="Team working"
                        className="w-full h-auto rounded-2xl"
                      />
                    </div>

                    {/* Client logo grid */}
                    <div className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-2.5">
                      {Array.from({ length: 19 }, (_, i) => i + 29).map((n) => (
                        <div
                          key={n}
                          className="bg-white border border-gray-200 rounded-[10px] p-2 flex items-center justify-center h-[52px] hover:shadow-md transition-shadow"
                        >
                          <img
                            src={`${R2}/image${n}.png`}
                            alt="Client"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AboutUs;
