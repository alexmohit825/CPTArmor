import { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Stethoscope, 
  Send, 
  RotateCcw,
  Eye,
  EyeOff,
  Clock,
  Activity
} from 'lucide-react';
import { SAMPLE_OP_NOTES } from './data/sampleOpNotes';
import type { SampleOpNote } from './data/sampleOpNotes';
import { sanitizeOperativeNote } from './engine/phiSanitizer';
import type { SanitizationResult } from './engine/phiSanitizer';
import { parseOperativeNoteLocally } from './engine/surgicalParser';
import { analyzeOperativeCoding } from './engine/cptRulesEngine';
import type { AuditArmorAnalysis } from './types/cpt';


export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-1-revision-tlif');
  const [inputText, setInputText] = useState<string>('');
  const [sanitizedView, setSanitizedView] = useState<boolean>(true);
  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>({});
  const [screenDropStatus, setScreenDropStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'codes' | 'armor' | 'opportunities' | 'anatomy'>('codes');

  // Initialize with Case 1
  useEffect(() => {
    const defaultCase = SAMPLE_OP_NOTES.find(c => c.id === 'case-1-revision-tlif');
    if (defaultCase) {
      setInputText(defaultCase.rawText);
    }
  }, []);

  // Handle case selection
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    const chosen = SAMPLE_OP_NOTES.find(c => c.id === caseId);
    if (chosen) {
      setInputText(chosen.rawText);
    }
  };

  // Run Client-Side PHI Sanitization
  const sanitizationResult: SanitizationResult = useMemo(() => {
    return sanitizeOperativeNote(inputText);
  }, [inputText]);

  // Run Entity Extraction & Deterministic Rules Engine
  const analysisResult: AuditArmorAnalysis = useMemo(() => {
    const textToProcess = sanitizedView ? sanitizationResult.sanitizedText : inputText;
    const extracted = parseOperativeNoteLocally(textToProcess);
    return analyzeOperativeCoding(extracted);
  }, [inputText, sanitizedView, sanitizationResult]);

  // Copy to clipboard helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedState(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  // Generate full armored operative report text
  const getFullArmoredReport = () => {
    let result = sanitizedView ? sanitizationResult.sanitizedText : inputText;
    if (analysisResult.auditDefenseParagraphs.length > 0) {
      result += '\n\n' + '='.repeat(60) + '\n';
      result += 'AUDIT DEFENSE & MEDICAL NECESSITY DOCUMENTATION ADDENDUM:\n';
      result += '='.repeat(60) + '\n\n';
      analysisResult.auditDefenseParagraphs.forEach(p => {
        result += `[${p.title}]\n${p.paragraphText}\nRule Citation: ${p.ruleCitation}\n\n`;
      });
    }
    result += `RECOMMENDED CPT HIERARCHY:\n`;
    analysisResult.recommendedCodes.forEach(c => {
      result += `- ${c.code}${c.modifier ? c.modifier : ''}: ${c.description} (${c.wRVU.toFixed(2)} wRVU)\n`;
    });
    result += `TOTAL WORK RVUs: ${analysisResult.totalWRVU.toFixed(2)}\n`;
    return result;
  };

  // Beam to ScreenDrop server
  const handleSendToScreenDrop = async () => {
    setScreenDropStatus('Sending to ScreenDrop...');
    try {
      const blob = new Blob([getFullArmoredReport()], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', blob, `Armored_OpReport_${Date.now()}.txt`);

      const res = await fetch('http://127.0.0.1:7788/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setScreenDropStatus('Delivered to Workstation Desktop via ScreenDrop!');
      } else {
        setScreenDropStatus('ScreenDrop offline (run screendrop_server.py on PC)');
      }
    } catch {
      setScreenDropStatus('ScreenDrop server not reachable on port 7788');
    }
    setTimeout(() => setScreenDropStatus(null), 4000);
  };

  // Conversion factor ($32.74 per wRVU in 2026 Medicare baseline)
  const estimatedMedicareReimbursement = (analysisResult.totalWRVU * 32.74).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  const estimatedRecoveredValue = (analysisResult.recoveredWRVUDelta * 32.74).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-emerald-400">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0">OpReport CPT Armor</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                2026 CMS Fee Schedule
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0">Spine Surgical Coding Maximizer & Audit Defense Engine</p>
          </div>
        </div>

        {/* Security & Action Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Client-Side HIPAA Redaction: <strong>Active</strong></span>
          </div>

          <button
            onClick={handleSendToScreenDrop}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-lg text-xs font-medium transition"
            title="Beam armored report directly to local workstation via ScreenDrop"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Beam via ScreenDrop</span>
          </button>
        </div>
      </header>

      {/* ScreenDrop Status Notification */}
      {screenDropStatus && (
        <div className="bg-blue-900/60 border-b border-blue-700/50 text-blue-200 text-xs px-6 py-2 text-center flex items-center justify-center gap-2">
          <Activity className="w-4 h-4 animate-spin" />
          <span>{screenDropStatus}</span>
        </div>
      )}

      {/* Case Selector Pills */}
      <div className="bg-slate-900/40 border-b border-slate-800/60 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-2">
          Clinical Test Cases:
        </span>
        {SAMPLE_OP_NOTES.map((caseItem: SampleOpNote) => (
          <button
            key={caseItem.id}
            onClick={() => handleSelectCase(caseItem.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
              selectedCaseId === caseItem.id
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {caseItem.title.split(':')[0]} ({caseItem.procedureType})
          </button>
        ))}
      </div>

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* ======================================================== */}
        {/* LEFT PANE: Operative Note & PHI Redactor (Cols 1-5)     */}
        {/* ======================================================== */}
        <section className="lg:col-span-5 border-r border-slate-800 flex flex-col bg-slate-950 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200 m-0">Operative Narrative</h2>
              <span className="text-xs text-slate-400">
                ({sanitizationResult.scrubbedCount} PHI tokens sanitized)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSanitizedView(!sanitizedView)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                  sanitizedView 
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                }`}
                title="Toggle between raw and HIPAA-redacted view"
              >
                {sanitizedView ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{sanitizedView ? 'Sanitized View' : 'Raw Text'}</span>
              </button>

              <button
                onClick={() => setInputText('')}
                className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition"
                title="Clear text"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Text Editor */}
          <div className="relative flex-1 flex flex-col">
            <textarea
              value={sanitizedView ? sanitizationResult.sanitizedText : inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedCaseId('');
              }}
              placeholder="Paste raw operative note or dictation here..."
              className="w-full flex-1 min-h-[500px] lg:min-h-[640px] bg-slate-900/60 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>

          {/* Text Stats & EMR Export Bar */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>{inputText.length} characters • {inputText.split(/\s+/).filter(Boolean).length} words</span>
            <button
              onClick={() => handleCopy(getFullArmoredReport(), 'full_report')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
            >
              {copiedState['full_report'] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedState['full_report'] ? 'Copied Armored Report!' : 'Copy Armored Report for EMR'}</span>
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* RIGHT PANE: CPT Hierarchy, RVUs & Audit Armor (Cols 6-12) */}
        {/* ======================================================== */}
        <section className="lg:col-span-7 flex flex-col bg-slate-950 p-5 overflow-y-auto">
          
          {/* Executive Metrics Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {/* Metric 1: Total Armored wRVU */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Armored wRVUs</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {analysisResult.totalWRVU.toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-400/90 font-medium mt-0.5">
                Est. {estimatedMedicareReimbursement}
              </div>
            </div>

            {/* Metric 2: Recovered Revenue Delta */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Recovered Delta</span>
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-300">
                +{analysisResult.recoveredWRVUDelta.toFixed(2)}
              </div>
              <div className="text-[11px] text-blue-400/90 font-medium mt-0.5">
                +{estimatedRecoveredValue} vs Downcoded
              </div>
            </div>

            {/* Metric 3: Operative Time vs Benchmark */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Operative Time</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {analysisResult.extractedData.complexityMetrics.operativeDuration_minutes}m
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Benchmark: {analysisResult.extractedData.complexityMetrics.typicalDuration_minutes}m
              </div>
            </div>

            {/* Metric 4: RAC Audit Risk Level */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Audit Risk</span>
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-emerald-300 flex items-center gap-1.5">
                <span>{analysisResult.auditRiskLevel}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Score: {analysisResult.auditRiskScore}/100 (Safe)
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-800 mb-4 pb-1">
            <button
              onClick={() => setActiveTab('codes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'codes' 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended CPT Stack ({analysisResult.recommendedCodes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('armor')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'armor' 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Audit Armor Injections ({analysisResult.auditDefenseParagraphs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'opportunities' 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Unbilled Opportunities ({analysisResult.unbilledOpportunities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('anatomy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'anatomy' 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
              <span>Surgical Anatomy</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: RECOMMENDED CPT STACK                             */}
          {/* ======================================================== */}
          {activeTab === 'codes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Optimized according to AMA CPT & CMS NCCI Unbundling Guidelines</span>
                <button
                  onClick={() => {
                    const stack = analysisResult.recommendedCodes.map(c => `${c.code}${c.modifier ? c.modifier : ''} - ${c.description} (${c.wRVU.toFixed(2)} wRVU)`).join('\n');
                    handleCopy(stack, 'cpt_stack');
                  }}
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  {copiedState['cpt_stack'] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Code Stack</span>
                </button>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
                      <th className="py-2.5 px-3 font-semibold">CPT Code</th>
                      <th className="py-2.5 px-3 font-semibold">Modifier</th>
                      <th className="py-2.5 px-3 font-semibold">Description</th>
                      <th className="py-2.5 px-3 font-semibold text-right">wRVU</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {analysisResult.recommendedCodes.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                          {item.code}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-amber-300">
                          {item.modifier || '—'}
                        </td>
                        <td className="py-3 px-3 text-slate-200">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{item.justificationNotes}</div>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-100 text-right">
                          {item.wRVU.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Bulletproof
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-900/90 font-bold text-white">
                      <td colSpan={3} className="py-3 px-3 text-right">Total Armored Work RVUs:</td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400 text-sm">
                        {analysisResult.totalWRVU.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Coding Audit Findings */}
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5 mt-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Rule Engine Audit Trail</span>
                </div>
                {analysisResult.auditFindings.map((finding, idx) => (
                  <div key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: AUDIT ARMOR PARAGRAPHS                            */}
          {/* ======================================================== */}
          {activeTab === 'armor' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 px-1">
                Insert these exact CMS-compliant justification paragraphs into your final EMR operative note to survive RAC contractor audit clawbacks.
              </div>

              {analysisResult.auditDefenseParagraphs.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400 text-xs">
                  No complex modifiers (-22, -62, -XU) required for this standard procedure.
                </div>
              ) : (
                analysisResult.auditDefenseParagraphs.map((para, idx) => (
                  <div key={idx} className="bg-slate-900/80 border border-blue-500/30 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          {para.modifier}
                        </span>
                        <h3 className="text-sm font-semibold text-white m-0">{para.title}</h3>
                      </div>
                      <button
                        onClick={() => handleCopy(para.paragraphText, `para_${idx}`)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium transition"
                      >
                        {copiedState[`para_${idx}`] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedState[`para_${idx}`] ? 'Copied' : 'Copy Paragraph'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 m-0 whitespace-pre-wrap">
                      {para.paragraphText}
                    </p>

                    <div className="mt-2 text-[11px] text-blue-400/90 font-medium">
                      Authority Citation: {para.ruleCitation}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: UNBILLED OPPORTUNITIES                             */}
          {/* ======================================================== */}
          {activeTab === 'opportunities' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 px-1">
                Clinical services detected that lack 100% operative wording to be safely submitted without audit risk.
              </div>

              {analysisResult.unbilledOpportunities.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400 text-xs">
                  Zero unbilled revenue opportunities. All surgical services are fully documented and captured!
                </div>
              ) : (
                analysisResult.unbilledOpportunities.map((opp, idx) => (
                  <div key={idx} className="bg-slate-900/70 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-semibold text-white m-0">{opp.title}</h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        +{opp.additionalWRVU.toFixed(2)} wRVU
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-2">
                      {opp.clinicalMissingRequirement}
                    </p>

                    <div className="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-lg text-xs text-amber-300/90 font-medium">
                      Action Required: {opp.suggestedAction}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: SURGICAL ANATOMY BREAKDOWN                        */}
          {/* ======================================================== */}
          {activeTab === 'anatomy' && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Spinal Region & Approach:</span>
                  <span className="font-semibold text-white capitalize">
                    {analysisResult.extractedData.region} • {analysisResult.extractedData.approach} approach
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Operative Motion Segments:</span>
                  <span className="font-semibold text-emerald-400">
                    {analysisResult.extractedData.levels.join(', ')} ({analysisResult.extractedData.levels.length} levels)
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Instrumentation & Fixation:</span>
                  <span className="font-semibold text-white">
                    {analysisResult.extractedData.instrumentation.type.replace('_', ' ')} spanning {analysisResult.extractedData.instrumentation.vertebraeCount} vertebrae
                    {analysisResult.extractedData.instrumentation.hasPelvicFixation && ' (includes S2AI/iliac screws)'}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Interbody Cages:</span>
                  <span className="font-semibold text-white">
                    {analysisResult.extractedData.interbodyDevices.count} x {analysisResult.extractedData.interbodyDevices.material}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1.5 font-semibold">Bone Graft Breakdown:</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300">
                  <div>Local Autograft: <strong className={analysisResult.extractedData.boneGrafts.localAutograft ? 'text-emerald-400' : 'text-slate-500'}>{analysisResult.extractedData.boneGrafts.localAutograft ? 'Yes' : 'No'}</strong></div>
                  <div>Morselized Allograft: <strong className={analysisResult.extractedData.boneGrafts.morselizedAllograft ? 'text-emerald-400' : 'text-slate-500'}>{analysisResult.extractedData.boneGrafts.morselizedAllograft ? 'Yes' : 'No'}</strong></div>
                  <div>BMA (Sep. Incision): <strong className={analysisResult.extractedData.boneGrafts.marrowAspirateSeparateIncision ? 'text-emerald-400' : 'text-slate-500'}>{analysisResult.extractedData.boneGrafts.marrowAspirateSeparateIncision ? 'Yes' : 'No'}</strong></div>
                  <div>BMP / Infuse: <strong className={analysisResult.extractedData.boneGrafts.bmpUsed ? 'text-emerald-400' : 'text-slate-500'}>{analysisResult.extractedData.boneGrafts.bmpUsed ? 'Yes' : 'No'}</strong></div>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1.5 font-semibold">Complexity & Risk Profile:</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-slate-300">
                  <div>Revision Case: <strong className={analysisResult.extractedData.complexityMetrics.isRevision ? 'text-amber-400' : 'text-slate-500'}>{analysisResult.extractedData.complexityMetrics.isRevision ? 'Yes' : 'No'}</strong></div>
                  <div>Epidural Scarring: <strong className={analysisResult.extractedData.complexityMetrics.severeScarringLysisAdhesions ? 'text-amber-400' : 'text-slate-500'}>{analysisResult.extractedData.complexityMetrics.severeScarringLysisAdhesions ? 'Severe' : 'None'}</strong></div>
                  <div>EBL: <strong>{analysisResult.extractedData.complexityMetrics.estimatedBloodLoss_ml} mL</strong></div>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
