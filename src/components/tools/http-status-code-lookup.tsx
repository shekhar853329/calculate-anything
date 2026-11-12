import React, { useState, useMemo } from 'react';

type StatusCode = {
  code: number;
  name: string;
  description: string;
  rfc: string;
};

const STATUS_CODES: StatusCode[] = [
  // 1xx
  { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.', rfc: 'RFC 7231' },
  { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.', rfc: 'RFC 7231' },
  { code: 102, name: 'Processing', description: 'A WebDAV request may contain many sub-requests involving file operations.', rfc: 'RFC 2518' },
  { code: 103, name: 'Early Hints', description: 'Used to return some response headers before final HTTP message.', rfc: 'RFC 8297' },
  // 2xx
  { code: 200, name: 'OK', description: 'The request has succeeded.', rfc: 'RFC 7231' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled, resulting in the creation of a new resource.', rfc: 'RFC 7231' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but processing has not been completed.', rfc: 'RFC 7231' },
  { code: 204, name: 'No Content', description: 'The server has successfully fulfilled the request and there is no additional content to send.', rfc: 'RFC 7231' },
  { code: 206, name: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header sent by the client.', rfc: 'RFC 7233' },
  // 3xx
  { code: 301, name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI.', rfc: 'RFC 7231' },
  { code: 302, name: 'Found', description: 'The resource resides temporarily under a different URI.', rfc: 'RFC 7231' },
  { code: 304, name: 'Not Modified', description: 'Indicates that the resource has not been modified since last requested.', rfc: 'RFC 7232' },
  { code: 307, name: 'Temporary Redirect', description: 'The request should be repeated with another URI but future requests should still use the original URI.', rfc: 'RFC 7231' },
  { code: 308, name: 'Permanent Redirect', description: 'The request and all future requests should be repeated using another URI.', rfc: 'RFC 7538' },
  // 4xx
  { code: 400, name: 'Bad Request', description: 'The server cannot process the request due to a client error (malformed syntax, invalid request message framing, etc.).', rfc: 'RFC 7231' },
  { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided.', rfc: 'RFC 7235' },
  { code: 403, name: 'Forbidden', description: 'The server understood the request but refuses to authorize it.', rfc: 'RFC 7231' },
  { code: 404, name: 'Not Found', description: 'The requested resource could not be found on the server.', rfc: 'RFC 7231' },
  { code: 405, name: 'Method Not Allowed', description: 'A request method is not supported for the requested resource.', rfc: 'RFC 7231' },
  { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request.', rfc: 'RFC 7231' },
  { code: 409, name: 'Conflict', description: 'Indicates that the request could not be processed because of conflict in the current state.', rfc: 'RFC 7231' },
  { code: 410, name: 'Gone', description: 'The resource requested is no longer available and will not be available again.', rfc: 'RFC 7231' },
  { code: 413, name: 'Content Too Large', description: 'The request is larger than the server is willing or able to process.', rfc: 'RFC 7231' },
  { code: 414, name: 'URI Too Long', description: 'The URI provided was too long for the server to process.', rfc: 'RFC 7231' },
  { code: 415, name: 'Unsupported Media Type', description: 'The request entity has a media type the server does not support.', rfc: 'RFC 7231' },
  { code: 422, name: 'Unprocessable Content', description: 'The request was well-formed but was unable to be followed due to semantic errors.', rfc: 'RFC 4918' },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time (rate limiting).', rfc: 'RFC 6585' },
  // 5xx
  { code: 500, name: 'Internal Server Error', description: 'An unexpected condition was encountered by the server.', rfc: 'RFC 7231' },
  { code: 501, name: 'Not Implemented', description: 'The server does not support the functionality required to fulfill the request.', rfc: 'RFC 7231' },
  { code: 502, name: 'Bad Gateway', description: 'The server, while acting as a gateway, received an invalid response from an upstream server.', rfc: 'RFC 7231' },
  { code: 503, name: 'Service Unavailable', description: 'The server is currently unavailable (overloaded or down for maintenance).', rfc: 'RFC 7231' },
  { code: 504, name: 'Gateway Timeout', description: 'The server, while acting as a gateway, did not receive a timely response from an upstream server.', rfc: 'RFC 7231' },
  { code: 505, name: 'HTTP Version Not Supported', description: 'The server does not support the HTTP version used in the request.', rfc: 'RFC 7231' },
];

function getCategory(code: number) {
  if (code < 200) return { label: '1xx Informational', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' };
  if (code < 300) return { label: '2xx Success', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' };
  if (code < 400) return { label: '3xx Redirection', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' };
  if (code < 500) return { label: '4xx Client Error', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' };
  return { label: '5xx Server Error', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' };
}

export default function HttpStatusCodeLookup() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return STATUS_CODES;
    return STATUS_CODES.filter(s =>
      s.code.toString().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const groups: Record<string, StatusCode[]> = {};
    for (const code of filtered) {
      const cat = getCategory(code.code).label;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(code);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by code, name, or description..."
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="space-y-5">
        {Object.entries(grouped).map(([cat, codes]) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{cat}</h3>
            <div className="space-y-2">
              {codes.map(sc => {
                const cat = getCategory(sc.code);
                return (
                  <div key={sc.code} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full shrink-0 ${cat.color}`}>{sc.code}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{sc.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{sc.description}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sc.rfc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No status codes found.</p>
        )}
      </div>
    </div>
  );
}
