export interface SanitizationResult {
  sanitizedText: string;
  scrubbedCount: number;
  identifiedCategories: string[];
}

export function sanitizeOperativeNote(rawText: string): SanitizationResult {
  let text = rawText;
  let scrubbedCount = 0;
  const categories = new Set<string>();

  // 1. Line-anchored explicit header stripping
  const headerRules = [
    { regex: /^[ \t]*(?:Patient\s*Name|Patient|Pt\.?\s*Name)\s*:[^\n\r]*/gmi, category: 'Patient Name' },
    { regex: /^[ \t]*(?:MRN|Medical\s*Record\s*#?|Record\s*#?|Acct\s*#?)\s*:[^\n\r]*/gmi, category: 'Medical Record Number' },
    { regex: /^[ \t]*(?:DOB|Date\s*of\s*Birth)\s*:[^\n\r]*/gmi, category: 'Date of Birth' },
    { regex: /^[ \t]*(?:Date\s*of\s*Surgery|Date\s*of\s*Procedure|DOS|Surgery\s*Date)\s*:[^\n\r]*/gmi, category: 'Surgery Date' },
    { regex: /^[ \t]*(?:Surgeon|Attending|Primary\s*Surgeon)\s*:[^\n\r]*/gmi, category: 'Surgeon Identity' },
    { regex: /^[ \t]*(?:Assistant|Co-Surgeon|Co\s*Surgeon|First\s*Assist)\s*:[^\n\r]*/gmi, category: 'Assistant Identity' },
    { regex: /^[ \t]*(?:Hospital|Facility|Location)\s*:[^\n\r]*/gmi, category: 'Facility' }
  ];

  for (const { regex, category } of headerRules) {
    text = text.replace(regex, (match) => {
      scrubbedCount++;
      categories.add(category);
      const colonIdx = match.indexOf(':');
      const headerTitle = colonIdx !== -1 ? match.substring(0, colonIdx) : match;
      return `${headerTitle}: [REDACTED ${category.toUpperCase()}]`;
    });
  }

  // 2. Scrub dates (e.g., 01/15/2026, October 15, 2026)
  const dateRegex = /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi;
  text = text.replace(dateRegex, () => {
    scrubbedCount++;
    categories.add('Date');
    return '[REDACTED DATE]';
  });

  // 3. Scrub phone numbers and social security numbers
  const phoneSsnRegex = /\b(?:\d{3}[-.\s]\d{3}[-.\s]\d{4}|\d{3}-\d{2}-\d{4})\b/g;
  text = text.replace(phoneSsnRegex, () => {
    scrubbedCount++;
    categories.add('Identifier');
    return '[REDACTED ID]';
  });

  // 4. Scrub physician honorific names (Dr. Smith, Dr. A. Alex Mohit) in body text
  const docNameRegex = /\bDr\.?\s+[A-Za-z\.\-]+(?:\s+[A-Za-z\.\-]+)?\b/g;
  text = text.replace(docNameRegex, () => {
    scrubbedCount++;
    categories.add('Surgeon Name');
    return '[REDACTED SURGEON]';
  });

  return {
    sanitizedText: text,
    scrubbedCount,
    identifiedCategories: Array.from(categories)
  };
}
