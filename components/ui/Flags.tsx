import React from 'react';

/**
 * Country flags for the office list (user, 2026-10-14). Figma draws no flags,
 * so this is a build choice, recorded in the adapter (26b).
 *
 * Inline SVG, not emoji: Windows renders flag emoji as two letters ("FR"). Each
 * flag is drawn in a 30x20 box (3:2) and shown at 24x16. The detail is reduced
 * for that size: the US flag has a dot grid for its 50 stars, and the Singapore
 * stars are simplified. The country name is next to the flag, so the flag is
 * decoration and screen readers skip it.
 */
export type FlagCode = 'fr' | 'us' | 'sg' | 'jp' | 'vn';

const STAR_VN =
  'M15.00 4.00L16.35 8.15L20.71 8.15L17.18 10.71L18.53 14.85L15.00 12.29L11.47 14.85L12.82 10.71L9.29 8.15L13.65 8.15Z';
const STARS_SG =
  'M10.40 2.90L10.57 3.42L11.11 3.42L10.67 3.74L10.84 4.26L10.40 3.94L9.96 4.26L10.13 3.74L9.69 3.42L10.23 3.42Z' +
  'M12.06 4.11L12.23 4.63L12.78 4.63L12.34 4.95L12.51 5.47L12.06 5.15L11.62 5.47L11.79 4.95L11.35 4.63L11.90 4.63Z' +
  'M11.43 6.07L11.60 6.58L12.14 6.58L11.70 6.90L11.87 7.42L11.43 7.10L10.99 7.42L11.16 6.90L10.72 6.58L11.26 6.58Z' +
  'M9.37 6.07L9.54 6.58L10.08 6.58L9.64 6.90L9.81 7.42L9.37 7.10L8.93 7.42L9.10 6.90L8.66 6.58L9.20 6.58Z' +
  'M8.74 4.11L8.90 4.63L9.45 4.63L9.01 4.95L9.18 5.47L8.74 5.15L8.29 5.47L8.46 4.95L8.02 4.63L8.57 4.63Z';

/** The 50 US stars as a dot grid: nine rows that alternate six and five dots. */
const US_STARS = Array.from({ length: 9 }, (_, row) => {
  const six = row % 2 === 0;
  return Array.from({ length: six ? 6 : 5 }, (_, col) => ({
    cx: (six ? 1 : 2) + col * 2,
    cy: 0.6 + row * 1.2,
  }));
}).flat();

const ART: Record<FlagCode, React.ReactNode> = {
  fr: (
    <>
      <rect width="10" height="20" fill="#002395" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#ED2939" />
    </>
  ),
  us: (
    <>
      <rect width="30" height="20" fill="#FFFFFF" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={(i * 2 * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
      ))}
      <rect width="12" height={(7 * 20) / 13} fill="#3C3B6E" />
      {US_STARS.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r="0.32" fill="#FFFFFF" />
      ))}
    </>
  ),
  sg: (
    <>
      <rect width="30" height="10" fill="#EF3340" />
      <rect y="10" width="30" height="10" fill="#FFFFFF" />
      <circle cx="7.6" cy="5.2" r="3.6" fill="#FFFFFF" />
      <circle cx="9" cy="5.2" r="3.5" fill="#EF3340" />
      <path d={STARS_SG} fill="#FFFFFF" />
    </>
  ),
  jp: (
    <>
      <rect width="30" height="20" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </>
  ),
  vn: (
    <>
      <rect width="30" height="20" fill="#DA251D" />
      <path d={STAR_VN} fill="#FFFF00" />
    </>
  ),
};

const Flag: React.FC<{ code: FlagCode; className?: string }> = ({ code, className = '' }) => (
  /* A hairline ring keeps the white parts (Japan, Singapore, France) visible on
     the light card. */
  <svg
    viewBox="0 0 30 20"
    aria-hidden="true"
    focusable="false"
    className={`h-[16px] w-[24px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10 ${className}`}
  >
    {ART[code]}
  </svg>
);

export default Flag;
