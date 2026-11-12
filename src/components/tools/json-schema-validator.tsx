import React, { useState, useCallback } from 'react';

// Minimal JSON Schema validator (draft-07 subset)
type Schema = any;

interface ValidationError {
  path: string;
  message: string;
}

function validate(data: any, schema: Schema, path: string = '$'): ValidationError[] {
  const errors: ValidationError[] = [];

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actualType = data === null ? 'null' : Array.isArray(data) ? 'array' : typeof data;
    if (!types.includes(actualType)) {
      errors.push({ path, message: `Expected type "${types.join(' | ')}" but got "${actualType}"` });
      return errors;
    }
  }

  if (schema.enum !== undefined) {
    if (!schema.enum.some((v: any) => JSON.stringify(v) === JSON.stringify(data))) {
      errors.push({ path, message: `Value must be one of: ${schema.enum.map(JSON.stringify).join(', ')}` });
    }
  }

  if (schema.const !== undefined) {
    if (JSON.stringify(data) !== JSON.stringify(schema.const)) {
      errors.push({ path, message: `Value must be exactly: ${JSON.stringify(schema.const)}` });
    }
  }

  if (typeof data === 'string') {
    if (schema.minLength !== undefined && data.length < schema.minLength) {
      errors.push({ path, message: `String length ${data.length} is less than minLength ${schema.minLength}` });
    }
    if (schema.maxLength !== undefined && data.length > schema.maxLength) {
      errors.push({ path, message: `String length ${data.length} exceeds maxLength ${schema.maxLength}` });
    }
    if (schema.pattern) {
      const re = new RegExp(schema.pattern);
      if (!re.test(data)) {
        errors.push({ path, message: `String does not match pattern "${schema.pattern}"` });
      }
    }
  }

  if (typeof data === 'number') {
    if (schema.minimum !== undefined && data < schema.minimum) {
      errors.push({ path, message: `${data} is less than minimum ${schema.minimum}` });
    }
    if (schema.maximum !== undefined && data > schema.maximum) {
      errors.push({ path, message: `${data} exceeds maximum ${schema.maximum}` });
    }
    if (schema.multipleOf !== undefined && data % schema.multipleOf !== 0) {
      errors.push({ path, message: `${data} is not a multiple of ${schema.multipleOf}` });
    }
  }

  if (Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems) {
      errors.push({ path, message: `Array has ${data.length} items, minimum is ${schema.minItems}` });
    }
    if (schema.maxItems !== undefined && data.length > schema.maxItems) {
      errors.push({ path, message: `Array has ${data.length} items, maximum is ${schema.maxItems}` });
    }
    if (schema.items) {
      data.forEach((item: any, i: number) => {
        errors.push(...validate(item, schema.items, `${path}[${i}]`));
      });
    }
    if (schema.uniqueItems && new Set(data.map(JSON.stringify)).size !== data.length) {
      errors.push({ path, message: 'Array items must be unique' });
    }
  }

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in data)) {
          errors.push({ path: `${path}.${key}`, message: `Required property "${key}" is missing` });
        }
      }
    }
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in data) {
          errors.push(...validate(data[key], propSchema as Schema, `${path}.${key}`));
        }
      }
    }
    if (schema.additionalProperties === false && schema.properties) {
      const extra = Object.keys(data).filter(k => !(k in schema.properties));
      if (extra.length > 0) {
        errors.push({ path, message: `Additional properties not allowed: ${extra.join(', ')}` });
      }
    }
    if (schema.minProperties !== undefined && Object.keys(data).length < schema.minProperties) {
      errors.push({ path, message: `Object has fewer than ${schema.minProperties} properties` });
    }
    if (schema.maxProperties !== undefined && Object.keys(data).length > schema.maxProperties) {
      errors.push({ path, message: `Object has more than ${schema.maxProperties} properties` });
    }
  }

  return errors;
}

const SAMPLE_DATA = `{
  "name": "Alice",
  "age": 30,
  "email": "alice@example.com"
}`;

const SAMPLE_SCHEMA = `{
  "type": "object",
  "required": ["name", "age"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "number", "minimum": 0, "maximum": 150 },
    "email": { "type": "string" }
  }
}`;

export default function JsonSchemaValidator() {
  const [dataInput, setDataInput] = useState(SAMPLE_DATA);
  const [schemaInput, setSchemaInput] = useState(SAMPLE_SCHEMA);
  const [errors, setErrors] = useState<ValidationError[] | null>(null);
  const [parseError, setParseError] = useState('');
  const [valid, setValid] = useState<boolean | null>(null);

  const validateData = useCallback(() => {
    setParseError('');
    setErrors(null);
    setValid(null);

    let data: any, schema: any;
    try { data = JSON.parse(dataInput); } catch (e: any) { setParseError(`Data JSON error: ${e.message}`); return; }
    try { schema = JSON.parse(schemaInput); } catch (e: any) { setParseError(`Schema JSON error: ${e.message}`); return; }

    const errs = validate(data, schema);
    setErrors(errs);
    setValid(errs.length === 0);
  }, [dataInput, schemaInput]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">JSON Data</label>
          <textarea
            value={dataInput}
            onChange={e => setDataInput(e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">JSON Schema</label>
          <textarea
            value={schemaInput}
            onChange={e => setSchemaInput(e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      </div>

      {parseError && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{parseError}</p>}

      <button onClick={validateData} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
        Validate
      </button>

      {valid !== null && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
          valid ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          <span className="text-lg">{valid ? '✓' : '✗'}</span>
          <span>{valid ? 'Validation passed — data matches the schema.' : `Validation failed — ${errors?.length} error${errors?.length !== 1 ? 's' : ''} found.`}</span>
        </div>
      )}

      {errors && errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((err, i) => (
            <div key={i} className="bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2.5">
              <code className="text-xs font-mono text-red-700 dark:text-red-400">{err.path}</code>
              <p className="text-sm text-red-800 dark:text-red-300 mt-0.5">{err.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
