import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ASSETS } from '../assets';

export type SurveyBranch = 'work' | 'category';

interface ContactProps {
  onOpenSurvey: (branch: SurveyBranch) => void;
}

type Office = {
  city: string;
  address?: string;
  subOffices?: { name: string; address: string }[];
};

// 3 columns, matching Figma Contact Details layout.
const officeColumns: Office[][] = [
  [
    { city: 'Paris, France', address: '47 Boulevard de Sébastopol, 75001, Paris, France' },
    { city: 'San Francisco, USA', address: '8 The Green, Suite #4511, Dover, Delaware 19901, USA' },
  ],
  [
    { city: 'Singapore', address: '9 Kallang Place, #04-08, Singapore 339154' },
    { city: 'Japan', address: 'Ark Mori Bldg. 7F, 12-32, Akasaka 1-chome, Minato-ku, Tokyo 107-6006' },
  ],
  [
    {
      city: 'Hochiminh City, Vietnam',
      subOffices: [
        { name: 'OffyPlex', address: '16A Le Hong Phong Street, Ward 12. District 10, HCMC' },
        { name: 'CrunchBase', address: '262/18 Huynh Van Banh Street, Ward 11, Phu Nhuan District, HCMC' },
      ],
    },
  ],
];

const options: { branch: SurveyBranch; title: string; desc: string }[] = [
  {
    branch: 'work',
    title: 'Work with Officience',
    desc: "I'm looking for a digital partner - IT, Design, Data or BPO.",
  },
  {
    branch: 'category',
    title: 'Category inquiries',
    desc: 'Internship, co-working, partnership & more.',
  },
];

const AddressBlock: React.FC<{ office: Office }> = ({ office }) => (
  <div className="flex gap-[8px] items-start w-full">
    <img src={ASSETS.contact.pin} alt="" aria-hidden="true" width={32} height={32} className="w-[32px] h-[32px] shrink-0" />
    <div className="flex flex-col gap-[8px] text-text-default">
      <p className="t-h3 text-text-default">{office.city}</p>
      {office.address ? (
        <p className="font-body text-[20px] leading-[26px] text-text-default">{office.address}</p>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {office.subOffices!.map((sub) => (
            <p key={sub.name} className="font-body text-[20px] leading-[26px] text-text-default">
              <span className="font-bold text-text-primary">{sub.name}</span> - {sub.address}
            </p>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Contact: React.FC<ContactProps> = ({ onOpenSurvey }) => {
  return (
    <section id="contact" className="w-full">
      <div className="w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)] pb-[clamp(40px,5vw,60px)]">

        {/* Card — Figma: bg #f7f7f7, rounded-24, p-60, gap-64 */}
        <div
          className="bg-bg-secondary border border-white/40 rounded-[24px] flex flex-col gap-[clamp(40px,5vw,64px)]"
          style={{ padding: 'clamp(28px,4vw,60px)' }}
        >
          {/* Contact Content: header (left) + form (right) */}
          <div className="flex flex-col lg:flex-row gap-[clamp(32px,4vw,48px)] items-stretch">

            {/* Header — bottom-aligned */}
            <div className="flex-1 flex flex-col justify-end gap-[20px]">
              <h2 className="t-display-xl text-text-default">Let’s Build Together</h2>
              <p className="t-subtitle text-subtitle max-w-[660px]">
                Ready to scale? Fill out our quick requirement survey to get started.
              </p>
            </div>

            {/* Form — white panel */}
            <div className="flex-1 bg-bg-default rounded-fig-xs p-[clamp(24px,3vw,40px)] flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[4px]">
                <h3 className="t-h2 text-text-default">What brings you here?</h3>
                <p className="font-body text-[20px] leading-[28px] text-subtitle">
                  We'll tailor the next questions just for you.
                </p>
              </div>

              {options.map((opt) => (
                <button
                  key={opt.branch}
                  type="button"
                  onClick={() => onOpenSurvey(opt.branch)}
                  className="group flex items-center justify-between gap-4 text-left rounded-fig-m border bg-bg-secondary border-gray-fig-100 hover:border-primary transition-all px-[14px] py-[14px] min-h-[99px]"
                >
                  <span className="flex flex-col gap-[3px] min-w-0">
                    <span className="font-sans font-medium text-text-primary text-[clamp(16px,5vw,20px)] leading-[28px]">
                      {opt.title}
                    </span>
                    <span className="font-body text-subtitle text-[clamp(16px,5vw,20px)] leading-[28px]">
                      {opt.desc}
                    </span>
                  </span>
                  <ChevronRight size={24} className="text-text-primary group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details — 3 columns of offices */}
          <div className="flex flex-col md:flex-row gap-[clamp(24px,3vw,32px)] items-start">
            {officeColumns.map((col, i) => (
              <div key={i} className="flex-1 flex flex-col gap-[24px] w-full">
                {col.map((office) => (
                  <AddressBlock key={office.city} office={office} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
