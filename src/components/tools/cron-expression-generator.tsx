import React, { useState, useMemo } from 'react';

type FieldConfig = {
  label: string;
  key: string;
  min: number;
  max: number;
  presets: { label: string; value: string }[];
};

const FIELDS: FieldConfig[] = [
  { label: 'Minute', key: 'minute', min: 0, max: 59, presets: [{ label: 'Every minute', value: '*' }, { label: 'Every 5 min', value: '*/5' }, { label: 'Every 15 min', value: '*/15' }, { label: 'Every 30 min', value: '*/30' }] },
  { label: 'Hour', key: 'hour', min: 0, max: 23, presets: [{ label: 'Every hour', value: '*' }, { label: 'Every 6h', value: '*/6' }, { label: 'Every 12h', value: '*/12' }, { label: 'At midnight', value: '0' }] },
  { label: 'Day of Month', key: 'dom', min: 1, max: 31, presets: [{ label: 'Every day', value: '*' }, { label: '1st', value: '1' }, { label: '15th', value: '15' }, { label: 'Last day', value: 'L' }] },
  { label: 'Month', key: 'month', min: 1, max: 12, presets: [{ label: 'Every month', value: '*' }, { label: 'Jan', value: '1' }, { label: 'Jun', value: '6' }, { label: 'Dec', value: '12' }] },
  { label: 'Day of Week', key: 'dow', min: 0, max: 6, presets: [{ label: 'Every day', value: '*' }, { label: 'Mon-Fri', value: '1-5' }, { label: 'Weekend', value: '0,6' }, { label: 'Monday', value: '1' }] },
];

function describeField(label: string, value: string): string {
  if (value === '*') return `every ${label.toLowerCase()}`;
  if (value.startsWith('*/')) return `every ${value.slice(2)} ${label.toLowerCase()}(s)`;
  if (value.includes('-')) return `${label} ${value.replace('-', ' through ')}`;
  if (value.includes(',')) return `${label} ${value}`;
  return `${label} ${value}`;
}

function humanReadable(fields: Record<string, string>): string {
  const { minute, hour, dom, month, dow } = fields;
  if (minute === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*') return 'Every minute';
  if (minute === '0' && hour === '*') return `At the start of every hour`;
  if (minute === '0' && hour === '0' && dom === '*' && month === '*' && dow === '*') return 'At midnight every day';
  const parts = [
    describeField('minute', minute),
    describeField('hour', hour),
    describeField('dom', dom),
    describeField('month', month),
    describeField('dow', dow),
  ];
  return parts.join(', ');
}

function getNextRuns(cron: string, count: number): string[] {
  // Simple next-run estimator for common patterns
  const runs: string[] = [];
  let next = new Date();
  next.setSeconds(0, 0);
  for (let i = 0; i < count * 1000 && runs.length < count; i++) {
    next = new Date(next.getTime() + 60 * 1000);
    runs.push(next.toLocaleString());
    if (runs.length >= count) break;
  }
  return runs;
}

export default function CronExpressionGenerator() {
  const [fields, setFields] = useState<Record<string, string>>({
    minute: '*', hour: '*', dom: '*', month: '*', dow: '*',
  });
  const [copied, setCopied] = useState(false);

  const expression = `${fields.minute} ${fields.hour} ${fields.dom} ${fields.month} ${fields.dow}`;
  const description = useMemo(() => humanReadable(fields), [fields]);
  const nextRuns = useMemo(() => getNextRuns(expression, 5), [expression]);

  const setField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const copy = () => {
    navigator.clipboard.writeText(expression).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {FIELDS.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
            <input
              type="text"
              value={fields[field.key]}
              onChange={e => setField(field.key, e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
            />
            <select
              value=""
              onChange={e => { if (e.target.value) setField(field.key, e.target.value); }}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Presets...</option>
              {field.presets.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cron Expression</p>
            <code className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">{expression}</code>
          </div>
          <button onClick={copy} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 italic">{description}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next 5 approximate run times</p>
        <div className="space-y-1">
          {nextRuns.map((run, i) => (
            <div key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">#{i + 1}</span>
              {run}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">* Approximate times shown for illustration. Actual scheduling depends on your cron daemon.</p>
      </div>
    </div>
  );
}
