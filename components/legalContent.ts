// Legal copy for the footer "Terms & Conditions" modal.
//
// Two documents are exposed as tabs:
//   - TERMS_SECTIONS   → Terms of Use (transcribed from "Terms of Use (draft).docx").
//   - PRIVACY_SECTIONS → Privacy Policy (transcribed from "Privacy Policy (draft).docx").
//
// Content is kept as plain data so the modal stays small and both docs share one
// renderer (see TermsConditions.tsx). The renderer auto-linkifies email addresses
// and bare URLs found in paragraph text — keep those as plain strings here.

export type LegalBlock =
  | { kind: 'p'; lead?: string; text: string } // optional bold lead-in, e.g. "Services:"
  | { kind: 'ul'; items: string[] }
  | { kind: 'address'; lines: string[] }; // boxed postal address

export interface LegalClause {
  heading?: string; // sub-section heading, e.g. "1.1. Interpretation"
  blocks: LegalBlock[];
}

export interface LegalSection {
  id: string; // section number prefix; "" renders just the title (or no heading at all)
  title: string; // section title; "" to render no heading at all
  clauses: LegalClause[]; // a first headingless clause acts as the section intro
}

// ─────────────────────────────────────────────────────────────────────────────
// Terms of Use — Officience (verbatim from draft)
// ─────────────────────────────────────────────────────────────────────────────
export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: '',
    title: 'Introduction',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Welcome to Officience. These Terms of Use ("Terms") govern your access to and use of our website and services, which include the content, features, and tools available on or through https://www.officience.com (the "Website"). By using or interacting with the Website, you acknowledge that you have read, understood, and agreed to be bound by these Terms, as well as our Privacy Policy. If you do not agree to these Terms, we kindly ask that you refrain from using the Website.` },
          { kind: 'p', text: `Please be aware that we may update or modify these Terms from time to time. Any changes will be effective immediately upon posting on this page. It is important for you to review these Terms periodically to stay informed of any updates. Your continued use of the Website after any modifications signifies your acceptance of the revised Terms.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Definitions',
    clauses: [
      {
        blocks: [
          { kind: 'p', lead: 'Company:', text: `Refers to Officience (referred to as "We", "Us", or "Our").` },
          { kind: 'p', lead: 'User:', text: `Refers to anyone who accesses, browses, or interacts with the Website (referred to as "You" or "Your").` },
          { kind: 'p', lead: 'Service(s):', text: `Refers to the products, content, interactive multi-step forms, and tools provided by Officience through the Website.` },
          { kind: 'p', lead: 'User Submissions:', text: `Refers to any and all information, text, graphics, resumes/CVs, portfolio links, company details, and other materials submitted, uploaded, or provided by the User through the Website's interactive forms (including but not limited to Business Requirements, Career Applications, Co-working Requests, and Partnership Inquiries).` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Use of the Service',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `By accessing and using the Website, you agree to use it in accordance with these Terms and for lawful, legitimate purposes only. You are fully responsible for all activities and data transmitted through your interaction with the Website.` },
        ],
      },
      {
        heading: 'Prohibited Conduct',
        blocks: [
          { kind: 'p', text: `You may not use the Website or its Services to:` },
          { kind: 'ul', items: [
            `Engage in illegal activities, violate any local or international laws, or promote fraudulent schemes.`,
            `Harass, harm, defame, or defraud other users, organizations, or the Company.`,
            `Distribute, upload, or transmit harmful code, viruses, malware, or Trojan horses through any submission forms or file upload fields.`,
            `Misuse, tamper with, or attempt to gain unauthorized access to the Website's infrastructure, restricted features, content, or operational tools.`,
          ] },
        ],
      },
      {
        heading: 'Form Submissions and Data Accuracy',
        blocks: [
          { kind: 'p', text: `Whenever you interact with our multi-step inquiry forms, you expressly agree to the following provisions:` },
          { kind: 'p', lead: 'Accuracy and Truthfulness:', text: `You must provide true, accurate, current, and complete information. You are strictly prohibited from impersonating any person or entity, creating false identities, or misrepresenting your professional role, academic credentials, company affiliation, or authority to act on behalf of a business.` },
          { kind: 'p', lead: 'Third-Party Rights:', text: `You warrant that you own or possess all necessary rights, licenses, and consents to upload and share any documents, portfolios, text, or links (such as LinkedIn and GitHub profiles). Your submissions must not violate or infringe upon the intellectual property, privacy, or publicity rights of any third party.` },
          { kind: 'p', lead: 'Right to Screen and Reject:', text: `Officience reserves the right, at its sole discretion, to review, decline, or delete any User Submission that we deem false, incomplete, inappropriate, or in violation of these Terms, without prior notice.` },
        ],
      },
      {
        heading: 'No Contractual or Employment Relationship',
        blocks: [
          { kind: 'p', text: `The submission of any inquiry or application through our Website—including but not limited to submitting business requirements, applying for a career or internship position, requesting co-working space, or proposing a partnership model—does not create, imply, or constitute a binding business contract, formal partnership, joint venture, or employment agreement between You and Officience. All official business engagements or employment appointments are strictly subject to the execution of separate, mutually signed written legal contracts (e.g., Master Services Agreements, Employment Contracts, Non-Disclosure Agreements).` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Company Content and Media',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Our Website may display photos, videos, corporate updates, social media posts, and other media materials (collectively, "Company Content") to showcase Officience's culture and updates.` },
          { kind: 'p', lead: 'Intellectual Property:', text: `All Company Content displayed on this Website is the exclusive property of Officience or its licensors and is protected by copyright and other intellectual property laws. You may not download, copy, reproduce, or redistribute any photos, videos, or text for commercial purposes without our prior written consent.` },
          { kind: 'p', lead: 'Third-Party Media:', text: `If we share or embed media posts, links, or content from third-party social media platforms, such content remains subject to the terms and privacy policies of those respective platforms.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Limited License',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `All content on this Website, including but not limited to text, images, videos, software, trademarks, patents, and other intellectual property, is the property of Officience or its licensors and is protected by intellectual property laws worldwide. By using this Website, you agree to comply with all applicable intellectual property laws.` },
          { kind: 'p', text: `Officience grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Website for personal, non-commercial purposes only. You may not:` },
          { kind: 'ul', items: [
            `Modify, copy, reproduce, distribute, transmit, display, or sell any content from the Website without prior written consent from Officience.`,
            `Use any part of the Website to create derivative works, websites, or services without prior written consent.`,
            `Use the Website or any of its content to develop a competing website or service, whether directly or indirectly.`,
          ] },
          { kind: 'p', text: `In cases where software or other downloadable materials are made available on the Website, any use of such materials will be governed by the specific license terms, conditions, and notices provided with them.` },
          { kind: 'p', text: `Violation of any part of this Limited License will result in the immediate termination of any rights granted to you without prior notice. Officience reserves the right to take legal action for any violations.` },
          { kind: 'p', text: `Officience maintains the integrity and accuracy of the content provided on the Website. You are solely responsible for the use you make of the Website and its content, including ensuring that your activities comply with these Terms of Use. Officience is not responsible for any consequences arising from your use of the Website.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Violation Actions',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Officience reserves the right to suspend or terminate your access to the Website if you violate these Terms. Such actions may include disabling your account, restricting your access, or pursuing legal remedies if necessary.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Limited Liability',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `By using the Officience website and services, you agree that your use is at your own risk. To the maximum extent permitted by law, Officience and its affiliates disclaim all liability for any direct, indirect, incidental, special, consequential, or exemplary damages, including, but not limited to, loss of profits, data, or other intangible losses resulting from:` },
          { kind: 'ul', items: [
            `Your use or inability to use the Website or its features.`,
            `Technical malfunctions or errors in the content provided.`,
            `Unauthorized access to, or alteration of, your data or communications.`,
            `Any third-party actions or statements related to the Website.`,
          ] },
          { kind: 'p', text: `Officience is not responsible for any loss, damage, or harm, including damage to your devices or data loss, resulting from downloading or acquiring materials from the Website.` },
          { kind: 'p', text: `You agree to indemnify Officience from any claims, losses, or expenses arising from your violation of these Terms or use of the Website.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Links to Other Websites',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The Officience website may contain links to third-party websites that are not operated by us. These external websites have their own terms of use and privacy policies, which you should review before interacting with them. We do not control the content or operations of these third-party sites and, therefore, cannot be held responsible for their content, accuracy, or any issues that may arise from using these websites.` },
          { kind: 'p', text: `These links are provided for your convenience and reference only. Officience does not endorse, approve, or take responsibility for the products, services, or content offered on these external sites. We do not guarantee the safety, security, or accuracy of any linked content, nor do we accept responsibility for any damage or loss resulting from your use of these third-party sites.` },
          { kind: 'p', text: `By accessing these external links, you understand and agree that Officience is not liable for any direct or indirect consequences, including loss or damage, arising from your use of the content, products, or services provided on these external websites.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Disclaimer of Warranty',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `You understand and agree that your use of the Officience website is solely at your own risk. While we take reasonable steps to maintain and update the Website, it is provided "as is" and "as available" without any warranties, express or implied.` },
          { kind: 'p', text: `To the fullest extent permitted by law, Officience disclaims all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee that the Website will be uninterrupted, error-free, secure, or free from harmful components.` },
          { kind: 'p', text: `The content on this Website is provided for informational purposes only and should not be interpreted as professional or technical advice. Officience assumes no responsibility for keeping the Website's information up to date, accurate, or complete.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Changes to These Terms of Use',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Officience may update these Terms from time to time. Any changes will be posted on this page, and the "Last Updated" date will be revised accordingly. You are encouraged to review these Terms periodically. Continued use of the Website after changes are made constitutes your acceptance of the new Terms.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Copyright Notice',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `© 2026 Officience. All rights reserved. Officience respects the intellectual property rights of others and expects users to do the same.` },
          { kind: 'p', text: `This Website is provided by Officience as a service for informational purposes only and should not be considered legal, financial, or professional advice. If you require legal advice, please consult a qualified professional.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Contact Information',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `If you have any questions or concerns about these Terms, please contact us:` },
          { kind: 'ul', items: [
            `By email: engage@officience.com`,
            `By visiting: https://www.officience.com`,
          ] },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Privacy Policy — Officience (verbatim from draft)
// ─────────────────────────────────────────────────────────────────────────────
export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: '',
    title: '',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Last updated: 1 June 2026` },
          { kind: 'p', text: `This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.` },
          { kind: 'p', text: `We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Interpretation and Definitions',
    clauses: [
      {
        heading: '1.1. Interpretation',
        blocks: [
          { kind: 'p', text: `The words in which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in the plural.` },
        ],
      },
      {
        heading: '1.2. Definitions',
        blocks: [
          { kind: 'p', text: `For the purposes of this Privacy Policy:` },
          { kind: 'p', lead: 'Account', text: `means a unique account created for You to access our Service or parts of our Service.` },
          { kind: 'p', lead: 'Company', text: `(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Officience, 16A Le Hong Phong Street, Ward 12, District 10, Ho Chi Minh City` },
          { kind: 'p', lead: 'Cookies', text: `are small files that are placed on Your computer, mobile device, or any other device by a website, containing the details of Your browsing history on that website among its many uses.` },
          { kind: 'p', lead: 'Country', text: `refers to Vietnam.` },
          { kind: 'p', lead: 'Device', text: `means any device that can access the Service such as a computer, a cellphone, or a digital tablet.` },
          { kind: 'p', lead: 'Personal Data', text: `is any information that relates to an identified or identifiable individual.` },
          { kind: 'p', lead: 'Service', text: `refers to the Website.` },
          { kind: 'p', lead: 'Service Provider', text: `means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service, or to assist the Company in analyzing how the Service is used.` },
          { kind: 'p', lead: 'Usage Data', text: `refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).` },
          { kind: 'p', lead: 'Website', text: `refers to Officience, accessible from https://officience.com.` },
          { kind: 'p', lead: 'You', text: `mean the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Collecting and Using Your Personal Data',
    clauses: [
      {
        heading: 'Personal Data',
        blocks: [
          { kind: 'p', text: `While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You, or to evaluate your specific requests submitted through our interactive multi-step forms. Personally identifiable information may include, but is not limited to:` },
          { kind: 'p', lead: 'Identity & Contact Information:', text: `First name, last name, work or personal email address, and phone number.` },
          { kind: 'p', lead: 'Professional & Employment Application Data:', text: `Professional experience, employment history, desired position (such as Design/UX, Front-end, Back-end, Data/AI, QA, BPO), portfolio URLs, LinkedIn profile URL, and any information contained in uploaded files (including CVs and resumes in PDF format).` },
          { kind: 'p', lead: 'Academic Data:', text: `Name of University/School attended and expected or actual graduation year.` },
          { kind: 'p', lead: 'Business & Organization Data:', text: `Company or organization name, organization type (including Independent, Agency, Startup, SME, Enterprise, Social Venture), and your specific job role or title.` },
          { kind: 'p', lead: 'Project & Financial Request Data:', text: `Technology services of interest, business challenges or objectives you are trying to solve, estimated project timelines, and expected budget ranges.` },
          { kind: 'p', lead: 'Workspace Preferences:', text: `Preferred co-working location (Ho Chi Minh City, Paris, or both), intended rental duration (Daily, Weekly, Monthly, or Long-term), and your team size.` },
          { kind: 'p', lead: 'Partnership & Collaboration Data:', text: `Preferred partnership or delivery models (including Referral, Subcontracting, and Co-delivery).` },
        ],
      },
      {
        heading: 'Usage Data',
        blocks: [
          { kind: 'p', text: `Usage Data is collected automatically when using the Service.` },
          { kind: 'p', text: `Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.` },
          { kind: 'p', text: `When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device's unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.` },
          { kind: 'p', text: `We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.` },
        ],
      },
      {
        heading: 'Tracking Technologies and Cookies',
        blocks: [
          { kind: 'p', text: `We use cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:` },
          { kind: 'p', lead: 'Cookies or Browser Cookies.', text: `A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse cookies, our Service may use Cookies.` },
          { kind: 'p', lead: 'Flash Cookies.', text: `Certain features of our Service may use local stored objects (or Flash cookies) to collect and store information about Your preferences or Your activity on our Service. Flash Cookies are not managed by the same browser settings as those used for Browser Cookies. For more information on how You can delete Flash Cookies, please read "Where can I change the settings for disabling, or deleting local shared objects?" available at https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html` },
          { kind: 'p', lead: 'Web Beacons.', text: `Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).` },
          { kind: 'p', text: `Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.` },
          { kind: 'p', text: `We use both Session and Persistent Cookies for the purposes set out below:` },
          { kind: 'p', lead: 'Necessary / Essential Cookies', text: `` },
          { kind: 'ul', items: [
            `Type: Session Cookies`,
            `Administered by: Us`,
            `Purpose: These cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.`,
          ] },
          { kind: 'p', lead: 'Cookies Policy / Notice Acceptance Cookies', text: `` },
          { kind: 'ul', items: [
            `Type: Persistent Cookies`,
            `Administered by: Us`,
            `Purpose: These Cookies identify if users have accepted the use of cookies on the Website.`,
          ] },
          { kind: 'p', lead: 'Functionality Cookies', text: `` },
          { kind: 'ul', items: [
            `Type: Persistent Cookies`,
            `Administered by: Us`,
            `Purpose: These cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.`,
          ] },
          { kind: 'p', text: `For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Use of Your Personal Data',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The Company may use Personal Data for the following purposes:` },
          { kind: 'p', lead: 'To provide, maintain, and monitor our Service:', text: `Including evaluating and tracking the usage and technical performance of our Website.` },
          { kind: 'p', lead: 'To manage Your Account:', text: `To manage Your registration as a user of the Service and grant access to specific functionalities reserved for registered users.` },
          { kind: 'p', lead: 'To evaluate and fulfill Business Requests:', text: `To process your project requirements, analyze your business challenges, estimate project scopes, and provide tailored technological consulting, quotes, and service proposals.` },
          { kind: 'p', lead: 'To process Employment & Internship Applications:', text: `To review your qualifications, evaluate submitted CVs, resumes, and portfolios, verify academic and professional credentials, and manage communication throughout the recruitment process.` },
          { kind: 'p', lead: 'To manage Co-working Space Inquiries:', text: `To assess availability, manage desk or office reservations, coordinate logistics based on your team size and preferred location, and facilitate onboarding to our physical workspaces.` },
          { kind: 'p', lead: 'To establish Partnerships & Collaborations:', text: `To evaluate organizational profiles for potential strategic alliances, subcontractor arrangements, or referral networks.` },
          { kind: 'p', lead: 'To contact You:', text: `To communicate with You by email, telephone calls, SMS, or other equivalent forms of electronic communication regarding updates, informative announcements, or security alerts related to our services and contract implementation.` },
          { kind: 'p', lead: 'To provide marketing and promotional updates:', text: `To send you news, special offers, and general information about other services, events, or resources we offer that are similar to those you have already inquired about, unless You have opted out of receiving such communications.` },
          { kind: 'p', lead: 'To manage and attend to Your requests:', text: `To process, answer, and manage any general inquiries or messages You send to Us.` },
          { kind: 'p', lead: 'For business transfers:', text: `To evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, where Personal Data held by Us is among the transferred assets.` },
          { kind: 'p', lead: 'For data analysis and improvement:', text: `To identify usage trends, determine the effectiveness of our promotional campaigns, and evaluate and enhance our Website, services, marketing strategies, and your overall user experience.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Retention of Your Personal Data',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.` },
          { kind: 'p', text: `The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Transfer of Your Personal Data',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of Your jurisdiction.` },
          { kind: 'p', text: `Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.` },
          { kind: 'p', text: `The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Disclosure of Your Personal Data',
    clauses: [
      {
        heading: '3.1. Business Transactions',
        blocks: [
          { kind: 'p', text: `If the Company is involved in a merger, acquisition, or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.` },
        ],
      },
      {
        heading: '3.2. Law enforcement',
        blocks: [
          { kind: 'p', text: `As a technology outsourcing company, Officience processes your Personal Data based on distinct, transparent legal grounds depending on the nature of your interaction through our survey forms. Our primary objective in gathering this data is to better understand your specific business demands, technical challenges, and operational needs to deliver highly customized solutions.` },
          { kind: 'p', text: `We rely on the following legal bases under applicable data protection laws (including the EU GDPR and Vietnam's Decree No. 13/2023/ND-CP):` },
          { kind: 'p', lead: 'Consent:', text: `We process your data when you explicitly grant us permission by voluntarily filling out and submitting our multi-step inquiry forms. You have the right to withdraw this consent at any time.` },
          { kind: 'p', lead: 'Performance of a Contract or Pre-contractual Measures:', text: `For Clients, Partners, and Co-working Inquirers, processing your information is necessary to take steps at your request prior to entering into a formal business contract, Master Services Agreement, or lease agreement.` },
          { kind: 'p', lead: 'Legitimate Interests:', text: `We process your data when it is necessary for the legitimate business interests pursued by Officience, such as analyzing survey data to deeply understand market demands, improve our technological services, and tailor our B2B consultancies.` },
          { kind: 'p', lead: 'Legitimate Recruitment and Pre-employment Purposes:', text: `For Job and Internship Candidates, processing your credentials and CVs is necessary to assess your suitability for open positions prior to establishing any potential employment relationship.` },
          { kind: 'p', lead: 'Compliance with Legal Obligations:', text: `We may process your data when it is required to comply with statutory legal requirements or regulatory audits.` },
        ],
      },
      {
        heading: '3.3. Other legal requirements',
        blocks: [
          { kind: 'p', text: `The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:` },
          { kind: 'ul', items: [
            `Comply with a legal obligation`,
            `Protect and defend the rights or property of the Company`,
            `Prevent or investigate possible wrongdoing in connection with the Service`,
            `Protect the personal safety of users of the Service or the public`,
            `Protect against legal liability`,
          ] },
        ],
      },
      {
        heading: '3.4. Security of Your Personal Data',
        blocks: [
          { kind: 'p', text: `The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect Your Personal Data, we cannot guarantee its absolute security.` },
        ],
      },
      {
        heading: "3.5. Children's Privacy",
        blocks: [
          { kind: 'p', text: `Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please Contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.` },
          { kind: 'p', text: `If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.` },
        ],
      },
      {
        heading: '3.6. Links to Other Websites',
        blocks: [
          { kind: 'p', text: `Our Service may contain links to other websites that are not operated by Us. If You click on a third-party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.` },
          { kind: 'p', text: `We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.` },
        ],
      },
      {
        heading: '3.7. Changes to this Privacy Policy',
        blocks: [
          { kind: 'p', text: `We may update Our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.` },
          { kind: 'p', text: `We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last Updated" date at the top of this Privacy Policy.` },
          { kind: 'p', text: `You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'International Data Transfers',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Officience operates globally, with offices and operations in Vietnam and France. By submitting your information through our Website, you acknowledge and agree that your Personal Data may be transferred to, stored, and processed in countries outside of your residency. We ensure that all such cross-border transfers comply with applicable local regulations (including EU GDPR and Vietnam's Decree 13) by implementing strict contractual safeguards and security standards.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Your Privacy Rights',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `Regardless of your location, Officience respects your statutory privacy rights. You have the right to:` },
          { kind: 'p', lead: 'Access and Portability:', text: `Request a copy of your Personal Data currently held by us.` },
          { kind: 'p', lead: 'Correction:', text: `Request the correction of incomplete or inaccurate data.` },
          { kind: 'p', lead: 'Erasure (Right to be Forgotten):', text: `Request the deletion of your Personal Data from our systems, subject to legal retention requirements.` },
          { kind: 'p', lead: 'Withdraw Consent:', text: `Withdraw your consent to data processing (such as opting out of marketing emails) at any time.` },
          { kind: 'p', lead: 'Restriction and Objection:', text: `Object to or restrict the processing of your data for specific purposes.` },
          { kind: 'p', text: `To exercise any of these rights, please contact us at engage@officience.com.` },
        ],
      },
    ],
  },
  {
    id: '',
    title: 'Contact Us',
    clauses: [
      {
        blocks: [
          { kind: 'p', text: `If you have any questions about this Privacy Policy, You can contact us:` },
          { kind: 'ul', items: [
            `By email: engage@officience.com`,
            `By visiting this page on our website: https://www.officience.com`,
          ] },
        ],
      },
    ],
  },
];
