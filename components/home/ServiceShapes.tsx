import React from 'react';

/**
 * The four decorative shapes on the "What we do" cards of frame 4229:4651
 * (adapter 27). Each is one flat path at 30% opacity, so the markup is inline
 * (small flat vectors do not go to the bucket).
 *
 * Each export is the full Figma image box, in source px at 1440. The card puts
 * it at the drawn bottom-right offset (see `SHAPE_BOX` in Capabilities.tsx).
 * The fills stay literal: they are one-off art, not themable UI.
 */

export type ShapeName = 'design' | 'bi' | 'data' | 'software';

interface ShapeProps {
  className?: string;
  style?: React.CSSProperties;
}

const common = {
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
  focusable: 'false' as const,
  preserveAspectRatio: 'none',
};

/** Design & Digital Experience: node 4353:18183, a 282 box. */
const DesignShape: React.FC<ShapeProps> = ({ className, style }) => (
  <svg viewBox="0 0 282 282" className={className} style={style} {...common}>
    <g opacity="0.3" fill="#1F49BF">
      <path d="M281.874 141.799C281.874 141.799 285.991 74.2309 247.073 35.1095C208.154 -4.01229 140.937 0.126198 140.937 0.126198C140.937 0.126198 136.82 67.6939 175.739 106.816C214.657 145.937 281.874 141.799 281.874 141.799Z" />
      <path d="M0.12554 141.8C0.12554 141.8 67.3425 145.938 106.261 106.816C145.18 67.6946 141.063 0.127266 141.063 0.127266C141.063 0.127266 73.8457 -4.01152 34.927 35.1103C-3.99141 74.2317 0.12554 141.8 0.12554 141.8Z" />
      <path d="M281.874 140.201C281.874 140.201 285.991 207.769 247.073 246.891C208.154 286.012 140.937 281.874 140.937 281.874C140.937 281.874 136.82 214.306 175.739 175.184C214.657 136.063 281.874 140.201 281.874 140.201Z" />
      <path d="M0.125554 140.2C0.125554 140.2 67.3425 136.062 106.261 175.184C145.18 214.305 141.063 281.873 141.063 281.873C141.063 281.873 73.8457 286.011 34.927 246.89C-3.99139 207.768 0.125554 140.2 0.125554 140.2Z" />
    </g>
  </svg>
);

/**
 * Business Intelligence: node 4353:18197 ("IT_black"). Figma puts a 120 box in
 * the card and lets the image run out of it by an inset, so the drawn image is
 * 337 x 308. This is that image box.
 */
const BiShape: React.FC<ShapeProps> = ({ className, style }) => (
  <svg viewBox="0 0 337 308" className={className} style={style} {...common}>
    <path
      opacity="0.3"
      fill="#FFCE00"
      d="M66.7985 87.6942C75.448 79.0448 85.0195 71.8792 95.197 66.1986C67.7798 115.322 74.9463 178.558 116.694 220.306C158.442 262.054 221.676 269.218 270.8 241.801C265.119 251.979 257.955 261.552 249.306 270.202C198.908 320.599 117.196 320.599 66.7985 270.202C16.4005 219.804 16.4005 138.092 66.7985 87.6942ZM116.694 37.7984C167.092 -12.5994 248.804 -12.5995 299.202 37.7984C349.599 88.1964 349.599 169.908 299.202 220.306C290.551 228.956 280.978 236.121 270.8 241.801C298.218 192.677 291.054 129.443 249.306 87.6942C207.557 45.9457 144.321 38.7801 95.197 66.1986C100.878 56.0204 108.044 46.4484 116.694 37.7984Z"
    />
  </svg>
);

/** Data Processing: node 4353:18200 ("Data_black"). Same inset model, 349 x 333. */
const DataShape: React.FC<ShapeProps> = ({ className, style }) => (
  <svg viewBox="0 0 349 333" className={className} style={style} {...common}>
    <path
      opacity="0.3"
      fill="#FFBFC7"
      d="M318.909 262.558C288.667 305.176 238.843 333 182.5 333C126.157 333 76.3328 305.176 46.0907 262.558H318.909ZM349 179.308C347.438 199.776 342.165 219.21 333.849 236.942H31.1507C22.8352 219.21 17.5616 199.776 16 179.308H349ZM333.849 96.0577C342.165 113.79 347.438 133.224 349 153.692H16C17.5616 133.224 22.8352 113.79 31.1507 96.0577H333.849ZM182.5 0C238.843 0 288.667 27.824 318.909 70.4423H46.0907C76.3328 27.824 126.157 0 182.5 0Z"
    />
  </svg>
);

/** Software Development: node 4353:18195, a 298 box. */
const SoftwareShape: React.FC<ShapeProps> = ({ className, style }) => (
  <svg viewBox="0 0 298 298" className={className} style={style} {...common}>
    <path
      opacity="0.3"
      fill="#DD3C57"
      d="M100.076 298C74.2243 288.822 51.5952 272.572 34.3877 251.505L87.5997 169.769L0 141.558C2.09436 112.975 11.8366 86.5799 27.136 64.5179L109.398 91.0106L107.823 5.88947C120.896 2.05673 134.7 8.99932e-05 148.973 0C162.343 0 175.303 1.80299 187.635 5.18106L189.233 91.6289L271.244 65.1427C286.427 87.2694 296.04 113.703 298 142.302L214.764 169.184L268.06 245.723C251.811 267.679 229.92 285.004 204.601 295.426L151.449 219.09L100.076 298Z"
    />
  </svg>
);

const SHAPES: Record<ShapeName, React.FC<ShapeProps>> = {
  design: DesignShape,
  bi: BiShape,
  data: DataShape,
  software: SoftwareShape,
};

const ServiceShape: React.FC<ShapeProps & { name: ShapeName }> = ({ name, className, style }) => {
  const Shape = SHAPES[name];
  return <Shape className={className} style={style} />;
};

export default ServiceShape;
