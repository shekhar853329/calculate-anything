export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  icon: string; // lucide-react icon name
  keywords: string[];
  related: string[]; // slugs of related tools
  popular?: boolean;
}

export const TOOLS: Tool[] = [
  // ─── Category 1: Date & Age Calculators ───────────────────────────────────
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Calculate your exact age in years, months, days, hours, and minutes from your date of birth. Find out how many days until your next birthday.',
    icon: 'Calendar',
    keywords: ['age', 'birthday', 'date of birth', 'years old', 'calculate age'],
    related: ['age-difference-calculator', 'birthday-calculator', 'date-difference-calculator', 'date-add-subtract'],
    popular: true,
  },
  {
    id: 'age-difference-calculator',
    name: 'Age Difference Calculator',
    slug: 'age-difference-calculator',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Find the exact age difference between two people or two dates. Displays the gap in years, months, and days.',
    icon: 'CalendarRange',
    keywords: ['age difference', 'age gap', 'compare ages', 'two birthdays'],
    related: ['age-calculator', 'date-difference-calculator', 'birthday-calculator', 'date-add-subtract'],
  },
  {
    id: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    slug: 'date-difference-calculator',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Calculate the number of days, weeks, months, and years between any two dates. Useful for project timelines and event planning.',
    icon: 'CalendarDays',
    keywords: ['date difference', 'days between dates', 'date range', 'duration'],
    related: ['age-calculator', 'working-days-calculator', 'days-until-calculator', 'age-difference-calculator'],
  },
  {
    id: 'date-add-subtract',
    name: 'Date Add/Subtract Calculator',
    slug: 'date-add-subtract',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Add or subtract days, weeks, months, or years from any date. Instantly calculate past or future target dates with calendar leap year support.',
    icon: 'CalendarPlus',
    keywords: ['add days', 'subtract days', 'future date', 'past date', 'date arithmetic'],
    related: ['date-difference-calculator', 'working-days-calculator', 'days-until-calculator', 'age-calculator'],
  },
  {
    id: 'days-until-calculator',
    name: 'Days Until Calculator',
    slug: 'days-until-calculator',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Calculate exactly how many days, hours, and minutes remain until any upcoming event, holiday, birthday, or deadline with instant countdown.',
    icon: 'Clock',
    keywords: ['days until', 'countdown', 'days remaining', 'event countdown'],
    related: ['date-difference-calculator', 'date-add-subtract', 'birthday-calculator', 'age-calculator'],
  },
  {
    id: 'birthday-calculator',
    name: 'Birthday Calculator',
    slug: 'birthday-calculator',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Discover what day of the week you were born, your birth number, next birthday countdown, and upcoming birthdays for any date.',
    icon: 'Cake',
    keywords: ['birthday', 'birth date', 'day of week', 'birth number', 'next birthday'],
    related: ['age-calculator', 'age-difference-calculator', 'days-until-calculator', 'date-difference-calculator'],
  },
  {
    id: 'leap-year-checker',
    name: 'Leap Year Checker',
    slug: 'leap-year-checker',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Quickly check whether any given year is a leap year and find the nearest past and future leap years.',
    icon: 'CalendarCheck',
    keywords: ['leap year', 'divisible by 4', 'february 29', 'year check'],
    related: ['date-difference-calculator', 'date-add-subtract', 'days-until-calculator', 'age-calculator'],
  },
  {
    id: 'working-days-calculator',
    name: 'Working Days Calculator',
    slug: 'working-days-calculator',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Calculate the number of business (working) days between two dates, excluding weekends and optional public holidays.',
    icon: 'Briefcase',
    keywords: ['working days', 'business days', 'weekdays', 'exclude weekends', 'holidays'],
    related: ['date-difference-calculator', 'date-add-subtract', 'meeting-time-calculator', 'age-calculator'],
  },
  {
    id: 'time-duration-calculator',
    name: 'Time Duration Calculator',
    slug: 'time-duration-calculator',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Add or subtract time values and calculate the total duration between two time points in hours, minutes, and seconds.',
    icon: 'Timer',
    keywords: ['time duration', 'time difference', 'hours minutes', 'elapsed time'],
    related: ['date-difference-calculator', 'stopwatch', 'countdown-timer', 'age-calculator'],
  },
  {
    id: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    slug: 'unix-timestamp-converter',
    category: 'Date & Age Calculators',
    categorySlug: 'date-age',
    description:
      'Convert Unix timestamps to human-readable dates and vice versa. Supports millisecond and second precision.',
    icon: 'Hash',
    keywords: ['unix timestamp', 'epoch time', 'timestamp converter', 'posix time'],
    related: ['date-difference-calculator', 'time-duration-calculator', 'date-add-subtract', 'age-calculator'],
  },

  // ─── Category 2: Mathematics Calculators ──────────────────────────────────
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'A full-featured scientific calculator with trigonometric, logarithmic, exponential, and statistical functions for advanced mathematical computations.',
    icon: 'Calculator',
    keywords: ['scientific calculator', 'trigonometry', 'logarithm', 'math', 'sin cos tan'],
    related: ['percentage-calculator', 'square-root-calculator', 'power-calculator', 'fraction-calculator'],
    popular: true,
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Calculate percentages, percentage change, percentage of a number, and reverse percentages with ease.',
    icon: 'Percent',
    keywords: ['percentage', 'percent of', 'percentage change', 'discount', 'increase decrease'],
    related: ['scientific-calculator', 'profit-loss-calculator', 'discount-calculator', 'fraction-calculator'],
  },
  {
    id: 'fraction-calculator',
    name: 'Fraction Calculator',
    slug: 'fraction-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Add, subtract, multiply, and divide fractions and mixed numbers. Automatically simplifies results to the lowest terms.',
    icon: 'Divide',
    keywords: ['fraction', 'mixed numbers', 'simplify fraction', 'numerator denominator'],
    related: ['scientific-calculator', 'ratio-calculator', 'lcm-hcf-calculator', 'percentage-calculator'],
  },
  {
    id: 'ratio-calculator',
    name: 'Ratio Calculator',
    slug: 'ratio-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Simplify ratios, find equivalent ratios, and solve proportions for A:B = C:D. Free online math ratio solver with step-by-step simplification.',
    icon: 'SplitSquareHorizontal',
    keywords: ['ratio', 'proportion', 'simplify ratio', 'equivalent ratio'],
    related: ['fraction-calculator', 'percentage-calculator', 'average-calculator', 'scientific-calculator'],
  },
  {
    id: 'average-calculator',
    name: 'Average Calculator',
    slug: 'average-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Compute the mean, median, mode, and range for any list of numbers. Great for statistics and data analysis.',
    icon: 'BarChart2',
    keywords: ['average', 'mean', 'median', 'mode', 'statistics'],
    related: ['standard-deviation-calculator', 'scientific-calculator', 'gpa-calculator', 'percentage-calculator'],
  },
  {
    id: 'square-root-calculator',
    name: 'Square Root Calculator',
    slug: 'square-root-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Calculate the square root, cube root, or any nth root of a number instantly with step-by-step explanation.',
    icon: 'Radical',
    keywords: ['square root', 'cube root', 'nth root', 'radical'],
    related: ['scientific-calculator', 'power-calculator', 'factorial-calculator', 'percentage-calculator'],
  },
  {
    id: 'power-calculator',
    name: 'Power Calculator',
    slug: 'power-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Calculate a base raised to any exponent, including negative and fractional powers, with detailed results.',
    icon: 'Zap',
    keywords: ['power', 'exponent', 'base', 'raise to power', 'exponentiation'],
    related: ['square-root-calculator', 'scientific-calculator', 'factorial-calculator', 'percentage-calculator'],
  },
  {
    id: 'prime-number-checker',
    name: 'Prime Number Checker',
    slug: 'prime-number-checker',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Check whether a number is prime or composite, and find all prime factors with a complete factorization breakdown.',
    icon: 'Shield',
    keywords: ['prime number', 'prime checker', 'composite', 'prime factors', 'factorization'],
    related: ['lcm-hcf-calculator', 'factorial-calculator', 'scientific-calculator', 'percentage-calculator'],
  },
  {
    id: 'lcm-hcf-calculator',
    name: 'LCM & HCF Calculator',
    slug: 'lcm-hcf-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Find the Least Common Multiple (LCM) and Highest Common Factor (HCF / GCD) of two or more numbers instantly with step-by-step prime factorizations.',
    icon: 'GitMerge',
    keywords: ['lcm', 'hcf', 'gcd', 'least common multiple', 'greatest common divisor'],
    related: ['prime-number-checker', 'fraction-calculator', 'factorial-calculator', 'scientific-calculator'],
  },
  {
    id: 'factorial-calculator',
    name: 'Factorial Calculator',
    slug: 'factorial-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Calculate the factorial (n!) of any non-negative integer with precision. Includes permutation and combination formulas for math and probability.',
    icon: 'Sigma',
    keywords: ['factorial', 'permutation', 'combination', 'n!', 'combinatorics'],
    related: ['scientific-calculator', 'prime-number-checker', 'lcm-hcf-calculator', 'percentage-calculator'],
  },
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    slug: 'random-number-generator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Generate one or multiple random numbers within a custom range. Supports integers and decimal values.',
    icon: 'Shuffle',
    keywords: ['random number', 'random generator', 'dice roll', 'lottery', 'random integer'],
    related: ['random-name-picker', 'random-password-generator', 'random-team-generator', 'scientific-calculator'],
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Calculate your Body Mass Index (BMI) using height and weight in metric or imperial units, with a health classification result.',
    icon: 'Activity',
    keywords: ['bmi', 'body mass index', 'weight height', 'obesity', 'health'],
    related: ['scientific-calculator', 'average-calculator', 'standard-deviation-calculator', 'percentage-calculator'],
    popular: true,
  },
  {
    id: 'gpa-calculator',
    name: 'GPA Calculator',
    slug: 'gpa-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Calculate your cumulative and semester GPA easily. Enter course grades and credit hours to determine your grade point average on standard 4.0 scale.',
    icon: 'GraduationCap',
    keywords: ['gpa', 'grade point average', 'semester gpa', 'cgpa', 'academic'],
    related: ['average-calculator', 'percentage-calculator', 'scientific-calculator', 'fraction-calculator'],
  },
  {
    id: 'standard-deviation-calculator',
    name: 'Standard Deviation Calculator',
    slug: 'standard-deviation-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Compute the population and sample standard deviation, variance, and other descriptive statistics for a dataset.',
    icon: 'TrendingUp',
    keywords: ['standard deviation', 'variance', 'statistics', 'mean', 'data analysis'],
    related: ['average-calculator', 'scientific-calculator', 'gpa-calculator', 'percentage-calculator'],
  },
  {
    id: 'profit-loss-calculator',
    name: 'Profit & Loss Calculator',
    slug: 'profit-loss-calculator',
    category: 'Mathematics Calculators',
    categorySlug: 'mathematics',
    description:
      'Calculate profit, loss, profit percentage, and loss margin given cost price and selling price. Essential financial tool for business and trading.',
    icon: 'TrendingDown',
    keywords: ['profit loss', 'profit percentage', 'cost price', 'selling price', 'margin'],
    related: ['percentage-calculator', 'discount-calculator', 'gst-calculator', 'scientific-calculator'],
  },

  // ─── Category 3: Text & Formatting Tools ──────────────────────────────────
  {
    id: 'rich-text-editor',
    name: 'Rich Text Editor',
    slug: 'rich-text-editor',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Full-featured WYSIWYG rich text editor powered by open-source TinyMCE. Format text, insert tables, media, code, and export to HTML or plain text offline.',
    icon: 'FileEdit',
    keywords: ['rich text editor', 'tinymce', 'wysiwyg', 'html editor', 'text formatting', 'word processor', 'document editor'],
    related: ['word-character-counter', 'markdown-previewer', 'html-formatter', 'text-formatter'],
    popular: true,
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    slug: 'json-formatter',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Beautify, minify, and validate JSON data instantly. Supports syntax highlighting and error detection for malformed JSON.',
    icon: 'Braces',
    keywords: ['json formatter', 'json beautify', 'json minify', 'json validator', 'pretty print'],
    related: ['xml-formatter', 'json-to-csv-converter', 'json-schema-validator', 'rich-text-editor'],
    popular: true,
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    slug: 'text-case-converter',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Convert text between uppercase, lowercase, title case, sentence case, camelCase, snake_case, and kebab-case.',
    icon: 'CaseSensitive',
    keywords: ['text case', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake_case'],
    related: ['word-character-counter', 'text-formatter', 'lorem-ipsum-generator', 'rich-text-editor'],
  },
  {
    id: 'word-character-counter',
    name: 'Word & Character Counter',
    slug: 'word-character-counter',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Count words, characters (with and without spaces), sentences, paragraphs, and lines in any block of text.',
    icon: 'FileText',
    keywords: ['word count', 'character count', 'text analysis', 'sentence count', 'paragraph'],
    related: ['text-case-converter', 'reading-time-calculator', 'text-formatter', 'rich-text-editor'],
  },
  {
    id: 'text-difference-checker',
    name: 'Text Difference Checker',
    slug: 'text-difference-checker',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Compare two blocks of text side-by-side and highlight the differences line by line, word by word, or character by character.',
    icon: 'GitCompare',
    keywords: ['text diff', 'compare text', 'diff checker', 'text comparison'],
    related: ['text-formatter', 'json-formatter', 'xml-formatter', 'rich-text-editor'],
  },
  {
    id: 'text-formatter',
    name: 'Text Formatter',
    slug: 'text-formatter',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Remove extra spaces, fix line breaks, trim whitespace, and clean up pasted text from documents or PDFs.',
    icon: 'AlignLeft',
    keywords: ['text formatter', 'clean text', 'remove spaces', 'trim whitespace'],
    related: ['text-case-converter', 'word-character-counter', 'text-difference-checker', 'rich-text-editor'],
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown Previewer',
    slug: 'markdown-previewer',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Write Markdown and see a live formatted preview side-by-side. Supports tables, code blocks, images, and GFM extensions.',
    icon: 'FileCode',
    keywords: ['markdown', 'markdown preview', 'markdown editor', 'readme', 'gfm'],
    related: ['html-formatter', 'text-formatter', 'html-to-markdown-converter', 'rich-text-editor'],
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    slug: 'html-formatter',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Beautify, format, and minify HTML markup instantly. Clean up messy code with customizable indentation, tag formatting, and syntax validation.',
    icon: 'Code',
    keywords: ['html formatter', 'html beautify', 'html minify', 'pretty html'],
    related: ['css-formatter', 'javascript-formatter', 'markdown-previewer', 'rich-text-editor'],
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter',
    slug: 'css-formatter',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Beautify, format, and minify CSS code online. Clean up stylesheets with custom indentation, CSS property sorting, and syntax error checking.',
    icon: 'Paintbrush',
    keywords: ['css formatter', 'css beautify', 'css minify', 'stylesheet formatter'],
    related: ['html-formatter', 'javascript-formatter', 'css-gradient-generator', 'rich-text-editor'],
  },
  {
    id: 'javascript-formatter',
    name: 'JavaScript Formatter',
    slug: 'javascript-formatter',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Format, beautify, and clean up JavaScript and TypeScript code online with configurable indentation, bracket spacing, and syntax highlighting.',
    icon: 'FileJson',
    keywords: ['javascript formatter', 'js beautify', 'prettier', 'code formatter', 'typescript'],
    related: ['html-formatter', 'css-formatter', 'json-formatter', 'rich-text-editor'],
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    slug: 'xml-formatter',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Format, beautify, and validate XML documents online. Clean up messy XML feeds and files with structured indentation and tree hierarchy view.',
    icon: 'FileCode2',
    keywords: ['xml formatter', 'xml beautify', 'xml validator', 'xml parser'],
    related: ['json-formatter', 'html-formatter', 'sql-formatter', 'rich-text-editor'],
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    slug: 'sql-formatter',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Format and beautify SQL queries with proper indentation and keyword capitalization for better readability.',
    icon: 'Database',
    keywords: ['sql formatter', 'sql beautify', 'sql query', 'database query'],
    related: ['json-formatter', 'xml-formatter', 'sql-query-formatter', 'rich-text-editor'],
  },
  {
    id: 'url-encoder-decoder',
    name: 'URL Encoder/Decoder',
    slug: 'url-encoder-decoder',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Encode special characters in URLs for safe transmission or decode percent-encoded URLs back to plain text.',
    icon: 'Link',
    keywords: ['url encode', 'url decode', 'percent encoding', 'uri encode', 'query string'],
    related: ['base64-encoder-decoder', 'html-entity-encoder-decoder', 'jwt-decoder', 'rich-text-editor'],
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    slug: 'base64-encoder-decoder',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Encode plain text or binary data to Base64 format and decode Base64 strings back to their original content.',
    icon: 'Binary',
    keywords: ['base64', 'encode decode', 'base64 image', 'binary encoding'],
    related: ['url-encoder-decoder', 'html-entity-encoder-decoder', 'hash-generator', 'rich-text-editor'],
  },
  {
    id: 'html-entity-encoder-decoder',
    name: 'HTML Entity Encoder/Decoder',
    slug: 'html-entity-encoder-decoder',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Encode special characters into HTML entities or decode entity codes back to plain text. Supports named, decimal, and hexadecimal formats.',
    icon: 'Replace',
    keywords: ['html entity', 'html encode', 'html decode', 'special characters', 'escape'],
    related: ['url-encoder-decoder', 'base64-encoder-decoder', 'html-formatter', 'rich-text-editor'],
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    slug: 'lorem-ipsum-generator',
    category: 'Text & Formatting Tools',
    categorySlug: 'text-formatting',
    description:
      'Generate placeholder Lorem Ipsum text by paragraphs, sentences, words, or bytes for use in design mockups and prototypes.',
    icon: 'PenLine',
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'filler text'],
    related: ['word-character-counter', 'text-formatter', 'text-case-converter', 'rich-text-editor'],
  },

  // ─── Category 4: Developer Tools ──────────────────────────────────────────
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    slug: 'jwt-decoder',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Decode and inspect JSON Web Tokens (JWT) to view the header, payload, and signature without needing a secret key.',
    icon: 'KeyRound',
    keywords: ['jwt', 'json web token', 'decode jwt', 'bearer token', 'authentication'],
    related: ['hash-generator', 'base64-encoder-decoder', 'url-encoder-decoder', 'regex-tester'],
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    slug: 'regex-tester',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Test and debug regular expressions against sample text in real time, with match highlighting and group capture details.',
    icon: 'Search',
    keywords: ['regex', 'regular expression', 'pattern matching', 'regex tester'],
    related: ['text-difference-checker', 'javascript-formatter', 'json-formatter', 'jwt-decoder'],
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    slug: 'uuid-generator',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Generate RFC-compliant UUIDs (v1, v4) in bulk. Copy individual or multiple UUIDs with a single click.',
    icon: 'Fingerprint',
    keywords: ['uuid', 'guid', 'unique id', 'random id', 'identifier'],
    related: ['hash-generator', 'password-generator', 'random-number-generator', 'jwt-decoder'],
  },
  {
    id: 'cron-expression-generator',
    name: 'Cron Expression Generator',
    slug: 'cron-expression-generator',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Build and validate cron expressions visually. Instantly see the next scheduled run times for any cron schedule.',
    icon: 'Clock4',
    keywords: ['cron', 'cron expression', 'scheduler', 'crontab', 'schedule'],
    related: ['unix-timestamp-converter', 'time-duration-calculator', 'countdown-timer', 'jwt-decoder'],
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    slug: 'hash-generator',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes from any text or file input instantly.',
    icon: 'ShieldCheck',
    keywords: ['hash', 'md5', 'sha256', 'sha512', 'checksum', 'cryptographic hash'],
    related: ['password-generator', 'uuid-generator', 'base64-encoder-decoder', 'jwt-decoder'],
    popular: true,
  },
  {
    id: 'color-code-converter',
    name: 'Color Code Converter',
    slug: 'color-code-converter',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Convert color codes between HEX, RGB, HSL, HSV, and CMYK formats with an interactive visual color picker and real-time live preview.',
    icon: 'Palette',
    keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'color code', 'color picker'],
    related: ['css-gradient-generator', 'css-formatter', 'svg-optimizer', 'jwt-decoder'],
  },
  {
    id: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    slug: 'css-gradient-generator',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Design linear, radial, and conic CSS gradients visually. Adjust color stops, angles, and blend modes, then copy cross-browser CSS code.',
    icon: 'Layers',
    keywords: ['css gradient', 'linear gradient', 'radial gradient', 'background gradient'],
    related: ['color-code-converter', 'css-formatter', 'svg-optimizer', 'jwt-decoder'],
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Create custom QR codes for URLs, text, Wi-Fi passwords, vCards, and emails. Download high-resolution vector SVG or PNG images instantly.',
    icon: 'QrCode',
    keywords: ['qr code', 'qr generator', 'barcode', 'qr code download', 'wifi qr'],
    related: ['qr-code-scanner', 'uuid-generator', 'jwt-decoder', 'regex-tester'],
    popular: true,
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    slug: 'password-generator',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Generate strong, secure passwords with custom length, character sets, symbols, and numbers. Includes strength indicator.',
    icon: 'Lock',
    keywords: ['password generator', 'strong password', 'secure password', 'random password'],
    related: ['password-strength-checker', 'random-password-generator', 'hash-generator', 'jwt-decoder'],
    popular: true,
  },
  {
    id: 'sql-query-formatter',
    name: 'SQL Query Formatter',
    slug: 'sql-query-formatter',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Format and indent complex SQL queries for improved readability. Supports MySQL, PostgreSQL, and standard SQL dialects.',
    icon: 'TableProperties',
    keywords: ['sql formatter', 'sql query', 'database', 'mysql', 'postgresql'],
    related: ['sql-formatter', 'json-formatter', 'json-to-csv-converter', 'jwt-decoder'],
  },
  {
    id: 'http-status-code-lookup',
    name: 'HTTP Status Code Lookup',
    slug: 'http-status-code-lookup',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Quickly look up HTTP status codes (1xx, 2xx, 3xx, 4xx, 5xx). View official RFC definitions, causes, and troubleshooting guidelines.',
    icon: 'Globe',
    keywords: ['http status', '404', '200', '500', 'status code', 'http response'],
    related: ['mime-type-lookup', 'api-request-builder', 'ip-address-info', 'jwt-decoder'],
  },
  {
    id: 'mime-type-lookup',
    name: 'MIME Type Lookup',
    slug: 'mime-type-lookup',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Search MIME types by file extension or find associated extensions by media type. Complete directory for web developers and API designers.',
    icon: 'FileSearch',
    keywords: ['mime type', 'content type', 'file extension', 'media type'],
    related: ['http-status-code-lookup', 'api-request-builder', 'json-formatter', 'jwt-decoder'],
  },
  {
    id: 'ip-address-info',
    name: 'IP Address Information Tool',
    slug: 'ip-address-info',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Look up geolocation, ISP, and network details for any IP address (IPv4 or IPv6). Also detects your current IP.',
    icon: 'MapPin',
    keywords: ['ip address', 'ip lookup', 'geolocation', 'isp', 'ipv4 ipv6'],
    related: ['http-status-code-lookup', 'user-agent-parser', 'mime-type-lookup', 'jwt-decoder'],
  },
  {
    id: 'user-agent-parser',
    name: 'User-Agent Parser',
    slug: 'user-agent-parser',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Parse any User-Agent string to identify the browser, operating system, device type, and engine details.',
    icon: 'Monitor',
    keywords: ['user agent', 'browser detection', 'os detection', 'device parser'],
    related: ['ip-address-info', 'http-status-code-lookup', 'regex-tester', 'jwt-decoder'],
  },
  {
    id: 'html-to-markdown-converter',
    name: 'HTML to Markdown Converter',
    slug: 'html-to-markdown-converter',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Convert HTML markup to clean Markdown syntax, preserving headings, lists, links, tables, and inline formatting.',
    icon: 'ArrowRightLeft',
    keywords: ['html to markdown', 'convert html', 'markdown converter', 'html parser'],
    related: ['markdown-previewer', 'html-formatter', 'text-formatter', 'jwt-decoder'],
  },
  {
    id: 'json-to-csv-converter',
    name: 'JSON to CSV Converter',
    slug: 'json-to-csv-converter',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Convert JSON arrays to CSV format and download the resulting file for use in spreadsheets or data tools.',
    icon: 'Table',
    keywords: ['json to csv', 'json converter', 'csv export', 'data conversion'],
    related: ['csv-to-json-converter', 'json-formatter', 'json-schema-validator', 'jwt-decoder'],
  },
  {
    id: 'csv-to-json-converter',
    name: 'CSV to JSON Converter',
    slug: 'csv-to-json-converter',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Convert CSV data to clean JSON format online with automatic header detection, custom delimiters, and formatted or minified output options.',
    icon: 'FileInput',
    keywords: ['csv to json', 'csv converter', 'parse csv', 'data import'],
    related: ['json-to-csv-converter', 'json-formatter', 'sql-query-formatter', 'jwt-decoder'],
  },
  {
    id: 'json-schema-validator',
    name: 'JSON Schema Validator',
    slug: 'json-schema-validator',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Validate JSON data against a JSON Schema (Draft-07 or later) and get detailed error messages for invalid fields.',
    icon: 'ClipboardCheck',
    keywords: ['json schema', 'json validator', 'schema validation', 'ajv', 'json draft'],
    related: ['json-formatter', 'json-to-csv-converter', 'csv-to-json-converter', 'jwt-decoder'],
  },
  {
    id: 'svg-optimizer',
    name: 'SVG Optimizer',
    slug: 'svg-optimizer',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Optimize and minify SVG files by removing unnecessary metadata, comments, and redundant elements to reduce file size.',
    icon: 'Maximize2',
    keywords: ['svg optimizer', 'svgo', 'svg minify', 'vector optimization'],
    related: ['image-compressor', 'css-gradient-generator', 'color-code-converter', 'jwt-decoder'],
  },
  {
    id: 'api-request-builder',
    name: 'API Request Builder',
    slug: 'api-request-builder',
    category: 'Developer Tools',
    categorySlug: 'developer',
    description:
      'Build and send HTTP requests (GET, POST, PUT, DELETE) with custom headers, query params, and body. View formatted responses.',
    icon: 'Send',
    keywords: ['api request', 'http client', 'rest api', 'postman alternative', 'fetch'],
    related: ['http-status-code-lookup', 'json-formatter', 'jwt-decoder', 'regex-tester'],
  },

  // ─── Category 5: Unit & Conversion Tools ──────────────────────────────────
  {
    id: 'length-converter',
    name: 'Length Converter',
    slug: 'length-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert length and distance between meters, feet, inches, miles, kilometers, yards, and nautical units with real-time bidirectional conversion.',
    icon: 'Ruler',
    keywords: ['length converter', 'meter feet', 'km miles', 'unit conversion', 'distance'],
    related: ['weight-converter', 'area-converter', 'speed-converter', 'temperature-converter'],
  },
  {
    id: 'weight-converter',
    name: 'Weight Converter',
    slug: 'weight-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert weight and mass between kilograms, pounds (lbs), grams, ounces (oz), stones, and tons with instant, high-precision calculations.',
    icon: 'Scale',
    keywords: ['weight converter', 'kg to lbs', 'pounds kilograms', 'mass conversion'],
    related: ['length-converter', 'bmi-calculator', 'volume-converter', 'temperature-converter'],
  },
  {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    slug: 'temperature-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert temperatures instantly between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R) with step-by-step conversion formulas.',
    icon: 'Thermometer',
    keywords: ['temperature converter', 'celsius fahrenheit', 'kelvin', 'convert temperature'],
    related: ['length-converter', 'weight-converter', 'speed-converter', 'data-storage-converter'],
    popular: true,
  },
  {
    id: 'data-storage-converter',
    name: 'Data Storage Converter',
    slug: 'data-storage-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert between bits, bytes, kilobytes, megabytes, gigabytes, terabytes, and beyond using binary or decimal prefixes.',
    icon: 'HardDrive',
    keywords: ['data storage', 'bytes megabytes', 'gb to mb', 'file size converter'],
    related: ['internet-speed-unit-converter', 'length-converter', 'number-to-words-converter', 'weight-converter'],
  },
  {
    id: 'speed-converter',
    name: 'Speed Converter',
    slug: 'speed-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert speed between km/h, mph, m/s, knots, and other velocity units for travel, physics, and engineering.',
    icon: 'Gauge',
    keywords: ['speed converter', 'kmh to mph', 'velocity', 'knots', 'meter per second'],
    related: ['length-converter', 'time-converter', 'temperature-converter', 'weight-converter'],
  },
  {
    id: 'time-converter',
    name: 'Time Converter',
    slug: 'time-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert between seconds, minutes, hours, days, weeks, months, and years with high precision. Ideal for time tracking, billing, and scheduling.',
    icon: 'Hourglass',
    keywords: ['time converter', 'seconds to hours', 'minutes hours', 'time unit'],
    related: ['time-duration-calculator', 'speed-converter', 'unix-timestamp-converter', 'length-converter'],
  },
  {
    id: 'area-converter',
    name: 'Area Converter',
    slug: 'area-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert between square meters, square feet, acres, hectares, square kilometers, and many more area units.',
    icon: 'Square',
    keywords: ['area converter', 'square meter', 'acres hectares', 'sq ft to sq m'],
    related: ['length-converter', 'volume-converter', 'weight-converter', 'temperature-converter'],
  },
  {
    id: 'volume-converter',
    name: 'Volume Converter',
    slug: 'volume-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert volume between liters, milliliters, gallons, fluid ounces, pints, cups, cubic meters, and cubic feet with instant calculation.',
    icon: 'Container',
    keywords: ['volume converter', 'liters to gallons', 'ml to oz', 'cubic meters'],
    related: ['weight-converter', 'area-converter', 'length-converter', 'temperature-converter'],
  },
  {
    id: 'number-to-words-converter',
    name: 'Number to Words Converter',
    slug: 'number-to-words-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert any number to its English word representation. Useful for writing cheques or formal documents.',
    icon: 'Type',
    keywords: ['number to words', 'spell number', 'number in words', 'check writing'],
    related: ['roman-numeral-converter', 'data-storage-converter', 'scientific-calculator', 'length-converter'],
  },
  {
    id: 'roman-numeral-converter',
    name: 'Roman Numeral Converter',
    slug: 'roman-numeral-converter',
    category: 'Unit & Conversion Tools',
    categorySlug: 'unit-conversion',
    description:
      'Convert numbers between Arabic numerals and Roman numerals (1 to 3,999). Includes explanation of Roman numeral rules and calculation breakdown.',
    icon: 'Columns',
    keywords: ['roman numerals', 'roman numeral converter', 'arabic to roman', 'numeral'],
    related: ['number-to-words-converter', 'scientific-calculator', 'factorial-calculator', 'length-converter'],
  },

  // ─── Category 6: Finance & Business Calculators ───────────────────────────
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    slug: 'emi-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Calculate your monthly EMI for home, car, or personal loans based on principal, interest rate, and tenure. Includes amortization schedule.',
    icon: 'CreditCard',
    keywords: ['emi calculator', 'loan emi', 'monthly installment', 'home loan', 'car loan'],
    related: ['simple-interest-calculator', 'compound-interest-calculator', 'fd-calculator', 'gst-calculator'],
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    slug: 'gst-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Calculate GST-inclusive and GST-exclusive prices for different GST slabs (5%, 12%, 18%, 28%). Shows CGST, SGST, and IGST breakdowns.',
    icon: 'Receipt',
    keywords: ['gst calculator', 'goods services tax', 'gst inclusive', 'cgst sgst igst'],
    related: ['discount-calculator', 'profit-loss-calculator', 'salary-calculator', 'emi-calculator'],
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    slug: 'sip-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Calculate the future value of your Systematic Investment Plan (SIP) investments and estimate returns over time.',
    icon: 'TrendingUp',
    keywords: ['sip calculator', 'mutual fund', 'systematic investment', 'investment returns'],
    related: ['fd-calculator', 'rd-calculator', 'compound-interest-calculator', 'emi-calculator'],
  },
  {
    id: 'fd-calculator',
    name: 'FD Calculator',
    slug: 'fd-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Calculate the maturity amount and interest earned on a Fixed Deposit for different compounding frequencies.',
    icon: 'PiggyBank',
    keywords: ['fd calculator', 'fixed deposit', 'maturity amount', 'bank interest'],
    related: ['rd-calculator', 'sip-calculator', 'compound-interest-calculator', 'emi-calculator'],
  },
  {
    id: 'rd-calculator',
    name: 'RD Calculator',
    slug: 'rd-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Calculate the maturity value of a Recurring Deposit by entering the monthly deposit amount, interest rate, and tenure.',
    icon: 'Wallet',
    keywords: ['rd calculator', 'recurring deposit', 'maturity value', 'monthly deposit'],
    related: ['fd-calculator', 'sip-calculator', 'simple-interest-calculator', 'emi-calculator'],
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Calculate simple interest (SI = P×R×T/100) and total accumulated amount for any principal, annual interest rate, and duration in years or months.',
    icon: 'DollarSign',
    keywords: ['simple interest', 'si calculator', 'principal rate time', 'interest'],
    related: ['compound-interest-calculator', 'emi-calculator', 'fd-calculator', 'gst-calculator'],
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Calculate compound interest with different compounding frequencies (daily, monthly, quarterly, annually) and see the power of compounding.',
    icon: 'BarChart',
    keywords: ['compound interest', 'compounding', 'annual interest', 'investment growth'],
    related: ['simple-interest-calculator', 'sip-calculator', 'fd-calculator', 'emi-calculator'],
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    slug: 'discount-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Calculate the discounted price, discount amount, and savings percentage for any original price and discount rate.',
    icon: 'Tag',
    keywords: ['discount calculator', 'sale price', 'percentage off', 'savings'],
    related: ['percentage-calculator', 'gst-calculator', 'profit-loss-calculator', 'emi-calculator'],
  },
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Convert salary between hourly, daily, weekly, monthly, and annual figures. Includes basic tax and deduction estimations.',
    icon: 'Banknote',
    keywords: ['salary calculator', 'annual salary', 'hourly rate', 'monthly salary', 'ctc'],
    related: ['income-tax-calculator', 'gst-calculator', 'discount-calculator', 'emi-calculator'],
  },
  {
    id: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    slug: 'income-tax-calculator',
    category: 'Finance & Business Calculators',
    categorySlug: 'finance',
    description:
      'Estimate your income tax liability under the old and new tax regimes for the current financial year.',
    icon: 'Landmark',
    keywords: ['income tax', 'tax calculator', 'tax slab', 'new tax regime', 'old tax regime'],
    related: ['salary-calculator', 'gst-calculator', 'compound-interest-calculator', 'emi-calculator'],
  },

  // ─── Category 7: Image & File Tools ───────────────────────────────────────
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Compress JPEG, PNG, and WebP images in the browser without uploading to a server. Adjust quality and see real-time size reduction.',
    icon: 'Image',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'optimize image'],
    related: ['image-resizer', 'png-to-jpg-converter', 'svg-optimizer', 'image-to-pdf-converter'],
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Resize images to exact pixel dimensions or by percentage while maintaining aspect ratio. Download the resized image instantly.',
    icon: 'Maximize',
    keywords: ['image resizer', 'resize image', 'scale image', 'image dimensions'],
    related: ['image-compressor', 'image-cropper', 'png-to-jpg-converter', 'image-to-pdf-converter'],
  },
  {
    id: 'image-to-pdf-converter',
    name: 'Image to PDF Converter',
    slug: 'image-to-pdf-converter',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Convert one or multiple images (JPG, PNG, WebP) into a single PDF document. Control page size and orientation.',
    icon: 'FileImage',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert image pdf'],
    related: ['pdf-to-image-converter', 'pdf-merger', 'image-compressor', 'image-resizer'],
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    slug: 'pdf-merger',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Combine multiple PDF files into one document in seconds. Reorder pages with drag-and-drop in your browser with 100% client-side privacy.',
    icon: 'FilePlus',
    keywords: ['pdf merger', 'merge pdf', 'combine pdf', 'join pdf files'],
    related: ['pdf-splitter', 'image-to-pdf-converter', 'pdf-page-counter', 'image-compressor'],
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    slug: 'pdf-splitter',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Split PDF documents into separate pages or extract specific page ranges securely in your browser. Fast, private, with zero upload to any server.',
    icon: 'Scissors',
    keywords: ['pdf splitter', 'split pdf', 'extract pages', 'pdf pages'],
    related: ['pdf-merger', 'pdf-page-counter', 'pdf-to-image-converter', 'image-compressor'],
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    slug: 'background-remover',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Automatically remove the background from photos using AI-powered segmentation, all processed client-side for privacy.',
    icon: 'Eraser',
    keywords: ['background remover', 'remove background', 'transparent background', 'cut out'],
    related: ['image-compressor', 'image-resizer', 'png-to-jpg-converter', 'image-to-pdf-converter'],
  },
  {
    id: 'png-to-jpg-converter',
    name: 'PNG to JPG Converter',
    slug: 'png-to-jpg-converter',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Convert PNG images to JPG format with adjustable quality settings. Handles transparency by applying a background color.',
    icon: 'FileType',
    keywords: ['png to jpg', 'convert png', 'image format', 'jpg converter'],
    related: ['jpg-to-png-converter', 'webp-converter', 'image-compressor', 'image-resizer'],
  },
  {
    id: 'jpg-to-png-converter',
    name: 'JPG to PNG Converter',
    slug: 'jpg-to-png-converter',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Convert JPG and JPEG images to high-quality PNG format online. Runs completely client-side in your browser for total privacy and instant downloads.',
    icon: 'FileType2',
    keywords: ['jpg to png', 'convert jpg', 'jpeg to png', 'lossless image'],
    related: ['png-to-jpg-converter', 'webp-converter', 'image-compressor', 'image-resizer'],
  },
  {
    id: 'webp-converter',
    name: 'WebP Converter',
    slug: 'webp-converter',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Convert images to and from WebP format for fast web performance. Reduce file size while keeping crisp quality directly in your browser.',
    icon: 'ImagePlus',
    keywords: ['webp converter', 'webp image', 'convert to webp', 'webp format'],
    related: ['png-to-jpg-converter', 'jpg-to-png-converter', 'image-compressor', 'image-resizer'],
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    slug: 'image-cropper',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Crop images to any size or aspect ratio using an interactive drag-and-drop interface. Download the cropped image instantly.',
    icon: 'Crop',
    keywords: ['image cropper', 'crop image', 'trim image', 'aspect ratio'],
    related: ['image-resizer', 'image-compressor', 'background-remover', 'image-to-pdf-converter'],
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    slug: 'favicon-generator',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Generate complete favicon packages (ICO, PNG 16x16 to 512x512, Apple touch icons) from any image with HTML link tags ready to copy.',
    icon: 'Star',
    keywords: ['favicon generator', 'favicon ico', 'web icon', 'site icon'],
    related: ['image-resizer', 'png-to-jpg-converter', 'svg-optimizer', 'image-compressor'],
  },
  {
    id: 'qr-code-scanner',
    name: 'QR Code Scanner',
    slug: 'qr-code-scanner',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Scan and decode QR codes from an uploaded image or directly from your webcam using the browser camera.',
    icon: 'ScanLine',
    keywords: ['qr code scanner', 'scan qr', 'decode qr', 'barcode reader', 'qr reader'],
    related: ['qr-code-generator', 'image-compressor', 'image-metadata-viewer', 'image-resizer'],
  },
  {
    id: 'pdf-page-counter',
    name: 'PDF Page Counter',
    slug: 'pdf-page-counter',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Count pages in any PDF document instantly and inspect file size, page dimensions, and document metadata completely client-side in your browser.',
    icon: 'FileDigit',
    keywords: ['pdf page count', 'count pdf pages', 'pdf info', 'pdf metadata'],
    related: ['pdf-merger', 'pdf-splitter', 'pdf-to-image-converter', 'image-compressor'],
  },
  {
    id: 'pdf-to-image-converter',
    name: 'PDF to Image Converter',
    slug: 'pdf-to-image-converter',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'Extract and convert PDF pages into high-resolution PNG or JPG images. Download single pages or all pages packaged as a ZIP archive.',
    icon: 'FileScan',
    keywords: ['pdf to image', 'pdf to png', 'pdf to jpg', 'convert pdf pages'],
    related: ['image-to-pdf-converter', 'pdf-splitter', 'pdf-page-counter', 'image-compressor'],
  },
  {
    id: 'image-metadata-viewer',
    name: 'Image Metadata Viewer',
    slug: 'image-metadata-viewer',
    category: 'Image & File Tools',
    categorySlug: 'image-file',
    description:
      'View EXIF, IPTC, and XMP metadata from JPEG and TIFF images. See camera settings, GPS coordinates, and more.',
    icon: 'Info',
    keywords: ['exif viewer', 'image metadata', 'exif data', 'photo info', 'gps exif'],
    related: ['image-compressor', 'qr-code-scanner', 'pdf-page-counter', 'image-resizer'],
  },

  // ─── Category 8: Random & Productivity Tools ──────────────────────────────
  {
    id: 'random-name-picker',
    name: 'Random Name Picker',
    slug: 'random-name-picker',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Enter a list of names and randomly pick one or more winners. Perfect for giveaways, classroom selections, and team decisions.',
    icon: 'Users',
    keywords: ['random name picker', 'name wheel', 'random picker', 'giveaway picker'],
    related: ['random-team-generator', 'decision-maker', 'random-number-generator', 'random-password-generator'],
  },
  {
    id: 'random-password-generator',
    name: 'Random Password Generator',
    slug: 'random-password-generator',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Generate secure, randomized passwords in bulk with customizable length, symbols, numbers, and uppercase letters. Fast and completely client-side.',
    icon: 'KeySquare',
    keywords: ['random password', 'password generator', 'secure password', 'bulk password'],
    related: ['password-generator', 'password-strength-checker', 'hash-generator', 'random-name-picker'],
  },
  {
    id: 'random-team-generator',
    name: 'Random Team Generator',
    slug: 'random-team-generator',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Quickly generate balanced random teams or groups from any list of names. Perfect for classrooms, sports, hackathons, and office activities.',
    icon: 'Group',
    keywords: ['random teams', 'team generator', 'split teams', 'group generator'],
    related: ['random-name-picker', 'decision-maker', 'checklist-generator', 'random-password-generator'],
  },
  {
    id: 'decision-maker',
    name: 'Decision Maker',
    slug: 'decision-maker',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Enter your choices and let the Decision Maker randomly pick one for you. Supports Yes/No, custom options, and weighted choices.',
    icon: 'HelpCircle',
    keywords: ['decision maker', 'yes no', 'random choice', 'pick random', 'wheel of fortune'],
    related: ['random-name-picker', 'random-team-generator', 'random-number-generator', 'random-password-generator'],
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    slug: 'stopwatch',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Accurate online stopwatch with split lap times, pause/resume, keyboard shortcuts, and export options. Free and runs smoothly in any web browser.',
    icon: 'StopCircle',
    keywords: ['stopwatch', 'lap timer', 'time tracking', 'chrono'],
    related: ['countdown-timer', 'pomodoro-timer', 'time-duration-calculator', 'random-name-picker'],
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    slug: 'countdown-timer',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Set a custom countdown timer with an audio alert when it reaches zero. Supports hours, minutes, and seconds.',
    icon: 'TimerOff',
    keywords: ['countdown timer', 'timer', 'count down', 'alarm timer'],
    related: ['stopwatch', 'pomodoro-timer', 'days-until-calculator', 'random-name-picker'],
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    slug: 'pomodoro-timer',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Boost your focus with the Pomodoro technique. Customizable work and break intervals with session tracking.',
    icon: 'Clock',
    keywords: ['pomodoro', 'pomodoro timer', 'focus timer', 'productivity', 'work break'],
    related: ['countdown-timer', 'stopwatch', 'typing-speed-test', 'random-name-picker'],
  },
  {
    id: 'meeting-time-calculator',
    name: 'Meeting Time Calculator',
    slug: 'meeting-time-calculator',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Find the best meeting time across multiple time zones. Enter participants and their locations to calculate overlap.',
    icon: 'CalendarClock',
    keywords: ['meeting time', 'time zone', 'world clock', 'schedule meeting'],
    related: ['working-days-calculator', 'time-converter', 'countdown-timer', 'random-name-picker'],
  },
  {
    id: 'checklist-generator',
    name: 'Checklist Generator',
    slug: 'checklist-generator',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Create interactive checklists, to-do lists, and task trackers. Save progress to local storage and export as PDF or text.',
    icon: 'CheckSquare',
    keywords: ['checklist', 'to-do list', 'task list', 'checklist generator', 'todo'],
    related: ['random-team-generator', 'decision-maker', 'reading-time-calculator', 'random-name-picker'],
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    slug: 'text-to-speech',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Convert written text to audio using the browser\'s Web Speech API. Choose from available voices, speed, and pitch.',
    icon: 'Volume2',
    keywords: ['text to speech', 'tts', 'read aloud', 'voice', 'speech synthesis'],
    related: ['speech-to-text', 'reading-time-calculator', 'word-character-counter', 'random-name-picker'],
  },
  {
    id: 'speech-to-text',
    name: 'Speech to Text',
    slug: 'speech-to-text',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Transcribe your voice to text in real time using the browser\'s Web Speech Recognition API. No sign-up required.',
    icon: 'Mic',
    keywords: ['speech to text', 'voice to text', 'transcribe', 'voice recognition', 'stt'],
    related: ['text-to-speech', 'word-character-counter', 'typing-speed-test', 'random-name-picker'],
  },
  {
    id: 'typing-speed-test',
    name: 'Typing Speed Test',
    slug: 'typing-speed-test',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Measure your typing speed in WPM (words per minute) and accuracy with timed typing tests and performance history.',
    icon: 'Keyboard',
    keywords: ['typing speed', 'wpm', 'typing test', 'words per minute', 'accuracy'],
    related: ['speech-to-text', 'text-to-speech', 'word-character-counter', 'random-name-picker'],
  },
  {
    id: 'password-strength-checker',
    name: 'Password Strength Checker',
    slug: 'password-strength-checker',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Evaluate password strength instantly with entropy analysis, common pattern detection, and improvement suggestions.',
    icon: 'ShieldAlert',
    keywords: ['password strength', 'password checker', 'secure password', 'entropy', 'password policy'],
    related: ['password-generator', 'random-password-generator', 'hash-generator', 'random-name-picker'],
  },
  {
    id: 'reading-time-calculator',
    name: 'Reading Time Calculator',
    slug: 'reading-time-calculator',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Estimate the reading time for any article or document based on word count and average reading speed.',
    icon: 'BookOpen',
    keywords: ['reading time', 'read time estimator', 'words per minute', 'article length'],
    related: ['word-character-counter', 'text-to-speech', 'lorem-ipsum-generator', 'random-name-picker'],
  },
  {
    id: 'internet-speed-unit-converter',
    name: 'Internet Speed Unit Converter',
    slug: 'internet-speed-unit-converter',
    category: 'Random & Productivity Tools',
    categorySlug: 'productivity',
    description:
      'Convert between internet speed units: Kbps, Mbps, Gbps, KB/s, MB/s, and GB/s. Calculate download time for any file size.',
    icon: 'Wifi',
    keywords: ['internet speed', 'mbps converter', 'bandwidth', 'download speed', 'kbps gbps'],
    related: ['data-storage-converter', 'speed-converter', 'time-converter', 'random-name-picker'],
  },
];

export const CATEGORIES = [
  { name: 'Date & Age Calculators', slug: 'date-age', icon: 'Calendar', count: 10 },
  { name: 'Mathematics Calculators', slug: 'mathematics', icon: 'Calculator', count: 15 },
  { name: 'Text & Formatting Tools', slug: 'text-formatting', icon: 'FileText', count: 16 },
  { name: 'Developer Tools', slug: 'developer', icon: 'Code2', count: 20 },
  { name: 'Unit & Conversion Tools', slug: 'unit-conversion', icon: 'ArrowLeftRight', count: 10 },
  { name: 'Finance & Business Calculators', slug: 'finance', icon: 'DollarSign', count: 10 },
  { name: 'Image & File Tools', slug: 'image-file', icon: 'Image', count: 15 },
  { name: 'Random & Productivity Tools', slug: 'productivity', icon: 'Shuffle', count: 15 },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return TOOLS.filter(t => t.categorySlug === categorySlug);
}

export function getPopularTools(): Tool[] {
  return TOOLS.filter(t => t.popular);
}

export function getRelatedTools(slug: string): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  const primary = (tool.related || [])
    .map(s => getToolBySlug(s))
    .filter(Boolean) as Tool[];

  if (primary.length >= 4) {
    return primary.slice(0, 4);
  }

  // Fallback: fill up to 4 tools from the same category
  const siblings = getToolsByCategory(tool.categorySlug).filter(
    t => t.slug !== tool.slug && !primary.some(p => p.slug === t.slug)
  );

  return [...primary, ...siblings].slice(0, 4);
}
