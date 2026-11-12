import React, { useState, useCallback } from 'react';

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return (Math.abs(a) * Math.abs(b)) / gcd(a, b);
}

function gcdMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => gcd(acc, n));
}

function lcmMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => lcm(acc, n));
}

function gcdSteps(a: number, b: number): string[] {
  const steps: string[] = [];
  let x = Math.abs(a), y = Math.abs(b);
  steps.push(`GCD(${x}, ${y})`);
  while (y) {
    const r = x % y;
    steps.push(`${x} = ${y} × ${Math.floor(x / y)} + ${r}`);
    x = y; y = r;
  }
  steps.push(`GCD = ${x}`);
  return steps;
}

export default function LcmHcfCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ hcf: number; lcm: number; nums: number[]; steps: string[] } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!input.trim()) {
      setError('Please enter at least two numbers.');
      return;
    }

    const parts = input.split(/[,\s]+/).filter(Boolean);
    if (parts.length < 2) {
      setError('Please enter at least two numbers separated by commas or spaces.');
      return;
    }

    const nums: number[] = [];
    for (const p of parts) {
      const n = parseInt(p, 10);
      if (isNaN(n) || !Number.isInteger(n) || n <= 0) {
        setError(`"${p}" is not a valid positive integer.`);
        return;
      }
      nums.push(n);
    }

    const hcfVal = gcdMultiple(nums);
    const lcmVal = lcmMultiple(nums);

    // Show steps for first two numbers
    const steps: string[] = [];
    if (nums.length === 2) {
      steps.push('--- HCF (using Euclidean algorithm) ---');
      steps.push(...gcdSteps(nums[0], nums[1]));
      steps.push('');
      steps.push('--- LCM ---');
      steps.push(`LCM(${nums[0]}, ${nums[1]}) = (${nums[0]} × ${nums[1]}) / GCD(${nums[0]}, ${nums[1]})`);
      steps.push(`= ${nums[0] * nums[1]} / ${hcfVal} = ${lcmVal}`);
    } else {
      steps.push(`Numbers: ${nums.join(', ')}`);
      steps.push(`HCF computed pairwise using Euclidean algorithm`);
      steps.push(`LCM = product / HCF (computed pairwise)`);
    }

    setResult({ hcf: hcfVal, lcm: lcmVal, nums, steps });
  }, [input]);

  const reset = useCallback(() => {
    setInput('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    const text = `HCF/GCD of ${result.nums.join(', ')} = ${result.hcf}\nLCM of ${result.nums.join(', ')} = ${result.lcm}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Numbers <span className="text-gray-400 font-normal">(comma or space separated, at least 2)</span>
          </label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 12, 18, 24"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => e.key === 'Enter' && calculate()}
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button onClick={calculate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            Calculate
          </button>
          <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-teal-700 dark:text-teal-300">{result.hcf.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">HCF / GCD</div>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-5 text-center">
              <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{result.lcm.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">LCM</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Step-by-step working</div>
            <div className="space-y-0.5">
              {result.steps.map((step, i) => (
                <div key={i} className="text-sm font-mono text-gray-700 dark:text-gray-300">{step || '\u00A0'}</div>
              ))}
            </div>
          </div>

          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
