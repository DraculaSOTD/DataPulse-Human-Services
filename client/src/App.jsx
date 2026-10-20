import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Offerings from './pages/Offerings';
import UseCases from './pages/UseCases';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './styles/global.css';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/offerings" element={<Offerings />} />
              <Route path="/use-cases" element={<UseCases />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              {/* Services was renamed to Offerings — keep old links alive */}
              <Route path="/services" element={<Navigate to="/offerings" replace />} />
              {/* /privacy is the shorthand people type and link to */}
              <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
