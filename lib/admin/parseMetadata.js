// lib/admin/parseMetadata.js
//
// Parses a pasted metadata block (like the Wakhan Corridor example)
// into individual fields. Tolerant of comma- or line-separated lists,
// and of minor spacing differences around labels.
//
// Expected labels (case-insensitive, colon required):
//   Primary keyword:
//   Secondary keywords:
//   Meta title:
//   Meta description:
//   URL slug:
//   AEO questions answered:   (followed by Q:/A: pairs)
//   GEO context line:

const LABELS = [
  'primary keyword',
  'secondary keywords',
  'meta title',
  'meta description',
  'url slug',
  'aeo questions answered',
  'geo context line',
];

function splitList(raw) {
  return raw
    .split(/[\n,]/)
    .map((s) => s.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
}

function parseQAPairs(raw) {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const pairs = [];
  let currentQuestion = null;

  for (const line of lines) {
    const qMatch = line.match(/^Q:\s*(.+)$/i);
    const aMatch = line.match(/^A:\s*(.+)$/i);

    if (qMatch) {
      currentQuestion = qMatch[1].trim();
    } else if (aMatch && currentQuestion) {
      pairs.push({ question: currentQuestion, answer: aMatch[1].trim() });
      currentQuestion = null;
    } else if (!qMatch && !aMatch && line.replace(/^[-*•]\s*/, '')) {
      // A bare line with no Q:/A: marker — treat as a question with no answer yet.
      pairs.push({ question: line.replace(/^[-*•]\s*/, '').trim(), answer: '' });
    }
  }

  return pairs;
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Parses a raw pasted metadata block into a structured object.
 * Any field not found in the input is returned as an empty
 * string/array so the caller can safely merge into form state.
 */
export function parseMetadataBlock(raw) {
  const result = {
    primaryKeyword: '',
    secondaryKeywords: [],
    metaTitle: '',
    metaDescription: '',
    slug: '',
    aeoQuestions: [],
    geoContextLine: '',
  };

  if (!raw || !raw.trim()) return result;

  // Build a regex that finds each label and captures everything up
  // to the next known label (or end of string).
  const labelPattern = LABELS.map((l) => l.replace(/\s+/g, '\\s+')).join('|');
  const sectionRegex = new RegExp(
    `\\*{0,2}(${labelPattern})\\*{0,2}\\s*:\\s*([\\s\\S]*?)(?=\\*{0,2}(?:${labelPattern})\\*{0,2}\\s*:|$)`,
    'gi'
  );

  let match;
  while ((match = sectionRegex.exec(raw)) !== null) {
    const label = match[1].toLowerCase().replace(/\s+/g, ' ').trim();
    const value = match[2].trim();

    switch (label) {
      case 'primary keyword':
        result.primaryKeyword = value.split('\n')[0].trim();
        break;
      case 'secondary keywords':
        result.secondaryKeywords = splitList(value);
        break;
      case 'meta title':
        result.metaTitle = value.split('\n')[0].trim();
        break;
      case 'meta description':
        result.metaDescription = value.split('\n')[0].trim();
        break;
      case 'url slug':
        result.slug = slugify(value.split('\n')[0].replace(/^\//, ''));
        break;
      case 'aeo questions answered':
        result.aeoQuestions = parseQAPairs(value);
        break;
      case 'geo context line':
        result.geoContextLine = value.split('\n')[0].trim();
        break;
      default:
        break;
    }
  }

  return result;
}

export { slugify };