import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../animations/AnimatedBackground';
import SEO from '../components/SEO';
import { fadeInUp, staggerContainer } from '../constants/animations';
import { getOrganizationSchema, getWebPageSchema } from '../utils/structuredData';
import './Home.css';

const Home = () => {
  const [currentTheme, setCurrentTheme] = useState('default');

  const indicators = [
    { value: '80%', label: 'Work Automated' },
    { value: '15min', label: 'Prototype Speed' },
    { value: '17+', label: 'Years Experience' },
    { value: '7%', label: 'Increase in Revenue' }
  ];

  useEffect(() => {
    // Four sections now: hero, partnership, problem, offerings power.
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollPosition < windowHeight * 0.8) {
        setCurrentTheme('default');
      } else if (scrollPosition < windowHeight * 1.8) {
        setCurrentTheme('solution');
      } else if (scrollPosition < windowHeight * 2.8) {
        setCurrentTheme('problem');
      } else {
        setCurrentTheme('acceleration');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home">
      <SEO
        /* No title: falls back to "DataPulse AI - The Joy of Creation" */
        description="We partner with leaders on AI and technology strategies. DataPulse AI works with leaders and operations teams to implement data, machine learning, and AI technology."
        keywords="AI consultancy, data science consultancy, machine learning strategy, AI strategy, data strategy, ML implementation, AI implementation, technology consulting"
        ogType="website"
        structuredData={[getOrganizationSchema(), getWebPageSchema('/', 'DataPulse AI - Human and Data Science Consultancy', 'We partner with leaders on AI and technology strategies.')]}
      />
      <AnimatedBackground theme={currentTheme} />

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
                {indicators.map((indicator) => (
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

      {/* Problem Section */}
      <section className="problem-section section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="problem-content"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Great ideas are getting <span className="gradient-text">stuck...</span>
            </motion.h2>

            <div className="problem-cards">
              <motion.div className="problem-card" variants={fadeInUp}>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Slow Delivery</h3>
                <p>
                  Your in-house teams are brilliant, but they're buried in "keep-the-lights-on"
                  tasks. Your most innovative projects—the ones that drive real growth—are delayed
                  for months, or even years.
                </p>
              </motion.div>

              <motion.div className="problem-card" variants={fadeInUp}>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3>High Cost & Risk</h3>
                <p>
                  Building a specialized in-house AI team is incredibly expensive and time-consuming.
                  Traditional outsourcing projects often run over budget and fail to deliver, leaving
                  you with wasted resources and little to show for it.
                </p>
              </motion.div>

              <motion.div className="problem-card" variants={fadeInUp}>
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Inaccessible Technology</h3>
                <p>
                  The world of AI and advanced software is complex. You know the potential is there,
                  but harnessing it to solve your specific business problems feels out of reach without
                  taking on substantial risk.
                </p>
              </motion.div>
            </div>
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
              How do we deliver production-ready applications in a fraction of the time?
              The answer lies in our proprietary platforms, <strong>Ava and Ada</strong>.
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
                  <p>Full-stack prototype in as little as 15 minutes</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="acceleration-features" variants={fadeInUp}>
              <div className="acceleration-card">
                <h3>Automates the Heavy Lifting</h3>
                <p>
                  Ava and Ada automate up to 80% of the foundational work in building new
                  applications. From generating clean, secure code to setting up database
                  structures and creating testing harnesses.
                </p>
              </div>

              <div className="acceleration-card">
                <h3>Ensures Quality and Consistency</h3>
                <p>
                  By standardizing the core architecture, our engine ensures every application
                  is secure, scalable, and adheres to the highest quality standards from day one.
                  This eliminates technical debt before it starts.
                </p>
              </div>

              <div className="acceleration-card">
                <h3>Frees Experts to Focus on Value</h3>
                <p>
                  With the engine handling the groundwork, our world-class engineers, data
                  scientists, and designers dedicate their time to solving your unique business
                  challenges and crafting the perfect user experience.
                </p>
              </div>
            </motion.div>

            <motion.blockquote className="acceleration-quote" variants={fadeInUp}>
              The Acceleration Engine is our secret sauce. It's the tangible, technological
              advantage that allows us to make a bold promise—and keep it.
            </motion.blockquote>
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
            <h2>Let's achieve your AI strategies together</h2>
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
