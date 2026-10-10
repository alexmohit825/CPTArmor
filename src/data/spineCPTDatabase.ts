import type { CPTCodeDefinition } from '../types/cpt';

export const SPINE_CPT_DATABASE: Record<string, CPTCodeDefinition> = {
  // ==========================================
  // ANTERIOR CERVICAL ARTHRODESIS
  // ==========================================
  '22551': {
    code: '22551',
    description: 'Arthrodesis, anterior interbody, including disc space preparation; cervical below C2, single interspace',
    category: 'arthrodesis_cervical',
    type: 'base',
    wRVU: 24.08,
    globalDays: 90,
    allowedModifiers: ['-22', '-62', '-80', '-AS'],
    documentationRules: [
      'Must document complete discectomy, endplate preparation, and arthrodesis',
      'Bundles standard anterior decompression at that level (do NOT bill 63075 at same interspace)',
      'Single interspace only; use +22552 for additional levels'
    ],
    auditPitfall: 'Unbundling 63075 (discectomy) at the same level as 22551 will trigger immediate RAC audit clawback unless performed for corpectomy.'
  },
  '22552': {
    code: '22552',
    description: 'Arthrodesis, anterior interbody, cervical below C2, each additional interspace (List separately in addition to code for primary procedure)',
    category: 'arthrodesis_cervical',
    type: 'addon',
    baseCodeRequired: ['22551'],
    wRVU: 6.28,
    globalDays: 'ZZZ',
    allowedModifiers: ['-62', '-80', '-AS'],
    documentationRules: [
      'Must explicitly state discectomy and endplate prep at each numbered interspace',
      'Bill once per each additional interspace (e.g., C5-C6 and C6-C7 = 22551 + 22552 x 1)'
    ],
    auditPitfall: 'Submitting 22551 twice for two levels instead of 22551 + 22552.'
  },

  // ==========================================
  // POSTERIOR CERVICAL ARTHRODESIS
  // ==========================================
  '22595': {
    code: '22595',
    description: 'Arthrodesis, posterior, craniocervical (occiput-C2)',
    category: 'arthrodesis_cervical',
    type: 'base',
    wRVU: 24.50,
    globalDays: 90,
    allowedModifiers: ['-22', '-62', '-80'],
    documentationRules: [
      'Must document occiput exposure, decortication, and fusion bed preparation down to axis'
    ],
    auditPitfall: 'Failing to bill distinct skull/occiput instrumentation add-on 22842/22845.'
  },
  '22600': {
    code: '22600',
    description: 'Arthrodesis, posterior or posterolateral, cervical below C2 segment; single interspace',
    category: 'arthrodesis_cervical',
    type: 'base',
    wRVU: 21.20,
    globalDays: 90,
    allowedModifiers: ['-22', '-62', '-80'],
    documentationRules: [
      'Must document decortication of facet joints, lamina, and lateral masses',
      'Document bone graft placement into the prepared posterior cervical beds'
    ],
    auditPitfall: 'Omitting local autograft code 20936 or instrumentation add-ons.'
  },
  '22614': {
    code: '22614',
    description: 'Arthrodesis, posterior or posterolateral, each additional interspace (List separately in addition to code for primary procedure)',
    category: 'arthrodesis_lumbar',
    type: 'addon',
    baseCodeRequired: ['22600', '22612', '22630'],
    wRVU: 7.65,
    globalDays: 'ZZZ',
    allowedModifiers: ['-62', '-80'],
    documentationRules: [
      'Each additional interspace for posterior arthrodesis across cervical, thoracic, or lumbar'
    ],
    auditPitfall: 'Overbilling quantity beyond total fused motion segments.'
  },

  // ==========================================
  // POSTERIOR LUMBAR ARTHRODESIS (TLIF / PLIF / POSTEROLATERAL)
  // ==========================================
  '22633': {
    code: '22633',
    description: 'Arthrodesis, combined posterior or posterolateral technique with posterior interbody technique including laminectomy and/or discectomy; lumbar, single interspace',
    category: 'arthrodesis_lumbar',
    type: 'base',
    wRVU: 27.70,
    globalDays: 90,
    allowedModifiers: ['-22', '-62', '-80', '-AS'],
    documentationRules: [
      'Covers combined posterolateral fusion AND interbody (TLIF/PLIF) at the same level',
      'Includes standard decompression/laminectomy at that same fusion interspace',
      'Billable with cage code 22853 x 1 and instrumentation 22842'
    ],
    auditPitfall: 'Do NOT bill 63047 (laminectomy) at the same level without distinct contralateral decompression or separate pathology; doing so triggers immediate RAC denial.'
  },
  '22634': {
    code: '22634',
    description: 'Arthrodesis, combined posterior or posterolateral technique with posterior interbody technique; each additional interspace (List separately in addition to code for primary procedure)',
    category: 'arthrodesis_lumbar',
    type: 'addon',
    baseCodeRequired: ['22633'],
    wRVU: 8.60,
    globalDays: 'ZZZ',
    allowedModifiers: ['-62', '-80', '-AS'],
    documentationRules: [
      'Used for multi-level TLIF/PLIF (e.g. L4-S1 two-level TLIF = 22633 for L4-L5, 22634 for L5-S1)'
    ],
    auditPitfall: 'Using 22614 (posterolateral add-on) instead of 22634 when an interbody cage is placed at the second level.'
  },
  '22612': {
    code: '22612',
    description: 'Arthrodesis, posterior or posterolateral, single interspace; lumbar',
    category: 'arthrodesis_lumbar',
    type: 'base',
    wRVU: 25.26,
    globalDays: 90,
    allowedModifiers: ['-22', '-62', '-80', '-AS'],
    documentationRules: [
      'Posterolateral fusion with decortication of transverse processes and facet joints',
      'Use when NO interbody cage was placed at this segment'
    ],
    auditPitfall: 'Billing 22612 when an interbody cage was inserted (must use 22633).'
  },

  // ==========================================
  // ANTERIOR / LATERAL LUMBAR ARTHRODESIS (ALIF / LLIF / XLIF / DLIF)
  // ==========================================
  '22558': {
    code: '22558',
    description: 'Arthrodesis, anterior interbody technique, including minimal discectomy to prepare interspace; lumbar, single interspace',
    category: 'arthrodesis_lumbar',
    type: 'base',
    wRVU: 24.47,
    globalDays: 90,
    allowedModifiers: ['-22', '-62', '-80', '-AS'],
    documentationRules: [
      'Used for ALIF or lateral retroperitoneal transpsoas interbody fusion (LLIF/XLIF)',
      'If vascular/general surgeon performed exposure, bill with Modifier -62',
      'Add 22853 for interbody cage and 22845 for anterior plate/screw fixation'
    ],
    auditPitfall: 'Both co-surgeons must submit identical CPT codes with modifier -62 and cross-reference each other in the note.'
  },
  '22559': {
    code: '22559',
    description: 'Arthrodesis, anterior interbody technique; lumbar, each additional interspace (List separately in addition to code for primary procedure)',
    category: 'arthrodesis_lumbar',
    type: 'addon',
    baseCodeRequired: ['22558'],
    wRVU: 8.00,
    globalDays: 'ZZZ',
    allowedModifiers: ['-62', '-80', '-AS'],
    documentationRules: [
      'Each additional interspace for ALIF or LLIF'
    ],
    auditPitfall: 'Failing to apply Modifier -62 to the add-on code when co-surgeon participated across all levels.'
  },

  // ==========================================
  // SPINAL INSTRUMENTATION
  // ==========================================
  '22845': {
    code: '22845',
    description: 'Anterior instrumentation; 2 to 3 vertebral segments (List separately in addition to code for primary procedure)',
    category: 'instrumentation',
    type: 'addon',
    baseCodeRequired: ['22551', '22558'],
    wRVU: 11.85,
    globalDays: 'ZZZ',
    allowedModifiers: ['-62', '-80'],
    documentationRules: [
      'Documents anterior plate/screws or integrated plate spanning 2 or 3 vertebrae (e.g. C5-C6 or C5-C7)'
    ],
    auditPitfall: 'Counting interspaces instead of vertebral segments. C5-C6 is 2 vertebrae (22845).'
  },
  '22846': {
    code: '22846',
    description: 'Anterior instrumentation; 4 to 7 vertebral segments (List separately in addition to code for primary procedure)',
    category: 'instrumentation',
    type: 'addon',
    baseCodeRequired: ['22551', '22558'],
    wRVU: 12.75,
    globalDays: 'ZZZ',
    allowedModifiers: ['-62', '-80'],
    documentationRules: [
      'Spanning 4 to 7 vertebral segments (e.g., C4-T1 anterior plate = 5 vertebrae)'
    ],
    auditPitfall: 'Under-coding as 22845 on long 3-level or 4-level constructs.'
  },
  '22840': {
    code: '22840',
    description: 'Posterior non-segmental instrumentation (eg, Harrington rod technique, pedicle fixation across 1 interspace without intermediate fixation)',
    category: 'instrumentation',
    type: 'addon',
    wRVU: 11.90,
    globalDays: 'ZZZ',
    allowedModifiers: ['-80'],
    documentationRules: [
      'Non-segmental fixation anchored only at proximal and distal ends'
    ],
    auditPitfall: 'Using 22840 when screws were placed at every level (use 22842).'
  },
  '22842': {
    code: '22842',
    description: 'Posterior segmental instrumentation (eg, pedicle fixation, dual rods with screws at multiple levels); 3 to 6 vertebral segments',
    category: 'instrumentation',
    type: 'addon',
    wRVU: 13.75,
    globalDays: 'ZZZ',
    allowedModifiers: ['-80', '-AS'],
    documentationRules: [
      'Must count vertebral segments: e.g. L4-S1 pedicle screws = L4, L5, S1 = 3 vertebral segments (22842)'
    ],
    auditPitfall: 'Forgetting that 2-level fusion (L4-S1) spans 3 vertebral segments and qualifies for 22842.'
  },
  '22843': {
    code: '22843',
    description: 'Posterior segmental instrumentation; 7 to 12 vertebral segments',
    category: 'instrumentation',
    type: 'addon',
    wRVU: 14.50,
    globalDays: 'ZZZ',
    allowedModifiers: ['-80', '-AS'],
    documentationRules: [
      'Long construct spanning 7 to 12 vertebrae (e.g. T10 to pelvis/S1)'
    ],
    auditPitfall: 'Miscounting vertebrae and defaulting to 22842 on deformity constructs.'
  },
  '22848': {
    code: '22848',
    description: 'Pelvic fixation, other than sacrum, attached to spinal construct (eg, S2AI screws, iliac screws) (List separately in addition to code for primary procedure)',
    category: 'instrumentation',
    type: 'addon',
    baseCodeRequired: ['22842', '22843'],
    wRVU: 6.05,
    globalDays: 'ZZZ',
    allowedModifiers: ['-80', '-AS'],
    documentationRules: [
      'Must document placement of pelvic fixation (S2AI or iliac screws) connected via rods to construct'
    ],
    auditPitfall: 'Surgeons frequently forget to bill 22848 when placing bilateral S2AI screws in long constructs.'
  },

  // ==========================================
  // INTERBODY BIOMECHANICAL DEVICES (CAGES)
  // ==========================================
  '22853': {
    code: '22853',
    description: 'Insertion of interbody biomechanical device(s) (eg, synthetic cage, PEEK, titanium, mesh) with integral or non-integral fixation, each interspace',
    category: 'interbody_device',
    type: 'addon',
    wRVU: 4.50,
    globalDays: 'ZZZ',
    allowedModifiers: ['-80', '-AS'],
    documentationRules: [
      'Bill once per interspace regardless of whether 1 cage or 2 cages are placed in that interspace',
      'Applies to TLIF, PLIF, ALIF, LLIF, and ACDF cages'
    ],
    auditPitfall: 'Billing twice for dual TLIF cages at the same level (only 1 unit allowed per interspace).'
  },

  // ==========================================
  // BONE GRAFTS
  // ==========================================
  '20930': {
    code: '20930',
    description: 'Allograft, morselized, or placement of osteopromotive material, for spine surgery only (List separately in addition to code for primary procedure)',
    category: 'bone_graft',
    type: 'addon',
    wRVU: 0.00, // Carrier-priced or bundled in Medicare; billable in commercial contracts!
    globalDays: 'ZZZ',
    allowedModifiers: [],
    documentationRules: [
      'Document type and vendor of morselized allograft / DBM placed in interbody space or gutters'
    ],
    auditPitfall: 'Coders routinely omit 20930 because Medicare does not pay separate RVU, losing thousands in commercial insurance contracts.'
  },
  '20936': {
    code: '20936',
    description: 'Autograft for spine surgery only (includes harvesting the graft); local (eg, ribs, spinous process, or laminar fragments) obtained from same incision',
    category: 'bone_graft',
    type: 'addon',
    wRVU: 0.00, // Medicare status B, but critical for commercial contracts & surgical completeness
    globalDays: 'ZZZ',
    allowedModifiers: [],
    documentationRules: [
      'Document harvest of local spinous process or lamina fragments, morselization in bone mill, and packing'
    ],
    auditPitfall: 'Failing to document morselization and packing site.'
  },
  '20937': {
    code: '20937',
    description: 'Autograft for spine surgery only; morselized, through separate skin or fascial incision',
    category: 'bone_graft',
    type: 'addon',
    wRVU: 2.80,
    globalDays: 'ZZZ',
    allowedModifiers: ['-80'],
    documentationRules: [
      'Requires separate skin or fascial incision (e.g. percutaneous iliac crest bone marrow aspirate trochar)'
    ],
    auditPitfall: 'Billing 20937 when bone was obtained through the same midline exposure (must use 20936).'
  },
  '20938': {
    code: '20938',
    description: 'Autograft for spine surgery only; structural, through separate skin or fascial incision (eg, tricortical iliac crest)',
    category: 'bone_graft',
    type: 'addon',
    wRVU: 3.15,
    globalDays: 'ZZZ',
    allowedModifiers: ['-80'],
    documentationRules: [
      'Structural graft block taken from iliac crest through separate incision'
    ],
    auditPitfall: 'Billing for synthetic struts as 20938 (must be genuine autograft).'
  },

  // ==========================================
  // DECOMPRESSION & LAMINECTOMY
  // ==========================================
  '63047': {
    code: '63047',
    description: 'Laminectomy, facetectomy and foraminotomy (unilateral or bilateral with decompression of spinal cord, cauda equina and/or nerve root[s]); lumbar, single interspace',
    category: 'decompression',
    type: 'base',
    wRVU: 17.50,
    globalDays: 90,
    allowedModifiers: ['-22', '-59', '-XU', '-80', '-AS'],
    documentationRules: [
      'Complete decompression of nerve roots and thecal sac at lumbar interspace',
      'When billed with 22633 at same level, laminectomy is bundled by NCCI',
      'Billable with Modifier -59 or -XU if performed at a SEPARATE, NON-FUSION level (e.g. L3-L4 decompression with L4-S1 fusion)'
    ],
    auditPitfall: 'Billing 63047-59 at the same level as 22633 without documenting distinct contralateral pathology that required standalone operative time.'
  },
  '63048': {
    code: '63048',
    description: 'Laminectomy, facetectomy and foraminotomy; each additional interspace, cervical, thoracic, or lumbar (List separately in addition to code for primary procedure)',
    category: 'decompression',
    type: 'addon',
    baseCodeRequired: ['63047', '63045'],
    wRVU: 3.80,
    globalDays: 'ZZZ',
    allowedModifiers: ['-59', '-XU', '-80'],
    documentationRules: [
      'Each additional decompression interspace'
    ],
    auditPitfall: 'Applying base code 63047 multiple times for adjacent levels instead of 63048.'
  },

  // ==========================================
  // HARDWARE REMOVAL & REVISION
  // ==========================================
  '22852': {
    code: '22852',
    description: 'Removal of posterior segmental instrumentation',
    category: 'hardware_removal',
    type: 'base',
    wRVU: 12.20,
    globalDays: 90,
    allowedModifiers: ['-22', '-59', '-XU', '-80'],
    documentationRules: [
      'Must document removal of prior pedicle screws and rods from previous surgery',
      'Billable in addition to new re-instrumentation (22842) in revision cases'
    ],
    auditPitfall: 'Surgeons forget to bill 22852 in revision surgery when removing old broken or loose hardware.'
  },
  '22830': {
    code: '22830',
    description: 'Exploration of spinal fusion',
    category: 'hardware_removal',
    type: 'base',
    wRVU: 13.40,
    globalDays: 90,
    allowedModifiers: ['-22', '-80'],
    documentationRules: [
      'Exploration of previous fusion bed to evaluate for pseudoarthrosis',
      'NCCI Edit: Bundled into re-fusion codes at the same level unless performed at an adjacent non-re-fused segment'
    ],
    auditPitfall: 'Billing 22830 at the exact same segment where a repeat fusion (22633) is billed; NCCI will deny.'
  },

  // ==========================================
  // OSTEOTOMIES (DEFORMITY CORRECTION)
  // ==========================================
  '22214': {
    code: '22214',
    description: 'Osteotomy of spine, posterior or posterolateral approach, 1 vertebral segment; lumbar (eg, Smith-Petersen, Ponte osteotomy)',
    category: 'osteotomy',
    type: 'base',
    wRVU: 23.50,
    globalDays: 90,
    allowedModifiers: ['-22', '-80', '-AS'],
    documentationRules: [
      'Must document resection of superior and inferior articular facets and spinous process to achieve sagittal closing wedge mobility'
    ],
    auditPitfall: 'Describing facetectomy as merely decompression rather than formal osteotomy for deformity alignment.'
  },
  '22216': {
    code: '22216',
    description: 'Osteotomy of spine, posterior or posterolateral approach, each additional vertebral segment; lumbar (List separately in addition to code for primary procedure)',
    category: 'osteotomy',
    type: 'addon',
    baseCodeRequired: ['22214'],
    wRVU: 6.50,
    globalDays: 'ZZZ',
    allowedModifiers: ['-80', '-AS'],
    documentationRules: [
      'Each additional Ponte/SPO osteotomy segment'
    ],
    auditPitfall: 'Failing to itemize each level where facet osteotomies were performed for sagittal correction.'
  }
};
