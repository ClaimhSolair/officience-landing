import React from 'react';
import { ASSETS } from '../assets';

const testimonials = [
  {
    quote: '"I really appreciate the team’s availability & responsiveness."',
    name: 'Mr. Leurette',
    role: 'Program Director - Orange',
    image: ASSETS.testimonials.authors[0],
    bordered: true,
  },
  {
    quote: '"Officience had become our main partner and I don’t regret it a single day."',
    name: 'Dr. Jean Marcel Guillon',
    role: 'FV Hospital',
    image: ASSETS.testimonials.authors[1],
    bordered: false,
  },
  {
    quote: '“ Without you, I just could not work.”',
    name: 'L. Lemaire',
    role: 'Director of Sales',
    image: ASSETS.testimonials.authors[2],
    bordered: false,
  },
];

const ClientStories: React.FC = () => {
  return (
    <section id="clients" className="w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)]">
      {/* Section: gap-64, centered */}
      <div className="flex flex-col gap-[clamp(40px,5vw,64px)] items-center">

        {/* Header — centered, gap-20 */}
        <div className="flex flex-col gap-[20px] items-center text-center max-w-[1400px]">
          <h2 className="t-display-xl text-text-default">People Trust Us</h2>
          <p className="t-subtitle text-subtitle">Success stories across different domains</p>
        </div>

        {/* Testimonial cards — card1 517px, others flex; gap-24 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[517px_1fr_1fr] gap-[24px] items-stretch">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-bg-default rounded-fig-m shadow-fig-xs flex flex-col gap-[20px] p-[36px]"
            >
              <img
                src={ASSETS.testimonials.quote}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className="rotate-180"
                style={{ width: 40, height: 40 }}
              />
              <p className="t-body-xl text-text-default flex-grow">{t.quote}</p>

              <div className="flex items-center gap-[12px]">
                <img
                  src={t.image}
                  alt={t.name}
                  width={60}
                  height={60}
                  className={`w-[60px] h-[60px] rounded-full object-cover shrink-0 ${t.bordered ? 'border border-[#e8e8e8]' : ''}`}
                  loading="lazy"
                />
                <div className="flex flex-col gap-[4px]">
                  <p className="t-h3 text-text-default">{t.name}</p>
                  <p className="t-body-xl text-subtitle">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client logos — marquee. Sources are trimmed to their content bbox, then each is
            fit into a uniform box (max-height + max-width, aspect preserved) so logos read at
            a consistent optical size. Track contains the set duplicated twice for a seamless loop. */}
        <div className="w-full overflow-hidden">
          <div className="flex w-max marquee-track animate-marquee items-center">
            {[...ASSETS.clients, ...ASSETS.clients].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Client logo"
                loading="lazy"
                className="client-logo shrink-0 object-contain"
                style={{
                  height: 'auto',
                  width: 'auto',
                  maxHeight: 'clamp(40px,4vw,54px)',
                  maxWidth: 'clamp(150px,16vw,200px)',
                  marginLeft: 'clamp(28px,3.5vw,48px)',
                  marginRight: 'clamp(28px,3.5vw,48px)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientStories;
