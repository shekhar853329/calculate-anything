import React, { lazy, Suspense } from 'react';
import { hasToolComponent } from '../../lib/toolComponents';

interface ToolRendererProps {
  slug: string;
}

// ── Date & Age ──────────────────────────────────────────────────────────────
const AgeCalculator = lazy(() => import('../tools/age-calculator'));
const AgeDifferenceCalculator = lazy(() => import('../tools/age-difference-calculator'));
const DateDifferenceCalculator = lazy(() => import('../tools/date-difference-calculator'));
const DateAddSubtract = lazy(() => import('../tools/date-add-subtract'));
const DaysUntilCalculator = lazy(() => import('../tools/days-until-calculator'));
const BirthdayCalculator = lazy(() => import('../tools/birthday-calculator'));
const LeapYearChecker = lazy(() => import('../tools/leap-year-checker'));
const WorkingDaysCalculator = lazy(() => import('../tools/working-days-calculator'));
const TimeDurationCalculator = lazy(() => import('../tools/time-duration-calculator'));
const UnixTimestampConverter = lazy(() => import('../tools/unix-timestamp-converter'));

// ── Mathematics ─────────────────────────────────────────────────────────────
const ScientificCalculator = lazy(() => import('../tools/scientific-calculator'));
const PercentageCalculator = lazy(() => import('../tools/percentage-calculator'));
const FractionCalculator = lazy(() => import('../tools/fraction-calculator'));
const RatioCalculator = lazy(() => import('../tools/ratio-calculator'));
const AverageCalculator = lazy(() => import('../tools/average-calculator'));
const SquareRootCalculator = lazy(() => import('../tools/square-root-calculator'));
const PowerCalculator = lazy(() => import('../tools/power-calculator'));
const PrimeNumberChecker = lazy(() => import('../tools/prime-number-checker'));
const LcmHcfCalculator = lazy(() => import('../tools/lcm-hcf-calculator'));
const FactorialCalculator = lazy(() => import('../tools/factorial-calculator'));
const RandomNumberGenerator = lazy(() => import('../tools/random-number-generator'));
const BmiCalculator = lazy(() => import('../tools/bmi-calculator'));
const GpaCalculator = lazy(() => import('../tools/gpa-calculator'));
const StandardDeviationCalculator = lazy(() => import('../tools/standard-deviation-calculator'));
const ProfitLossCalculator = lazy(() => import('../tools/profit-loss-calculator'));

// ── Text & Formatting ────────────────────────────────────────────────────────
const JsonFormatter = lazy(() => import('../tools/json-formatter'));
const TextCaseConverter = lazy(() => import('../tools/text-case-converter'));
const WordCharacterCounter = lazy(() => import('../tools/word-character-counter'));
const TextDifferenceChecker = lazy(() => import('../tools/text-difference-checker'));
const TextFormatter = lazy(() => import('../tools/text-formatter'));
const MarkdownPreviewer = lazy(() => import('../tools/markdown-previewer'));
const HtmlFormatter = lazy(() => import('../tools/html-formatter'));
const CssFormatter = lazy(() => import('../tools/css-formatter'));
const JavascriptFormatter = lazy(() => import('../tools/javascript-formatter'));
const XmlFormatter = lazy(() => import('../tools/xml-formatter'));
const SqlFormatter = lazy(() => import('../tools/sql-formatter'));
const UrlEncoderDecoder = lazy(() => import('../tools/url-encoder-decoder'));
const Base64EncoderDecoder = lazy(() => import('../tools/base64-encoder-decoder'));
const HtmlEntityEncoderDecoder = lazy(() => import('../tools/html-entity-encoder-decoder'));
const LoremIpsumGenerator = lazy(() => import('../tools/lorem-ipsum-generator'));
const RichTextEditor = lazy(() => import('../tools/rich-text-editor'));

// ── Developer Tools ──────────────────────────────────────────────────────────
const CodeCompiler = lazy(() => import('../tools/code-compiler'));
const JwtDecoder = lazy(() => import('../tools/jwt-decoder'));
const RegexTester = lazy(() => import('../tools/regex-tester'));
const UuidGenerator = lazy(() => import('../tools/uuid-generator'));
const CronExpressionGenerator = lazy(() => import('../tools/cron-expression-generator'));
const HashGenerator = lazy(() => import('../tools/hash-generator'));
const ColorCodeConverter = lazy(() => import('../tools/color-code-converter'));
const CssGradientGenerator = lazy(() => import('../tools/css-gradient-generator'));
const QrCodeGenerator = lazy(() => import('../tools/qr-code-generator'));
const PasswordGenerator = lazy(() => import('../tools/password-generator'));
const SqlQueryFormatter = lazy(() => import('../tools/sql-query-formatter'));
const HttpStatusCodeLookup = lazy(() => import('../tools/http-status-code-lookup'));
const MimeTypeLookup = lazy(() => import('../tools/mime-type-lookup'));
const IpAddressInfo = lazy(() => import('../tools/ip-address-info'));
const UserAgentParser = lazy(() => import('../tools/user-agent-parser'));
const HtmlToMarkdownConverter = lazy(() => import('../tools/html-to-markdown-converter'));
const JsonToCsvConverter = lazy(() => import('../tools/json-to-csv-converter'));
const CsvToJsonConverter = lazy(() => import('../tools/csv-to-json-converter'));
const JsonSchemaValidator = lazy(() => import('../tools/json-schema-validator'));
const SvgOptimizer = lazy(() => import('../tools/svg-optimizer'));
const ApiRequestBuilder = lazy(() => import('../tools/api-request-builder'));

// ── Unit & Conversion ────────────────────────────────────────────────────────
const LengthConverter = lazy(() => import('../tools/length-converter'));
const WeightConverter = lazy(() => import('../tools/weight-converter'));
const TemperatureConverter = lazy(() => import('../tools/temperature-converter'));
const DataStorageConverter = lazy(() => import('../tools/data-storage-converter'));
const SpeedConverter = lazy(() => import('../tools/speed-converter'));
const TimeConverter = lazy(() => import('../tools/time-converter'));
const AreaConverter = lazy(() => import('../tools/area-converter'));
const VolumeConverter = lazy(() => import('../tools/volume-converter'));
const NumberToWordsConverter = lazy(() => import('../tools/number-to-words-converter'));
const RomanNumeralConverter = lazy(() => import('../tools/roman-numeral-converter'));

// ── Finance & Business ───────────────────────────────────────────────────────
const EmiCalculator = lazy(() => import('../tools/emi-calculator'));
const GstCalculator = lazy(() => import('../tools/gst-calculator'));
const SipCalculator = lazy(() => import('../tools/sip-calculator'));
const FdCalculator = lazy(() => import('../tools/fd-calculator'));
const RdCalculator = lazy(() => import('../tools/rd-calculator'));
const SimpleInterestCalculator = lazy(() => import('../tools/simple-interest-calculator'));
const CompoundInterestCalculator = lazy(() => import('../tools/compound-interest-calculator'));
const DiscountCalculator = lazy(() => import('../tools/discount-calculator'));
const SalaryCalculator = lazy(() => import('../tools/salary-calculator'));
const IncomeTaxCalculator = lazy(() => import('../tools/income-tax-calculator'));

// ── Image & File ─────────────────────────────────────────────────────────────
const ImageCompressor = lazy(() => import('../tools/image-compressor'));
const ImageResizer = lazy(() => import('../tools/image-resizer'));
const ImageToPdfConverter = lazy(() => import('../tools/image-to-pdf-converter'));
const PdfMerger = lazy(() => import('../tools/pdf-merger'));
const PdfSplitter = lazy(() => import('../tools/pdf-splitter'));
const BackgroundRemover = lazy(() => import('../tools/background-remover'));
const PngToJpgConverter = lazy(() => import('../tools/png-to-jpg-converter'));
const JpgToPngConverter = lazy(() => import('../tools/jpg-to-png-converter'));
const WebpConverter = lazy(() => import('../tools/webp-converter'));
const ImageCropper = lazy(() => import('../tools/image-cropper'));
const FaviconGenerator = lazy(() => import('../tools/favicon-generator'));
const QrCodeScanner = lazy(() => import('../tools/qr-code-scanner'));
const PdfPageCounter = lazy(() => import('../tools/pdf-page-counter'));
const PdfToImageConverter = lazy(() => import('../tools/pdf-to-image-converter'));
const ImageMetadataViewer = lazy(() => import('../tools/image-metadata-viewer'));

// ── Random & Productivity ────────────────────────────────────────────────────
const RandomNamePicker = lazy(() => import('../tools/random-name-picker'));
const RandomPasswordGenerator = lazy(() => import('../tools/random-password-generator'));
const RandomTeamGenerator = lazy(() => import('../tools/random-team-generator'));
const DecisionMaker = lazy(() => import('../tools/decision-maker'));
const Stopwatch = lazy(() => import('../tools/stopwatch'));
const CountdownTimer = lazy(() => import('../tools/countdown-timer'));
const PomodoroTimer = lazy(() => import('../tools/pomodoro-timer'));
const MeetingTimeCalculator = lazy(() => import('../tools/meeting-time-calculator'));
const ChecklistGenerator = lazy(() => import('../tools/checklist-generator'));
const TextToSpeech = lazy(() => import('../tools/text-to-speech'));
const SpeechToText = lazy(() => import('../tools/speech-to-text'));
const TypingSpeedTest = lazy(() => import('../tools/typing-speed-test'));
const PasswordStrengthChecker = lazy(() => import('../tools/password-strength-checker'));
const ReadingTimeCalculator = lazy(() => import('../tools/reading-time-calculator'));
const InternetSpeedUnitConverter = lazy(() => import('../tools/internet-speed-unit-converter'));

/** All 110 tools mapped by slug to their lazy-loaded components. */
const TOOL_MAP: Record<string, React.ComponentType> = {
  // Date & Age
  'age-calculator': AgeCalculator,
  'age-difference-calculator': AgeDifferenceCalculator,
  'date-difference-calculator': DateDifferenceCalculator,
  'date-add-subtract': DateAddSubtract,
  'days-until-calculator': DaysUntilCalculator,
  'birthday-calculator': BirthdayCalculator,
  'leap-year-checker': LeapYearChecker,
  'working-days-calculator': WorkingDaysCalculator,
  'time-duration-calculator': TimeDurationCalculator,
  'unix-timestamp-converter': UnixTimestampConverter,
  // Mathematics
  'scientific-calculator': ScientificCalculator,
  'percentage-calculator': PercentageCalculator,
  'fraction-calculator': FractionCalculator,
  'ratio-calculator': RatioCalculator,
  'average-calculator': AverageCalculator,
  'square-root-calculator': SquareRootCalculator,
  'power-calculator': PowerCalculator,
  'prime-number-checker': PrimeNumberChecker,
  'lcm-hcf-calculator': LcmHcfCalculator,
  'factorial-calculator': FactorialCalculator,
  'random-number-generator': RandomNumberGenerator,
  'bmi-calculator': BmiCalculator,
  'gpa-calculator': GpaCalculator,
  'standard-deviation-calculator': StandardDeviationCalculator,
  'profit-loss-calculator': ProfitLossCalculator,
  // Text & Formatting
  'json-formatter': JsonFormatter,
  'text-case-converter': TextCaseConverter,
  'word-character-counter': WordCharacterCounter,
  'text-difference-checker': TextDifferenceChecker,
  'text-formatter': TextFormatter,
  'markdown-previewer': MarkdownPreviewer,
  'html-formatter': HtmlFormatter,
  'css-formatter': CssFormatter,
  'javascript-formatter': JavascriptFormatter,
  'xml-formatter': XmlFormatter,
  'sql-formatter': SqlFormatter,
  'url-encoder-decoder': UrlEncoderDecoder,
  'base64-encoder-decoder': Base64EncoderDecoder,
  'html-entity-encoder-decoder': HtmlEntityEncoderDecoder,
  'lorem-ipsum-generator': LoremIpsumGenerator,
  'rich-text-editor': RichTextEditor,
  // Developer Tools
  'code-compiler': CodeCompiler,
  'jwt-decoder': JwtDecoder,
  'regex-tester': RegexTester,
  'uuid-generator': UuidGenerator,
  'cron-expression-generator': CronExpressionGenerator,
  'hash-generator': HashGenerator,
  'color-code-converter': ColorCodeConverter,
  'css-gradient-generator': CssGradientGenerator,
  'qr-code-generator': QrCodeGenerator,
  'password-generator': PasswordGenerator,
  'sql-query-formatter': SqlQueryFormatter,
  'http-status-code-lookup': HttpStatusCodeLookup,
  'mime-type-lookup': MimeTypeLookup,
  'ip-address-info': IpAddressInfo,
  'user-agent-parser': UserAgentParser,
  'html-to-markdown-converter': HtmlToMarkdownConverter,
  'json-to-csv-converter': JsonToCsvConverter,
  'csv-to-json-converter': CsvToJsonConverter,
  'json-schema-validator': JsonSchemaValidator,
  'svg-optimizer': SvgOptimizer,
  'api-request-builder': ApiRequestBuilder,
  // Unit & Conversion
  'length-converter': LengthConverter,
  'weight-converter': WeightConverter,
  'temperature-converter': TemperatureConverter,
  'data-storage-converter': DataStorageConverter,
  'speed-converter': SpeedConverter,
  'time-converter': TimeConverter,
  'area-converter': AreaConverter,
  'volume-converter': VolumeConverter,
  'number-to-words-converter': NumberToWordsConverter,
  'roman-numeral-converter': RomanNumeralConverter,
  // Finance & Business
  'emi-calculator': EmiCalculator,
  'gst-calculator': GstCalculator,
  'sip-calculator': SipCalculator,
  'fd-calculator': FdCalculator,
  'rd-calculator': RdCalculator,
  'simple-interest-calculator': SimpleInterestCalculator,
  'compound-interest-calculator': CompoundInterestCalculator,
  'discount-calculator': DiscountCalculator,
  'salary-calculator': SalaryCalculator,
  'income-tax-calculator': IncomeTaxCalculator,
  // Image & File
  'image-compressor': ImageCompressor,
  'image-resizer': ImageResizer,
  'image-to-pdf-converter': ImageToPdfConverter,
  'pdf-merger': PdfMerger,
  'pdf-splitter': PdfSplitter,
  'background-remover': BackgroundRemover,
  'png-to-jpg-converter': PngToJpgConverter,
  'jpg-to-png-converter': JpgToPngConverter,
  'webp-converter': WebpConverter,
  'image-cropper': ImageCropper,
  'favicon-generator': FaviconGenerator,
  'qr-code-scanner': QrCodeScanner,
  'pdf-page-counter': PdfPageCounter,
  'pdf-to-image-converter': PdfToImageConverter,
  'image-metadata-viewer': ImageMetadataViewer,
  // Random & Productivity
  'random-name-picker': RandomNamePicker,
  'random-password-generator': RandomPasswordGenerator,
  'random-team-generator': RandomTeamGenerator,
  'decision-maker': DecisionMaker,
  'stopwatch': Stopwatch,
  'countdown-timer': CountdownTimer,
  'pomodoro-timer': PomodoroTimer,
  'meeting-time-calculator': MeetingTimeCalculator,
  'checklist-generator': ChecklistGenerator,
  'text-to-speech': TextToSpeech,
  'speech-to-text': SpeechToText,
  'typing-speed-test': TypingSpeedTest,
  'password-strength-checker': PasswordStrengthChecker,
  'reading-time-calculator': ReadingTimeCalculator,
  'internet-speed-unit-converter': InternetSpeedUnitConverter,
};

function ToolLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  );
}

function ToolNotFound({ slug }: { slug: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-6 text-center">
      <p className="text-red-700 dark:text-red-300 font-medium">
        Tool <code className="font-mono text-sm">{slug}</code> was not found.
      </p>
    </div>
  );
}

/**
 * Renders the tool component for the given slug.
 * All 110 tools are lazy-loaded and wrapped in a Suspense boundary.
 */
export default function ToolRenderer({ slug }: ToolRendererProps) {
  if (!hasToolComponent(slug)) {
    return <ToolNotFound slug={slug} />;
  }

  const ToolComponent = TOOL_MAP[slug];
  if (!ToolComponent) {
    return <ToolNotFound slug={slug} />;
  }

  return (
    <Suspense fallback={<ToolLoading />}>
      <ToolComponent />
    </Suspense>
  );
}
