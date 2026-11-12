import React, { useState } from 'react';

// --- English words conversion ---
const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function belowThousand(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
  return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + belowThousand(n % 100) : '');
}

function integerToEnglish(n: number): string {
  if (n === 0) return 'Zero';
  const groups = [
    { divisor: 1_000_000_000_000, name: 'Trillion' },
    { divisor: 1_000_000_000, name: 'Billion' },
    { divisor: 1_000_000, name: 'Million' },
    { divisor: 1_000, name: 'Thousand' },
    { divisor: 1, name: '' },
  ];
  let result = '';
  let rem = Math.floor(Math.abs(n));
  for (const g of groups) {
    const q = Math.floor(rem / g.divisor);
    rem = rem % g.divisor;
    if (q > 0) {
      result += (result ? ' ' : '') + belowThousand(q) + (g.name ? ' ' + g.name : '');
    }
  }
  return (n < 0 ? 'Negative ' : '') + result.trim();
}

function numberToEnglish(numStr: string): string {
  const [intPart, decPart] = numStr.split('.');
  const intNum = parseInt(intPart, 10);
  if (isNaN(intNum)) return '';
  let result = integerToEnglish(intNum);
  if (decPart !== undefined) {
    result += ' Point';
    for (const d of decPart) {
      result += ' ' + ones[parseInt(d, 10)];
    }
  }
  return result;
}

// --- Indian numbering system ---
const indianOnes = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const indianTens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function belowHundredIndian(n: number): string {
  if (n === 0) return '';
  if (n < 20) return indianOnes[n];
  return indianTens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + indianOnes[n % 10] : '');
}

function belowThousandIndian(n: number): string {
  if (n === 0) return '';
  if (n < 100) return belowHundredIndian(n);
  return indianOnes[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + belowHundredIndian(n % 100) : '');
}

function integerToIndian(n: number): string {
  if (n === 0) return 'Zero';
  let rem = Math.floor(Math.abs(n));
  let result = '';

  // Crore and above
  const crore = Math.floor(rem / 10_000_000);
  rem = rem % 10_000_000;
  if (crore > 0) {
    result += belowThousandIndian(crore) + ' Crore';
  }

  const lakh = Math.floor(rem / 100_000);
  rem = rem % 100_000;
  if (lakh > 0) {
    result += (result ? ' ' : '') + belowThousandIndian(lakh) + ' Lakh';
  }

  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;
  if (thousand > 0) {
    result += (result ? ' ' : '') + belowHundredIndian(thousand) + ' Thousand';
  }

  if (rem > 0) {
    result += (result ? ' ' : '') + belowThousandIndian(rem);
  }

  return (n < 0 ? 'Negative ' : '') + result.trim();
}

function numberToIndian(numStr: string): string {
  const [intPart, decPart] = numStr.split('.');
  const intNum = parseInt(intPart, 10);
  if (isNaN(intNum)) return '';
  let result = integerToIndian(intNum);
  if (decPart !== undefined) {
    result += ' Point';
    for (const d of decPart) {
      result += ' ' + indianOnes[parseInt(d, 10)];
    }
  }
  return result;
}

export default function NumberToWordsConverter() {
  const [input, setInput] = useState('');
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedIn, setCopiedIn] = useState(false);

  const { isValid, errorMsg } = React.useMemo(() => {
    const val = input;
    if (!val) return { isValid: false, errorMsg: '' };
    if (!/^-?\d+(\.\d+)?$/.test(val.trim())) {
      return { isValid: false, errorMsg: 'Please enter a valid number (decimals allowed, e.g. 1234.56).' };
    }
    const absInt = Math.abs(parseInt(val.split('.')[0], 10));
    if (absInt > 999_999_999_999_999) {
      return { isValid: false, errorMsg: 'Number must be at most 999 trillion.' };
    }
    return { isValid: true, errorMsg: '' };
  }, [input]);

  const handleChange = (val: string) => {
    setInput(val);
  };
  const englishWords = isValid ? numberToEnglish(input.trim()) : '';
  const indianWords = isValid ? numberToIndian(input.trim()) : '';

  const handleReset = () => {
    setInput('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Number to Words Converter</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Number</label>
          <input
            type="text"
            value={input}
            onChange={e => handleChange(e.target.value)}
            placeholder="e.g. 1234567.89"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Supports up to 999 trillion with optional decimals.</p>
        </div>

        {errorMsg && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{errorMsg}</p>}
        <button onClick={handleReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline">Reset</button>
      </div>

      {isValid && (
        <div className="space-y-4">
          {/* English */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">English (International)</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(englishWords);
                  setCopiedEn(true);
                  setTimeout(() => setCopiedEn(false), 2000);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copiedEn ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{englishWords}</p>
          </div>

          {/* Indian */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">Indian Numbering System</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(indianWords);
                  setCopiedIn(true);
                  setTimeout(() => setCopiedIn(false), 2000);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copiedIn ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{indianWords}</p>
          </div>
        </div>
      )}
    </div>
  );
}
