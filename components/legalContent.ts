// Legal copy for the footer "Terms & Conditions" modal.
//
// Two documents are exposed as tabs:
//   - TERMS_SECTIONS   → General Terms & Conditions (B2B services contract,
//                        transcribed verbatim from "Terms & Conditions 2025 (LTD).docx").
//   - PRIVACY_SECTIONS → Privacy Policy (migrated unchanged from the previous modal).
//
// Content is kept as plain data so the modal stays small and both docs share one
// renderer (see TermsConditions.tsx). The renderer auto-linkifies email addresses
// and bare URLs found in paragraph text — keep those as plain strings here.

export type LegalBlock =
  | { kind: 'p'; lead?: string; text: string } // optional bold lead-in, e.g. "Services:"
  | { kind: 'ul'; items: string[] }
  | { kind: 'address'; lines: string[] }; // boxed postal address

export interface LegalClause {
  heading?: string; // sub-section heading, e.g. "4.1. OFFICIENCE’s General Commitments"
  blocks: LegalBlock[];
}

export interface LegalSection {
  id: string; // section number ("1"…"23"); "" for intro / closing blocks
  title: string; // section title; "" to render no heading at all
  clauses: LegalClause[]; // a first headingless clause acts as the section intro
}

// ─────────────────────────────────────────────────────────────────────────────
// General Terms & Conditions — Officience, 2025 (verbatim)
// ─────────────────────────────────────────────────────────────────────────────
export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: '1',
    title: 'DEFINITIONS',
    clauses: [
      {
        blocks: [
          { kind: 'p', lead: 'Services:', text: `Shall mean all services specified in the Contract/Quotation appended to the present terms and conditions of sale, and more generally all services to be completed by OFFICIENCE in accordance with the present general terms and conditions of sale.` },
          { kind: 'p', lead: 'Deadlines:', text: `Shall mean, in these general terms and conditions of sale, the deadline in working days.` },
          { kind: 'p', lead: 'Information:', text: `Shall mean, in these general terms and conditions of sale, all information, documents or data of any kind (commercial, technical, financial or other), including, without limitation, any drawing, model, study, invention, trade secret, expertise, process, technology, computer program, algorithm, database, programming or software, in whole or part, in any form whatsoever and on any tangible medium whatsoever, including any written, printed or electronic document, as well as any samples or models, whether or not this information is protected or protectable by industrial property rights or copyright.` },
          { kind: 'p', lead: 'Deliverables:', text: `Shall mean, individually or collectively, the products to be delivered by OFFICIENCE in accordance with the present general terms and conditions of sale, including, but not limited to software, documents, an IT product, research, settings etc.` },
          { kind: 'p', lead: 'Party:', text: `Shall mean separately the CLIENT or OFFICIENCE.` },
          { kind: 'p', lead: 'Parties:', text: `Shall mean jointly the CLIENT and OFFICIENCE.` },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'CONTRACTUAL DOCUMENTS',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The services ordered by the CLIENT and carried out by OFFICIENCE under the present Contract shall be regulated exclusively by:` },
          { kind: 'ul', items: [
            `OFFICIENCE’s Contract/Quotation`,
            `The present General Terms (referred to below as ‘the General Terms’)`,
          ] },
          { kind: 'p', text: `In the event of conflict between the provisions of the General Terms and those of the Contract/Quotation, the terms of the Contract/Quotation shall prevail.` },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'PURPOSE',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `These General Terms are intended to determine the technical and financial conditions under which OFFICIENCE agrees to provide the CLIENT with the services defined in the Contract/Quotation appended to these General Terms. Any changes to these General Terms may be made only by amendment and with the agreement of both parties.` },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'OFFICIENCE’S OBLIGATIONS AND COMMITMENTS',
    clauses: [
      {
        heading: '4.1. OFFICIENCE’s General Commitments',
        blocks: [
          { kind: 'p', text: `OFFICIENCE, a company specialising in back-office services, guarantees to be able to ensure the establishment and management of dedicated offshore support. OFFICIENCE shall perform the services in accordance with the professional standards of its sector regarding the techniques and methods to be used. OFFICIENCE commits to take all necessary care for the proper completion of the General Terms, in close collaboration with the CLIENT, and commits to implement the services requested by the CLIENT, under the conditions agreed upon by both parties. OFFICIENCE assumes responsibility for:` },
          { kind: 'ul', items: [
            `Implementing the methods used,`,
            `Monitoring and supervising its own employees,`,
            `The practical organisation of work.`,
          ] },
          { kind: 'p', text: `In order to provide these services, OFFICIENCE commits to respect the methodology described in the Contract/Quotation appended to the present General Terms.` },
        ],
      },
      {
        heading: '4.2. Disclosure',
        blocks: [
          { kind: 'p', text: `OFFICIENCE commits to inform the CLIENT if any difficulties are encountered which could lead to additional time required for completion. In this event, the parties will liaise to determine any corrective action and/or curative measures to be taken.` },
        ],
      },
      {
        heading: '4.3. Continuity of service',
        blocks: [
          { kind: 'p', text: `OFFICIENCE commits under these terms to provide the CLIENT with continuous service except in cases of force majeure, as defined in the ‘Force Majeure’ clause of the present General Terms.` },
          { kind: 'p', text: `If, in the course of carrying out the Services, a difficulty should occur, both Parties shall commit to cooperate in order to define and implement an appropriate solution to resolve the difficulty at the earliest opportunity.` },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'CLIENT OBLIGATIONS AND COMMITMENTS',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The CLIENT warrants having the full authority and rights to enforce these General Terms.` },
          { kind: 'p', text: `The CLIENT commits to collaborate with OFFICIENCE to enable OFFICIENCE to perform all of the services entrusted to them.` },
          { kind: 'p', text: `The Services may be carried out either (a) exclusively on OFFICIENCE sites and with OFFICIENCE’s materials, or (b) principally on CLIENT sites with materials and software supplied wholly or in part by the CLIENT. In the case of (b) the CLIENT shall, for the needs of the present Contract, ensure that OFFICIENCE employees, representatives, agents and subcontractors have full access to its sites and provide them with work areas, data and any other material necessary for the successful completion of the present Contract. The CLIENT shall also put OFFICIENCE employees, representatives, agents and sub-contractors in contact with all necessary persons from the company and the CLIENT for completion of the services.` },
          { kind: 'p', text: `The CLIENT shall authorise and facilitate access to the information required by OFFICIENCE for completion of the Services. The CLIENT may only refuse access to information if access is proven non-essential to completion of the Services. In any case, if OFFICIENCE thinks otherwise, the CLIENT shall be informed of the difficulties and OFFICIENCE will endeavour to minimise any consequences.` },
          { kind: 'p', text: `The CLIENT commits to provide OFFICIENCE, in strictest confidence, with:` },
          { kind: 'ul', items: [
            `Information necessary for best possible understanding of the CLIENT’s services and markets,`,
            `The financial, material, technical and human resources as well as any items necessary to complete the Services.`,
          ] },
          { kind: 'p', text: `The CLIENT is entirely responsible for any materials (texts, music, photographs etc.) provided to OFFICIENCE.` },
          { kind: 'p', text: `The CLIENT must hold the rights to use these materials as part of the Services.` },
          { kind: 'p', text: `The CLIENT agrees to respect the validation timelines set out in the Contract/Quotation appended to the present General Terms.` },
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'FINANCIAL CONDITIONS',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The CLIENT commits to pay the service fee to OFFICIENCE fully and on time as prescribed in the Business Proposal.` },
          { kind: 'p', text: `Pricing conditions and terms of payment are stipulated in the Contract/Quotation appended to these General Terms. A renegotiation of the pricing conditions will take place at the contract’s anniversary dates or in the event of a Contract renewal by both parties.` },
          { kind: 'p', text: `The late payment penalty shall be calculated from the first day of delay in payment on the total amount of the invoice, tax included and multiplied by a late factor. The annual interest rate used for the calculation of late payment penalty is fixed at 8%.` },
          { kind: 'p', text: `In the event of non-payment, OFFICIENCE shall be entitled to terminate the present contract if there is no response eight days after formal notice is served (by corporate email).` },
        ],
      },
    ],
  },
  {
    id: '7',
    title: 'DURATION AND SCHEDULE',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The Contract/Quotation will enter into force upon signature by the CLIENT. The service performance duration, the stages and deadline schedule for the Services are stipulated in the Contract/Quotation appended to these General Terms.` },
          { kind: 'p', text: `Taking into account the Services for which OFFICIENCE is liable, the timelines indicated in the Contract/Quotation appended to the present General Terms for completion of the Services shall remain in any case indicative timelines. OFFICIENCE shall endeavour to respect these but shall not be held responsible if these are not respected, except in cases of serious negligence that can be demonstrated by the CLIENT.` },
          { kind: 'p', text: `In this regard, OFFICIENCE shall not be held liable for any delay originating from the late, incomplete or incorrect submission of information that should have been supplied by the CLIENT, or in the event of force majeure.` },
        ],
      },
    ],
  },
  {
    id: '8',
    title: 'EXTRAORDINARY SERVICES',
    clauses: [
      {
        heading: '8.1. Definition',
        blocks: [
          { kind: 'p', text: `Any service requested by the CLIENT that does not fit within the framework of the Services set forth in the Contract/Quotation, and appendices, be it a change of concept or additional functions that require significant improvements, shall be considered as an Extraordinary Service.` },
          { kind: 'p', text: `All requests for an Extraordinary Service must be made in writing to OFFICIENCE and must detail the changes desired by the CLIENT. The request for extraordinary services will be subject to a quotation which will be carried out only with the agreement of both parties.` },
          { kind: 'p', text: `The Parties will then meet to set a new schedule for completion of those Extraordinary Services.` },
        ],
      },
      {
        heading: '8.2. Pricing conditions for Extraordinary Services',
        blocks: [
          { kind: 'p', text: `All Extraordinary Service requests will be subject to a preliminary estimate of workload and costs. The completion of these Extraordinary Services will be agreed upon and billed in accordance with the terms set out in an amendment to the Quotation signed by the CLIENT, to the Contract and appendices signed by both parties.` },
        ],
      },
    ],
  },
  {
    id: '9',
    title: 'INTELLECTUAL PROPERTY',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `All information provided by the CLIENT of any nature whatsoever and in any format whatsoever (including HTML pages, image files, audio, video, etc.) is and shall remain at all times the property of the CLIENT.` },
          { kind: 'p', text: `OFFICIENCE shall transfer all economic rights to the Deliverables exclusively to the CLIENT, with all the associated legal and de facto warranties, including usage, publication, marketing, reproduction, representation and adaptation rights. This transfer of rights includes the entire legal term of protection of intellectual property rights applicable to each of the deliverables. The present transfer is also granted globally.` },
          { kind: 'p', text: `The costs of the present transfer are fixed and definitively included in the cost of the Services in question.` },
        ],
      },
    ],
  },
  {
    id: '10',
    title: 'GUARANTEE',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The CLIENT guarantees that all materials provided to OFFICIENCE for the Services are not illegal and do not violate third party rights in any way.` },
          { kind: 'p', text: `OFFICIENCE guarantees that the Services and Deliverables created for and provided to the CLIENT respect third party rights and are not illegal. In the event that OFFICIENCE calls on external parties to carry out all or part of the Services, it shall have obtained all necessary rights and authorisations allowing it to complete the present Contract.` },
          { kind: 'p', text: `OFFICIENCE will not be held responsible for any damages encountered by the CLIENT following any modifications to the Services made by the CLIENT or any other person who is not an OFFICIENCE employee.` },
        ],
      },
    ],
  },
  {
    id: '11',
    title: 'NON-SOLICITATION',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The PARTIES, by express agreement, agree not to employ or to work in any way with a present or future employee of the other PARTY. This provision shall apply whatever the specialisation of the employee in question and even where the solicitation is at that employee’s own initiative.` },
          { kind: 'p', text: `This provision shall apply for the entire duration of these General Terms and for one year following. In the event of a failure to comply with this non-solicitation clause, the concerned PARTY agrees to pay to the other PARTY a fixed indemnification equal to the gross annual salary that each employee concerned received before his/her departure.` },
        ],
      },
    ],
  },
  {
    id: '12',
    title: 'CONFIDENTIALITY',
    clauses: [
      {
        heading: '12.1. Definition',
        blocks: [
          { kind: 'p', text: `OFFICIENCE and the CLIENT agree to maintain the confidentiality of any information declared as such by the other Party, whatever its nature (financial, technical, commercial, etc.) to which they may have had access during the completion of these General Terms. Both Parties shall take all necessary measures regarding their staff to ensure the confidentiality of all the Information under their responsibility. The provisions of the present General Terms and appendices made between OFFICIENCE and the CLIENT, and any production, sales, support, and/or maintenance forecast shall be deemed to be confidential and as such shall not be published or disclosed to unauthorised third parties without the express consent of the Parties.` },
        ],
      },
      {
        heading: '12.2. Exclusions',
        blocks: [
          { kind: 'p', text: `Notwithstanding anything to the contrary, the provisions of this article shall not apply to any Information which:` },
          { kind: 'ul', items: [
            `Prior to its disclosure is legitimately known by the Party who receives it, or`,
            `Is lawfully obtained from a third party without obligation of confidentiality by the party who receives it, or,`,
            `Is made public by the party to whom it belongs without any restrictions, or,`,
            `Is developed independently by one of the parties without any use and/or reference to the Confidential Information of the other party, or,`,
            `Is disclosed by the party who has previously received it with the prior written consent of the party to which it belongs.`,
          ] },
        ],
      },
      {
        heading: '12.3. Use',
        blocks: [
          { kind: 'p', text: `Each party will disclose Confidential Information only to employees who require such Confidential Information to perform the task assigned to them in order to complete the Services and purpose of the Contract/Quotation. Those employees shall be systematically informed of the confidential nature of such information. Without limiting the general principle stated above, the party receiving the Confidential Information shall take the same degree of caution (and at least a reasonable degree of caution) to prevent the unauthorised use, disclosure or publication of said Information, as it takes to protect its own Confidential Information of similar nature.` },
        ],
      },
    ],
  },
  {
    id: '13',
    title: 'PARTIAL INVALIDITY',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `If one or several provisions in these General Terms are deemed to be invalid or are declared as such in accordance with legal or regulatory provisions or following a definitive decision by the competent court, all other provisions shall remain in full force and effect. However, if there is a substantial change that may affect the equilibrium of this Contract, the Parties shall agree new terms with equivalent effect by means of amendment as soon as possible.` },
        ],
      },
    ],
  },
  {
    id: '14',
    title: 'FORCE MAJEURE',
    clauses: [
      {
        heading: '14.1. Definition',
        blocks: [
          { kind: 'p', text: `The concept of force majeure shall be interpreted according to the law, particularly anything external, unforeseeable and insurmountable to the party asserting it. Explicitly considered as force majeure, besides those normally accepted by case law, are partial or total strikes, whether internal or external to the company, lockout, bad weather, epidemics, transport or supply difficulties, for whatever reason, earthquakes, fires, storms, floods, water damages, government or legal restrictions, legal or regulatory changes to forms of marketing, computer failure, interruption of telecommunications including the dial-up network, and any other cause beyond the reasonable control of the parties preventing the normal execution of the present contract.` },
        ],
      },
      {
        heading: '14.2. Application',
        blocks: [
          { kind: 'p', text: `Neither party shall be liable where there has been no negligence and/or fault on their part, in the event that the cause of a delay or failure to fulfil their obligations may be defined as a case of force majeure.` },
        ],
      },
      {
        heading: '14.3. Disclosure',
        blocks: [
          { kind: 'p', text: `In the event of force majeure, OFFICIENCE shall immediately inform the CLIENT, in writing where possible, of the event and measures taken to minimise if not avoid any consequences to the fulfilment of its obligations.` },
        ],
      },
      {
        heading: '14.4. Effects',
        blocks: [
          { kind: 'p', text: `If a force majeure event lasts for a period of longer than fourteen days, the CLIENT may request the termination of work in progress affected by this event without penalty or compensation. If the force majeure event lasts for a period longer than three months, the present Contract may be terminated by mutual agreement. In such a case, the CLIENT shall pay all sums due for those Services already completed.` },
        ],
      },
    ],
  },
  {
    id: '15',
    title: 'LIABILITY',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Any requirements not stated by the CLIENT shall be excluded from the scope of OFFICIENCE’s liability.` },
          { kind: 'p', text: `In the event that any files, data, programs etc. or any other Information is assigned to OFFICIENCE by the CLIENT, it shall be the CLIENT’s responsibility to safeguard, where necessary, against the risks of loss or accident by keeping a copy of all materials submitted to OFFICIENCE. Moreover it is the CLIENT’s responsibility to ensure regular back-up of the digital work areas concerned. OFFICIENCE will accept no liability in the event of any damage to such materials.` },
          { kind: 'p', text: `OFFICIENCE shall not be held liable for:` },
          { kind: 'ul', items: [
            `any material damage that may be caused to buildings, facilities, equipment, furniture, through its own actions or those of its representatives,`,
            `any damage to the installation, operation or use of the software by the CLIENT,`,
            `any consequences of a lack of collaboration and information on the part of the CLIENT.`,
          ] },
          { kind: 'p', text: `OFFICIENCE shall be held liable for all damages as result of proven negligence. In this case, any compensation, by mutual agreement between the Parties, shall not exceed that amount actually received by OFFICIENCE for the services multiplied by 4 times for which it accepts liability at the time of the relevant event and whatever the legal basis in question.` },
        ],
      },
    ],
  },
  {
    id: '16',
    title: 'INDEPENDENCE',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `OFFICIENCE shall act in its own name and on its own behalf.` },
          { kind: 'p', text: `None of the provisions in this Contract shall be construed as creating a sales contract, a subsidiary, an agency relationship or employee-employer relationship between the CLIENT and OFFICIENCE. Each Party shall act in all circumstances as an independent entity towards the other as well as towards any third party. Under no circumstances shall these General Terms be construed as an intention to create any incorporated or de facto company between the Parties.` },
        ],
      },
    ],
  },
  {
    id: '17',
    title: '‘INTUITU PERSONAE’',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `As the Contract is drawn up ‘intuitu personae’, the Parties shall not assign or transfer all or part of the obligations conferred upon them by the present terms, without the express consent of the other Party.` },
        ],
      },
    ],
  },
  {
    id: '18',
    title: 'INSURANCE',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `OFFICIENCE holds a public liability insurance policy for which it will supply the details at the express request of the CLIENT.` },
          { kind: 'p', text: `OFFICIENCE shall only be held responsible for its employees for work carried out by the latter under the completion of the present General Terms and solely in the event that any negligence can be held against OFFICIENCE or its staff.` },
          { kind: 'p', text: `For the duration of the Services, the CLIENT shall safeguard all its equipment and facilities including that which is made available to OFFICIENCE employees in order to complete the work set out in the Contract. It is the CLIENT’s responsibility to insure themselves against any risk and direct or indirect damages that could affect such equipment and facilities. Therefore, OFFICIENCE shall be released from all responsibility for any damage that the provider’s employees may unintentionally cause during completion of the work, unless there is a proven case of gross negligence on their part.` },
        ],
      },
    ],
  },
  {
    id: '19',
    title: 'ENTIRE AGREEMENT',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `These General Terms concluded between OFFICIENCE and the CLIENT, as well as their appendices, express the full obligations of both parties. No other reference or document (general terms etc.) shall give rise to obligations hereunder, unless they are the subject of an amendment signed by both Parties. This shall also include, but is not limited to: terms specified on invoices, commercial documents or any letters sent directly or indirectly by one party to another. No other technical, marketing or sales document of any kind or any correspondence prior to the signing of the Contract shall generate obligations under the aforementioned Contract. The two parties shall explicitly agree that all existing provisions in any previous contract pertaining to the same object as the present General Terms are invalidated and superseded by the provisions of these General Terms.` },
        ],
      },
    ],
  },
  {
    id: '20',
    title: 'GENERAL PROVISIONS',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `No exercise or enforcement by either Party of any right or remedy under these Terms and Conditions will preclude the enforcement by such Party of any other right or remedy under these Terms and Conditions.` },
          { kind: 'p', text: `OFFICIENCE will be free to sub-contract all or some of the obligations under the Contract. OFFICIENCE hereby represents and warrants that it has sufficient expertise in new communication technologies to design and implement these services for the CLIENT under optimal conditions.` },
          { kind: 'p', text: `All notifications, communications and formal notices provided for under the General Terms shall be deemed to be validly delivered to OFFICIENCE if sent by registered letter with an acknowledgement of receipt to the following address:` },
          { kind: 'address', lines: [`16A Le Hong Phong, Ward 12, District 10, Ho Chi Minh City, Vietnam`] },
          { kind: 'p', text: `Such notification shall take effect on the day on which the registered letter is first received.` },
        ],
      },
    ],
  },
  {
    id: '21',
    title: 'TRANSFER OF RISK AND OWNERSHIP',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The transfer of risk of the Deliverables shall take place from OFFICIENCE to the CLIENT at the time of the physical transfer of the Deliverables to the CLIENT.` },
          { kind: 'p', text: `The transfer of ownership of the Deliverables shall take place when the Deliverables in question have been paid for.` },
        ],
      },
    ],
  },
  {
    id: '22',
    title: 'TERMINATION OF THE CONTRACT',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Failure by either party to meet any of the obligations in the present agreement not remedied within 30 days following the registered letter with acknowledgement of receipt notifying the claimed defects, shall entitle the other party to terminate the contract without prejudice to any claims for damages and compensation. If the termination is due to failure by OFFICIENCE, the latter shall return to the CLIENT all documents in its possession regarding work carried out under these General Terms.` },
        ],
      },
    ],
  },
  {
    id: '23',
    title: 'DISPUTE RESOLUTION',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Any issue of general contract law shall be interpreted solely in accordance with the laws of Vietnam, without reference to any conflict of laws principles.` },
          { kind: 'p', text: `Prior to any legal action, the parties undertake to negotiate an amicable agreement in a spirit of loyalty and good faith in the event of any dispute relating to this Contract, including regarding its validity. The Party seeking to begin the negotiation process shall inform the other party by registered letter with acknowledgment of receipt setting out the details of the dispute.` },
          { kind: 'p', text: `If, after a period of two months, the parties cannot reach an agreement, the dispute shall be submitted to the competent court referred to below.` },
          { kind: 'p', text: `Exclusive jurisdiction is assigned to the competent court in Ho Chi Minh City for their validity, interpretation, implementation or termination, whether or not there are multiple respondents, or recourse under warranty, request or appeals procedures.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: '',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `General Terms and Conditions – Officience, 2025.` },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Privacy Policy (migrated unchanged from the previous Terms modal)
// ─────────────────────────────────────────────────────────────────────────────
export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: '',
    title: 'General Information',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Your privacy is of utmost importance to Officience Co., Ltd.` },
          { kind: 'p', text: `This privacy policy (the "Policy") describes the Personal Data which Officience collects about you through your use of the Platforms. It also sets out how Officience uses, discloses and protects this data.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Scope of this Policy',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `This Policy applies to all Personal Data processed online by Officience through all its websites, applications and domains, which include but are not limited to the following: www.officience.com` },
        ],
      },
    ],
  },
  {
    id: '1',
    title: 'Definitions',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `For the purposes of this Policy:` },
          { kind: 'p', lead: 'Personal Data', text: `means any information relating to an identified or identifiable natural person, where an identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person; and` },
          { kind: 'p', lead: 'Process, processed and processing', text: `means any operation or set of operations which is performed on Personal Data or on sets of Personal Data, whether or not by automated means, such as collection, recording, organisation, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction.` },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Personal Data Collected by Officience',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Officience will NOT collect Personal Data about an individual including any following mentioned categories, except contact email address which it reasonably considers necessary for the relevant purposes underlying such processing.` },
          { kind: 'p', text: `Examples of your Personal Data which may NOT be collected by us:` },
          { kind: 'ul', items: [
            `Your name, telephone number, mailing address, transaction details and any other information which you have provided to us in any forms you may have submitted to us or in other forms of interaction with you; and`,
            `Information about your usage of and interaction with the Platforms, including traffic data, location data, the originating domain name of your internet service provider, statistics on page views, cookies and IP addresses.`,
          ] },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'How We Collect Your Personal Data',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `We use different methods to collect data about you, including the following:` },
          { kind: 'p', lead: 'Direct interactions.', text: `You may give us your Personal Data by filling in forms or by corresponding with us by post, phone, email, chatbot or otherwise. We may also directly collect Personal Data in other ways, including when:` },
          { kind: 'ul', items: [
            `You apply for our products or services;`,
            `You create an account on our Platforms;`,
            `You subscribe to our service or publications;`,
            `You request marketing to be sent to you;`,
            `You enter a competition, promotion or survey;`,
            `You give us feedback;`,
            `You log on to Wi-Fi at our premises;`,
            `You use mobile or web applications developed by us;`,
            `You submit your resume or an application, or participate in interviews or testing, for employment or contracting opportunities with Officience.`,
          ] },
          { kind: 'p', lead: 'Automated technologies or interactions.', text: `As you interact with our Platforms, we may automatically collect technical data about your equipment, browsing actions and patterns. We collect this data by using cookies, server logs and other similar technologies.` },
          { kind: 'p', lead: 'Third parties or publicly available sources.', text: `We may receive Personal Data about you from various third parties and public sources, including financial and transaction data from providers of technical, payment and delivery services.` },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'How We Use Your Personal Data',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Your Personal Data is generally processed by us as necessary for purposes directly related to our functions and activities. This includes any one or more of the following purposes:` },
          { kind: 'ul', items: [
            `To provide you with services and to help us develop, improve, manage and administer the services we provide to you, including services provided on and through our Platforms and Wi-Fi services;`,
            `To help us verify your identity for the purposes of processing and administering any membership application or registration;`,
            `To send you notifications and marketing messages in relation to our promotional events, offers, opportunities, products, benefits and programmes;`,
            `To conduct marketing activities including market research, customer profiling, customer insights and targeted marketing activities;`,
            `To carry out profiling and statistical analysis to improve the services provided to you;`,
            `To inform you of changes to our programmes, policies, terms and conditions, Platform updates and other administrative information;`,
            `To conduct surveys, questionnaires and requests for feedback;`,
            `To respond to your queries, requests, feedback and complaints;`,
            `For promotional and publicity purposes, including to record or take photographs of participants at events or functions organised, hosted or participated in by Officience;`,
            `To meet the requirements of any applicable laws/regulations, enforceable governmental request or court order;`,
            `To detect, prevent or otherwise address security or technical issues in connection with services provided through the Platforms; and/or`,
            `To fulfil such other purpose as may be specified in a data protection and privacy notice given to you at the time your Personal Data is collected.`,
          ] },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'Disclosure of Your Personal Data',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `In carrying out one or more of the purposes set out above, we may need to disclose your Personal Data to one or more of the following third parties:` },
          { kind: 'ul', items: [
            `Our engagement team and/or agents;`,
            `Our authorised service providers such as marketing partners and web analysis companies, and their business partners;`,
            `Our auditors and professional advisors;`,
            `Our business partners;`,
            `Law enforcement agencies;`,
            `Any person to whom disclosure is permitted or required by any applicable laws/regulations, enforceable governmental request or court order; and/or`,
            `Any companies comprised in our group.`,
          ] },
          { kind: 'p', text: `We impose strict obligations on the third parties mentioned above with which we share your Personal Data to maintain the integrity and security of that data.` },
          { kind: 'p', text: `We only allow the said third parties to use your Personal Data for specified purposes and in accordance with our instructions.` },
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'Legal Basis for Processing Your Personal Data',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The legal basis for the processing of your Personal Data will generally fall under one or more of the following:` },
          { kind: 'ul', items: [
            `It is necessary for the performance of Officience's contractual relationship with you, which is regulated by the applicable terms and conditions governing the use of the Platforms and by the specific forms collecting your data;`,
            `It is necessary for our legitimate interests;`,
            `It is necessary to comply with our legal obligations;`,
            `It is authorised under any applicable law or regulations; and/or`,
            `You are deemed to have consented to such processing under any applicable law or regulations.`,
          ] },
          { kind: 'p', text: `Please note that we may process your Personal Data for more than one lawful ground depending on the specific purpose(s) for which we are using your data. Please contact us if you need details about the specific legal ground(s) we are relying on to process your Personal Data.` },
        ],
      },
    ],
  },
  {
    id: '7',
    title: 'Consent',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Where the processing of your Personal Data does not fall under one of the bases set out above, we will obtain express written consent from you for such processing by methods or means which include making you sign a form or check a box.` },
          { kind: 'p', text: `You can withdraw such express consent at any time by contacting our data protection officer at the contact details set out in Section 14 of this Policy.` },
          { kind: 'p', text: `Depending on the extent to which you withdraw consent to the processing of your Personal Data by us, such withdrawal of consent may result in our inability to provide the relevant services to you and may be considered as a termination by you of any agreement between Officience and you. Officience's legal rights and remedies are expressly reserved in such an event.` },
        ],
      },
    ],
  },
  {
    id: '8',
    title: 'Links to Third-Party Websites',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `We may provide links to third-party websites on the Platforms. Your use of such third-party websites will be subject to their privacy policies and is not covered by this Policy. We encourage you to read the privacy policies on the other websites you visit. As we cannot control or be responsible for the policies of other sites we may link to, or the use of any data you may share with them, you access these third-party websites at your own risk.` },
        ],
      },
    ],
  },
  {
    id: '9',
    title: 'Keeping Your Personal Data Secure',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `We will use reasonable technical and procedural measures to safeguard your Personal Data, for example by:` },
          { kind: 'ul', items: [
            `Ensuring that access to any personal account you have with us is controlled by a password and username which are unique to you;`,
            `Storing your Personal Data on secured servers; and`,
            `Restricting access to Personal Data on a 'need to know' basis.`,
          ] },
          { kind: 'p', text: `Whilst we will use all reasonable efforts to safeguard your Personal Data, please note that the use of the internet and/or our Platforms cannot be made entirely secure and we therefore are unable to guarantee the security or integrity of any Personal Data which is transferred from you or to you via the Platforms.` },
        ],
      },
    ],
  },
  {
    id: '10',
    title: 'Access to Personal Data',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Whilst we will take reasonable steps to accurately record your Personal Data, we require that you provide accurate and complete Personal Data, and update such Personal Data with us from time to time.` },
          { kind: 'p', text: `You may request access to, and correction of your Personal Data held by us by contacting us at the contact details set out in Section 14 of this Policy. All requests for access and/or correction will be processed within a reasonable time except where we refuse such requests in accordance with any applicable laws or regulations. In some situations, you may be able to access and correct your personal information directly through our Platforms.` },
        ],
      },
    ],
  },
  {
    id: '11',
    title: 'Further Rights of Data Subjects in the European Union ("EU")',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `If you are a data subject in the EU, you may contact us to exercise the following further rights:` },
          { kind: 'ul', items: [
            `Request for the erasure of your Personal Data;`,
            `Request for the restriction of processing of your Personal Data;`,
            `Object to the processing of your Personal Data; and/or`,
            `Request to transfer your personal Data to you or a third-party.`,
          ] },
          { kind: 'p', text: `You also have the right to lodge a complaint with the relevant EU supervisory authority if we have contravened any applicable laws or regulations.` },
          { kind: 'p', text: `All requests made to us in exercising the rights above will be processed within a reasonable time except where we refuse such requests in accordance with any applicable laws or regulations.` },
        ],
      },
    ],
  },
  {
    id: '12',
    title: 'Data Retention',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `We will cease to retain your Personal Data when the purposes for which we collected your Personal Data have ceased and/or when we are no longer required to continue retaining your Personal Data for any legal or business purposes.` },
        ],
      },
    ],
  },
  {
    id: '13',
    title: 'Changes to This Policy',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `We may amend this Policy (including the Cookies Policy) from time to time. The updated versions will be posted on our Platforms and date stamped so that you are aware of when the Policy was last updated. If we make significant amendments to the Policy, we will notify you in advance and allow you the opportunity to review the revised Policy prior to such changes taking effect. We also recommend that you check the relevant websites or sections of the Platforms regularly for any updates.` },
        ],
      },
    ],
  },
  {
    id: '14',
    title: 'How to Contact Us',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `We welcome your feedback, comments and any questions that you may have.` },
          { kind: 'p', text: `If you wish to contact us, please write to us at the address below referencing 'Privacy Policy':` },
          { kind: 'address', lines: [
            `Data Protection Officer`,
            `Officience Co., Ltd`,
            `16A Le Hong Phong, Ward 15, District 10,`,
            `Ho Chi Minh City, Viet Nam, 700000`,
          ] },
          { kind: 'p', text: `Or email data.protection@officience.com referencing 'Privacy Policy'.` },
          { kind: 'p', text: `Alternatively, for specific queries, you can send us an email at: Contact@officience.com` },
        ],
      },
    ],
  },
];
