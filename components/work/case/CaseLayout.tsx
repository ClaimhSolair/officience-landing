import React from 'react';
import { PIN_FOLLOW, STICKY_TOP } from '../../../lib/motion';
import type { WorkFact } from '../../../content/work/types';
import Container from '../../ui/Container';

/**
 * The body of a case study — IOGA 3770:4574: the fact sidebar (3825:8852) on
 * the left and the main column (3816:7969) on the right.
 *
 * The artboard draws 24 + 381 + 144 + 867 + 24 = 1440. From xl the three
 * tracks are shares of the content box (`381fr 144fr 867fr`), so 1280 and
 * 1910 keep the drawn proportions: the main column is 767px at 1280, 867 at
 * 1440 and 1116 at 1910. The sidebar sticks under the header and stops at
 * the end of the column (ruling 20e).
 *
 * Below xl the facts are a grid above the column (ruling 20h). At 1024 a
 * sidebar track is 267px, and "Corporates & SMEs" needs 230px of its 203px
 * inside the padding. From lg to xl the facts and the column keep the drawn
 * 867px width, centred, so 1024-1279 shows the 1440 column at its drawn size.
 * A full-width column there was wider than the drawing (976-1231px).
 */

const FactList: React.FC<{ facts: WorkFact[] }> = ({ facts }) => (
  <dl className="grid grid-cols-2 gap-x-fig-24 gap-y-fig-32 bg-bg-secondary px-fig-24 py-fig-32 md:grid-cols-4 xl:grid-cols-1 xl:gap-y-[55px] xl:px-fig-32 xl:py-fig-64">
    {facts.map((fact) => (
      <div key={fact.label} className="flex flex-col gap-[6px]">
        <dt className="font-sans text-h4 font-semibold text-gray-fig-400 lg:text-h3">{fact.label}</dt>
        <dd className="whitespace-pre-line font-sans text-h4 font-semibold text-text-primary lg:text-h3">{fact.value}</dd>
      </div>
    ))}
  </dl>
);

const CaseLayout: React.FC<{ facts: WorkFact[]; children: React.ReactNode }> = ({ facts, children }) => (
  <div className="bg-surface pb-fig-64 pt-fig-40 lg:pb-fig-120 lg:pt-fig-120">
    <Container className="flex flex-col gap-fig-48 lg:max-w-[867px] xl:grid xl:max-w-content-2 xl:grid-cols-[381fr_144fr_867fr] xl:items-start xl:gap-0">
      <aside aria-label="Project facts" data-sticky className={`xl:col-start-1 xl:sticky ${STICKY_TOP} ${PIN_FOLLOW}`}>
        <FactList facts={facts} />
      </aside>
      <div className="flex min-w-0 flex-col gap-fig-64 xl:col-start-3 xl:gap-fig-80">{children}</div>
    </Container>
  </div>
);

export default CaseLayout;
