import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../animations/AnimatedBackground';
import SEO from '../components/SEO';
import { fadeInUp, staggerContainer } from '../constants/animations';
import { getPersonSchema, getWebPageSchema } from '../utils/structuredData';
import './About.css';

const About = () => {
  const philosophyPillars = [
    {
      title: 'Pragmatic Innovation',
      description: 'We focus on solving real-world business problems. Our success is measured by the tangible impact we have on your KPIs, whether it\'s increasing revenue, reducing costs, or mitigating risk.'
    },
    {
      title: 'Radical Transparency',
      description: 'We operate as an extension of your team. You get clear, consistent communication and a predictable financial model that eliminates the uncertainty of project-based billing.'
    },
    {
      title: 'Sustainable Partnership',
      description: 'Our goal is to empower your organization for the long term. We build solutions that your team can own and maintain, and we provide the training and onboarding to ensure you get the most value from the technology we create together.'
    }
  ];

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

  const teamMembers = [
    {
      name: 'Arthur Procopos',
      title: 'Co-founder and Director',
      photo: '/team/arthur.jpg'
    },
    {
      name: 'Calvin Nigrini',
      title: 'Co-founder and Director',
      photo: '/team/calvin.jpg'
    },
    {
      name: 'Dr. Riaan Conradie',
      title: 'Co-founder',
      photo: '/team/riaan.jpg'
    }
  ];

  const partners = [
    { name: 'Samsung', logo: '/partners/samsung.png' },
    { name: 'Nokia', logo: '/partners/nokia.png' },
    { name: 'Sony Ericsson', logo: '/partners/sony-ericsson.png' },
    { name: 'TomTom', logo: '/partners/tomtom.png' },
    { name: 'Garmin', logo: '/partners/garmin.png' },
    { name: 'Montblanc', logo: '/partners/montblanc.png' },
    { name: 'Amazon', logo: '/partners/amazon.png' },
    { name: 'Texas Instruments', logo: '/partners/texas-instruments.png' },
    { name: 'Analog Devices', logo: '/partners/analog-devices.png' },
    { name: 'Qualcomm', logo: '/partners/qualcomm.png' },
    { name: 'Maxim Integrated', logo: '/partners/maxim-integrated.png' },
    { name: 'Osram', logo: '/partners/osram.png' },
    { name: 'LG Innotek', logo: '/partners/lg-innotek.png' },
    { name: '1Life', logo: '/partners/1life.png' },
    { name: 'MMI Holdings', logo: '/partners/mmi-holdings.png' },
    { name: 'Unisure', logo: '/partners/unisure.png' },
    { name: 'Hannover Re', logo: '/partners/hannover-re.png' },
    { name: 'Abacus Insurance', logo: '/partners/abacus-insurance.png' },
    { name: 'Precium', logo: '/partners/precium.png' },
    { name: 'Advanced Health Intelligence', logo: '/partners/ahi.png' }
  ];

  return (
    <div className="about">
      <SEO
        title="About Us - DataPulse AI"
        description="Founded by Arthur Procopos, Calvin Nigrini, and Dr. Riaan Conradie. Over 25 years of experience delivering transformative AI and software solutions. We're builders, not just consultants."
        keywords="DataPulse AI team, AI development company, machine learning experts, software development team, tech consulting, innovation delivery"
        structuredData={[
          getPersonSchema('Arthur Procopos', 'Co-founder and Director'),
          getPersonSchema('Calvin Nigrini', 'Co-founder and Director'),
          getPersonSchema('Dr. Riaan Conradie', 'Co-founder'),
          getWebPageSchema('about', 'About Us - DataPulse AI', 'Learn about DataPulse AI\'s team, philosophy, and track record.')
        ]}
      />
      <AnimatedBackground theme="solution" />

      {/* Hero Section */}
      <section className="about-hero section">
        <div className="container">
          <motion.div
            className="about-hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp}>
              We're a Team of <span className="gradient-text">Builders</span>,<br />
              Not Just Consultants
            </motion.h1>

            <motion.p className="about-intro" variants={fadeInUp}>
              DataPulse AI was founded by <strong>Arthur Procopos</strong>, <strong>Calvin Nigrini</strong>, and <strong>Dr. Riaan Conradie (PhD)</strong> with
              a single mission: to make the power of AI, ML, and custom software accessible and valuable for
              businesses frustrated with the traditional, slow, and expensive development models.
            </motion.p>

            <motion.p className="about-description" variants={fadeInUp}>
              We've spent over a decade in the trenches of R&D, building complex solutions for enterprises
              and startups alike. We saw a better way—a model that combines deep human expertise with
              powerful technological leverage to deliver real business outcomes, not just reports and
              recommendations.
            </motion.p>

            {/* Team Members Grid */}
            <motion.div className="team-grid" variants={fadeInUp}>
              {teamMembers.map((member, index) => {
                const photoClass = member.name === 'Arthur Procopos'
                  ? 'team-photo team-photo-arthur'
                  : member.name === 'Calvin Nigrini'
                  ? 'team-photo team-photo-calvin'
                  : 'team-photo';

                return (
                  <motion.div
                    key={index}
                    className="team-card"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="team-photo-container">
                      <img src={member.photo} alt={member.name} className={photoClass} />
                    </div>
                    <div className="team-info">
                      <h3 className="team-name">{member.name}</h3>
                      <p className="team-title">{member.title}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Banner */}
      <section className="experience-banner">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="experience-content"
          >
            <h2>25+ Years of Experience</h2>
            <p>Working with startups, private companies, enterprises and public companies</p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Our <span className="gradient-text">Philosophy</span>
            </motion.h2>

            <motion.h3 className="philosophy-subtitle" variants={fadeInUp}>
              Technology Should Augment Your Team, Not Replace It
            </motion.h3>

            <div className="philosophy-grid">
              {philosophyPillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  className="philosophy-card"
                  variants={fadeInUp}
                >
                  <div className="pillar-number">0{index + 1}</div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Track Record Section */}
      <section className="track-record-section section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Proof, Not Promises: <span className="gradient-text">Our Track Record</span>
            </motion.h2>

            <motion.p className="track-record-intro" variants={fadeInUp}>
              Over 25 years, we've delivered transformative solutions across industries
            </motion.p>

            <div className="track-record-grid">
              {trackRecord.map((project, index) => (
                <motion.div
                  key={index}
                  className="track-record-card"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03 }}
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
            animate={{
              x: [0, -5400]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 55,
                ease: "linear"
              }
            }}
          >
            {/* First set of partners */}
            {partners.map((partner, index) => (
              <div key={`partner-1-${index}`} className="partner-card">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="partner-logo"
                  loading="lazy"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <div key={`partner-2-${index}`} className="partner-card">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="partner-logo"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="cta-content"
          >
            <h2>Let's Build Something Great Together</h2>
            <p>Ready to turn your innovation backlog into delivered results?</p>
            <div className="cta-buttons">
              <Link to="/services" className="btn btn-primary">
                Explore Services
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

export default About;
