import fs from 'fs';
import { TOOLS } from '../src/data/tools.ts';

const baseUrl = 'https://calculate-anything.in';

let llmsTxt = `# CalculateAnything

> Free, fast, privacy-first online calculators, converters, and developer utilities running directly in your browser without sign-ups or servers.

CalculateAnything is an open web suite of 110+ calculation and conversion tools designed for accuracy, speed, and privacy. Every tool operates 100% on the client side inside the browser, meaning sensitive numbers, financial data, images, text, and documents never leave the user's device.

## Core Categories

- [Date & Age Calculators](${baseUrl}/category/date-age): Tools for birthdays, age differences, elapsed days, working days, and time intervals.
- [Finance & Business Calculators](${baseUrl}/category/finance): Loan EMI, SIP, mutual funds, interest rates, salary breakdown, and tax estimations.
- [Mathematics Calculators](${baseUrl}/category/mathematics): Scientific calculations, percentages, fractions, standard deviations, and ratios.
- [Developer Tools](${baseUrl}/category/developer): JSON formatters, Base64 encoders, UUID generators, regex testers, hash generators, and JWT decoders.
- [Unit & Conversion Tools](${baseUrl}/category/unit-conversion): Converters for length, weight, temperature, data storage, speed, area, and volume.
- [Text & Formatting Tools](${baseUrl}/category/text-formatting): Text case changers, difference checkers, word counters, and Markdown tools.
- [Image & File Tools](${baseUrl}/category/image-file): In-browser image compressor, resizer, cropper, WebP converter, and PDF utilities.
- [Random & Productivity Tools](${baseUrl}/category/productivity): Pomodoro timer, stopwatch, password generator, and randomizers.

## Popular Tools

`;

const popularTools = TOOLS.filter(t => t.popular);
popularTools.forEach(t => {
  llmsTxt += `- [${t.name}](${baseUrl}/tools/${t.slug}): ${t.description}\n`;
});

llmsTxt += `\n## All Tools\n\n`;

const categories = [...new Set(TOOLS.map(t => t.category))];
categories.forEach(cat => {
  llmsTxt += `### ${cat}\n\n`;
  const catTools = TOOLS.filter(t => t.category === cat);
  catTools.forEach(t => {
    llmsTxt += `- [${t.name}](${baseUrl}/tools/${t.slug}): ${t.description}\n`;
  });
  llmsTxt += '\n';
});

llmsTxt += `## Site Information

- [About CalculateAnything](${baseUrl}/about): Architecture, client-side privacy commitments, and tool performance.
- [Privacy Policy](${baseUrl}/privacy-policy): Privacy guarantee detailing zero tracking and client-side processing.
- [Terms of Service](${baseUrl}/terms): Usage terms for free public tools.
- [Disclaimer](${baseUrl}/disclaimer): Calculation accuracy and educational usage guidance.
- [Contact](${baseUrl}/contact): Support, feedback, and feature requests.

## Optional

- [Full Context Index](${baseUrl}/llms-full.txt): Comprehensive tools list including keywords and related capabilities.
`;

fs.writeFileSync('public/llms.txt', llmsTxt.trim() + '\n', 'utf8');

let llmsFull = `# CalculateAnything - Complete LLM Index

> Complete documentation and capability index of all 110+ client-side tools on CalculateAnything.

## Overview

CalculateAnything provides client-side computational utilities across date/age, math, finance, unit conversion, developer formatting, productivity, and image processing.

`;

TOOLS.forEach(t => {
  llmsFull += `### ${t.name}
- **URL**: ${baseUrl}/tools/${t.slug}
- **Category**: ${t.category}
- **Description**: ${t.description}
- **Keywords**: ${t.keywords.join(', ')}
- **Related Tools**: ${t.related.map(r => `${baseUrl}/tools/${r}`).join(', ')}

`;
});

fs.writeFileSync('public/llms-full.txt', llmsFull.trim() + '\n', 'utf8');
console.log('Successfully generated public/llms.txt and public/llms-full.txt');
