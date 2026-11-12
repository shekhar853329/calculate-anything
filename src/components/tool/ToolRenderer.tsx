import React from 'react';
import { hasToolComponent } from '../../lib/toolComponents';

interface ToolRendererProps {
  slug: string;
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
 * Individual tool components are registered in toolComponents.ts and imported
 * lazily. Until a tool component has been created, this renders a "coming soon"
 * placeholder so pages build successfully without every component file existing.
 *
 * To wire up a real component, add its lazy import to toolComponents.ts
 * and ensure the component file exists at the expected path.
 */
export default function ToolRenderer({ slug }: ToolRendererProps) {
  if (!hasToolComponent(slug)) {
    return <ToolNotFound slug={slug} />;
  }

  // Tool is registered but component files are not built yet.
  // This placeholder is replaced once the tool components step runs.
  return <ToolComingSoon slug={slug} />;
}
