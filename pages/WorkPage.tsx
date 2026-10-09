import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ServiceHero from '../components/services/ServiceHero';
import WorkFilters from '../components/work/WorkFilters';
import WorkGrid from '../components/work/WorkGrid';
import WorkPagination from '../components/work/WorkPagination';
import Container from '../components/ui/Container';
import { scrollToId } from '../components/navigation';
import { workSources } from '../assets';
import { WORK_PROJECTS } from '../content/work';
import { categoriesOf, filterProjects, paginate } from '../lib/workFilter';
import { usePageView } from '../lib/pageMeta';
import { useSectionViews } from '../lib/sectionViews';

/**
 * The Work listing — Figma 3353:3329 (cards 1-6) and 3403:3521 (cards 7-12),
 * a 1440 artboard.
 *
 * The hero is the service-page hero: the drawn 1440x839 photo at its own
 * ratio, the drawn 40% black scrim, and the copy at its bottom-left (a 658px
 * box). Below it, on white, the filter bar sits 108px down, the grid 64px
 * under the bar, and the pagination 64px under the grid. The listing draws no
 * contact band. The shared Footer comes from `Layout`.
 *
 * The filter, the search and the page live in the URL (`?category=&q=&page=`),
 * so the back button and a shared link give the same view (ruling 20b). A new
 * category or search goes back to page 1. Typing replaces the history entry,
 * so the back button does not step through each letter.
 */

const WORK_SECTION_IDS = ['work-hero', 'work-grid'] as const;

const HERO = {
  sources: workSources('listing', 'hero', [800, 1440, 1920]),
  w: 1440,
  h: 839,
  alt: 'A laptop shows a grid of service tiles, with glowing chart, idea and team icons above it, on a dark blue ground.',
};

const CATEGORIES = categoriesOf(WORK_PROJECTS);

const WorkPage: React.FC = () => {
  usePageView('Work — Officience');
  useSectionViews(WORK_SECTION_IDS, 'work');

  const [params, setParams] = useSearchParams();
  const category = CATEGORIES.includes(params.get('category') ?? '') ? (params.get('category') as string) : '';
  const q = params.get('q') ?? '';
  const filtered = useMemo(() => filterProjects(WORK_PROJECTS, { category, q }), [category, q]);
  const { items, page, pages } = paginate(filtered, Number(params.get('page') ?? 1));

  const update = (next: { category?: string; q?: string; page?: number }, replace = false) => {
    const p = new URLSearchParams(params);
    const set = (key: string, value: string) => (value ? p.set(key, value) : p.delete(key));
    if (next.category !== undefined) set('category', next.category);
    if (next.q !== undefined) set('q', next.q);
    set('page', next.page && next.page > 1 ? String(next.page) : '');
    setParams(p, { replace });
  };

  const goToPage = (n: number) => {
    update({ page: n });
    scrollToId('work-grid');
  };

  return (
    <>
      <ServiceHero
        id="work-hero"
        titleId="work-hero-title"
        image={HERO}
        title="Showcase of work"
        subtitle="Explore our most impactful and diverse projects — from web apps and design to data and AI. Browse our portfolio to see how we've helped clients achieve their goals."
        titleWidth={658}
        subtitleWidth={658}
        scrim={0.4}
        back={false}
      />
      <section
        id="work-grid"
        aria-label="Our work"
        className="scroll-mt-[120px] bg-surface pb-fig-64 pt-fig-40 lg:pb-fig-100 lg:pt-[108px]"
      >
        <Container className="flex flex-col gap-fig-32 lg:gap-fig-64">
          <WorkFilters
            categories={CATEGORIES}
            category={category}
            q={q}
            onCategory={(value) => update({ category: value })}
            onSearch={(value) => update({ q: value }, true)}
          />
          <p className="sr-only" role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
          </p>
          {items.length > 0 ? (
            // Keyed by the view, so a new page or filter mounts fresh cards and
            // they enter as the first cards did.
            <WorkGrid key={`${category}|${q}|${page}`} projects={items} />
          ) : (
            <div className="flex flex-col items-start gap-fig-16 py-fig-40">
              {/* Placeholder copy: Figma draws no empty state (flagged). */}
              <p className="font-body text-body-xl text-subtitle">No work matches your search.</p>
              <button
                type="button"
                onClick={() => {
                  update({ category: '', q: '' });
                  // The button goes away with the empty result, so the focus
                  // goes to the Search field, where the user typed.
                  document.getElementById('work-search')?.focus();
                }}
                className="font-sans text-btn-md text-text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Clear filters
              </button>
            </div>
          )}
          <WorkPagination page={page} pages={pages} onPage={goToPage} />
        </Container>
      </section>
    </>
  );
};

export default WorkPage;
