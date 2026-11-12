import React, { useState, useCallback } from 'react';

interface Course {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

const GRADES = Object.keys(GRADE_POINTS);

let nextId = 1;

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: nextId++, name: '', credits: '3', grade: 'A' },
    { id: nextId++, name: '', credits: '3', grade: 'B+' },
  ]);
  const [result, setResult] = useState<{ gpa: number; totalCredits: number; honorRoll: boolean } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const addCourse = useCallback(() => {
    setCourses(prev => [...prev, { id: nextId++, name: '', credits: '3', grade: 'A' }]);
  }, []);

  const removeCourse = useCallback((id: number) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateCourse = useCallback((id: number, field: keyof Omit<Course, 'id'>, value: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (courses.length === 0) {
      setError('Add at least one course.');
      return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      const cr = parseFloat(course.credits);
      if (isNaN(cr) || cr <= 0) {
        setError(`Invalid credit hours for "${course.name || 'a course'}". Must be a positive number.`);
        return;
      }
      const gp = GRADE_POINTS[course.grade];
      if (gp === undefined) {
        setError(`Invalid grade "${course.grade}".`);
        return;
      }
      totalPoints += gp * cr;
      totalCredits += cr;
    }

    const gpa = totalPoints / totalCredits;
    setResult({ gpa, totalCredits, honorRoll: gpa >= 3.5 });
  }, [courses]);

  const reset = useCallback(() => {
    setCourses([
      { id: nextId++, name: '', credits: '3', grade: 'A' },
      { id: nextId++, name: '', credits: '3', grade: 'B+' },
    ]);
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    const lines = courses.map(c => `${c.name || 'Course'}: ${c.credits} credits, ${c.grade}`);
    lines.push(`\nGPA: ${result.gpa.toFixed(2)} / 4.0`);
    lines.push(`Total Credits: ${result.totalCredits}`);
    if (result.honorRoll) lines.push('Status: Honor Roll 🏆');
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, courses]);

  const inputCls = "rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
          <div className="col-span-5">Course Name</div>
          <div className="col-span-3">Credits</div>
          <div className="col-span-3">Grade</div>
          <div className="col-span-1"></div>
        </div>

        {courses.map(course => (
          <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
            <input
              className={`col-span-5 ${inputCls}`}
              type="text"
              value={course.name}
              onChange={e => updateCourse(course.id, 'name', e.target.value)}
              placeholder="e.g. Math 101"
            />
            <input
              className={`col-span-3 ${inputCls}`}
              type="number"
              min="0.5"
              step="0.5"
              value={course.credits}
              onChange={e => updateCourse(course.id, 'credits', e.target.value)}
            />
            <select
              className={`col-span-3 ${inputCls}`}
              value={course.grade}
              onChange={e => updateCourse(course.id, 'grade', e.target.value)}
            >
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <button
              onClick={() => removeCourse(course.id)}
              className="col-span-1 text-red-400 hover:text-red-600 text-lg leading-none"
              aria-label="Remove course"
            >
              ×
            </button>
          </div>
        ))}

        <button
          onClick={addCourse}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          + Add Course
        </button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button onClick={calculate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
          Calculate GPA
        </button>
        <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Reset
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`rounded-xl p-6 text-center ${result.honorRoll ? 'bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600' : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'}`}>
            <div className="text-5xl font-bold text-gray-900 dark:text-gray-100">{result.gpa.toFixed(2)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">out of 4.0</div>
            {result.honorRoll && <div className="text-yellow-600 dark:text-yellow-400 font-semibold mt-2">🏆 Honor Roll</div>}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Credit Hours</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{result.totalCredits}</span>
          </div>

          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
