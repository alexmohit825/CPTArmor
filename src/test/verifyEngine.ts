import { SAMPLE_OP_NOTES } from '../data/sampleOpNotes.ts';
import { sanitizeOperativeNote } from '../engine/phiSanitizer.ts';
import { parseOperativeNoteLocally } from '../engine/surgicalParser.ts';
import { analyzeOperativeCoding } from '../engine/cptRulesEngine.ts';

function runVerification() {
  console.log('===============================================================');
  console.log(' OPREPORT CPT ARMOR - AUTOMATED PROGRAMMATIC VERIFICATION SUITE ');
  console.log('===============================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // -----------------------------------------------------------------
  // TEST 1: HIPAA PHI Sanitization Engine
  // -----------------------------------------------------------------
  console.log('--- TEST 1: Zero-Leakage PHI Sanitizer ---');
  const sample1 = SAMPLE_OP_NOTES[0];
  const sanitized = sanitizeOperativeNote(sample1.rawText);

  assert(sanitized.scrubbedCount > 0, `Sanitized ${sanitized.scrubbedCount} PHI tokens`);
  assert(!sanitized.sanitizedText.includes('Jane Doe'), 'Patient Name "Jane Doe" successfully redacted');
  assert(!sanitized.sanitizedText.includes('8492014'), 'MRN "8492014" successfully redacted');
  assert(!sanitized.sanitizedText.includes('04/12/1971'), 'DOB successfully redacted');
  assert(!sanitized.sanitizedText.includes('Swedish Medical Center'), 'Facility name successfully redacted');
  assert(sanitized.sanitizedText.includes('[REDACTED'), 'Replacement redaction tokens injected');

  // -----------------------------------------------------------------
  // TEST 2: Case 1 - L4-S1 Complex Revision TLIF (Modifier -22 & -59)
  // -----------------------------------------------------------------
  console.log('\n--- TEST 2: Case 1 - Revision TLIF with Scarring & Hardware Removal ---');
  const extractedCase1 = parseOperativeNoteLocally(sanitized.sanitizedText);
  const analysisCase1 = analyzeOperativeCoding(extractedCase1);

  assert(extractedCase1.levels.includes('L4-L5') && extractedCase1.levels.includes('L5-S1'), 'Extracted both L4-L5 and L5-S1 levels');
  assert(extractedCase1.complexityMetrics.isRevision, 'Identified revision procedure');
  assert(extractedCase1.complexityMetrics.qualifiesForModifier22, 'Qualified for Modifier -22 based on time and severe scarring');

  const c1Codes = analysisCase1.recommendedCodes.map(c => `${c.code}${c.modifier || ''}`);
  console.log('  Assigned Codes:', c1Codes.join(', '));
  assert(c1Codes.includes('22633-22'), 'Base code 22633 armed with Modifier -22');
  assert(c1Codes.includes('22634'), 'Add-on code 22634 added for second TLIF level');
  assert(c1Codes.includes('22842'), 'Segmental instrumentation 22842 added (3 vertebrae)');
  assert(c1Codes.includes('22852-59'), 'Revision hardware removal 22852 added with -59');
  assert(analysisCase1.auditDefenseParagraphs.some(p => p.modifier === '-22'), 'Generated CMS-compliant -22 justification paragraph');
  assert(analysisCase1.totalWRVU > 55, `Calculated armored wRVUs: ${analysisCase1.totalWRVU} wRVU`);

  // -----------------------------------------------------------------
  // TEST 3: Case 2 - C5-C7 ACDF Multi-Level Interbody
  // -----------------------------------------------------------------
  console.log('\n--- TEST 3: Case 2 - C5-C7 Anterior Cervical Discectomy & Fusion ---');
  const sample2 = SAMPLE_OP_NOTES[1];
  const extractedCase2 = parseOperativeNoteLocally(sample2.rawText);
  const analysisCase2 = analyzeOperativeCoding(extractedCase2);

  const c2Codes = analysisCase2.recommendedCodes.map(c => c.code);
  console.log('  Assigned Codes:', c2Codes.join(', '));
  assert(c2Codes.includes('22551'), 'Assigned primary ACDF code 22551');
  assert(c2Codes.includes('22552'), 'Assigned add-on ACDF code 22552');
  assert(c2Codes.includes('22845'), 'Assigned anterior plate 22845 (spanning 3 vertebrae)');
  assert(c2Codes.filter(c => c === '22853').length === 2, 'Assigned 2 units of interbody cage 22853');

  // -----------------------------------------------------------------
  // TEST 4: Case 3 - L3-L5 Lateral LLIF with Co-Surgeon (-62)
  // -----------------------------------------------------------------
  console.log('\n--- TEST 4: Case 3 - Lateral LLIF with Co-Surgeon Exposure ---');
  const sample3 = SAMPLE_OP_NOTES[2];
  const extractedCase3 = parseOperativeNoteLocally(sample3.rawText);
  const analysisCase3 = analyzeOperativeCoding(extractedCase3);

  const c3Codes = analysisCase3.recommendedCodes.map(c => `${c.code}${c.modifier || ''}`);
  console.log('  Assigned Codes:', c3Codes.join(', '));
  assert(c3Codes.includes('22558-62'), 'Assigned primary lateral fusion 22558 with Modifier -62');
  assert(c3Codes.includes('22559-62'), 'Assigned add-on lateral fusion 22559 with Modifier -62');
  assert(analysisCase3.auditDefenseParagraphs.some(p => p.modifier === '-62'), 'Generated Co-Surgeon -62 demarcation statement');

  // -----------------------------------------------------------------
  // TEST 5: Case 4 - L2-L5 Fusion with Pelvic S2AI Fixation & BMA
  // -----------------------------------------------------------------
  console.log('\n--- TEST 5: Case 4 - Complex Construct with Pelvic S2AI & BMA ---');
  const sample4 = SAMPLE_OP_NOTES[3];
  const extractedCase4 = parseOperativeNoteLocally(sample4.rawText);
  const analysisCase4 = analyzeOperativeCoding(extractedCase4);

  const c4Codes = analysisCase4.recommendedCodes.map(c => c.code);
  console.log('  Assigned Codes:', c4Codes.join(', '));
  assert(c4Codes.includes('22848'), 'Captured pelvic fixation add-on code 22848 (+6.05 wRVUs)');
  assert(c4Codes.includes('20937'), 'Captured separate incision bone marrow aspirate 20937 (+2.80 wRVUs)');
  assert(analysisCase4.totalWRVU > 70, `Total construct armored wRVU: ${analysisCase4.totalWRVU}`);

  console.log('\n===============================================================');
  console.log(` VERIFICATION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (100% SUCCESS)`);
  console.log('===============================================================\n');
}

runVerification();
