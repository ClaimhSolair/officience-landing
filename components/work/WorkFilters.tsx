import React from 'react';

/**
 * The filter bar of the Work listing — Figma 3353:3338: a Category select box
 * (224x42, 3403:3658) and a search field (385 wide, 3367:3356), 14px apart.
 * Both are white with a 1px Outline Field border and a 4px radius, in
 * Body-lg-regular. The chevron and the search glass are Figma's own paths.
 *
 * The select is a native `<select>`, so the keyboard, screen readers and phones
 * get the system list. Below sm the two controls share the row at full width.
 */

const FIELD =
  'h-[42px] rounded-fig-xs border border-border-field bg-white font-body text-body-lg focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary';

const Chevron: React.FC = () => (
  <svg aria-hidden="true" width="10" height="5.625" viewBox="0 0 10 5.625" fill="none" className="pointer-events-none absolute right-fig-16 top-1/2 -translate-y-1/2">
    <path
      d="M0.150706 0.153687C0.33333 -0.0326003 0.619108 -0.0495355 0.820488 0.102881L0.878182 0.153687L5.00004 4.35839L9.1219 0.153687C9.30452 -0.0326003 9.5903 -0.0495355 9.79168 0.102881L9.84938 0.153687C10.032 0.339974 10.0486 0.631483 9.89918 0.836902L9.84938 0.895753L5.36378 5.47131C5.18115 5.6576 4.89538 5.67454 4.694 5.52212L4.6363 5.47131L0.150706 0.895753C-0.0501812 0.690837 -0.0501812 0.358603 0.150706 0.153687Z"
      fill="#5A5A5A"
    />
  </svg>
);

const SearchGlass: React.FC = () => (
  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 15 15" fill="none" className="pointer-events-none shrink-0">
    <path
      transform="translate(1.25 1.25)"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.08675 0.9375C3.24738 0.9375 0.937375 3.24687 0.937375 6.08625C0.937375 8.92563 3.24738 11.2356 6.08675 11.2356C8.9255 11.2356 11.2355 8.92563 11.2355 6.08625C11.2355 3.24687 8.9255 0.9375 6.08675 0.9375M6.08675 12.1731C2.7305 12.1731 -0.000124991 9.4425 -0.000124991 6.08625C-0.000124991 2.73 2.7305 0 6.08675 0C9.443 0 12.173 2.73 12.173 6.08625C12.173 9.4425 9.443 12.1731 6.08675 12.1731"
      fill="#A0A0A0"
    />
    <path
      transform="translate(10.77 11.07)"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.67141 3.13425C2.55203 3.13425 2.43203 3.08862 2.34016 2.99737L0.137657 0.801124C-0.0454684 0.617999 -0.0460934 0.321124 0.137032 0.137999C0.319532 -0.0463757 0.616407 -0.0451257 0.800157 0.136749L3.00266 2.33362C3.18578 2.51675 3.18641 2.813 3.00328 2.99612C2.91203 3.08862 2.79141 3.13425 2.67141 3.13425"
      fill="#A0A0A0"
    />
  </svg>
);

interface WorkFiltersProps {
  categories: string[];
  category: string;
  q: string;
  onCategory: (value: string) => void;
  onSearch: (value: string) => void;
}

const WorkFilters: React.FC<WorkFiltersProps> = ({ categories, category, q, onCategory, onSearch }) => (
  <form role="search" className="flex flex-col gap-fig-12 sm:flex-row sm:gap-[14px]" onSubmit={(e) => e.preventDefault()}>
    <label className={`relative block w-full sm:w-[224px] sm:shrink-0 ${FIELD}`}>
      <span className="sr-only">Category</span>
      <select
        value={category}
        onChange={(e) => onCategory(e.target.value)}
        className="h-full w-full cursor-pointer appearance-none rounded-fig-xs bg-transparent pl-fig-16 pr-fig-40 text-subtitle outline-none"
      >
        <option value="">Category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <Chevron />
    </label>
    <label className={`flex w-full items-center gap-fig-8 pl-fig-16 pr-fig-12 sm:w-[385px] ${FIELD}`}>
      <span className="sr-only">Search</span>
      <input
        type="search"
        value={q}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search"
        className="h-full min-w-0 flex-1 bg-transparent text-text-default outline-none placeholder:text-gray-fig-400"
      />
      <SearchGlass />
    </label>
  </form>
);

export default WorkFilters;
