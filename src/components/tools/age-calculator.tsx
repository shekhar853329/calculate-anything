import React, { useState, useCallback } from 'react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthdayDays: number;
  nextBirthdayDate: string;
}

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!dob) {
      setError('Please enter a date of birth.');
      return;
    }

    const birth = new Date(dob);
    const today = new Date();

    if (birth > today) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    // Calculate age
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total days
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    // Next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const nextBirthdayDate = nextBirthday.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    setResult({ years, months, days, totalDays, nextBirthdayDays, nextBirthdayDate });
  }, [dob]);

  const reset = useCallback(() => {
    setDob('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    const text = `Age: ${result.years} years, ${result.months} months, ${result.days} days\nTotal days lived: ${result.totalDays.toLocaleString()}\nNext birthday: ${result.nextBirthdayDate} (in ${result.nextBirthdayDays} days)`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            max={today}
            onChange={e => setDob(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Calculate Age
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Years', value: result.years },
              { label: 'Months', value: result.months },
              { label: 'Days', value: result.days },
            ].map(item => (
              <div key={item.label} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{item.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total days lived</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{result.totalDays.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Next birthday</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{result.nextBirthdayDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Days until next birthday</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{result.nextBirthdayDays} days</span>
            </div>
          </div>

          <button
            onClick={copyResult}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
