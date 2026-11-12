import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Tool } from '../../data/tools';

interface FAQProps {
  tool: Tool;
}

interface FAQItem {
  question: string;
  answer: string;
}

function buildFAQs(tool: Tool): FAQItem[] {
  return [
    {
      question: `What is ${tool.name}?`,
      answer: `${tool.name} is a free online tool that helps you ${tool.description.charAt(0).toLowerCase()}${tool.description.slice(1)} It runs entirely in your browser — no sign-up or installation required.`,
    },
    {
      question: `Is ${tool.name} free to use?`,
      answer: `Yes, ${tool.name} is completely free. There are no hidden charges, subscriptions, or account requirements. You can use it as many times as you like.`,
    },
    {
      question: `How accurate is ${tool.name}?`,
      answer: `${tool.name} uses industry-standard algorithms and formulas to ensure accurate results. All calculations are performed locally in your browser for speed and privacy. If you spot an issue, please let us know via the Contact page.`,
    },
  ];
}

interface AccordionItemProps {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ item, index, isOpen, onToggle }: AccordionItemProps) {
  const id = `faq-answer-${index}`;
  const headerId = `faq-header-${index}`;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <h3>
        <button
          id={headerId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={id}
          className="w-full flex items-center justify-between gap-3 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span>{item.question}</span>
          <ChevronDown
            className={`shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        className="pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
      >
        {item.answer}
      </div>
    </div>
  );
}

export default function FAQ({ tool }: FAQProps) {
  const faqs = buildFAQs(tool);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(idx: number) {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  }

  return (
    <section className="mt-10" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
      >
        Frequently Asked Questions
      </h2>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 divide-y divide-gray-200 dark:divide-gray-700">
        {faqs.map((item, idx) => (
          <AccordionItem
            key={idx}
            item={item}
            index={idx}
            isOpen={openIndex === idx}
            onToggle={() => toggle(idx)}
          />
        ))}
      </div>
    </section>
  );
}
