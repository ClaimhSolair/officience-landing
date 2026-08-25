import React from 'react';

/**
 * Footer glyphs, inlined.
 *
 * Every one is a small single-colour vector used once, on a page that already
 * loads a dozen images — inlining them costs a few kB of markup and saves six
 * requests. They are generated from the Figma exports rather than hand-copied,
 * and each fragment's ids are namespaced so two icons on the same page can
 * never collide over a mask id.
 *
 * Only the mail and phone glyphs live here. Figma also draws its own four social
 * marks for the footer, but at inconsistent relative sizes — LinkedIn fills 36%
 * of its box where Facebook fills all of it — and MenuOverlay already renders
 * the site's social set from the bucket. The footer reuses that set so the same
 * four brands are not drawn two different ways on one site.
 */
interface IconProps {
  className?: string;
}

export const MailIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" className={className}>
    <svg x="0.834" y="1.666" width="17.916" height="16.25" viewBox="0 0 17.9166 16.25" overflow="visible"><g id="mailicon-Message">
<path id="mailicon-Fill 1" fillRule="evenodd" clipRule="evenodd" d="M8.98075 9.554C8.42325 9.554 7.86742 9.36983 7.40242 9.0015L3.66492 5.98817C3.39575 5.7715 3.35408 5.37733 3.56992 5.109C3.78742 4.8415 4.18075 4.799 4.44908 5.01483L8.18325 8.02483C8.65242 8.3965 9.31325 8.3965 9.78575 8.0215L13.4824 5.0165C13.7507 4.79733 14.1441 4.839 14.3624 5.10733C14.5799 5.37483 14.5391 5.76817 14.2716 5.9865L10.5682 8.9965C10.0999 9.36817 9.53992 9.554 8.98075 9.554" fill="white"/>
<g id="mailicon-Group 5">
<mask id="mailicon-mask0_3594_3586" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="17">
<path id="mailicon-Clip 4" fillRule="evenodd" clipRule="evenodd" d="M0 0H17.9166V16.25H0V0Z" fill="white"/>
</mask>
<g mask="url(#mailicon-mask0_3594_3586)">
<path id="mailicon-Fill 3" fillRule="evenodd" clipRule="evenodd" d="M4.86575 15H13.0491C13.0508 14.9983 13.0574 15 13.0624 15C14.0133 15 14.8566 14.66 15.5033 14.0142C16.2541 13.2667 16.6666 12.1925 16.6666 10.99V5.26667C16.6666 2.93917 15.1449 1.25 13.0491 1.25H4.86742C2.77158 1.25 1.24992 2.93917 1.24992 5.26667V10.99C1.24992 12.1925 1.66325 13.2667 2.41325 14.0142C3.05992 14.66 3.90408 15 4.85408 15H4.86575ZM4.85158 16.25C3.56575 16.25 2.41742 15.7833 1.53075 14.9C0.54325 13.915 -8.33273e-05 12.5267 -8.33273e-05 10.99V5.26667C-8.33273e-05 2.26417 2.09242 0 4.86742 0H13.0491C15.8241 0 17.9166 2.26417 17.9166 5.26667V10.99C17.9166 12.5267 17.3732 13.915 16.3857 14.9C15.4999 15.7825 14.3507 16.25 13.0624 16.25H13.0491H4.86742H4.85158Z" fill="white"/>
</g>
</g>
</g></svg>
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" className={className}>
    <svg x="1.668" y="1.666" width="17.082" height="17.084" viewBox="0 0 17.083 17.0829" overflow="visible"><g id="phoneicon-Call">
<mask id="phoneicon-mask0_3594_3558" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
<path id="phoneicon-Clip 2" fillRule="evenodd" clipRule="evenodd" d="M0 0H17.083V17.0829H0V0Z" fill="white"/>
</mask>
<g mask="url(#phoneicon-mask0_3594_3558)">
<path id="phoneicon-Fill 1" fillRule="evenodd" clipRule="evenodd" d="M1.9659 2.55042C1.96757 2.55042 1.9259 2.59375 1.8734 2.64542C1.67174 2.84125 1.25424 3.24875 1.25007 4.10125C1.2434 5.29375 2.02757 7.50792 5.8034 11.2829C9.56174 15.0396 11.7726 15.8329 12.9676 15.8329H12.9851C13.8376 15.8287 14.2442 15.4104 14.4409 15.2096C14.5009 15.1479 14.5492 15.1029 14.5834 15.0746C15.4134 14.2396 15.8384 13.6179 15.8342 13.2196C15.8284 12.8129 15.3226 12.3321 14.6234 11.6671C14.4009 11.4554 14.1592 11.2254 13.9042 10.9704C13.2434 10.3112 12.9159 10.4237 12.1959 10.6771C11.2001 11.0262 9.8334 11.5012 7.71007 9.37708C5.5834 7.25208 6.05924 5.88708 6.40757 4.89125C6.65924 4.17125 6.77424 3.84292 6.11257 3.18125C5.8534 2.92292 5.6209 2.67792 5.40674 2.45292C4.7459 1.75792 4.26924 1.25542 3.86507 1.24958H3.8584C3.45924 1.24958 2.83924 1.67625 1.96174 2.55375C1.96424 2.55125 1.96507 2.55042 1.9659 2.55042V2.55042ZM12.9684 17.0829C10.8917 17.0829 8.18424 15.4296 4.92007 12.1671C1.6434 8.89125 -0.0124298 6.17542 7.02447e-05 4.09458C0.00757024 2.71958 0.728404 2.01542 0.999237 1.75125C1.0134 1.73375 1.06174 1.68625 1.0784 1.66958C2.2734 0.47375 3.07924 -0.00958334 3.8809 -0.000416674C4.81174 0.0120833 5.47424 0.70875 6.31257 1.59125C6.52007 1.80958 6.74507 2.04708 6.9959 2.29708C8.21257 3.51375 7.8659 4.50625 7.58757 5.30292C7.28424 6.17208 7.02174 6.92208 8.5934 8.49375C10.1667 10.0654 10.9167 9.80292 11.7826 9.49708C12.5801 9.21875 13.5701 8.87042 14.7884 10.0871C15.0351 10.3337 15.2692 10.5562 15.4851 10.7621C16.3717 11.6046 17.0717 12.2704 17.0834 13.2038C17.0934 13.9996 16.6101 14.8104 15.4167 16.0046L14.8884 15.6462L15.3351 16.0829C15.0709 16.3537 14.3676 17.0754 12.9917 17.0829H12.9684Z" fill="white"/>
</g>
</g></svg>
  </svg>
);




