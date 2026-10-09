import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../animations/AnimatedBackground';
import SEO from '../components/SEO';
import { fadeInUp, staggerContainer } from '../constants/animations';
import { getWebPageSchema } from '../utils/structuredData';
import './UseCases.css';

/* Carousel geometry. These must stay in sync with --partner-card-w and the
   track gap in UseCases.css — the loop is seamless only when the track is
   translated by exactly one set's width. */
const PARTNER_CARD_WIDTH = 200;
const PARTNER_CARD_GAP = 32;
const PARTNER_SET_REPEAT = 5;
const PARTNER_SCROLL_SECONDS_PER_CARD = 3;

const UseCases = () => {
  const trackRecord = [
    {
      title: 'Health Scanning Application',
      description: 'Rebuilding of mobile health scanning application into a web-based application featuring face, body, finger, and other health scanning technologies to provide non-invasive diagnosis.'
    },
    {
      title: 'GenAI Claims Agent and Rules Engine',
      description: 'Design, build, and implementation of multi-lingual GenAI claims agents and rules engine to process claims and unclaimed benefits. The agents integrate to Salesforce and automatically process claims while creating tickets.'
    },
    {
      title: 'Propensity and Prediction to Pay Model',
      description: 'Design, development, and implementation of a model that predicts with an 80% accuracy which clients would not pay their first premium. This increased first premium collection by 7% in the first month of testing.'
    },
    {
      title: 'Social Media Targeting Model',
      description: 'Design and implementation of a digital marketing model to inform and push market access. Model led to the conversion of 58% of most valuable clients across digital channels.'
    },
    {
      title: 'Education Platform',
      description: 'Design, develop, and implementation of a finance and investment education platform. The platform includes several learning spaces and mediums with multiple value-adds to provide both education and information to the public.'
    },
    {
      title: 'Payment Recovery Chat Bots',
      description: 'Redesign, implementation, and refinement of a payment management and recovery chatbot for a payment gateway provider managing multiple tasks surrounding payments and services.'
    }
  ];

  const partners = [
    { name: 'Abacus Insurance', logo: '/partners/abacus-insurance.png' },
    { name: 'Advanced Health Intelligence', logo: '/partners/ahi.png' },
    { name: 'Metropolitan', logo: '/partners/mmi-holdings.png' },
    { name: 'Precium', logo: '/partners/precium.png' }
    // Add back when the asset lands: { name: 'Sens', logo: '/partners/sens.png' }
  ];

  // One set's travel distance; repeating the set keeps wide viewports filled.
  const setWidth = partners.length * (PARTNER_CARD_WIDTH + PARTNER_CARD_GAP);
  const carouselDuration = partners.length * PARTNER_SCROLL_SECONDS_PER_CARD;
  const partnerSets = Array.from({ length: PARTNER_SET_REPEAT });

  return (
    <div className="use-cases">
      <SEO
        title="Use Cases"
        description="Over 17 years we've implemented transformative solutions across industries and have applied AI since 2013. Explore our track record in ML, AI, and software delivery."
        keywords="AI use cases, machine learning case studies, data science projects, GenAI claims, propensity models, predictive modelling, AI track record"
        structuredData={[getWebPageSchema('/use-cases', 'Use Cases - DataPulse AI', 'Our track record implementing data, ML, and AI solutions across industries.')]}
      />
      <AnimatedBackground />

      {/* Track Record Section */}
      <section className="track-record-section section">
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className="section-title">
              Use Cases
            </motion.h1>

            <motion.p className="track-record-intro" variants={fadeInUp}>
              Over 17 years, we've implemented transformative solutions across industries and
              have applied AI since 2013.
            </motion.p>

            <div className="track-record-grid">
              {trackRecord.map((project, index) => (
                <motion.div
                  key={index}
                  className="track-record-card"
                  variants={fadeInUp}
                >
                  <div className="project-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="values-content"
          >
            <motion.h2 variants={fadeInUp}>
              Built on <span className="gradient-text">Trust and Results</span>
            </motion.h2>

            <motion.div className="values-grid" variants={fadeInUp}>
              <div className="value-item">
                <h3>80%</h3>
                <p>Prediction Accuracy</p>
              </div>
              <div className="value-item">
                <h3>7%</h3>
                <p>Increased Revenue</p>
              </div>
              <div className="value-item">
                <h3>58%</h3>
                <p>Client Conversion</p>
              </div>
            </motion.div>

            <motion.p className="values-description" variants={fadeInUp}>
              These aren't just numbers—they represent real business impact for our partners.
              We don't measure success by lines of code or features delivered, but by the
              tangible value we create for your organization.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="partners-content"
          >
            <h2>Our Experience Includes <span className="gradient-text">Working and Partnering with</span></h2>
          </motion.div>
        </div>

        <div className="carousel-container">
          <motion.div
            className="carousel-track"
            animate={{ x: [0, -setWidth] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: carouselDuration,
                ease: 'linear'
              }
            }}
          >
            {partnerSets.map((_, setIndex) =>
              partners.map((partner, index) => (
                <div key={`partner-${setIndex}-${index}`} className="partner-card">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="partner-logo"
                    loading="lazy"
                  />
                </div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="use-cases-cta section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="cta-content"
          >
            <h2>Let's achieve your AI strategies together</h2>
            <div className="cta-buttons">
              <Link to="/offerings" className="btn btn-primary">
                Offerings
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UseCases;
