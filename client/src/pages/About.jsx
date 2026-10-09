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

  const leadership = [
    {
      name: 'Arthur Procopos',
      title: 'CEO and Innovation Officer',
      photo: '/team/arthur.jpg',
      photoClass: 'team-photo team-photo-arthur'
    },
    {
      name: 'Calvin Nigrini',
      title: 'CTO and Information Officer',
      photo: '/team/calvin.jpg',
      photoClass: 'team-photo team-photo-calvin'
    }
  ];

  return (
    <div className="about">
      <SEO
        title="About Us"
        description="A human and data science consultancy with proprietary data sciences, machine learning, and AI technology. Since 2024 we have helped organisations implement strategic agendas in ML and AI."
        keywords="DataPulse AI team, data science consultancy, human data science, machine learning consultancy, AI readiness, AI risk, technology consulting"
        structuredData={[
          getPersonSchema('Arthur Procopos', 'CEO and Innovation Officer'),
          getPersonSchema('Calvin Nigrini', 'CTO and Information Officer'),
          getWebPageSchema('/about', 'About Us - DataPulse AI', 'Learn about DataPulse AI\'s practice, values, and leadership.')
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
              We are a human and data science consultancy with proprietary data sciences,
              machine learning, and AI technology.
            </motion.h1>

            <motion.p className="about-intro" variants={fadeInUp}>
              Since 2024, DataPulse AI has helped organisations implement and achieve strategic
              agendas in machine learning and AI technology. By helping our clients understand
              their data, machine learning and AI technology readiness and risk, we bridge the
              gap between strategy and operations to implement new technology alongside your
              people and clients by maintaining a human first approach.
            </motion.p>
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
            <h2>17+ Years of Experience</h2>
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

      {/* Our Practice */}
      <section className="practice-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="statement-block"
          >
            <motion.h2 variants={fadeInUp}>Our Practice</motion.h2>
            <motion.p variants={fadeInUp}>
              We understand that technology is pointless without people and designed a practice
              rooted in human, data, and computer sciences. By understanding people, data, and
              technology we bridge the gap between strategy, the market, data, and operations
              helping organisations grow and evolve.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="our-values-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="statement-block"
          >
            <motion.h2 variants={fadeInUp}>Our Values</motion.h2>
            <motion.p variants={fadeInUp}>
              We are the most anti-AI, AI business. Technology without humans is at best boring.
              It's not about humans out of or on the loop or anywhere else but in the loop.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Leadership — sits below Our Values */}
      <section className="leadership-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Our Leadership
            </motion.h2>

            <motion.p className="leadership-intro" variants={fadeInUp}>
              We've spent over a decade in the trenches of R&D, building complex solutions for
              enterprises and startups alike. We saw a better way and established DataPulse AI
              for the single mission to apply a deep understanding of human and data sciences to
              achieve strategic initiatives and agendas to create 5th Industrial Revolution
              organisations.
            </motion.p>

            <motion.div className="team-grid" variants={fadeInUp}>
              {leadership.map((member) => (
                <motion.div
                  key={member.name}
                  className="team-card"
                  variants={fadeInUp}
                >
                  <div className="team-photo-container">
                    <img src={member.photo} alt={member.name} className={member.photoClass} />
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-title">{member.title}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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

export default About;
