import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../animations/AnimatedBackground';
import SEO from '../components/SEO';
import { fadeInUp, staggerContainer } from '../constants/animations';
import { CONTACT_EMAILS } from '../constants/config';
import { getServiceSchema, getWebPageSchema } from '../utils/structuredData';
import './Offerings.css';

const analyticsServices = [
  {
    service: 'Data Discovery/Confirmation',
    outcome: 'Thematic Analysis, Data Quality analysis, correlation analysis'
  },
  {
    service: 'ML & AI Model Discovery',
    outcome: 'ML & AI model readiness, identification of appropriate models'
  },
  {
    service: 'Logic Systems Discovery & Build',
    outcome: 'Identification of businesses decision making frameworks and logic frameworks, mapping, and codification'
  },
  {
    service: 'ML Systems Architecture',
    outcome: 'Architecture artefacts: architecture, process flow, data flows, ML model selection, data transformation rules, governance'
  },
  {
    service: 'AI & Agentic Systems Architecture',
    outcome: 'Architecture artefacts: architecture, process flow, data flows, AI model selection, data usage rules, governance, controls'
  },
  {
    service: 'ML Ecosystem Build',
    outcome: 'Includes components: Integrations, Model Databases, Multiple Data transformation components, Multiple Rules Engines'
  },
  {
    service: 'Model Build & Train',
    outcome: 'Creation of models & training of models'
  },
  {
    service: 'Ada: Proprietary DSML Platform',
    outcome: 'Data Management, Cleaning, Transformation, Masking, Compliance, Pipeline management, 23 ML models, low-code, rapid deployment.'
  }
];

const softwareServices = [
  {
    service: 'User Journey Mapping',
    outcome: 'User Journey and Service Cycle Mapping'
  },
  {
    service: 'Concept Creation',
    outcome: 'The concept behind the product or service, target market identification'
  },
  {
    service: 'Research & Strategy',
    outcome: 'Product/service strategy document: strategy vision and directives, market dynamics and competitive analysis, target audience profiles and segmentation needs, objectives and metrics, go-to-market strategy'
  },
  {
    service: 'Architecture',
    outcome: 'Architecture artefacts, process flow, data flows, data usage rules, governance'
  },
  {
    service: 'Business & Technical Requirements',
    outcome: 'Technical documentation detailing all the outcome'
  },
  {
    service: 'Software Integrations',
    outcome: 'Integration discovery, mapping, and build'
  },
  {
    service: 'Software Build',
    outcome: 'Software development, testing, and refinement.'
  },
  {
    service: 'Ava: Proprietary LLM powered AI Software Development Platform',
    outcome: 'Product Planning and Management, Architecture, Design, Development, Data, and Testing tools and agents for your entire team from Product Manager to QA and Testers. Deliver code faster to your clients or improve internal software development productivity.'
  }
];

/* Industry filter for the examples grid. 'all' is the default and shows every
   example with its general summary; the other ids key into each example's
   `industries` map, whose presence also decides whether a tile is relevant. */
const INDUSTRIES = [
  { id: 'all', label: 'All' },
  { id: 'finance', label: 'Finance' },
  { id: 'banking', label: 'Banking' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'insights', label: 'Insights' },
  { id: 'rnd', label: 'Research & Development' }
];

const examples = [
  {
    title: 'Enterprise Data Lake design and creation',
    summary: 'One governed store for every source system, so analysis stops starting with a data hunt.',
    industries: {
      finance: 'Consolidates ledgers, treasury feeds and market data into one governed store, so reporting reconciles against a single source.',
      banking: 'Brings core banking, cards and channel data together, so a customer view no longer means joining four extracts by hand.',
      insurance: 'Unifies policy, claims, broker and reinsurance data, making portfolio questions answerable without a data request queue.',
      cybersecurity: 'Centralises log, endpoint and identity telemetry with retention that satisfies both investigators and auditors.',
      insights: 'Gives analysts one governed place to query, so findings are reproducible instead of locked in someone\'s spreadsheet.',
      rnd: 'Keeps experiment data, instrument output and prior results queryable together, so past work is reusable rather than rediscovered.'
    }
  },
  {
    title: 'Data transformation, cleaning and generation',
    summary: 'Turns messy source data into something models and reports can actually rely on.',
    industries: {
      finance: 'Normalises instrument and counterparty records across systems, so the same entity is not counted three ways.',
      banking: 'Standardises customer, account and transaction records, resolving the duplicates that distort every downstream metric.',
      insurance: 'Cleans decades of policy and claims history into consistent schemas, making long-horizon analysis viable.',
      cybersecurity: 'Parses and normalises heterogeneous log formats into one schema, so detection rules work across the estate.',
      insights: 'Removes the cleaning tax from every study, so analyst time goes to interpretation rather than reformatting.',
      rnd: 'Generates synthetic and augmented datasets where real samples are scarce, expensive or restricted.'
    }
  },
  {
    title: 'Compliance and ML/AI readiness of data',
    summary: 'Establishes whether your data can lawfully and practically support the models you want to build.',
    industries: {
      finance: 'Assesses lineage, retention and consent before a model touches client data, so model risk review does not stall the build.',
      banking: 'Documents provenance and fair-lending exposure up front, so a model can survive regulatory scrutiny.',
      insurance: 'Checks that rating and claims data can lawfully feed pricing models, flagging proxies for protected attributes.',
      cybersecurity: 'Classifies sensitive fields and sets masking rules, so security analytics does not itself become an exposure.',
      rnd: 'Confirms licensing, consent and provenance of research data before it is committed to a model pipeline.'
    }
  },
  {
    title: 'Continuous Operations Monitoring',
    summary: 'Watches live operational flows and surfaces the breaks while they can still be fixed.',
    industries: {
      finance: 'Tracks settlement, reconciliation and payment flows in real time, catching breaks before end-of-day.',
      banking: 'Monitors channel, payment and core-system throughput, so a degraded service is noticed before customers report it.',
      insurance: 'Follows claims and policy administration pipelines, surfacing stalled cases before service levels are breached.',
      cybersecurity: 'Maintains continuous visibility of control health and coverage gaps rather than a point-in-time snapshot.'
    }
  },
  {
    title: 'Anomaly and error detection',
    summary: 'Learns normal behaviour, then flags the departures worth a human look.',
    industries: {
      finance: 'Flags irregular transactions, mispostings and valuation outliers for review before they reach a reported figure.',
      banking: 'Separates genuine fraud signals from noise, cutting false positives that burn analyst hours.',
      insurance: 'Surfaces claims patterns inconsistent with the policy and cohort, prioritising which to investigate.',
      cybersecurity: 'Detects deviations in user and system behaviour that signature-based tooling does not see.'
    }
  },
  {
    title: 'Revenue Protection Models',
    summary: 'Finds the leakage between what you earned and what you actually collected.',
    industries: {
      finance: 'Identifies fee leakage, uncollected income and billing errors across the book.',
      banking: 'Predicts collection outcomes and arrears risk, so intervention effort goes where it recovers most.',
      insurance: 'Detects premium leakage and under-rated exposure, recovering margin without touching the rate book.'
    }
  },
  {
    title: 'Continuous Risk Scoring',
    summary: 'Live risk scores that update as new data lands, instead of a quarterly batch.',
    industries: {
      finance: 'Scores every counterparty and exposure continuously, so committees act on today\'s position rather than last quarter\'s.',
      banking: 'Re-scores borrowers between review cycles, surfacing deterioration early enough to restructure.',
      insurance: 'Reprices risk as claims and exposure data arrives, keeping portfolio limits meaningful.',
      cybersecurity: 'Ranks assets and identities by live threat exposure, so remediation effort lands where it matters.'
    }
  },
  {
    title: 'Customer Churn Retention Modelling',
    summary: 'Identifies who is about to leave, early enough to do something about it.',
    industries: {
      banking: 'Spots the behavioural shifts that precede a primary-account switch, while the relationship is still recoverable.',
      insurance: 'Predicts non-renewal at policy level and ranks which interventions actually hold the book.',
      insights: 'Explains the drivers behind churn, not just the score, so retention strategy has something to act on.'
    }
  },
  {
    title: 'Lead scoring Optimisation',
    summary: 'Ranks prospects by likely value so effort concentrates where it converts.',
    industries: {
      banking: 'Prioritises cross-sell and onboarding effort by predicted lifetime value rather than product quota.',
      insurance: 'Scores broker and direct leads on conversion and expected loss ratio together, not volume alone.',
      insights: 'Quantifies which channels and segments genuinely produce revenue, closing the loop on spend.'
    }
  },
  {
    title: 'Automated Pricing & Logistics Engines',
    summary: 'Codifies pricing and routing decisions so they are consistent, fast and auditable.',
    industries: {
      finance: 'Applies pricing and fee logic consistently across products, with every decision traceable to a rule.',
      banking: 'Automates rate and limit decisioning within policy, cutting turnaround without widening risk appetite.',
      insurance: 'Runs rating and quote generation against live exposure data, so pricing moves with the portfolio.'
    }
  },
  {
    title: 'Client & Market Segmentation',
    summary: 'Groups your market by behaviour that actually predicts something, not by convenient labels.',
    industries: {
      banking: 'Segments on behaviour and need rather than product holdings, which changes what you offer whom.',
      insurance: 'Builds risk and value segments that hold up in pricing and in distribution strategy.',
      insights: 'Produces segments backed by evidence and sized against the real population, ready to brief on.'
    }
  },
  {
    title: 'Sentiment Analysis & Content Guardrails',
    summary: 'Reads language at volume and enforces limits on what generated text may say.',
    industries: {
      cybersecurity: 'Screens inbound and generated content for social-engineering and data-exfiltration patterns.',
      insights: 'Measures sentiment across open text at a scale manual coding cannot reach, with the method documented.',
      rnd: 'Puts enforceable guardrails around model output, so experimental systems stay inside policy.'
    }
  },
  {
    title: 'Unstructured Data & Document Grouping',
    summary: 'Makes sense of the documents, notes and correspondence nobody has ever been able to query.',
    industries: {
      banking: 'Classifies and extracts from onboarding and KYC packs, cutting manual review per file.',
      insurance: 'Groups and extracts from claims correspondence, reports and schedules, so assessors read less to decide more.',
      cybersecurity: 'Clusters incident reports and ticket text to reveal recurring root causes behind separate tickets.',
      insights: 'Codes open-ended responses and interview transcripts consistently, at a volume manual coding cannot match.',
      rnd: 'Organises literature, lab notes and prior reports so existing knowledge is findable before work is repeated.'
    }
  },
  {
    title: 'Social Graph Network Analytics',
    summary: 'Maps the relationships between entities to expose structure that row-by-row analysis misses.',
    industries: {
      banking: 'Reveals rings and shared-attribute clusters across accounts that look unrelated individually.',
      insurance: 'Links claimants, providers and intermediaries to surface organised claim patterns.',
      cybersecurity: 'Maps lateral movement paths and trust relationships across identities and infrastructure.',
      insights: 'Shows how influence and information actually travel through a population, rather than assuming it.'
    }
  },
  {
    title: 'Claims and benefits processing',
    summary: 'Automates the routine path through a claim while routing the exceptions to people.',
    industries: {
      insurance: 'Straight-through processes clean claims and routes only genuine exceptions to assessors, with every decision logged.'
    }
  },
  {
    title: 'Governed workflow automation',
    summary: 'Automation with the audit trail, approvals and controls built in from the start.',
    industries: {
      finance: 'Automates controlled processes with segregation of duties and an evidence trail auditors accept.',
      banking: 'Embeds approval gates and policy checks in the workflow, so speed does not cost control.',
      insurance: 'Routes underwriting and claims decisions through recorded authority limits rather than inbox convention.',
      cybersecurity: 'Automates response playbooks with approval gates, so containment is fast and still accountable.'
    }
  },
  {
    title: 'Operational intelligence systems',
    summary: 'Puts the current state of operations in front of the people who make the decisions.',
    industries: {
      finance: 'Gives finance leadership live position and exposure views instead of a month-end retrospective.',
      banking: 'Surfaces branch, channel and portfolio performance as it happens, so intervention is same-day.',
      insurance: 'Tracks underwriting and claims performance against plan continuously, not in quarterly review.',
      cybersecurity: 'Consolidates posture, coverage and incident state into one operational picture.',
      insights: 'Replaces recurring manual reporting with live, self-serve views the business can interrogate.',
      rnd: 'Tracks experiment throughput and resource use, so pipeline bottlenecks are visible early.'
    }
  },
  {
    title: 'Enterprise prototypes that can move into production',
    summary: 'Prototypes built on production foundations, so a successful pilot is not a rewrite.',
    industries: {
      finance: 'Tests a concept against real data under real controls, so the pilot result is one you can bank on.',
      banking: 'Proves an idea inside the existing control environment, so approval is not a second project.',
      insurance: 'Validates a pricing or claims concept on live portfolio data before committing to a programme.',
      cybersecurity: 'Trials detections and controls in a production-equivalent environment before rollout.',
      insights: 'Stands up a working version of the analysis so stakeholders can use it, not just read about it.',
      rnd: 'Takes promising research into a deployable build without the usual handover rewrite.'
    }
  }
];

/* Shared two-column service table, used by both tracks. */
const ServiceTable = ({ rows, caption }) => (
  <div className="service-table-wrapper">
    <table className="service-table">
      <caption className="visually-hidden">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Service</th>
          <th scope="col">Outcome/delivery/capability</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.service}>
            <th scope="row" data-label="Service">{row.service}</th>
            <td data-label="Outcome/delivery/capability">{row.outcome}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Offerings = () => {
  const [industry, setIndustry] = useState('all');

  /* Under 'all' every example shows its general summary; under a specific
     industry only the examples that address it are relevant. */
  const visibleExamples = industry === 'all'
    ? examples
    : examples.filter((example) => example.industries[industry]);

  const activeLabel = INDUSTRIES.find((entry) => entry.id === industry).label;

  return (
    <div className="offerings">
      <SEO
        title="Offerings"
        description="We work with leaders and operations to implement strategic agendas across Data, Machine Learning, and AI. Advanced analytics, AI services, and design, product, and software services."
        keywords="AI services, machine learning services, data services, ML architecture, agentic systems architecture, software development, product strategy, data discovery"
        structuredData={[getServiceSchema(), getWebPageSchema('/offerings', 'Offerings - DataPulse AI', 'Advanced analytics, insights, AI services, and software delivery.')]}
      />
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="offerings-hero section-sm">
        <div className="container">
          <motion.div
            className="offerings-hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp}>Offerings</motion.h1>

            <motion.p className="offerings-lead" variants={fadeInUp}>
              We work with leaders and operations to implement strategic agendas across Data,
              Machine Learning, and AI.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Advanced Analytics, Insights, and AI Services */}
      <section className="analytics-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Advanced Analytics, Insights, and AI Services
            </motion.h2>

            <motion.div variants={fadeInUp}>
              <ServiceTable
                rows={analyticsServices}
                caption="Advanced analytics, insights, and AI services by service and outcome"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Design, Product, and Software Services */}
      <section className="software-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Design, Product, and Software Services
            </motion.h2>

            <motion.div variants={fadeInUp}>
              <ServiceTable
                rows={softwareServices}
                caption="Design, product, and software services by service and outcome"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Examples of what we do */}
      <section className="examples-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Examples of what we do:
            </motion.h2>

            <motion.div
              className="industry-filter"
              role="group"
              aria-label="Filter examples by industry"
              variants={fadeInUp}
            >
              {INDUSTRIES.map((entry) => (
                <button
                  type="button"
                  key={entry.id}
                  className="industry-chip"
                  aria-pressed={industry === entry.id}
                  onClick={() => setIndustry(entry.id)}
                >
                  {entry.label}
                </button>
              ))}
            </motion.div>

            {/* Filtering changes the grid silently, so announce the result */}
            <p className="visually-hidden" aria-live="polite">
              {`${visibleExamples.length} examples shown for ${activeLabel}.`}
            </p>

            {/* Tiles drive their own entry animation rather than inheriting a
                variant. The section's whileInView gesture fires once and then
                freezes, so a variant child mounting later (on a filter change)
                would have no state to animate to and would stay hidden. */}
            <motion.ul className="examples-grid" variants={fadeInUp}>
              {visibleExamples.map((example) => (
                <motion.li
                  className="example-item"
                  key={example.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <h3 className="example-title">{example.title}</h3>
                  <p className="example-detail">
                    {industry === 'all' ? example.summary : example.industries[industry]}
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      {/* Startup Partnership */}
      <section className="startup-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="startup-content"
          >
            <div className="startup-badge">For Startups</div>
            <h2>Fueling the Next Wave of <span className="gradient-text">Innovation</span></h2>
            <p>
              For high-potential, early-stage startups, we offer a unique partnership model.
              We invest our deep technical expertise and technology helping you accelerate your
              growth and achieve your vision when cash flow is critical.
            </p>
            <a href={`mailto:${CONTACT_EMAILS.PRIMARY}?subject=Startup Partnership Inquiry`} className="btn btn-secondary">
              Learn About Startup Partnership
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="offerings-cta section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="cta-content"
          >
            <h2>Ready to Get Started?</h2>
            <p>Let's discuss how we can implement your data, ML, and AI strategy.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">
                Schedule a Call
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Offerings;
