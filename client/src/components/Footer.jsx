import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../constants/config';
import './Footer.css';

// Matches the company registration number 2024/530497/07
const FOUNDING_YEAR = 2024;

const Footer = () => {
  // The end of the range is derived rather than hardcoded, so the notice
  // never goes stale. Before the first rollover it collapses to a single year.
  const currentYear = new Date().getFullYear();
  const years = currentYear > FOUNDING_YEAR
    ? `${FOUNDING_YEAR}–${currentYear}`
    : `${FOUNDING_YEAR}`;

  return (
    <footer className="site-footer">
      <div className="container">
        {/* The pipes are decorative: aria-hidden keeps screen readers from
            announcing them between each item. */}
        <p className="footer-legal">
          <span>© {years} {COMPANY_INFO.NAME}</span>
          <span className="footer-sep" aria-hidden="true">|</span>
          <span>All rights reserved</span>
          <span className="footer-sep" aria-hidden="true">|</span>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
