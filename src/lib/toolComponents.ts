/**
 * Tool component registry.
 *
 * Maps each tool slug to the relative path of its React component file.
 * Used by ToolRenderer to know which tools are registered (and their paths
 * for future lazy loading once the component files are created).
 *
 * To add a new tool:
 *   1. Add its slug → path entry here.
 *   2. Create the component at the specified path.
 *   3. Update ToolRenderer to import it lazily.
 */

/** Map from tool slug to the relative import path of its component. */
export const toolPaths: Record<string, string> = {
  // ── Date & Age Calculators ──────────────────────────────────────────────
  'age-calculator': '../components/tools/AgeCalculator',
  'age-difference-calculator': '../components/tools/AgeDifferenceCalculator',
  'date-difference-calculator': '../components/tools/DateDifferenceCalculator',
  'date-add-subtract': '../components/tools/DateAddSubtract',
  'days-until-calculator': '../components/tools/DaysUntilCalculator',
  'birthday-calculator': '../components/tools/BirthdayCalculator',
  'leap-year-checker': '../components/tools/LeapYearChecker',
  'working-days-calculator': '../components/tools/WorkingDaysCalculator',
  'time-duration-calculator': '../components/tools/TimeDurationCalculator',
  'unix-timestamp-converter': '../components/tools/UnixTimestampConverter',

  // ── Mathematics Calculators ─────────────────────────────────────────────
  'scientific-calculator': '../components/tools/ScientificCalculator',
  'percentage-calculator': '../components/tools/PercentageCalculator',
  'fraction-calculator': '../components/tools/FractionCalculator',
  'ratio-calculator': '../components/tools/RatioCalculator',
  'average-calculator': '../components/tools/AverageCalculator',
  'square-root-calculator': '../components/tools/SquareRootCalculator',
  'power-calculator': '../components/tools/PowerCalculator',
  'prime-number-checker': '../components/tools/PrimeNumberChecker',
  'lcm-hcf-calculator': '../components/tools/LcmHcfCalculator',
  'factorial-calculator': '../components/tools/FactorialCalculator',
  'random-number-generator': '../components/tools/RandomNumberGenerator',
  'bmi-calculator': '../components/tools/BmiCalculator',
  'gpa-calculator': '../components/tools/GpaCalculator',
  'standard-deviation-calculator': '../components/tools/StandardDeviationCalculator',
  'profit-loss-calculator': '../components/tools/ProfitLossCalculator',

  // ── Text & Formatting Tools ─────────────────────────────────────────────
  'json-formatter': '../components/tools/JsonFormatter',
  'text-case-converter': '../components/tools/TextCaseConverter',
  'word-character-counter': '../components/tools/WordCharacterCounter',
  'text-difference-checker': '../components/tools/TextDifferenceChecker',
  'text-formatter': '../components/tools/TextFormatter',
  'markdown-previewer': '../components/tools/MarkdownPreviewer',
  'html-formatter': '../components/tools/HtmlFormatter',
  'css-formatter': '../components/tools/CssFormatter',
  'javascript-formatter': '../components/tools/JavascriptFormatter',
  'xml-formatter': '../components/tools/XmlFormatter',
  'sql-formatter': '../components/tools/SqlFormatter',
  'url-encoder-decoder': '../components/tools/UrlEncoderDecoder',
  'base64-encoder-decoder': '../components/tools/Base64EncoderDecoder',
  'html-entity-encoder-decoder': '../components/tools/HtmlEntityEncoderDecoder',
  'lorem-ipsum-generator': '../components/tools/LoremIpsumGenerator',
  'rich-text-editor': '../components/tools/rich-text-editor',

  // ── Developer Tools ─────────────────────────────────────────────────────
  'code-compiler': '../components/tools/code-compiler',
  'jwt-decoder': '../components/tools/JwtDecoder',
  'regex-tester': '../components/tools/RegexTester',
  'uuid-generator': '../components/tools/UuidGenerator',
  'cron-expression-generator': '../components/tools/CronExpressionGenerator',
  'hash-generator': '../components/tools/HashGenerator',
  'color-code-converter': '../components/tools/ColorCodeConverter',
  'css-gradient-generator': '../components/tools/CssGradientGenerator',
  'qr-code-generator': '../components/tools/QrCodeGenerator',
  'password-generator': '../components/tools/PasswordGenerator',
  'sql-query-formatter': '../components/tools/SqlQueryFormatter',
  'http-status-code-lookup': '../components/tools/HttpStatusCodeLookup',
  'mime-type-lookup': '../components/tools/MimeTypeLookup',
  'ip-address-info': '../components/tools/IpAddressInfo',
  'user-agent-parser': '../components/tools/UserAgentParser',
  'html-to-markdown-converter': '../components/tools/HtmlToMarkdownConverter',
  'json-to-csv-converter': '../components/tools/JsonToCsvConverter',
  'csv-to-json-converter': '../components/tools/CsvToJsonConverter',
  'json-schema-validator': '../components/tools/JsonSchemaValidator',
  'svg-optimizer': '../components/tools/SvgOptimizer',
  'api-request-builder': '../components/tools/ApiRequestBuilder',

  // ── Unit & Conversion Tools ─────────────────────────────────────────────
  'length-converter': '../components/tools/LengthConverter',
  'weight-converter': '../components/tools/WeightConverter',
  'temperature-converter': '../components/tools/TemperatureConverter',
  'data-storage-converter': '../components/tools/DataStorageConverter',
  'speed-converter': '../components/tools/SpeedConverter',
  'time-converter': '../components/tools/TimeConverter',
  'area-converter': '../components/tools/AreaConverter',
  'volume-converter': '../components/tools/VolumeConverter',
  'number-to-words-converter': '../components/tools/NumberToWordsConverter',
  'roman-numeral-converter': '../components/tools/RomanNumeralConverter',

  // ── Finance & Business Calculators ─────────────────────────────────────
  'emi-calculator': '../components/tools/EmiCalculator',
  'gst-calculator': '../components/tools/GstCalculator',
  'sip-calculator': '../components/tools/SipCalculator',
  'fd-calculator': '../components/tools/FdCalculator',
  'rd-calculator': '../components/tools/RdCalculator',
  'simple-interest-calculator': '../components/tools/SimpleInterestCalculator',
  'compound-interest-calculator': '../components/tools/CompoundInterestCalculator',
  'discount-calculator': '../components/tools/DiscountCalculator',
  'salary-calculator': '../components/tools/SalaryCalculator',
  'income-tax-calculator': '../components/tools/IncomeTaxCalculator',

  // ── Image & File Tools ──────────────────────────────────────────────────
  'image-compressor': '../components/tools/ImageCompressor',
  'image-resizer': '../components/tools/ImageResizer',
  'image-to-pdf-converter': '../components/tools/ImageToPdfConverter',
  'pdf-merger': '../components/tools/PdfMerger',
  'pdf-splitter': '../components/tools/PdfSplitter',
  'background-remover': '../components/tools/BackgroundRemover',
  'png-to-jpg-converter': '../components/tools/PngToJpgConverter',
  'jpg-to-png-converter': '../components/tools/JpgToPngConverter',
  'webp-converter': '../components/tools/WebpConverter',
  'image-cropper': '../components/tools/ImageCropper',
  'favicon-generator': '../components/tools/FaviconGenerator',
  'qr-code-scanner': '../components/tools/QrCodeScanner',
  'pdf-page-counter': '../components/tools/PdfPageCounter',
  'pdf-to-image-converter': '../components/tools/PdfToImageConverter',
  'image-metadata-viewer': '../components/tools/ImageMetadataViewer',

  // ── Random & Productivity Tools ─────────────────────────────────────────
  'random-name-picker': '../components/tools/RandomNamePicker',
  'random-password-generator': '../components/tools/RandomPasswordGenerator',
  'random-team-generator': '../components/tools/RandomTeamGenerator',
  'decision-maker': '../components/tools/DecisionMaker',
  'stopwatch': '../components/tools/Stopwatch',
  'countdown-timer': '../components/tools/CountdownTimer',
  'pomodoro-timer': '../components/tools/PomodoroTimer',
  'meeting-time-calculator': '../components/tools/MeetingTimeCalculator',
  'checklist-generator': '../components/tools/ChecklistGenerator',
  'text-to-speech': '../components/tools/TextToSpeech',
  'speech-to-text': '../components/tools/SpeechToText',
  'typing-speed-test': '../components/tools/TypingSpeedTest',
  'password-strength-checker': '../components/tools/PasswordStrengthChecker',
  'reading-time-calculator': '../components/tools/ReadingTimeCalculator',
  'internet-speed-unit-converter': '../components/tools/InternetSpeedUnitConverter',
};

/** Returns true if a component is registered for the given slug. */
export function hasToolComponent(slug: string): boolean {
  return slug in toolPaths;
}
