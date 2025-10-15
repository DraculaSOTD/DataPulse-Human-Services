import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../animations/AnimatedBackground';
import SEO from '../components/SEO';
import { fadeInUp, staggerContainer } from '../constants/animations';
import { CONTACT_EMAILS } from '../constants/config';
import { getServiceSchema, getWebPageSchema } from '../utils/structuredData';
import './Services.css';

const Services = () => {
  const services = [
    {
      title: 'Strategic Design & Prototyping',
      description: 'We don\'t just build; we partner with you to define the problem, map the user journey, and design a solution that delivers maximum business impact.',
      details: 'We use our Acceleration Engine to build functional prototypes in minutes, not months, allowing for rapid feedback and validation.'
    },
    {
      title: 'Expert AI & Software Development',
      description: 'Your dedicated squad handles the entire development lifecycle.',
      details: 'From custom machine learning models that solve your unique challenges to building secure, scalable full-stack applications, we deliver clean, documented code ready for deployment.'
    },
    {
      title: 'Rigorous Testing & Quality Assurance',
      description: 'Our process includes comprehensive testing to ensure your application is robust, reliable, and secure.',
      details: 'We deliver solutions that your technical team can trust and your business can depend on.'
    },
    {
      title: 'Full IP Ownership & Hand-off',
      description: 'This is your innovation, and you own it completely.',
      details: 'At the end of our engagement, we hand over 100% of the source code and intellectual property. No vendor lock-in, ever.'
    }
  ];

  const included = [
    'Dedicated, multi-disciplinary delivery team',
    'AI & Machine Learning Expertise',
    'Full-Stack Software Development',
    'Strategic Design & Prototyping',
    'Rigorous Quality Assurance',
    'Project & Partnership Management',
    '100% IP & Source Code Ownership'
  ];

  return (
    <div className="services">
      <SEO
        title="Services & Pricing - DataPulse AI"
        description="Your on-demand AI & software squad. Flat monthly fee starting from $13,500 for dedicated team, full-stack development, AI expertise, and 100% IP ownership. No hidden fees."
        keywords="AI development services, software development pricing, tech partnership, machine learning services, full-stack development, startup development, software as a service"
        structuredData={[getServiceSchema(), getWebPageSchema('services', 'Services & Pricing - DataPulse AI', 'Your on-demand AI & software squad for a predictable monthly investment.')]}
      />
      <AnimatedBackground theme="acceleration" />

      {/* Hero Section */}
      <section className="services-hero section">
        <div className="container">
          <motion.div
            className="services-hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp}>
              Your On-Demand <br />
              <span className="gradient-text">AI & Software Squad</span>
            </motion.h1>

            <motion.p className="services-subtitle" variants={fadeInUp}>
              For a flat monthly fee starting from <strong>$13,500</strong>, you get everything you need
              to turn an idea into a high-value, production-ready application.
            </motion.p>

            <motion.p className="services-description" variants={fadeInUp}>
              No hidden fees, no surprise invoices, no recruiting headaches. Just results.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="pricing-content"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              A Predictable, <span className="gradient-text">High-Value Investment</span>
            </motion.h2>

            <motion.div className="pricing-card" variants={fadeInUp}>
              <div className="price-header">
                <h3>Tech & ML Partnership</h3>
                <div className="price">
                  <span className="starting-from">Starting from</span>
                  <span className="currency">$</span>
                  <span className="amount">13,500</span>
                  <span className="period">/month</span>
                </div>
                <p className="price-subtext">Simple, Transparent Pricing</p>
              </div>

              <div className="included-list">
                <h4>What's Included:</h4>
                {included.map((item, index) => (
                  <motion.div
                    key={index}
                    className="included-item"
                    variants={fadeInUp}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div className="price-cta" variants={fadeInUp}>
                <a href={`mailto:${CONTACT_EMAILS.PRIMARY}`} className="btn btn-primary">
                  Get Started Today
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Details */}
      <section className="services-details section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              A Complete, <span className="gradient-text">End-to-End</span> Delivery Team
            </motion.h2>

            <div className="services-grid">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="service-card"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="service-number">0{index + 1}</div>
                  <h3>{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <p className="service-details">{service.details}</p>
                </motion.div>
              ))}
            </div>
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
              We invest our deep technical expertise in exchange for realistic royalty agreements,
              helping you accelerate your growth and achieve your vision when cash flow is critical.
            </p>
            <a href={`mailto:${CONTACT_EMAILS.PRIMARY}?subject=Startup Partnership Inquiry`} className="btn btn-secondary">
              Learn About Startup Partnership
            </a>
          </motion.div>
        </div>
      </section>

      {/* Value Comparison */}
      <section className="comparison-section section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              The Smarter <span className="gradient-text">Investment</span>
            </motion.h2>

            <motion.p className="comparison-intro" variants={fadeInUp}>
              Total Cost of Delivery & Speed to Value Comparison
            </motion.p>

            <motion.div className="comparison-table" variants={fadeInUp}>
              <div className="comparison-row header">
                <div className="comparison-cell"></div>
                <div className="comparison-cell highlight">DataPulse AI</div>
                <div className="comparison-cell">Outsourcing</div>
                <div className="comparison-cell">Internal Team</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell label">Monthly Cost</div>
                <div className="comparison-cell highlight">Starting from $13,500</div>
                <div className="comparison-cell">$36,122</div>
                <div className="comparison-cell">$52,973</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell label">Time to Deliver</div>
                <div className="comparison-cell highlight">1 Month</div>
                <div className="comparison-cell">4 Months</div>
                <div className="comparison-cell">4 Months</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell label">Full IP Ownership</div>
                <div className="comparison-cell highlight">✓</div>
                <div className="comparison-cell">✓</div>
                <div className="comparison-cell">✓</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell label">AI Expertise</div>
                <div className="comparison-cell highlight">✓</div>
                <div className="comparison-cell">Limited</div>
                <div className="comparison-cell">Varies</div>
              </div>

              <div className="comparison-row">
                <div className="comparison-cell label">Predictable Pricing</div>
                <div className="comparison-cell highlight">✓</div>
                <div className="comparison-cell">✗</div>
                <div className="comparison-cell">✗</div>
              </div>
            </motion.div>

            <motion.div className="value-statement" variants={fadeInUp}>
              <p>
                If an application can generate <strong>$50k/month</strong> in new revenue,
                a 4-month delay represents a <strong>$200k opportunity cost</strong>.
                Our model is designed to capture that value for you, faster.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta section-sm">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="cta-content"
          >
            <h2>Ready to Get Started?</h2>
            <p>Let's transform your innovation backlog into delivered results.</p>
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

export default Services;
