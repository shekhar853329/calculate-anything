import React, { lazy, Suspense } from 'react';
import { hasToolComponent } from '../../lib/toolComponents';

interface ToolRendererProps {
  slug: string;
}

// ── Date & Age tool components ──────────────────────────────────────────────
const AgeCalculator = lazy(() => import('../tools/age-calculator'));
const AgeDifferenceCalculator = lazy(() => import('../tools/age-difference-calculator'));
const DateDifferenceCalculator = lazy(() => import('../tools/date-difference-calculator'));
const DateAddSubtract = lazy(() => import('../tools/date-add-subtract'));
const DaysUntilCalculator = lazy(() => import('../tools/days-until-calculator'));
const BirthdayCalculator = lazy(() => import('../tools/birthday-calculator'));
const LeapYearChecker = lazy(() => import('../tools/leap-year-checker'));
const WorkingDaysCalculator = lazy(() => import('../tools/working-days-calculator'));
const TimeDurationCalculator = lazy(() => import('../tools/time-duration-calculator'));
const UnixTimestampConverter = lazy(() => import('../tools/unix-timestamp-converter'));

// ── Mathematics tool components ─────────────────────────────────────────────
const ScientificCalculator = lazy(() => import('../tools/scientific-calculator'));
const PercentageCalculator = lazy(() => import('../tools/percentage-calculator'));
const FractionCalculator = lazy(() => import('../tools/fraction-calculator'));
const RatioCalculator = lazy(() => import('../tools/ratio-calculator'));
const AverageCalculator = lazy(() => import('../tools/average-calculator'));
const SquareRootCalculator = lazy(() => import('../tools/square-root-calculator'));
const PowerCalculator = lazy(() => import('../tools/power-calculator'));
const PrimeNumberChecker = lazy(() => import('../tools/prime-number-checker'));
const LcmHcfCalculator = lazy(() => import('../tools/lcm-hcf-calculator'));
const FactorialCalculator = lazy(() => import('../tools/factorial-calculator'));
const RandomNumberGenerator = lazy(() => import('../tools/random-number-generator'));
const BmiCalculator = lazy(() => import('../tools/bmi-calculator'));
const GpaCalculator = lazy(() => import('../tools/gpa-calculator'));
const StandardDeviationCalculator = lazy(() => import('../tools/standard-deviation-calculator'));
const ProfitLossCalculator = lazy(() => import('../tools/profit-loss-calculator'));

/** Map tool slugs to their lazy-loaded components. */
const TOOL_MAP: Record<string, React.ComponentType> = {
  // Date & Age
  'age-calculator': AgeCalculator,
  'age-difference-calculator': AgeDifferenceCalculator,
  'date-difference-calculator': DateDifferenceCalculator,
  'date-add-subtract': DateAddSubtract,
  'days-until-calculator': DaysUntilCalculator,
  'birthday-calculator': BirthdayCalculator,
  'leap-year-checker': LeapYearChecker,
  'working-days-calculator': WorkingDaysCalculator,
  'time-duration-calculator': TimeDurationCalculator,
  'unix-timestamp-converter': UnixTimestampConverter,
  // Mathematics
  'scientific-calculator': ScientificCalculator,
  'percentage-calculator': PercentageCalculator,
  'fraction-calculator': FractionCalculator,
  'ratio-calculator': RatioCalculator,
  'average-calculator': AverageCalculator,
  'square-root-calculator': SquareRootCalculator,
  'power-calculator': PowerCalculator,
  'prime-number-checker': PrimeNumberChecker,
  'lcm-hcf-calculator': LcmHcfCalculator,
  'factorial-calculator': FactorialCalculator,
  'random-number-generator': RandomNumberGenerator,
  'bmi-calculator': BmiCalculator,
  'gpa-calculator': GpaCalculator,
  'standard-deviation-calculator': StandardDeviationCalculator,
  'profit-loss-calculator': ProfitLossCalculator,
};

function ToolLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  );
}

function ToolComingSoon({ slug }: { slug: string }) {
  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 p-6 text-center">
      <p className="text-orange-700 dark:text-orange-300 font-medium">
        Tool <code className="font-mono text-sm">{slug}</code> is coming soon.
      </p>
      <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
        We are building it — check back shortly!
      </p>
    </div>
  );
}

function ToolNotFound({ slug }: { slug: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-6 text-center">
      <p className="text-red-700 dark:text-red-300 font-medium">
        Tool <code className="font-mono text-sm">{slug}</code> was not found.
      </p>
    </div>
  );
}

/**
 * Renders the tool component for the given slug.
 *
 * Tools are lazily imported and wrapped in a Suspense boundary.
 * Slugs registered in toolComponents.ts but not yet wired here
 * show a "coming soon" placeholder.
 */
export default function ToolRenderer({ slug }: ToolRendererProps) {
  if (!hasToolComponent(slug)) {
    return <ToolNotFound slug={slug} />;
  }

  const ToolComponent = TOOL_MAP[slug];
  if (!ToolComponent) {
    return <ToolComingSoon slug={slug} />;
  }

  return (
    <Suspense fallback={<ToolLoading />}>
      <ToolComponent />
    </Suspense>
  );
}
