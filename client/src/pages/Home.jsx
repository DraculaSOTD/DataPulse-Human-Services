import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../animations/AnimatedBackground';
import SEO from '../components/SEO';
import { fadeInUp, staggerContainer } from '../constants/animations';
import { PERFORMANCE_INDICATORS } from '../constants/indicators';
import { getOrganizationSchema, getWebPageSchema } from '../utils/structuredData';
import './Home.css';

/* Industry filter for the examples grid. 'all' is the default and shows every
   example with its general summary; the other ids key into each example's
   `industries` map, whose presence also decides whether a tile is relevant. */
const INDUSTRIES = [
  { id: 'all', label: 'All' },
  { id: 'finance', label: 'Finance' },
  { id: 'banking', label: 'Banking' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'telecoms', label: 'Telecommunications' },
  { id: 'retail', label: 'Retail' },
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
      telecoms: 'Joins network, billing, CRM and usage data in one governed store, so a subscriber view no longer means stitching OSS and BSS extracts together.',
      retail: 'Brings POS, e-commerce, loyalty and supply-chain data together, so online and in-store performance can be read as one picture.',
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
      telecoms: 'Reconciles CDR, provisioning and network inventory records, so the same subscriber and cell site are not counted under three identifiers.',
      retail: 'Cleans and matches product, SKU and supplier data across channels, so catalogue and stock figures finally agree.',
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
      telecoms: 'Establishes what location, usage and content metadata may lawfully feed a model, before a build runs into the regulator.',
      retail: 'Confirms that loyalty, browsing and payment data carries the consent a personalisation model depends on.',
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
      cybersecurity: 'Maintains continuous visibility of control health and coverage gaps rather than a point-in-time snapshot.',
      telecoms: 'Watches network, provisioning and activation flows, so a degraded cell or stalled order is caught before the complaint arrives.',
      retail: 'Tracks checkout, fulfilment and replenishment flows live, so a stockout or failing payment route is fixed the same day.'
    }
  },
  {
    title: 'Anomaly and error detection',
    summary: 'Learns normal behaviour, then flags the departures worth a human look.',
    industries: {
      finance: 'Flags irregular transactions, mispostings and valuation outliers for review before they reach a reported figure.',
      banking: 'Separates genuine fraud signals from noise, cutting false positives that burn analyst hours.',
      insurance: 'Surfaces claims patterns inconsistent with the policy and cohort, prioritising which to investigate.',
      cybersecurity: 'Detects deviations in user and system behaviour that signature-based tooling does not see.',
      telecoms: 'Separates genuine network faults and subscription fraud from ordinary traffic variation, so engineers chase real issues.',
      retail: 'Flags shrinkage, pricing errors and card-not-present fraud patterns while the transactions can still be stopped.'
    }
  },
  {
    title: 'Revenue Protection Models',
    summary: 'Finds the leakage between what you earned and what you actually collected.',
    industries: {
      finance: 'Identifies fee leakage, uncollected income and billing errors across the book.',
      banking: 'Predicts collection outcomes and arrears risk, so intervention effort goes where it recovers most.',
      insurance: 'Detects premium leakage and under-rated exposure, recovering margin without touching the rate book.',
      telecoms: 'Finds the rating, mediation and interconnect leakage that revenue assurance spreadsheets miss.',
      retail: 'Surfaces margin leakage across promotions, markdowns and supplier rebates, recovering profit without changing list prices.'
    }
  },
  {
    title: 'Continuous Risk Scoring',
    summary: 'Live risk scores that update as new data lands, instead of a quarterly batch.',
    industries: {
      finance: 'Scores every counterparty and exposure continuously, so committees act on today\'s position rather than last quarter\'s.',
      banking: 'Re-scores borrowers between review cycles, surfacing deterioration early enough to restructure.',
      insurance: 'Reprices risk as claims and exposure data arrives, keeping portfolio limits meaningful.',
      cybersecurity: 'Ranks assets and identities by live threat exposure, so remediation effort lands where it matters.',
      telecoms: 'Scores contract and device-financing risk as usage and payment behaviour changes, not at sign-up only.',
      retail: 'Keeps credit, instalment and supplier-concentration risk scored live, so exposure is known before the next order.'
    }
  },
  {
    title: 'Customer Churn Retention Modelling',
    summary: 'Identifies who is about to leave, early enough to do something about it.',
    industries: {
      banking: 'Spots the behavioural shifts that precede a primary-account switch, while the relationship is still recoverable.',
      insurance: 'Predicts non-renewal at policy level and ranks which interventions actually hold the book.',
      telecoms: 'Predicts churn ahead of contract end and port-out, while a retention offer can still change the outcome.',
      retail: 'Flags the loyalty customers drifting toward a competitor, early enough for a targeted offer rather than a blanket discount.',
      insights: 'Explains the drivers behind churn, not just the score, so retention strategy has something to act on.'
    }
  },
  {
    title: 'Lead scoring Optimisation',
    summary: 'Ranks prospects by likely value so effort concentrates where it converts.',
    industries: {
      banking: 'Prioritises cross-sell and onboarding effort by predicted lifetime value rather than product quota.',
      insurance: 'Scores broker and direct leads on conversion and expected loss ratio together, not volume alone.',
      telecoms: 'Ranks upgrade and cross-sell candidates by expected contract value net of subsidy, not handset volume.',
      retail: 'Scores prospects on predicted basket value and repeat likelihood, so acquisition spend buys customers worth keeping.',
      insights: 'Quantifies which channels and segments genuinely produce revenue, closing the loop on spend.'
    }
  },
  {
    title: 'Automated Pricing & Logistics Engines',
    summary: 'Codifies pricing and routing decisions so they are consistent, fast and auditable.',
    industries: {
      finance: 'Applies pricing and fee logic consistently across products, with every decision traceable to a rule.',
      banking: 'Automates rate and limit decisioning within policy, cutting turnaround without widening risk appetite.',
      insurance: 'Runs rating and quote generation against live exposure data, so pricing moves with the portfolio.',
      telecoms: 'Generates tariff, bundle and device pricing from live cost and usage data, and schedules field work along it.',
      retail: 'Drives markdown, promotion and replenishment decisions from live demand and stock, so pricing and logistics move together.'
    }
  },
  {
    title: 'Client & Market Segmentation',
    summary: 'Groups your market by behaviour that actually predicts something, not by convenient labels.',
    industries: {
      banking: 'Segments on behaviour and need rather than product holdings, which changes what you offer whom.',
      insurance: 'Builds risk and value segments that hold up in pricing and in distribution strategy.',
      telecoms: 'Segments subscribers on usage, device and network experience rather than plan name, which changes what you offer whom.',
      retail: 'Builds segments from real basket and visit behaviour, so range and store format decisions rest on evidence.',
      insights: 'Produces segments backed by evidence and sized against the real population, ready to brief on.'
    }
  },
  {
    title: 'Sentiment Analysis & Content Guardrails',
    summary: 'Reads language at volume and enforces limits on what generated text may say.',
    industries: {
      cybersecurity: 'Screens inbound and generated content for social-engineering and data-exfiltration patterns.',
      telecoms: 'Reads contact-centre transcripts at full volume to find which faults and offers actually drive complaints.',
      retail: 'Tracks sentiment across reviews and service chats, and keeps generated product copy inside brand and legal limits.',
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
      telecoms: 'Groups fault tickets, field notes and contracts so recurring network causes stop being filed as unrelated incidents.',
      retail: 'Structures supplier contracts, product specs and returns correspondence into something you can actually query.',
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
      telecoms: 'Analyses call and messaging graphs to find influence clusters and SIM-fraud rings that per-account checks miss.',
      retail: 'Maps basket affinity and referral networks, showing which products and customers actually pull others along.',
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
      cybersecurity: 'Automates response playbooks with approval gates, so containment is fast and still accountable.',
      telecoms: 'Automates provisioning, porting and field dispatch with the approvals and evidence trail the regulator expects.',
      retail: 'Runs supplier onboarding, price changes and returns through recorded authority limits rather than inbox convention.'
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
      telecoms: 'Puts network quality, churn and field performance on one live view, so regional teams act on today\'s position.',
      retail: 'Shows sales, stock and fulfilment by store and channel as it happens, so trading decisions are same-day.',
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
      telecoms: 'Trials a concept against live network and billing data before it is committed to a national rollout.',
      retail: 'Proves an idea in a handful of stores or one channel on production data, so the scale-up is not a rebuild.',
      insights: 'Stands up a working version of the analysis so stakeholders can use it, not just read about it.',
      rnd: 'Takes promising research into a deployable build without the usual handover rewrite.'
    }
  }
];

const Home = () => {
  const [industry, setIndustry] = useState('all');

  /* Under 'all' every example shows its general summary; under a specific
     industry only the examples that address it are relevant. */
  const visibleExamples = industry === 'all'
    ? examples
    : examples.filter((example) => example.industries[industry]);

  const activeLabel = INDUSTRIES.find((entry) => entry.id === industry).label;

  return (
    <div className="home">
      <SEO
        /* No title: falls back to "DataPulse AI - The Joy of Creation" */
        description="We partner with leaders on AI and technology strategies. DataPulse AI works with leaders and operations teams to implement data, machine learning, and AI technology."
        keywords="AI consultancy, data science consultancy, machine learning strategy, AI strategy, data strategy, ML implementation, AI implementation, technology consulting"
        ogType="website"
        structuredData={[getOrganizationSchema(), getWebPageSchema('/', 'DataPulse AI - Human and Data Science Consultancy', 'We partner with leaders on AI and technology strategies.')]}
      />
      <AnimatedBackground />

      {/* Hero Section — animation and pill only */}
      <section className="hero-section section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="hero-tag" variants={fadeInUp}>
              The Joy of Creation
            </motion.div>
          </motion.div>
        </div>

        <div className="scroll-indicator">
          <motion.div
            className="scroll-line"
            animate={{
              height: ['0%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>
      </section>

      {/* Partnership Section */}
      <section className="partnership-section section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="partnership-content"
          >
            {/* The page h1 — the hero carries no heading by design, so the
                document outline starts here. Sized by
                .partnership-section .section-title, which out-specifies the
                bare h1 rule, so the tag change is visually inert. */}
            <motion.h1 variants={fadeInUp} className="section-title">
              We partner with leaders on AI and technology strategies.
            </motion.h1>

            <motion.p className="partnership-lead" variants={fadeInUp}>
              We work with leaders and operation teams to development and implement data,
              machine learning (ML), and AI technology.
            </motion.p>

            <motion.div className="indicators" variants={fadeInUp}>
              <h3 className="indicators-title">Some performance indicators</h3>
              <div className="indicators-grid">
                {PERFORMANCE_INDICATORS.map((indicator) => (
                  <div className="stat" key={indicator.label}>
                    <h4>{indicator.value}</h4>
                    <p>{indicator.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Examples of what we do */}
      <section className="examples-section section">
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

      {/* Power Behind Our Offerings */}
      <section className="acceleration-section section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="acceleration-content"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Power behind our <span className="gradient-text">Offerings</span>
            </motion.h2>

            <motion.p className="acceleration-subtitle" variants={fadeInUp}>
              We built our own LLM AI software development and Data Science and Machine
              Learning (DSML) platform to enhance our workflows and offerings with the
              technology we help organisations design, build and implement.
            </motion.p>

            <motion.div className="acceleration-visual" variants={fadeInUp}>
              <div className="engine-flow">
                <div className="flow-step">
                  <div className="step-circle">
                    <h4>Ava & Ada</h4>
                  </div>
                  <p>Automate 80% of foundational work without technical debt</p>
                </div>

                <div className="flow-arrow">→</div>

                <div className="flow-step">
                  <div className="step-circle">
                    <h4>Human Expertise</h4>
                  </div>
                  <p>Engineers focus on solving unique business challenges</p>
                </div>

                <div className="flow-arrow">→</div>

                <div className="flow-step">
                  <div className="step-circle">
                    <h4>Production Ready</h4>
                  </div>
                  <p>Code, ML and AI deployments in as little as 2 weeks.</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="acceleration-features" variants={fadeInUp}>
              <div className="acceleration-card platform-card">
                <h3>Ava</h3>
                <p className="platform-role">
                  Proprietary LLM AI powered software development platform
                </p>

                <p className="coming-soon-label">Coming Soon</p>
                <ul>
                  <li>
                    On-prem private LLM model powering Ava — no more token costs for AI
                    powered software development workflows.
                  </li>
                  <li>
                    Includes Product Planning and Management, Architecture, Design,
                    Development, Data, and Testing tools and agents for your entire team
                    from Product Manager to QA and Testers.
                  </li>
                  <li>
                    Deliver code faster to your clients or improve internal software
                    development productivity.
                  </li>
                  <li>
                    Full workflow reporting, track what the LLM does and what your human
                    team does. Bridging the ownership gap.
                  </li>
                </ul>
              </div>

              <div className="acceleration-card platform-card">
                <h3>Ada</h3>
                <p className="platform-role">
                  Our proprietary Data Science and Machine Learning (DSML) Platform
                </p>

                <p className="coming-soon-label">Coming Soon</p>
                <ul>
                  <li>
                    On-prem private DSML Platform — no more usage and subscription costs
                    for data sciences and machine learning tools.
                  </li>
                  <li>Train and deploy 20+ ML models.</li>
                  <li>Transform, clean, and generate data.</li>
                  <li>Manage all integrations, data pipelines — inputs and outputs.</li>
                  <li>MLOps, Governance, and Compliance first platform.</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="cta-content"
          >
            <h2>Let's create together</h2>
            <div className="cta-buttons">
              <Link to="/about" className="btn btn-primary">
                Our Story
              </Link>
              <Link to="/offerings" className="btn btn-secondary">
                Offerings
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
