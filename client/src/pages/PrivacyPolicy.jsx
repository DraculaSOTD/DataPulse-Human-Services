import { motion } from 'framer-motion';
import AnimatedBackground from '../animations/AnimatedBackground';
import SEO from '../components/SEO';
import { fadeInUp, staggerContainer } from '../constants/animations';
import { CONTACT_EMAILS } from '../constants/config';
import { getWebPageSchema } from '../utils/structuredData';
import './PrivacyPolicy.css';

/* The policy reproduced from DataPulse AI_Website_Privacy_Policy.docx — it is
   legal text, so wording and the "inter alia" phrasing stay as drafted.
   Declared at module scope rather than inside the component because, unlike
   the small arrays on the other pages, rebuilding thirteen sections on every
   render is pointless work.

   Four deliberate deviations from the source document. All four should be
   carried back into the .docx rather than reverted here:
     - clause 7.1 opened with a lowercase "if";
     - clause 12.4 read "and I again accessible", a stray "I";
     - the last bullet of 3.2.3 had the full stop inside the bracket and a
       double space after it ("Clause 6 below.)  solely");
     - the two internal cross-references were left stale when the document
       dropped its Children's Data Collection section: every section after it
       shifted down one, so "Clause 7" is now Sharing and Disclosure at 6 and
       "Clause 11" is now Personal Information Rights at 10. Renumbered here so
       both references point where the prose means them to.
   None of them change the meaning.

   The source document numbers its own table of contents as clause 1, which
   would push Introduction to 2 — but the cross-references above are counted
   from Introduction as 1. The table of contents is therefore dropped, which is
   also the right call for a single scrollable page.

   Clause fields render in a fixed order: `text` (the numbered clause), `lead`
   (a paragraph introducing a list), `bullets`, then `note` (a closing
   paragraph). A bullet may itself be an object with nested `bullets`. */
const POLICY_SECTIONS = [
  {
    title: 'Introduction',
    clauses: [
      {
        text: 'DataPulse AI (Pty) Ltd (hereinafter referred to as the “Company”) is a Company which provides, inter alia, Product, Innovation, Data, Analytics, Insights, Machine Learning, and Artificial Intelligence Products and Services (hereinafter referred to as the “Services”) is incorporated in terms of the Company Laws of South Africa with registration number 2024/530497/07.'
      },
      {
        text: 'This Privacy Policy (hereinafter referred to as the “Policy”) covers the Company’s collection, storage, and supply of information, which information may include information of a personal nature, and the Policy covers the Company’s methods and assets utilised to collect, store and supply such information, such methods and/or assets includes, but is not limited to, social media platforms, the Company’s website, newsletters, electronic mail, the Services of the company, the compiling and provision of detailed reports and analyses and all of the Company’s related sub-domains and mobile applications that are registered and operated by the Company.'
      },
      {
        text: 'The Company acting in its role as service provider in its best endeavour to provide the Services shall, where so required, act in accordance with Legislation such as, inter alia, the Consumer Protection Act 68 of 2008 as amended and the Protection of Personal Information Act 4 of 2013 (hereinafter referred to as “POPIA”).'
      },
      {
        text: 'This Policy applies to the Company’s employees and/or associated persons and follow the principles as outlined herein.'
      },
      {
        text: 'This Policy applies to existing clients, prospective clients, clients whom have terminated their contractual relationship with the Company and any and/or all website and/or social media and/or other electronic platform visitors (hereinafter jointly and severally referred to as the “Client”) who are accessing and/or using the Company’s websites and/or social media and/or other electronic platform (hereinafter referred to as the “Platforms”).'
      },
      {
        text: 'This Policy in terms of POPIA outlines how the Company collects, maintains, handles, protects, discloses and supplies (if applicable) Personal Information of the Company’s Clients and the Company herein records its commitment to the protection of the privacy of all its Clients’ Personal Information which it may process in accordance with POPIA, this Policy and the Company’s terms of business.'
      },
      {
        text: 'In terms of this Policy and for the purposes hereof, references to “Personal Information” shall mean data and/or information which may identify Clients, and which may include, inter alia, a Client’s name, address, identification number, contact details and date of birth.'
      }
    ]
  },
  {
    title: 'Collection of Personal Information',
    clauses: [
      {
        text: 'The Company collects different types of Personal Information through the Company’s Platforms from Clients who visit such Platforms or access, use or request products and services offered by the Company.'
      },
      {
        text: 'The provision of certain Personal Information is required for establishing a contractual relationship with the Company. Clients not wishing to provide such Personal Information will not be able to open an account with the Company or be provided with other products and/or services of the Company.'
      },
      {
        text: 'Clients have a responsibility to ensure that the Personal Information they provide to the Company remain accurate and up to date throughout the period of their contractual relationship with the Company.'
      },
      {
        text: 'In addition to the information provided by Clients, the Company also lawfully collects and processes Personal Information from publicly available sources (including, inter alia, the press, social media and the internet) and third-party risk management software solutions in order to meet its regulatory obligations and for confirming the validity of the provided information.'
      },
      {
        text: 'The Personal Information received from the Client, collected, and processed by the Company are required for the communication, identification, verification and assessment for the business relationship establishment with the Client, contract performance and legal compliance. The following Personal Information may be collected from Clients depending on the product and/or service the Company provides to him:',
        bullets: [
          'Contact details such as the Client’s name, e-mail address and phone number.',
          'Identification details such as the Client’s identification or passport number.',
          'Information relevant to the services that the Company provides to the Client such as the Client’s transactions and communication records with the Company.',
          'Details of visitors’ and Clients’ visits to the Company’s website and information collected through cookies and other tracking technologies including IP address and domain name, browser version, operating system and geolocation.',
          'Information in relation to criminal convictions and offences to the extent required and/or permitted by applicable law.',
          'Information in relation to the client\'s mobile device Call log with the permission of the client.',
          'Your marketing preferences.'
        ]
      }
    ]
  },
  {
    title: 'Use of Personal Information',
    clauses: [
      {
        text: 'The Company collects and processes Personal Information which is required for the evaluation, establishment, and maintenance of the contractual relationship between the Company and the Client and in order to comply with this Policy and the applicable laws and regulations governing the Company’s capacity to provide the Services. The Company may in certain instances process the Clients Personal Information to pursue legitimate interests or those of third parties, provided that the Clients’ interests and fundamental rights are not infringed upon by the Company or any such contemplated third party and provided further that the Company has been provided the necessary consents.'
      },
      {
        text: 'The Company will use the Client’s Personal Information in the following circumstances:',
        subclauses: [
          {
            text: 'Where the Company needs to perform in terms of the agreement it has entered into with the Client and/or in order to take certain steps prior to entering into an agreement with the Client – the Processing of information is necessary for the Company to provide the Client with its products and services and is required to, inter alia:',
            bullets: [
              'To verify the Client’s identity and carry out necessary security checks;',
              'To ensure that the Client meets the sustainability requirements to use the Company’s Services;',
              'To Consult with the Client regarding the Company’s Services (the “Services”);',
              'To Process the Client’s information and provide the necessary feedback / report / analyses to the Client based on the terms of the underlying agreement between the Company and the Client;',
              'To send the Client any information as per the consents received and, if applicable, by way of newsletter and/or other electronic means and/or social media platforms.'
            ],
            note: 'If the Client does not provide the requested Personal Information, the Company may not be able to offer the Client with any and/or all of its Services.'
          },
          {
            text: 'Where the Company needs to comply with a legal obligation',
            lead: 'As the Company is providing its Services it may be required to comply with certain legal and regulatory obligations which may involve the processing of Personal Information. Such obligations and requirements impose on the Company a duty to put in place certain procedures necessary for identification and verification purposes, compliance with court orders, tax law or other reporting obligations and money laundering controls.'
          },
          {
            text: 'Where the Company has legitimate interests to use the Clients information',
            lead: 'The Company may process the Personal Information of the Client for the following purposes:',
            bullets: [
              'To develop and/or enhance its products and services;',
              'To enhance the security of the Company’s network and information systems;',
              'To identify, prevent and investigate fraud and other unlawful activities, unauthorised transactions, other liabilities and manage risk exposure;',
              'To maintain records;',
              'To manage its business operations and comply with internal policies and procedures;',
              'To defend, investigate, institute and prosecute legal claims;',
              'To receive professional advice (such as legal advice), and',
              'For the analyses of statistical data which helps the Company in providing its Clients with better products and services, in future and throughout. It is important to note that the Company “anonymises” and “end to end encrypts” its data so that the Client’s Personal Information is not revealed. The Company may provide this statistical data to third parties (as described in Clause 6 below) solely for statistical purposes and in an effort to improve the Company’s marketing campaign.'
            ]
          },
          {
            text: 'Where the Client has given his/her/its Consent',
            bullets: [
              'The Company will request the Client’s consent for the Company to provide marketing information to it’s Clients in relation to the Company’s Services which may be of interest to the Client.',
              'The Company will request the Client’s permission to electronically verify their identity by providing their Personal Information to identity verification providers.'
            ]
          }
        ]
      }
    ],
    note: 'The Client may withdraw any and/or all such consent at any time. This right to withdraw does not affect the lawfulness of any processing of information before the Client’s withdrawal of consent.'
  },
  {
    title: 'Cookies',
    clauses: [
      {
        text: 'A cookie is a small text file that is stored on a user\'s computer for record-keeping purposes. The Company uses cookies on its website(s) to ensure and provide the Client with a good experience when he browses our website and also allows us to improve our website.'
      }
    ]
  },
  {
    title: 'Links to other websites',
    clauses: [
      {
        text: 'The Company’s website contains or may contain links to other websites or social media platforms of interest. However, once you have used these links to leave the Company’s website, you should note that the Company does not have any control over those other websites. Therefore, the Company cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this Policy. You should exercise caution and look at the privacy statement applicable to the website in question.'
      },
      {
        text: 'The Company will not be liable for the unlawful or unauthorized use of the Client’s Personal Information due to misuse and/or malicious use and/or negligence and/or misplacement of the Client’s passwords either by him/her or any third party.'
      }
    ]
  },
  {
    title: 'Sharing and Disclosure of Personal Information',
    clauses: [
      {
        text: 'The Company, during the course of performing its contractual and statutory obligations may in certain instances disclose the Client’s Personal Information to third parties.'
      },
      {
        text: 'Such instances of disclosing the Client’s Personal Information may be so disclosed for, inter alia, the following reasons:',
        bullets: [
          'Other service providers that the Company has elected to support in the effective and proper performance of its Services by offering technological expertise, solutions and support;',
          'Governmental and/or regulatory bodies, including, inter alia, law enforcement authorities, in connection with enquiries, proceedings or investigations by such parties and/or in order to enable the Company to comply with its legal, statutory and regulatory requirements and obligations;',
          'Credit reference and fraud preventions agencies, third party authentication service providers and/or other financial institutions for the purposes of credit checking, fraud prevention and anti-money laundering controls;',
          'Third party service providers for the provision of the required customer support services through live chat and the Company’s website and/or other electronic platform visits and traffic monitoring through the use of cookies;',
          'External consultants including, inter alia, Legal and Tax consultants;',
          'Data reporting service providers;',
          'Market research companies and call centres; and',
          'Affiliates and associated persons of the Company.'
        ]
      },
      {
        text: 'The Company does not collect, store or process any personal credit or debit card information. All payment transactions will be processed through payment gateway providers.'
      }
    ]
  },
  {
    title: 'Business Transfers Legal Requirements',
    clauses: [
      {
        text: 'If the Company is involved in a merger, acquisition, financing due diligence, reorganisation, bankruptcy, receivership, sale of company assets, or transition of service to another provider, the Client’s Personal Information along with other information may be transferred to a successor or affiliate as part of that transaction along with other assets of the Company.'
      }
    ]
  },
  {
    title: 'Personal Information Transfers outside of South Africa',
    clauses: [
      {
        text: 'The Company is committed to protecting the Personal Information of its Clients especially when such information is to be transferred outside of South Africa. The POPIA allows for Personal Information to be transferred outside of South Africa in the event that the necessary and adequate conditions and safeguards have been put into place to ensure that such information stays secured and encrypted and as such sufficiently protected.'
      },
      {
        text: 'The adequate safeguards include, inter alia, other laws, binding corporate rules and/or binding agreements which provide an adequate and similar level of protection as contemplated in the POPIA. Where such adequate safeguards are put in to place the rights of the Client in respect of his/her/its Personal Information remain protected after the information has been transferred outside of South Africa.'
      },
      {
        text: 'The Company may transfer or disclose Personal Information of Clients in and/or out of South Africa to any company within the Company’s network of Clients, affiliates and/or associated persons and/or other third party service providers who are engaged on the Company’s behalf and who are processing such data and information based on the Company’s instructions and in compliance with this Policy and other appropriate measures pertaining to confidentiality and security of Personal Information.'
      }
    ]
  },
  {
    title: 'Marketing Communications – Services Subscriptions Preferences',
    clauses: [
      {
        text: 'The Company may process Personal Information to tell its Clients about products, services and offers that may be of interest to the Client. The Company may only process such Personal Information if it has obtained the Client’s express consent to do so.'
      },
      {
        text: 'If the Client no longer wishes to receive any promotional communications, he/she/it may opt-out of receiving same by following the instructions included in each communication from the Company and/or the Client may do so by updating the necessary email subscription preferences.'
      }
    ]
  },
  {
    title: 'Personal Information Rights',
    clauses: [
      {
        text: 'With reference to Personal Information, the Client has the following rights:',
        bullets: [
          {
            text: 'To be notified that the Client’s Personal Information –',
            bullets: [
              'Is being collected; and',
              'Has been accessed and/or acquired by an unauthorised person.'
            ]
          },
          'To be informed of the information the Company holds pertaining to the Client and to request access to such Personal Information.',
          'To request corrections, deletions and/or the destruction of the Client’s Personal Information so held by the Company.',
          'To object, on reasonable grounds, to the processing of Personal Information for the purposes of direct marketing.',
          'To not have Personal Information processed for the purposes of direct marketing by means of unsolicited electronic communications.',
          'To not be subject, under certain instances, to a decision which is based solely on the basis of automated processing of Personal Information intended to build and provide a profile.',
          'To submit a complaint to the regulator regarding an alleged interference with the protection of the Client’s Personal Information.',
          'To institute civil proceedings regarding any such alleged interference and/or infringement of Personal Information.'
        ]
      }
    ],
    note: `The Client may exercise its rights, as above mentioned, by contacting the Company and laying a complaint at the following email address: ${CONTACT_EMAILS.INFO}`
  },
  {
    title: 'Automated decision-making and Profiling',
    clauses: [
      {
        text: 'When the Client makes an application and enters into and concludes an agreement with the Company, the Company shall use systems to make an automated assessment of the Client’s knowledge and experience through the evaluation of the Company’s Appropriateness test. In such events, the Client has the following rights:',
        bullets: [
          'To request from the Company to provide the Client with information regarding the processing of Personal Information (see Clause 10 above);',
          'To request that one of the Company’s authorised persons examines the Clients application and obtain an explanation for the automated decisions reached. The Client furthermore has the right to challenge such decision. Following such request, the Company will reassess the Client’s position and application, taking into consideration both the reasons as to why the initial automated decision was reached and any mitigating factors provided by the Client.'
        ]
      }
    ]
  },
  {
    title: 'Confidentiality and Security of Personal Information',
    clauses: [
      {
        text: 'Personal Information which the Company holds is to be treated by the Company as confidential and will not be used for any purpose other than specified in this Policy.'
      },
      {
        text: 'Any Personal Information that the Client provides to the Company will be treated as confidential and shall be shared and/or disclosed only in strict accordance with the terms and conditions of this Policy.'
      },
      {
        text: 'The Personal Information that the Client provides in connection with registering as a user of the Company’s websites and/or other electronic platforms and/or in terms of any written agreement between the Client and the Company shall be classified as registration information. The Company is committed to the protection of the registration information and to ensure that such information is encrypted, securely stored and sufficiently accessible upon the Client’s request. Registration information shall be securely stored on secure servers that only authorised personnel shall have access to via password authentication procedures. The Company encrypts all Personal Information as it is transferred to the Company and thus makes all necessary efforts to prevent any unauthorised parties from accessing, viewing and/or processing such Personal Information.'
      },
      {
        text: 'Any other Personal Information, that is not registration information, provided to the Company shall also be stored on secure servers and again accessible only to authorised personnel.'
      }
    ]
  },
  {
    title: 'Amendments to this Policy',
    clauses: [
      {
        text: 'The Company reserves the right to review and amend this Policy from time to time for any reason whatsoever and notify the Clients of any such amendments by posting an updated and amended version of this Policy on the Company’s website(s). The Company shall notify the Client about any material changes to this Policy by placing a notice on its website(s) or by communicating same to the Client directly.'
      }
    ]
  }
];

// The policy names the info address twice. Linkifying it here keeps every entry
// above a plain string and the address itself sourced from config.
const linkifyEmail = (text) => {
  const parts = text.split(CONTACT_EMAILS.INFO);
  if (parts.length === 1) return text;

  return parts.reduce((nodes, part, i) => {
    if (i > 0) {
      nodes.push(
        <a key={`mail-${i}`} href={`mailto:${CONTACT_EMAILS.INFO}`}>
          {CONTACT_EMAILS.INFO}
        </a>
      );
    }
    nodes.push(part);
    return nodes;
  }, []);
};

// A bullet is either a plain string or an object carrying nested bullets.
const PolicyBullets = ({ bullets }) => (
  <ul className="policy-bullets" role="list">
    {bullets.map((bullet, i) => {
      const isNested = typeof bullet === 'object';
      return (
        <li key={i}>
          {linkifyEmail(isNested ? bullet.text : bullet)}
          {isNested && bullet.bullets && <PolicyBullets bullets={bullet.bullets} />}
        </li>
      );
    })}
  </ul>
);

const PolicyClauseBody = ({ clause }) => (
  <>
    <p className="policy-text">{linkifyEmail(clause.text)}</p>
    {clause.lead && <p className="policy-text">{linkifyEmail(clause.lead)}</p>}
    {clause.bullets && <PolicyBullets bullets={clause.bullets} />}
    {clause.note && <p className="policy-text">{linkifyEmail(clause.note)}</p>}
  </>
);

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <SEO
        title="Privacy Policy"
        description="How DataPulse AI (Pty) Ltd collects, stores, protects and discloses personal information, in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA)."
        keywords="DataPulse AI privacy policy, POPIA, personal information, data protection, South Africa"
        structuredData={[
          getWebPageSchema(
            '/privacy-policy',
            'Privacy Policy',
            'The DataPulse AI privacy policy, setting out how personal information is collected, used, shared and protected under POPIA.'
          )
        ]}
      />
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="privacy-hero section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="privacy-hero-content"
          >
            <motion.span variants={fadeInUp} className="eyebrow">Legal</motion.span>
            <motion.h1 variants={fadeInUp}>Privacy Policy</motion.h1>
            <motion.p variants={fadeInUp} className="privacy-intro">
              How DataPulse AI (Pty) Ltd collects, stores, protects and discloses personal
              information, in accordance with the Protection of Personal Information Act 4
              of 2013 (POPIA).
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Policy Body */}
      <section className="privacy-body section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={fadeInUp}
            className="policy-content"
          >
            <ol className="policy-sections" role="list">
              {POLICY_SECTIONS.map((section) => (
                <li key={section.title} className="policy-section">
                  <h2 className="policy-section-title">{section.title}</h2>

                  <ol className="policy-clauses" role="list">
                    {section.clauses.map((clause, i) => (
                      <li key={i} className="policy-clause">
                        <PolicyClauseBody clause={clause} />

                        {clause.subclauses && (
                          <ol className="policy-subclauses" role="list">
                            {clause.subclauses.map((subclause, j) => (
                              <li key={j} className="policy-subclause">
                                <PolicyClauseBody clause={subclause} />
                              </li>
                            ))}
                          </ol>
                        )}
                      </li>
                    ))}
                  </ol>

                  {/* Section-level closing paragraph — sits outside the numbered
                      clauses because the source document leaves it unnumbered. */}
                  {section.note && <p className="policy-text policy-note">{linkifyEmail(section.note)}</p>}
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
