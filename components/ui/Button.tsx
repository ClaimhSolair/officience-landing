import React from 'react';
import { Link } from 'react-router-dom';

/**
 * The Sept-2026 button, in the three variants the Figma component ships
 * (Primary, Secondary_Outline, Tertiary_Text).
 *
 * Figma draws only the resting state, so the interaction states below are the
 * house chains carried forward from the July build — recorded here once instead
 * of being re-invented per section:
 *
 *   primary    bg  #1F49BF → hover #000086 → active #000050, text/icon white
 *   secondary  bg  white, 1px #1F49BF border → hover bg #F7F7F7
 *                  → active bg #1F49BF with inverse text (Figma "BG Pressed")
 *   tertiary   no bg → hover bg #ECF4FF (pri-50), text/icon #1F49BF
 *   focus      2px outline, 2px offset — primary blue on light surfaces,
 *              white via `onDark` where the button sits on #1F49BF
 *   disabled   50% opacity, pointer events off
 *
 * Corner radius is 0: the component screenshot (node 3552:2330) shows square
 * corners. One constant, so it is one edit if a section proves otherwise.
 */
const RADIUS = 'rounded-none';

type Variant = 'primary' | 'secondary' | 'tertiary';
type Size = 'md' | 'lg';

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-primary text-white border border-primary hover:bg-[#000086] hover:border-[#000086] active:bg-[#000050] active:border-[#000050]',
  secondary:
    'bg-surface text-text-primary border border-primary hover:bg-bg-secondary active:bg-primary active:text-white',
  tertiary: 'bg-transparent text-text-primary border border-transparent hover:bg-pri-50',
};

/** Height comes from Figma: 16px of padding above and below a 24px line box. */
const SIZE: Record<Size, string> = {
  md: 'h-[48px] px-fig-20 gap-fig-8 text-btn-md',
  lg: 'h-[56px] px-fig-24 gap-fig-8 text-btn-md',
};

interface CommonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Sitting on the blue background: switch the focus ring to white. */
  onDark?: boolean;
  className?: string;
  /** Rendered after the label, at 24×24 in the Figma component. */
  icon?: React.ReactNode;
}

type ButtonProps = CommonProps &
  ({ to: string; href?: never; onClick?: never } | { href: string; to?: never; onClick?: never } | {
    onClick: () => void;
    to?: never;
    href?: never;
  });

const Button: React.FC<ButtonProps & { disabled?: boolean; type?: 'button' | 'submit' }> = ({
  children,
  variant = 'primary',
  size = 'lg',
  onDark = false,
  className = '',
  icon,
  to,
  href,
  onClick,
  disabled,
  type = 'button',
}) => {
  const classes = [
    'inline-flex items-center justify-center whitespace-nowrap font-sans transition-colors',
    RADIUS,
    VARIANT[variant],
    SIZE[size],
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    onDark ? 'focus-visible:outline-white' : 'focus-visible:outline-primary',
    disabled ? 'opacity-50 pointer-events-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {children}
      {icon}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-disabled={disabled || undefined}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
};

export default Button;
