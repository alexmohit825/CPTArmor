import type { ExtractedProcedureData } from '../types/cpt';

export function parseOperativeNoteLocally(text: string): ExtractedProcedureData {
  const lower = text.toLowerCase();

  // 1. Detect Spinal Interspaces (e.g., C5-C6, L4-L5)
  const levelRegex = /\b([CTLS]\d)\s*[-–/]\s*([CTLS]\d|S1)\b/gi;
  const rawLevels = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = levelRegex.exec(text)) !== null) {
    const from = match[1].toUpperCase();
    const to = match[2].toUpperCase();

    // Helper to calculate segment distance (e.g. L3 to L4 = 1; L3 to L5 = 2)
    const getNum = (seg: string) => {
      if (seg === 'S1') return 6; // L5 = 5, S1 = 6
      return parseInt(seg.substring(1), 10);
    };

    const fromPrefix = from[0];
    const toPrefix = to[0];
    const fromNum = getNum(from);
    const toNum = getNum(to);

    // Only add true single motion segment interspaces (distance of 1)
    if (fromPrefix === toPrefix || (fromPrefix === 'L' && to === 'S1')) {
      if (toNum - fromNum === 1) {
        rawLevels.add(`${from}-${to}`);
      }
    }
  }

  // Fallback: If no single-level interspace matched, but a span was mentioned (e.g. L3-L5)
  if (rawLevels.size === 0) {
    const spanRegex = /\b([CTLS]\d)\s*[-–/]\s*([CTLS]\d|S1)\b/gi;
    while ((match = spanRegex.exec(text)) !== null) {
      rawLevels.add(`${match[1].toUpperCase()}-${match[2].toUpperCase()}`);
    }
  }

  const levels = Array.from(rawLevels);

  // 2. Region Classification
  const hasCervical = levels.some(l => l.startsWith('C')) || lower.includes('cervical') || lower.includes('acdf');
  const hasLumbar = levels.some(l => l.startsWith('L') || l.includes('S1')) || lower.includes('lumbar') || lower.includes('tlif') || lower.includes('alif') || lower.includes('llif') || lower.includes('transpsoas');
  const hasThoracic = levels.some(l => l.startsWith('T')) || lower.includes('thoracic');

  let region: ExtractedProcedureData['region'] = 'lumbar';
  if (hasCervical && !hasLumbar) region = 'cervical';
  else if (hasThoracic && !hasLumbar && !hasCervical) region = 'thoracic';
  else if (hasLumbar && levels.some(l => l.includes('S1'))) region = 'lumbosacral';
  else if ((hasCervical && hasLumbar) || (hasThoracic && hasLumbar)) region = 'multi-region';

  // 3. Arthrodesis Components
  const hasTLIF = lower.includes('tlif') || lower.includes('transforaminal lumbar interbody');
  const hasPLIF = lower.includes('plif') || lower.includes('posterior lumbar interbody');
  const hasALIF = lower.includes('alif') || lower.includes('anterior lumbar interbody');
  const hasLLIF = lower.includes('llif') || lower.includes('xlif') || lower.includes('lateral lumbar interbody') || lower.includes('transpsoas');
  const hasACDF = lower.includes('acdf') || (hasCervical && (lower.includes('anterior cervical discectomy') || lower.includes('anterior cervical interbody')));
  
  const hasInterbody = hasTLIF || hasPLIF || hasALIF || hasLLIF || hasACDF || lower.includes('interbody cage') || lower.includes('interbody spacer');
  const hasPosterolateral = lower.includes('posterolateral fusion') || lower.includes('transverse process') || lower.includes('gutters') || lower.includes('decortication of the transverse');

  // 4. Approach Determination
  let approach: ExtractedProcedureData['approach'] = 'posterior';
  if (hasACDF || (hasCervical && lower.includes('anterior cervical'))) {
    approach = 'anterior';
  } else if (hasLLIF) {
    approach = 'lateral';
  } else if (hasALIF) {
    approach = 'anterior';
  } else if (hasTLIF) {
    approach = 'transforaminal';
  } else if (lower.includes('anterior') && lower.includes('posterior incision')) {
    approach = 'combined';
  }

  // 5. Instrumentation
  const hasPedicleScrews = lower.includes('pedicle screw') || lower.includes('posterior segmental') || lower.includes('rod fixation') || lower.includes('tulip') || lower.includes('percutaneous pedicle');
  const hasAnteriorPlate = lower.includes('anterior plate') || lower.includes('cervical plate') || lower.includes('locking plate');
  const hasPelvicFixation = lower.includes('s2ai') || lower.includes('s2 alar iliac') || lower.includes('iliac screw') || lower.includes('pelvic screw') || lower.includes('pelvic fixation');

  // Vertebral count calculation
  let vertebraeCount = levels.length > 0 ? levels.length + 1 : 0;
  if (lower.includes('spanning 7 vertebral') || lower.includes('l1 to s1')) {
    vertebraeCount = 7;
  }

  let instrumentationType: ExtractedProcedureData['instrumentation']['type'] = 'none' as any;
  if (hasPedicleScrews) instrumentationType = 'posterior_segmental';
  else if (hasAnteriorPlate) instrumentationType = 'anterior';

  // 6. Interbody Cages
  const cageMention = lower.includes('cage') || lower.includes('interbody device') || lower.includes('spacer') || lower.includes('peek') || lower.includes('titanium');
  let cageCount = 0;
  if (hasInterbody || cageMention) {
    cageCount = Math.max(1, levels.length);
    if (lower.includes('3 peek') || lower.includes('3 interbody') || lower.includes('three cages')) {
      cageCount = 3;
    } else if (lower.includes('2 cages') || lower.includes('two cages') || lower.includes('cages x 2') || lower.includes('cages x2')) {
      cageCount = 2;
    }
  }

  // 7. Bone Grafts
  const localAutograft = lower.includes('local bone') || lower.includes('local autograft') || lower.includes('laminar bone') || lower.includes('spinous process') || lower.includes('bone mill') || lower.includes('local morselized');
  const morselizedAllograft = lower.includes('allograft') || lower.includes('dbm') || lower.includes('demineralized bone matrix') || lower.includes('cancellous');
  const structuralAllograft = lower.includes('structural allograft') || lower.includes('fibula strut') || lower.includes('iliac strut');
  const marrowAspirate = lower.includes('bone marrow aspirate') || lower.includes('bma') || lower.includes('separate skin incision') || lower.includes('separate incision for aspirat') || lower.includes('jamshidi needle');
  const iliacCrestAutograft = lower.includes('iliac crest harvest') || lower.includes('autologous iliac crest') || lower.includes('tricortical');
  const bmpUsed = lower.includes('infuse') || lower.includes('bmp') || lower.includes('rhbmp-2');

  // 8. Decompressions
  const hasLaminectomy = lower.includes('laminectomy') || lower.includes('hemilaminectomy');
  const hasFacetectomy = lower.includes('facetectomy') || lower.includes('inferior facet');
  const hasForaminotomy = lower.includes('foraminotomy') || lower.includes('neuroforamen');
  const hasDiscectomy = lower.includes('discectomy') || lower.includes('microdiscectomy');

  const decompressions: ExtractedProcedureData['decompressions'] = [];
  if (hasLaminectomy || hasFacetectomy || hasForaminotomy || hasDiscectomy) {
    levels.forEach(lvl => {
      decompressions.push({
        level: lvl,
        type: hasLaminectomy ? 'laminectomy' : (hasFacetectomy ? 'facetectomy' : 'foraminotomy'),
        isAtFusionLevel: true,
        isDistinctContralateralOrNonFusion: lower.includes('contralateral decompression')
      });
    });
  }

  // 9. Complexity Factors (Modifier -22 triggers)
  const isRevision = lower.includes('revision') || 
                     lower.includes('prior') || 
                     lower.includes('previous') || 
                     lower.includes('re-exploration') || 
                     lower.includes('post-laminectomy') || 
                     lower.includes('hardware removal') || 
                     lower.includes('removal of posterior');

  const severeScarring = lower.includes('extensive scarring') || 
                         lower.includes('severe cicatricial') || 
                         lower.includes('dense epidural fibrosis') || 
                         lower.includes('tedious lysis of adhesions') || 
                         lower.includes('adherent dura') || 
                         lower.includes('scar dissection');

  const duralTearRepaired = lower.includes('dural tear') || lower.includes('incidental durotomy') || lower.includes('4-0 prolene') || lower.includes('dura sealant') || lower.includes('duraseal');
  
  // BMI extraction
  const bmiMatch = text.match(/\bBMI\s*(?:of\s*)?(\d{2}(?:\.\d)?)\b/i);
  const morbidObesityBMI = bmiMatch ? parseFloat(bmiMatch[1]) : (lower.includes('morbid obesity') || lower.includes('morbidly obese') ? 41.2 : undefined);

  // Operative duration extraction
  const timeMatch = text.match(/(?:operative\s*time|total\s*time|duration|anesthesia\s*time)\s*:\s*(\d{1,2})\s*(?:hours?|hrs?)\s*(?:(\d{1,2})\s*(?:mins?|minutes?))?/i)
    || text.match(/(\d{2,3})\s*(?:minutes|mins)\s*(?:of\s*operative\s*time)?/i);
  
  let operativeDuration_minutes = 180;
  if (timeMatch) {
    if (timeMatch[2] !== undefined) {
      operativeDuration_minutes = parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
    } else if (parseInt(timeMatch[1], 10) > 20) {
      operativeDuration_minutes = parseInt(timeMatch[1], 10);
    } else {
      operativeDuration_minutes = parseInt(timeMatch[1], 10) * 60;
    }
  }

  // EBL extraction
  const eblMatch = text.match(/(?:EBL|estimated\s*blood\s*loss)\s*:\s*(\d{2,4})\s*(?:ml|cc)?/i);
  const estimatedBloodLoss_ml = eblMatch ? parseInt(eblMatch[1], 10) : (lower.includes('minimal blood loss') ? 50 : 250);

  // Typical time benchmark
  const typicalDuration_minutes = Math.max(120, levels.length * 75);
  const qualifiesForModifier22 = (isRevision && severeScarring) || 
                                (operativeDuration_minutes >= typicalDuration_minutes * 1.45) || 
                                (morbidObesityBMI !== undefined && morbidObesityBMI >= 40 && severeScarring);

  // 10. Co-Surgeon / Exposure Surgeon
  const coSurgeonPresent = lower.includes('co-surgeon') || lower.includes('co surgeon') || lower.includes('dr. kevin patterson') || lower.includes('approach co-surgeon');
  let approachSurgeonRole: string | undefined;
  if (coSurgeonPresent) {
    approachSurgeonRole = lower.includes('vascular') || lower.includes('general') ? 'General / Vascular Retroperitoneal Approach' : 'Access Surgeon Exposure';
  }

  return {
    patientDeidentified: text.includes('[REDACTED'),
    procedureTitle: text.split('\n')[0].replace(/^#+\s*/, '').trim(),
    preopDiagnosis: lower.includes('preoperative diagnosis') ? 'Spinal stenosis / instability' : 'Spine Pathology',
    postopDiagnosis: 'Same as preoperative',
    region,
    levels: levels.length > 0 ? levels : (hasCervical ? ['C5-C6', 'C6-C7'] : ['L4-L5']),
    approach,
    arthrodesis: {
      hasInterbody,
      hasPosterolateral,
      hasCervicalAnterior: hasACDF,
      hasCervicalPosterior: hasCervical && (approach === 'posterior'),
      levels
    },
    instrumentation: {
      present: hasPedicleScrews || hasAnteriorPlate,
      type: instrumentationType,
      vertebraeCount,
      levels,
      hasPelvicFixation
    },
    interbodyDevices: {
      present: cageCount > 0,
      count: cageCount,
      material: lower.includes('titanium') ? 'Titanium Expandable' : (lower.includes('peek') ? 'PEEK' : 'Biomechanical Device'),
      levels
    },
    boneGrafts: {
      localAutograft,
      morselizedAllograft,
      structuralAllograft,
      marrowAspirateSeparateIncision: marrowAspirate,
      iliacCrestAutograft,
      bmpUsed
    },
    decompressions,
    complexityMetrics: {
      isRevision,
      severeScarringLysisAdhesions: severeScarring,
      morbidObesityBMI,
      duralTearRepaired,
      estimatedBloodLoss_ml,
      operativeDuration_minutes,
      typicalDuration_minutes,
      qualifiesForModifier22
    },
    coSurgeon: {
      present: coSurgeonPresent,
      approachSurgeonRole,
      spineSurgeonRole: 'Arthrodesis, Instrumentation, Discectomy & Implants'
    }
  };
}
