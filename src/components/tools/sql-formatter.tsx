import React, { useState, useCallback } from 'react';

const SQL_KEYWORDS = [
  'SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN',
  'FULL JOIN','CROSS JOIN','ON','AND','OR','NOT','IN','BETWEEN','LIKE','IS NULL',
  'IS NOT NULL','ORDER BY','GROUP BY','HAVING','LIMIT','OFFSET','INSERT INTO',
  'VALUES','UPDATE','SET','DELETE FROM','CREATE TABLE','DROP TABLE','ALTER TABLE',
  'ADD COLUMN','DROP COLUMN','INDEX','UNIQUE','PRIMARY KEY','FOREIGN KEY',
  'REFERENCES','CONSTRAINT','DISTINCT','AS','UNION','UNION ALL','INTERSECT',
  'EXCEPT','CASE','WHEN','THEN','ELSE','END','WITH','EXISTS','ANY','ALL',
  'COUNT','SUM','AVG','MIN','MAX','COALESCE','NULLIF','CAST','CONVERT',
];

function formatSQL(sql: string): string {
  let result = sql.trim();
  // Uppercase keywords
  for (const kw of SQL_KEYWORDS.sort((a, b) => b.length - a.length)) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), kw);
  }
  // Add newlines before major clauses
  const clauses = ['SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN',
    'OUTER JOIN','FULL JOIN','ORDER BY','GROUP BY','HAVING','LIMIT','OFFSET',
    'INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','UNION','UNION ALL',
    'WITH','ON','AND','OR'];

  for (const clause of clauses.sort((a, b) => b.length - a.length)) {
    const escaped = clause.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`(?<!^)\\b${escaped}\\b`, 'g'), `\n${clause}`);
  }
  // Indent AND/OR under WHERE
  const lines = result.split('\n').map(l => {
    const t = l.trim();
    if (t.startsWith('AND ') || t.startsWith('OR ')) return '  ' + t;
    return t;
  });
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => { if (input.trim()) setOutput(formatSQL(input)); }, [input]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const download = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.sql';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const reset = useCallback(() => { setInput(''); setOutput(''); }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SQL Input</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
          placeholder="select id, name from users where active=1 order by name"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      <div className="flex gap-3">
        <button onClick={format} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">Format</button>
        <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Reset</button>
      </div>
      {output && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Formatted SQL</label>
          <pre className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono overflow-auto max-h-64 whitespace-pre-wrap">
            {output}
          </pre>
          <div className="flex gap-2">
            <button onClick={copy} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
            <button onClick={download} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
