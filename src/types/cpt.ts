export type ProcedureCategory = 
  | 'arthrodesis_cervical'
  | 'arthrodesis_lumbar'
  | 'arthrodesis_thoracic'
  | 'instrumentation'
  | 'interbody_device'
  | 'bone_graft'
  | 'decompression'
  | 'osteotomy'
  | 'hardware_removal';

export interface CPTCodeDefinition {
  code: string;
  description: string;
  category: ProcedureCategory;
  type: 'base' | 'addon' | 'standalone';
  baseCodeRequired?: string[];
  wRVU: number; // Work Relative Value Units (2026 CMS MPFS)
  globalDays: number | 'ZZZ'; // 'ZZZ' = add-on code
  allowedModifiers: string[];
  documentationRules: string[];
  auditPitfall: string;
}

export interface ExtractedProcedureData {
  patientDeidentified: boolean;
  procedureTitle: string;
  preopDiagnosis: string;
  postopDiagnosis: string;
  region: 'cervical' | 'thoracic' | 'lumbar' | 'lumbosacral' | 'multi-region';
  levels: string[]; // e.g., ["L4-L5", "L5-S1"]
  approach: 'anterior' | 'posterior' | 'lateral' | 'transforaminal' | 'combined';
  
  // Surgical Components
  arthrodesis: {
    hasInterbody: boolean; // TLIF, PLIF, ALIF, LLIF
    hasPosterolateral: boolean;
    hasCervicalAnterior: boolean;
    hasCervicalPosterior: boolean;
    levels: string[];
  };

  instrumentation: {
    present: boolean;
    type: 'anterior' | 'posterior_segmental' | 'posterior_nonsegmental' | 'pelvic_fixation';
    vertebraeCount: number; // Number of vertebral segments spanned
    levels: string[];
    hasPelvicFixation: boolean; // S2AI or iliac screws
  };

  interbodyDevices: {
    present: boolean;
    count: number;
    material: string; // PEEK, Titanium, Expandable, Structural Allograft
    levels: string[];
  };

  boneGrafts: {
    localAutograft: boolean; // 20936
    morselizedAllograft: boolean; // 20930
    structuralAllograft: boolean; // 20931
    marrowAspirateSeparateIncision: boolean; // 20937
    iliacCrestAutograft: boolean; // 20938
    bmpUsed: boolean;
  };

  decompressions: Array<{
    level: string;
    type: 'laminectomy' | 'facetectomy' | 'foraminotomy' | 'discectomy';
    isAtFusionLevel: boolean;
    isDistinctContralateralOrNonFusion: boolean;
  }>;

  complexityMetrics: {
    isRevision: boolean;
    severeScarringLysisAdhesions: boolean;
    morbidObesityBMI?: number;
    duralTearRepaired: boolean;
    estimatedBloodLoss_ml: number;
    operativeDuration_minutes: number;
    typicalDuration_minutes: number;
    qualifiesForModifier22: boolean;
  };

  coSurgeon: {
    present: boolean;
    approachSurgeonRole?: string;
    spineSurgeonRole?: string;
  };
}

export interface RecommendedCodeItem {
  code: string;
  modifier?: string;
  description: string;
  wRVU: number;
  category: ProcedureCategory;
  auditConfidence: 'bulletproof' | 'review_required' | 'high_risk';
  justificationNotes: string;
}

export interface UnbilledOpportunityItem {
  title: string;
  potentialCode: string;
  potentialModifier?: string;
  additionalWRVU: number;
  clinicalMissingRequirement: string;
  suggestedAction: string;
}

export interface AuditDefenseParagraph {
  title: string;
  modifier: string;
  paragraphText: string;
  ruleCitation: string;
}

export interface AuditArmorAnalysis {
  extractedData: ExtractedProcedureData;
  recommendedCodes: RecommendedCodeItem[];
  unbilledOpportunities: UnbilledOpportunityItem[];
  auditDefenseParagraphs: AuditDefenseParagraph[];
  totalWRVU: number;
  baselineUnarmoredWRVU: number;
  recoveredWRVUDelta: number;
  auditRiskScore: number; // 0 (Zero Risk) to 100 (High Risk)
  auditRiskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  auditFindings: string[];
}
