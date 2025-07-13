const fs = require('fs');
const path = require('path');

// Load the raw logs
const raw = fs.readFileSync(path.join(__dirname, 'incomingLog.json'), 'utf-8');
const entries = JSON.parse(raw);

// Map to hold question + timestamp, keyed by spanId
const spanMap = {};

// First pass: find all questions
entries.forEach(entry => {
  const { textPayload, spanId, timestamp } = entry;
  const prefix = 'ask Starting Process with ';
  if (textPayload.startsWith(prefix)) {
    spanMap[spanId] = {
      question: textPayload.slice(prefix.length).trim(),
      timestamp
    };
  }
});

// Second pass: find matching answers
entries.forEach(entry => {
  const { textPayload, spanId } = entry;
  const prefix = 'Final Answer ';
  if (textPayload.startsWith(prefix) && spanMap[spanId]) {
    spanMap[spanId].answer = textPayload.slice(prefix.length).trim();
  }
});

// Build the clean array, only include those with both question & answer
const cleanLogs = Object.values(spanMap).filter(item => item.answer);

// Save to cleanLogs.json
fs.writeFileSync(
  path.join(__dirname, 'cleanLogs.json'),
  JSON.stringify(cleanLogs, null, 2),
  'utf-8'
);

console.log(`Wrote ${cleanLogs.length} entries to cleanLogs.json`);