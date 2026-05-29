import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TermsConditionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsConditions: React.FC<TermsConditionsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#1F49BF] p-6 md:p-8 flex justify-between items-center">
              <h2 
                className="font-sans font-bold text-white"
                style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}
              >
                Terms and Conditions
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X size={28} />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F7F7F7]">
              <div className="max-w-3xl mx-auto space-y-6 text-gray-800 font-body" style={{ fontSize: 'clamp(14px, 1.2vw, 16px)' }}>
                
                {/* General Information */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    General Information
                  </h3>
                  <p className="leading-relaxed">
                    Your privacy is of utmost importance to Officience Co., Ltd.
                  </p>
                  <p className="leading-relaxed mt-2">
                    This privacy policy (the "Policy") describes the Personal Data which Officience collects about you through your use of the Platforms. It also sets out how Officience uses, discloses and protects this data.
                  </p>
                </section>

                {/* Scope */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    Scope of this Policy
                  </h3>
                  <p className="leading-relaxed">
                    This Policy applies to all Personal Data processed online by Officience through all its websites, applications and domains, which include but are not limited to the following: www.officience.com
                  </p>
                </section>

                {/* 1. Definitions */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    1. Definitions
                  </h3>
                  <p className="leading-relaxed">
                    For the purposes of this Policy:
                  </p>
                  <p className="leading-relaxed mt-2">
                    <strong>Personal Data</strong> means any information relating to an identified or identifiable natural person, where an identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person; and
                  </p>
                  <p className="leading-relaxed mt-2">
                    <strong>Process, processed and processing</strong> means any operation or set of operations which is performed on Personal Data or on sets of Personal Data, whether or not by automated means, such as collection, recording, organisation, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction.
                  </p>
                </section>

                {/* 2. Personal Data collected */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    2. Personal Data Collected by Officience
                  </h3>
                  <p className="leading-relaxed">
                    Officience will NOT collect Personal Data about an individual including any following mentioned categories, except contact email address which it reasonably considers necessary for the relevant purposes underlying such processing.
                  </p>
                  <p className="leading-relaxed mt-2">
                    Examples of your Personal Data which may NOT be collected by us:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Your name, telephone number, mailing address, transaction details and any other information which you have provided to us in any forms you may have submitted to us or in other forms of interaction with you; and</li>
                    <li>Information about your usage of and interaction with the Platforms, including traffic data, location data, the originating domain name of your internet service provider, statistics on page views, cookies and IP addresses.</li>
                  </ul>
                </section>

                {/* 3. How we collect */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    3. How We Collect Your Personal Data
                  </h3>
                  <p className="leading-relaxed">
                    We use different methods to collect data about you, including the following:
                  </p>
                  <p className="leading-relaxed mt-2">
                    <strong>Direct interactions.</strong> You may give us your Personal Data by filling in forms or by corresponding with us by post, phone, email, chatbot or otherwise. We may also directly collect Personal Data in other ways, including when:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>You apply for our products or services;</li>
                    <li>You create an account on our Platforms;</li>
                    <li>You subscribe to our service or publications;</li>
                    <li>You request marketing to be sent to you;</li>
                    <li>You enter a competition, promotion or survey;</li>
                    <li>You give us feedback;</li>
                    <li>You log on to Wi-Fi at our premises;</li>
                    <li>You use mobile or web applications developed by us;</li>
                    <li>You submit your resume or an application, or participate in interviews or testing, for employment or contracting opportunities with Officience.</li>
                  </ul>
                  <p className="leading-relaxed mt-2">
                    <strong>Automated technologies or interactions.</strong> As you interact with our Platforms, we may automatically collect technical data about your equipment, browsing actions and patterns. We collect this data by using cookies, server logs and other similar technologies.
                  </p>
                  <p className="leading-relaxed mt-2">
                    <strong>Third parties or publicly available sources.</strong> We may receive Personal Data about you from various third parties and public sources, including financial and transaction data from providers of technical, payment and delivery services.
                  </p>
                </section>

                {/* 4. How we use */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    4. How We Use Your Personal Data
                  </h3>
                  <p className="leading-relaxed">
                    Your Personal Data is generally processed by us as necessary for purposes directly related to our functions and activities. This includes any one or more of the following purposes:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>To provide you with services and to help us develop, improve, manage and administer the services we provide to you, including services provided on and through our Platforms and Wi-Fi services;</li>
                    <li>To help us verify your identity for the purposes of processing and administering any membership application or registration;</li>
                    <li>To send you notifications and marketing messages in relation to our promotional events, offers, opportunities, products, benefits and programmes;</li>
                    <li>To conduct marketing activities including market research, customer profiling, customer insights and targeted marketing activities;</li>
                    <li>To carry out profiling and statistical analysis to improve the services provided to you;</li>
                    <li>To inform you of changes to our programmes, policies, terms and conditions, Platform updates and other administrative information;</li>
                    <li>To conduct surveys, questionnaires and requests for feedback;</li>
                    <li>To respond to your queries, requests, feedback and complaints;</li>
                    <li>For promotional and publicity purposes, including to record or take photographs of participants at events or functions organised, hosted or participated in by Officience;</li>
                    <li>To meet the requirements of any applicable laws/regulations, enforceable governmental request or court order;</li>
                    <li>To detect, prevent or otherwise address security or technical issues in connection with services provided through the Platforms; and/or</li>
                    <li>To fulfil such other purpose as may be specified in a data protection and privacy notice given to you at the time your Personal Data is collected.</li>
                  </ul>
                </section>

                {/* 5. Disclosure */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    5. Disclosure of Your Personal Data
                  </h3>
                  <p className="leading-relaxed">
                    In carrying out one or more of the purposes set out above, we may need to disclose your Personal Data to one or more of the following third parties:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Our engagement team and/or agents;</li>
                    <li>Our authorised service providers such as marketing partners and web analysis companies, and their business partners;</li>
                    <li>Our auditors and professional advisors;</li>
                    <li>Our business partners;</li>
                    <li>Law enforcement agencies;</li>
                    <li>Any person to whom disclosure is permitted or required by any applicable laws/regulations, enforceable governmental request or court order; and/or</li>
                    <li>Any companies comprised in our group.</li>
                  </ul>
                  <p className="leading-relaxed mt-2">
                    We impose strict obligations on the third parties mentioned above with which we share your Personal Data to maintain the integrity and security of that data.
                  </p>
                  <p className="leading-relaxed mt-2">
                    We only allow the said third parties to use your Personal Data for specified purposes and in accordance with our instructions.
                  </p>
                </section>

                {/* 6. Legal basis */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    6. Legal Basis for Processing Your Personal Data
                  </h3>
                  <p className="leading-relaxed">
                    The legal basis for the processing of your Personal Data will generally fall under one or more of the following:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>It is necessary for the performance of Officience's contractual relationship with you, which is regulated by the applicable terms and conditions governing the use of the Platforms and by the specific forms collecting your data;</li>
                    <li>It is necessary for our legitimate interests;</li>
                    <li>It is necessary to comply with our legal obligations;</li>
                    <li>It is authorised under any applicable law or regulations; and/or</li>
                    <li>You are deemed to have consented to such processing under any applicable law or regulations.</li>
                  </ul>
                  <p className="leading-relaxed mt-2">
                    Please note that we may process your Personal Data for more than one lawful ground depending on the specific purpose(s) for which we are using your data. Please contact us if you need details about the specific legal ground(s) we are relying on to process your Personal Data.
                  </p>
                </section>

                {/* 7. Consent */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    7. Consent
                  </h3>
                  <p className="leading-relaxed">
                    Where the processing of your Personal Data does not fall under one of the bases set out above, we will obtain express written consent from you for such processing by methods or means which include making you sign a form or check a box.
                  </p>
                  <p className="leading-relaxed mt-2">
                    You can withdraw such express consent at any time by contacting our data protection officer at the contact details set out in Section 14 of this Policy.
                  </p>
                  <p className="leading-relaxed mt-2">
                    Depending on the extent to which you withdraw consent to the processing of your Personal Data by us, such withdrawal of consent may result in our inability to provide the relevant services to you and may be considered as a termination by you of any agreement between Officience and you. Officience's legal rights and remedies are expressly reserved in such an event.
                  </p>
                </section>

                {/* 8. Links */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    8. Links to Third-Party Websites
                  </h3>
                  <p className="leading-relaxed">
                    We may provide links to third-party websites on the Platforms. Your use of such third-party websites will be subject to their privacy policies and is not covered by this Policy. We encourage you to read the privacy policies on the other websites you visit. As we cannot control or be responsible for the policies of other sites we may link to, or the use of any data you may share with them, you access these third-party websites at your own risk.
                  </p>
                </section>

                {/* 9. Security */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    9. Keeping Your Personal Data Secure
                  </h3>
                  <p className="leading-relaxed">
                    We will use reasonable technical and procedural measures to safeguard your Personal Data, for example by:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Ensuring that access to any personal account you have with us is controlled by a password and username which are unique to you;</li>
                    <li>Storing your Personal Data on secured servers; and</li>
                    <li>Restricting access to Personal Data on a 'need to know' basis.</li>
                  </ul>
                  <p className="leading-relaxed mt-2">
                    Whilst we will use all reasonable efforts to safeguard your Personal Data, please note that the use of the internet and/or our Platforms cannot be made entirely secure and we therefore are unable to guarantee the security or integrity of any Personal Data which is transferred from you or to you via the Platforms.
                  </p>
                </section>

                {/* 10. Access */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    10. Access to Personal Data
                  </h3>
                  <p className="leading-relaxed">
                    Whilst we will take reasonable steps to accurately record your Personal Data, we require that you provide accurate and complete Personal Data, and update such Personal Data with us from time to time.
                  </p>
                  <p className="leading-relaxed mt-2">
                    You may request access to, and correction of your Personal Data held by us by contacting us at the contact details set out in Section 14 of this Policy. All requests for access and/or correction will be processed within a reasonable time except where we refuse such requests in accordance with any applicable laws or regulations. In some situations, you may be able to access and correct your personal information directly through our Platforms.
                  </p>
                </section>

                {/* 11. EU Rights */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    11. Further Rights of Data Subjects in the European Union ("EU")
                  </h3>
                  <p className="leading-relaxed">
                    If you are a data subject in the EU, you may contact us to exercise the following further rights:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Request for the erasure of your Personal Data;</li>
                    <li>Request for the restriction of processing of your Personal Data;</li>
                    <li>Object to the processing of your Personal Data; and/or</li>
                    <li>Request to transfer your personal Data to you or a third-party.</li>
                  </ul>
                  <p className="leading-relaxed mt-2">
                    You also have the right to lodge a complaint with the relevant EU supervisory authority if we have contravened any applicable laws or regulations.
                  </p>
                  <p className="leading-relaxed mt-2">
                    All requests made to us in exercising the rights above will be processed within a reasonable time except where we refuse such requests in accordance with any applicable laws or regulations.
                  </p>
                </section>

                {/* 12. Retention */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    12. Data Retention
                  </h3>
                  <p className="leading-relaxed">
                    We will cease to retain your Personal Data when the purposes for which we collected your Personal Data have ceased and/or when we are no longer required to continue retaining your Personal Data for any legal or business purposes.
                  </p>
                </section>

                {/* 13. Changes */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    13. Changes to This Policy
                  </h3>
                  <p className="leading-relaxed">
                    We may amend this Policy (including the Cookies Policy) from time to time. The updated versions will be posted on our Platforms and date stamped so that you are aware of when the Policy was last updated. If we make significant amendments to the Policy, we will notify you in advance and allow you the opportunity to review the revised Policy prior to such changes taking effect. We also recommend that you check the relevant websites or sections of the Platforms regularly for any updates.
                  </p>
                </section>

                {/* 14. Contact */}
                <section>
                  <h3 className="font-sans font-bold text-gray-900 mb-3" style={{ fontSize: 'clamp(18px, 2vw, 24px)' }}>
                    14. How to Contact Us
                  </h3>
                  <p className="leading-relaxed">
                    We welcome your feedback, comments and any questions that you may have.
                  </p>
                  <p className="leading-relaxed mt-2">
                    If you wish to contact us, please write to us at the address below referencing 'Privacy Policy':
                  </p>
                  <div className="mt-3 p-4 bg-white rounded-lg">
                    <p className="font-semibold">Data Protection Officer</p>
                    <p>Officience Co., Ltd</p>
                    <p>16A Le Hong Phong, Ward 15, District 10,</p>
                    <p>Ho Chi Minh City, Viet Nam, 700000</p>
                  </div>
                  <p className="leading-relaxed mt-3">
                    Or email <a href="mailto:data.protection@officience.com" className="text-[#1F49BF] underline hover:text-blue-800">data.protection@officience.com</a> referencing 'Privacy Policy'.
                  </p>
                  <p className="leading-relaxed mt-2">
                    Alternatively, for specific queries, you can send us an email at: <a href="mailto:Contact@officience.com" className="text-[#1F49BF] underline hover:text-blue-800">Contact@officience.com</a>
                  </p>
                </section>

              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-4 md:p-6 flex justify-center">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-[#1F49BF] text-white rounded-full font-bold text-lg hover:bg-blue-800 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TermsConditions;
