import { useEffect, useState } from 'react';

import about from '../components/about.html?raw';
import certificate from '../components/certificate.html?raw';
import contact from '../components/contact.html?raw';
import education from '../components/education.html?raw';
import experience from '../components/experience.html?raw';
import footer from '../components/footer.html?raw';
import hero from '../components/hero.html?raw';
import navbar from '../components/navbar.html?raw';
import projects from '../components/projects.html?raw';
import skills from '../components/skills.html?raw';

const sections = [hero, about, skills, projects, experience, education, certificate, contact];

function Markup({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [certificateImage, setCertificateImage] = useState(null);
  const [projectImage, setProjectImage] = useState(null);

  useEffect(() => {
    document.body.style.overflow = resumeOpen || certificateImage || projectImage ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [resumeOpen, certificateImage, projectImage]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.nav-links a').forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
    document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));
    return () => { revealObserver.disconnect(); sectionObserver.disconnect(); };
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target.closest('button, a, .cert-card');
      if (!target) return;

      // 1. Handle Mobile Menu Toggle
      if (target.id === 'navToggle') setMenuOpen((open) => !open);
      
      // 2. Handle Resume Modals
      if (target.id === 'openResumeBtn' || target.id === 'openResumeBtnHero') setResumeOpen(true);
      if (target.id === 'closeResumeBtn' || target.closest('#resumeModal') === target) setResumeOpen(false);
      
      // 3. FIX: Handle Nav Links for same-page smooth scrolling
      const navLink = target.closest('.nav-links a');
      if (navLink) {
        event.preventDefault(); // Stops the browser from reloading/opening a new page
        setMenuOpen(false);     // Closes the mobile menu
        
        const href = navLink.getAttribute('href');
        if (href && href.startsWith('#')) {
          const section = document.querySelector(href);
          if (section) {
            // Smoothly scroll to the section
            section.scrollIntoView({ behavior: 'smooth' });
            // Update the URL hash without reloading the page
            window.history.pushState(null, '', href); 
          }
        }
      }

      // 4. Handle Certificates
      const certificate = target.closest('.cert-card');
      if (certificate?.dataset.cert) setCertificateImage({ src: certificate.dataset.cert, title: certificate.dataset.title });

      // 5. Handle Project Demos
      const demo = target.closest('.js-demo-btn');
      if (demo?.dataset.gif) {
        event.preventDefault();
        setProjectImage(demo.dataset.gif);
      }
    };

    const handleSubmit = (event) => {
      // ... (keep your existing handleSubmit code here)
      const form = event.target.closest('#contactForm');
      if (!form) return;
      event.preventDefault();
      const data = new FormData(form);
      const name = data.get('name').trim();
      const subject = data.get('subject').trim() || `Portfolio contact from ${name}`;
      const body = `Name: ${name}\nEmail: ${data.get('email').trim()}\n\n${data.get('message').trim()}`;
      const mailto = `mailto:abhijitrajkumar2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const note = form.querySelector('#cf-note');
      note.classList.add('is-opening');
      note.innerHTML = '<span class="form-note-loader" aria-hidden="true"></span><span>Opening your email client...</span>';
      setTimeout(() => { window.location.href = mailto; }, 450);
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
    };
  }, []);

  useEffect(() => {
    document.querySelector('.nav-links')?.classList.toggle('open', menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setResumeOpen(false);
        setCertificateImage(null);
        setProjectImage(null);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <>
      <div id="navbar-root"><Markup html={navbar} /></div>
      <main>{sections.map((html, index) => <Markup html={html} key={index} />)}</main>
      <div id="footer-root"><Markup html={footer} /></div>

      {resumeOpen && <div className="resume-modal open" id="resumeModal" onClick={(event) => event.target.id === 'resumeModal' && setResumeOpen(false)}>
        <div className="resume-modal-inner">
          <div className="resume-modal-head"><h3><i className="fa-solid fa-file-pdf" /> Resume - Abhijit Rajkumar</h3><div className="actions"><a href="assets/resume.pdf" download className="btn-icon-link"><button type="button" aria-label="Download"><i className="fa-solid fa-download" /></button></a><button type="button" onClick={() => setResumeOpen(false)} aria-label="Close"><i className="fa-solid fa-xmark" /></button></div></div>
          <div className="resume-modal-body"><iframe src="assets/resume.pdf" title="Resume PDF viewer" /></div>
        </div>
      </div>}
      {certificateImage && <div className="lightbox open" onClick={() => setCertificateImage(null)}><button className="lightbox-close" aria-label="Close"><i className="fa-solid fa-xmark" /></button><div className="lightbox-inner"><img src={certificateImage.src} alt={certificateImage.title} /></div></div>}
      {projectImage && <div className="lightbox open" onClick={() => setProjectImage(null)}><button className="lightbox-close" aria-label="Close"><i className="fa-solid fa-xmark" /></button><div className="lightbox-inner"><img src={projectImage} alt="Project demo" /></div></div>}
    </>
  );
}

export default App;