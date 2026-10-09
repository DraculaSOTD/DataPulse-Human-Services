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
    outcome: 'Creation of models, training of models'
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
    outcome: 'Software development + 2 testing and refinement cycles.'
  },
  {
    service: 'Ava: Proprietary LLM powered AI Software Development Platform',
    outcome: 'Fixed cost on-prem options available'
  }
];

const examples = [
  'Enterprise Data Lake design and creation',
  'Data transformation, cleaning and generation',
  'Compliance and ML/AI readiness of data',
  'Continuous Operations Monitoring',
  'Anomaly and error detection',
  'Revenue Protection Models',
  'Continuous Risk Scoring',
  'Customer Churn Retention Modelling',
  'Lead scoring Optimisation',
  'Automated Pricing & Logistics Engines',
  'Client & Market Segmentation',
  'Sentiment Analysis & Content Guardrails',
  'Unstructured Data & Document Grouping',
  'Social Graph Network Analytics',
  'Claims and benefits processing',
  'Governed workflow automation',
  'Operational intelligence systems',
  'Enterprise prototypes that can move into production'
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
  return (
    <div className="offerings">
      <SEO
        title="Offerings"
        description="We work with leaders and operations to implement strategic agendas across Data, Machine Learning, and AI. Advanced analytics, AI services, and a design, product, and software track."
        keywords="AI services, machine learning services, data services, ML architecture, agentic systems architecture, software development, product strategy, data discovery"
        structuredData={[getServiceSchema(), getWebPageSchema('/offerings', 'Offerings - DataPulse AI', 'Advanced analytics, insights, AI services, and software delivery.')]}
      />
      <AnimatedBackground theme="acceleration" />

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

      {/* Design, Product, and Software Track */}
      <section className="software-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Design, Product, and Software Track
            </motion.h2>

            <motion.div variants={fadeInUp}>
              <ServiceTable
                rows={softwareServices}
                caption="Design, product, and software track by service and outcome"
              />
            </motion.div>
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

            <motion.ul className="examples-grid" variants={fadeInUp}>
              {examples.map((example) => (
                <li className="example-item" key={example}>
                  {example}
                </li>
              ))}
            </motion.ul>
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
              <a href={`mailto:${CONTACT_EMAILS.PRIMARY}`} className="btn btn-primary">
                Schedule a Call
              </a>
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
