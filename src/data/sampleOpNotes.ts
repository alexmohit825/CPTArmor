export interface SampleOpNote {
  id: string;
  title: string;
  procedureType: string;
  expectedCodes: string[];
  rawText: string;
}

export const SAMPLE_OP_NOTES: SampleOpNote[] = [
  {
    id: 'case-1-revision-tlif',
    title: 'Case 1: L4-S1 Complex Revision TLIF with Scarring & Hardware Removal',
    procedureType: 'Lumbar Revision Interbody Fusion',
    expectedCodes: ['22633-22', '22634', '22842', '22853 x2', '22852-59', '20936', '20930'],
    rawText: `OPERATIVE REPORT
Patient Name: Jane Doe
MRN: 8492014
Date of Birth: 04/12/1971
Date of Surgery: October 14, 2026
Surgeon: Dr. A. Alex Mohit
Assistant: Marcus Vance, PA-C
Facility: Swedish Medical Center - Cherry Hill

PREOPERATIVE DIAGNOSIS:
1. Lumbar post-laminectomy syndrome with recurrent stenotic radiculopathy at L4-L5 and L5-S1.
2. Prior posterior fusion with loose bilateral L5-S1 pedicle screw hardware.
3. High-grade degenerative spondylolisthesis at L4-L5.
4. Morbid obesity (BMI 41.2).

POSTOPERATIVE DIAGNOSIS:
Same as preoperative.

PROCEDURES PERFORMED:
1. Re-exploration of prior lumbar surgical site with extensive lysis of epidural adhesions.
2. Removal of posterior segmental instrumentation (prior bilateral L5-S1 pedicle screws and rods).
3. Transforaminal lumbar interbody fusion (TLIF), L4-L5 and L5-S1.
4. Posterior segmental pedicle screw instrumentation, L4, L5, and S1 (spanning 3 vertebral segments).
5. Insertion of interbody biomechanical devices (PEEK cages) with autograft and allograft packing, L4-L5 and L5-S1.
6. Local morselized autograft and demineralized bone matrix allograft placement in posterolateral gutters.
7. Operating microscope utilization for neural decompression and durotomy scar dissection.

ANESTHESIA: General endotracheal.
ESTIMATED BLOOD LOSS: 450 mL.
OPERATIVE TIME: 275 minutes (typical benchmark is 150 minutes).
COMPLICATIONS: None. Neuromonitoring baseline maintained throughout.

OPERATIVE TECHNIQUE IN DETAIL:
The patient was transferred to the operating room and intubated without incident. Neuromonitoring leads for MEPs and SSEPs were connected. She was carefully positioned prone on a radiolucent Jackson table with all bony prominences meticulously padded. The previous midline lumbar incision was identified and prepped and draped in standard sterile fashion.

A midline incision was made through the prior scar. Dissection was carried down through subcutaneous tissue. Due to patient's morbid obesity (BMI 41.2), extended deep exposure retractors were placed. Dense, fibrous cicatricial scarring was encountered directly overlying the prior L5-S1 laminectomy defect. The dura was intimately adherent to the overgrown scar tissue. The operating microscope was brought into the sterile field. A tedious, painstaking microscopic lysis of adhesions was performed over 95 minutes to liberate the thecal sac and descending traversing nerve roots without laceration or dural injury.

Prior pedicle screw tulip caps were identified at L5 and S1. The set screws were loosened and the 5.5 mm titanium rods were extracted. The bilateral L5 and S1 pedicle screws were backed out and removed in their entirety without bone destruction. 

We then proceeded with pedicle screw cannulation at L4, L5, and S1 using navigation and fluoroscopic guidance. Robust bone purchase was confirmed across all 6 pedicles.

Attention was turned to interbody preparation. At L4-L5, an aggressive complete discectomy was performed under microscopic visualization. The cartilaginous endplates were systematically prepared using curettes and rasps until bleeding subchondral bone was exposed. A trial spacer was sized to 10 mm with 8 degrees of lordosis. A PEEK interbody cage packed with local morselized autograft from the bone mill and DBM allograft was seated firmly into the L4-L5 disc space under lateral fluoroscopy.

Attention was then directed to L5-S1. The scarred S1 nerve root was gently mobilized medially. A complete discectomy and endplate decortication was executed. A 12 mm lordotic PEEK interbody cage filled with autograft and allograft was impacted into the L5-S1 interspace.

Contoured dual titanium rods were placed into the L4, L5, and S1 pedicle screw heads. Moderate compression was applied across L4-L5 and L5-S1 to induce lordosis and lock the interbody cages under compression. Set screws were torqued to final calibration. Local bone fragments harvested from the decompression were milled and combined with morselized allograft and packed into the decorticated posterolateral gutters bilaterally.

Hemostasis was achieved. Neuromonitoring remained at baseline. The wound was closed in anatomical layers.`
  },
  {
    id: 'case-2-acdf-cervical',
    title: 'Case 2: C5-C7 Anterior Cervical Discectomy & Fusion (ACDF)',
    procedureType: 'Cervical Interbody Arthrodesis',
    expectedCodes: ['22551', '22552', '22845', '22853 x2', '20936', '20930'],
    rawText: `OPERATIVE REPORT
Patient Name: Robert Taylor
MRN: 7120934
Date of Birth: 11/24/1968
Date of Surgery: October 10, 2026
Surgeon: Dr. A. Alex Mohit
Facility: Swedish Neuroscience Institute

PREOPERATIVE DIAGNOSIS:
Cervical spondylotic myelopathy and bilateral C6 and C7 radiculopathy with multi-level cord compression at C5-C6 and C6-C7.

POSTOPERATIVE DIAGNOSIS:
Same as preoperative.

PROCEDURES PERFORMED:
1. Anterior cervical discectomy and interbody arthrodesis (ACDF), C5-C6 and C6-C7 (two interspaces).
2. Anterior cervical locking plate instrumentation spanning 3 vertebral segments (C5, C6, C7).
3. Insertion of interbody biomechanical devices (PEEK cages x 2).
4. Local autograft and morselized allograft bone placement.
5. Operating microscope microdissection.

ANESTHESIA: General endotracheal.
ESTIMATED BLOOD LOSS: 40 mL.
OPERATIVE TIME: 115 minutes.

PROCEDURE NARRATIVE:
The patient was placed supine. A standard transverse anterior cervical incision was made along a skin crease on the right side. Platysma was divided. Blunt dissection was carried through the avascular plane between the carotid sheath laterally and the trachea/esophagus medially. Prevertebral fascia was opened, exposing C5, C6, and C7.

At C5-C6, Caspar pins were placed. Complete discectomy was performed under the operating microscope. Posterior osteophytes were resected using a 3 mm high-speed burr and Kerrison rongeurs. The posterior longitudinal ligament was resected, completely decompressing the thecal sac and bilateral C6 nerve roots. Cartilaginous endplates were decorticated. A 6 mm PEEK interbody cage filled with local bone and DBM allograft was placed into the disc space.

At C6-C7, an identical thorough discectomy and canal decompression was performed. The bilateral C7 roots were confirmed free. A 6 mm PEEK cage with graft was impacted into place.

A 42 mm anterior cervical plate was contoured and secured to the anterior vertebral bodies of C5, C6, and C7 with variable angle screws, spanning 3 vertebral segments. Rigid fixation was verified. Hemostasis was immaculate. The wound was closed in layers over a flat drain.`
  },
  {
    id: 'case-3-lateral-llif-co-surgeon',
    title: 'Case 3: L3-L5 Lateral Lumbar Interbody Fusion (LLIF) with Co-Surgeon Access',
    procedureType: 'Lateral Lumbar Arthrodesis',
    expectedCodes: ['22558-62', '22559-62', '22842', '22853 x2', '20930'],
    rawText: `OPERATIVE REPORT
Patient Name: Harold Evans
MRN: 9021482
Date of Birth: 08/03/1959
Date of Surgery: September 28, 2026
Spine Surgeon: Dr. A. Alex Mohit
Access / Approach Co-Surgeon: Dr. Kevin Patterson (General / Vascular Surgery)
Facility: Swedish Medical Center

PROCEDURE PERFORMED:
1. Lateral transpsoas retroperitoneal interbody fusion (LLIF), L3-L4 and L4-L5 (two interspaces).
2. Co-surgeon retroperitoneal approach (-62).
3. Insertion of lateral titanium interbody cages x 2.
4. Placement of morselized allograft matrix.
5. Second stage: Posterior percutaneous pedicle screw fixation, L3-L5 (3 vertebral segments).

OPERATIVE TIME: 210 minutes.
ESTIMATED BLOOD LOSS: 120 mL.

PROCEDURAL SUMMARY:
The patient was positioned in the right lateral decubitus position. Dr. Kevin Patterson, General Surgery co-surgeon, performed the retroperitoneal flank exposure, identified the retroperitoneal fat plane, mobilized the peritoneal contents anteriorly, and docked the tubular retractor directly onto the lateral psoas fascia with electromyographic nerve monitoring.

Dr. Alex Mohit, Spine Surgeon, then took over the operative field. Under direct fluoroscopy, dilators were placed through the safe anterior third of the psoas muscle. Neuromonitoring stimulated at >25 mA with no proximity to the lumbar plexus. At L3-L4, annulotomy was made. An orthogonal discectomy was performed and the contralateral annulus released. A 10x18x55 mm titanium interbody cage packed with allograft matrix was impacted under true AP and lateral fluoroscopy.

At L4-L5, the retractor was repositioned. An identical lateral discectomy and endplate preparation was completed. A 12x18x55 mm titanium cage with allograft was placed.

Dr. Patterson then inspected the retroperitoneal space, confirmed absolute hemostasis, and closed the flank incision in multiple layers.

The patient was subsequently flipped prone. Percutaneous pedicle screws were placed at L3, L4, and L5 bilaterally under robotic guidance. Pre-bent rods were passed and set screws tightened to 90 in-lbs.`
  },
  {
    id: 'case-4-deformity-pelvic-fixation',
    title: 'Case 4: L2-L5 Fusion with Separate Trochar BMA & Pelvic S2AI Fixation',
    procedureType: 'Complex Lumbar / Pelvic Arthrodesis',
    expectedCodes: ['22633', '22634 x2', '22843', '22848', '22853 x3', '20937', '20936'],
    rawText: `OPERATIVE REPORT
Patient Name: Margaret Miller
MRN: 4810294
Date of Birth: 02/19/1955
Date of Surgery: October 02, 2026
Surgeon: Dr. A. Alex Mohit
Facility: Swedish Cherry Hill

PROCEDURES PERFORMED:
1. Multi-level posterior lumbar decompression and interbody fusion (TLIF), L2-L3, L3-L4, L4-L5.
2. Posterior segmental instrumentation spanning 7 vertebral segments (L1 to S1, with bilateral S2AI pelvic screws).
3. Pelvic fixation with bilateral S2 alar iliac (S2AI) screws attached to spinal rods (+22848).
4. Insertion of 3 PEEK interbody cages.
5. Percutaneous trochar harvest of bone marrow aspirate from the posterior iliac crest through a separate skin incision (+20937).
6. Local morselized laminar autograft (+20936).

OPERATIVE TIME: 320 minutes.
ESTIMATED BLOOD LOSS: 500 mL.

PROCEDURE IN BRIEF:
Following prone positioning on a radiolucent frame, a separate 1 cm stab incision was made over the right posterior superior iliac crest. A Jamshidi needle was advanced into the marrow cavity and 30 mL of rich bone marrow aspirate was harvested and mixed with allograft matrix.

The midline lumbar spine was exposed from L1 to sacrum. Transverse processes and facet joints were decorticated. Bilateral pedicle screws were placed from L1 to S1. Bilateral 8.5 x 80 mm S2AI pelvic screws were placed into the ilium and connected to the main longitudinal rods via modular connectors.

TLIF interbody cages packed with BMA and local autograft were seated at L2-L3, L3-L4, and L4-L5 following complete microscopic discectomies. Final tightening achieved solid construct rigidity.`
  }
];
