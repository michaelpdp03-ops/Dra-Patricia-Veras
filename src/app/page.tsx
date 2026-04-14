"use client";
import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

/* ===== HELPER: LazyVideo Component ===== */
function LazyVideo({ src, ...props }: { src: string } & React.VideoHTMLAttributes<HTMLVideoElement>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video ref={videoRef} loop muted playsInline preload="none" controls {...props}>
      {isVisible && <source src={src} type="video/mp4" />}
    </video>
  );
}

/* ===== HELPER: useCountUp Hook ===== */
function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          if (prefersReduced) {
            setCount(target);
            return;
          }
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, hasStarted]);

  return { count, ref };
}

/* ===== DATA ===== */
const services = [
  { title: "Cirugía Bariátrica", desc: "Procedimientos avanzados para la pérdida de peso y mejora de la salud metabólica (Manga y Bypass Gástrico).", icon: "bariatric" },
  { title: "Cirugía Laparoscópica", desc: "Técnicas mínimamente invasivas para una recuperación más rápida, menos dolor y cicatrices mínimas.", icon: "laparoscopy" },
  { title: "Cirugía General", desc: "Tratamiento quirúrgico de hernias, vesícula, apéndice y otras afecciones abdominales comunes.", icon: "surgery" },
  { title: "Manejo del Reflujo", desc: "Diagnóstico y tratamiento quirúrgico de la enfermedad por reflujo gastroesofágico y hernias hiatales.", icon: "stomach" },
  { title: "Evaluación Preoperatoria", desc: "Asesoría integral y preparación médica completa antes de cualquier procedimiento quirúrgico.", icon: "evaluation" },
  { title: "Seguimiento Post-cirugía", desc: "Acompañamiento continuo, guías nutricionales y monitoreo para asegurar tu recuperación y éxito.", icon: "care" },
];

const testimonials = [
  { name: "Juan Carlos R.", initials: "JC", procedure: "Manga Gástrica", quote: "La Dra. Patricia cambió mi vida. Perdí el peso que necesitaba y recuperé mi salud. Excelente atención en todo el proceso." },
  { name: "María Elena F.", initials: "ME", procedure: "Cirugía de Vesícula Laparoscópica", quote: "Tenía mucho miedo a operarme, pero la Dra. Veras me dio tanta confianza. La recuperación fue rapidísima y sin dolor." },
  { name: "Pedro N.", initials: "PN", procedure: "Bypass Gástrico", quote: "Profesionalismo de primer nivel. Las instalaciones, su trato humano y los resultados obtenidos superaron todas mis expectativas." },
];

const faqs = [
  { q: "¿Qué es la cirugía bariátrica?", a: "Es un conjunto de procedimientos quirúrgicos diseñados para ayudar a la pérdida de peso en pacientes con obesidad, mediante la reducción del tamaño del estómago y/o la modificación del proceso digestivo, favoreciendo además el control de enfermedades asociadas." },
  { q: "¿Quiénes son candidatos para cirugía bariátrica?", a: "Generalmente, personas con obesidad grado II o III, o con obesidad asociada a enfermedades como diabetes, hipertensión, apnea del sueño, entre otras, que no han logrado bajar de peso con otros métodos." },
  { q: "¿Qué tipos de cirugía bariátrica existen?", a: "Las más comunes son la manga gástrica y el bypass gástrico. El tipo de cirugía se elige de manera individual, según la condición médica y las necesidades de cada paciente." },
  { q: "¿La cirugía es segura?", a: "Sí. Es un procedimiento seguro cuando se realiza por cirujanos especializados y en centros adecuados. Como toda cirugía, conlleva riesgos, los cuales se explican detalladamente antes del procedimiento." },
  { q: "¿Cuánto peso se puede perder?", a: "La pérdida de peso varía según el tipo de cirugía y el compromiso del paciente con los cambios de estilo de vida. En general, se logra una pérdida significativa y sostenida a largo plazo." },
  { q: "¿Cuándo veré los resultados?", a: "Los resultados deseados se logran a ver a partir de 6 meses a 1 año. Pero todo depende del paciente; hay pacientes que lo ven desde antes." },
  { q: "¿La cirugía cura la obesidad?", a: "La cirugía es una herramienta, pero no una cura definitiva. Requiere cambios permanentes en la alimentación, actividad física y seguimiento médico continuo." },
  { q: "¿Cómo es la recuperación?", a: "La mayoría de los pacientes se reincorpora a sus actividades habituales en pocas semanas, siguiendo las indicaciones médicas y nutricionales." },
  { q: "¿Necesitaré seguimiento médico después de la cirugía?", a: "Sí. El seguimiento es fundamental para asegurar una adecuada pérdida de peso, prevenir deficiencias nutricionales y mantener resultados a largo plazo. Los primeros 21 días los encuentros serán semanales; después se ajustan según la evolución del paciente." },
  { q: "¿Tendré dolor después de la cirugía?", a: "Es normal presentar molestias en los primeros días. Sin embargo, el dolor suele ser leve y se controla eficazmente con medicamentos analgésicos indicados por el equipo médico. La mayoría de los pacientes refiere que el dolor es tolerable y mejora progresivamente." },
  { q: "¿Puedo recuperar el peso perdido?", a: "Es posible si no se siguen las recomendaciones médicas y nutricionales. El compromiso del paciente es clave para el éxito del tratamiento." },
  { q: "¿Cuánto cuesta la cirugía y qué incluye?", a: "El costo de la cirugía se discute con el paciente en la consulta. Generalmente incluye: cirugía, internamiento, materiales a utilizar, anestesia y primeras consultas postquirúrgicas." },
];

const videoLabels = [
  { 
    title: "Prevención del Cáncer", 
    description: "Conoce a qué edad y cómo debes iniciar las pruebas de mamografía para la prevención temprana del cáncer de mama, además de la importancia de los antecedentes familiares."
  },
  { 
    title: "Manejo del Reflujo", 
    description: "Aprende qué es el reflujo gastroesofágico y descubre medidas preventivas en tu dieta y estilo de vida, como evitar alimentos picantes y no acostarte inmediatamente después de comer." 
  },
  { 
    title: "Cirugía Bariátrica y Obesidad", 
    description: "Entiende cómo la obesidad es una enfermedad que afecta tu salud global (diabetes, riesgo cardiovascular) y por qué la cirugía bariátrica es una herramienta médica segura para tratarla." 
  },
  { 
    title: "Consultas y Evaluaciones", 
    description: "Descubre que la cirugía de obesidad no es un simple atajo, sino una herramienta probada para transformar tu salud y recuperar tu calidad de vida." 
  }
];

/* ===== SERVICE ICONS (inline SVG) ===== */
function ServiceIcon({ type }: { type: string }) {
  const svgProps = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "bariatric": return <svg {...svgProps}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M12 11v6"></path><path d="M9 14l3 3 3-3"></path></svg>;
    case "laparoscopy": return <svg {...svgProps}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
    case "surgery": return <svg {...svgProps}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;
    case "stomach": return <svg {...svgProps}><path d="M9.5 9c-1.5 0-3 1.5-3 4s1.5 6 4 6 5.5-2.5 5.5-5c0-1.5-.5-3-1.5-4s-3.5-1-3.5-1z"></path><path d="M10.5 4.5V9"></path><path d="M12 19v2.5"></path></svg>;
    case "evaluation": return <svg {...svgProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
    case "care": return <svg {...svgProps}><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>;
    default: return null;
  }
}

/* ===== STAR SVG ===== */
function Star() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary-gold)" stroke="var(--primary-gold)" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

/* ===== MAIN COMPONENT ===== */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Stats counters
  const patients = useCountUp(2500, 2000);
  const years = useCountUp(10, 1500);
  const procedures = useCountUp(5000, 2500);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-scale');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleCTA = useCallback(() => {
    const message = encodeURIComponent("¡Hola! Me gustaría agendar una consulta con la Dra. Patricia Veras, Cirujana General y Bariátrica.");
    window.open(`https://wa.me/18299629740?text=${message}`, "_blank");
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const navLinks = [
    { href: "#about", label: "Nosotros" },
    { href: "#services", label: "Servicios" },
    { href: "#gallery", label: "Galería" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contacto" },
  ];

  return (
    <main>
      {/* ===== NAVBAR ===== */}
      <nav className={`navbar ${scrolled ? 'glass scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#" className="navbar-logo">
            <Image
              src="/media/logo/logo.jpg"
              alt="Dra. Patricia Veras Deschamps - Cirujana General y Laparoscópica"
              width={180}
              height={50}
              style={{ objectFit: 'contain', borderRadius: '4px' }}
              priority
            />
          </a>

          <div className="nav-links">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </div>

          <div className="navbar-actions">
            <button onClick={handleCTA} className="btn-primary navbar-cta">
              Agendar Ahora
            </button>
            <button
              className="hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileMenuOpen}
            >
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu} />
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        {navLinks.map(link => (
          <a key={link.href} href={link.href} onClick={closeMobileMenu}>{link.label}</a>
        ))}
        <button onClick={() => { closeMobileMenu(); handleCTA(); }} className="btn-primary mobile-menu-cta">
          Agendar Ahora
        </button>
      </div>

      {/* ===== HERO ===== */}
      <header className="hero">
        <video
          autoPlay loop muted playsInline
          className="hero-video"
        >
          <source src="/media/videos/IMG_1560.MP4" type="video/mp4" />
        </video>
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-content animate-fade-in">
          <p className="section-subtitle hero-subtitle">
            Cirujana General y Laparoscópica
          </p>
          <h1 className="heading-xl">
            <span className="text-gradient">Transformando Vidas</span>
            <br />a Través de tu Salud
          </h1>
          <p>
            Experiencia, precisión y tecnología de vanguardia para brindarte el cuidado quirúrgico que mereces.
          </p>
          <div className="hero-cta-group">
            <button onClick={handleCTA} className="btn-primary hero-cta">
              Agenda tu Consulta
            </button>
            <a href="#about" className="btn-outline">
              Conoce más
            </a>
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </header>

      {/* ===== ABOUT ===== */}
      <section id="about" className="section-padding" style={{ backgroundColor: 'var(--secondary-bg)' }} aria-labelledby="about-heading">
        <div className="about-grid">
          <div className="about-photo-col scroll-reveal-left">
            <div className="about-photo-wrapper">
              <Image
                src="/media/doctora/photo_2026-04-10_18-59-49.jpg"
                alt="Dra. Patricia Veras en su consultorio"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <div className="about-badge glass">
              <h3>10+</h3>
              <p>Años de<br />Experiencia</p>
            </div>
          </div>

          <div className="about-text-col scroll-reveal">
            <p className="section-subtitle">La Excelencia es nuestra firma</p>
            <h2 id="about-heading" className="heading-lg">Conoce a la Dra. Patricia Veras</h2>
            <div className="section-divider section-divider-left" />
            <p className="text-body about-paragraph">
              Doctora en Medicina egresada del Instituto Tecnológico de Santo Domingo (INTEC), graduada <strong>Summa Cum Laude</strong>. Realizó su especialidad en Cirugía General en el Hospital Salvador B. Gautier, donde también se desempeñó como <strong>Jefa de Residentes</strong>. Posteriormente completó su formación en Cirugía Bariátrica en el Hospital Salvador B. Gautier.
            </p>
            <p className="text-body about-paragraph about-paragraph-last">
              Cuenta con un Diplomado en Investigación en Salud por la Universidad Iberoamericana (UNIBE). Su práctica se caracteriza por el compromiso con la excelencia, la actualización continua y una atención integral centrada en el bienestar del paciente.
            </p>
            <ul className="about-services-list">
              {['Cirugía Bariátrica', 'Cirugía General y Laparoscópica', 'Manejo del Reflujo'].map(item => (
                <li key={item}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="credential-badges">
              {[
                'INTEC — Summa Cum Laude',
                'H. Salvador B. Gautier',
                'Jefa de Residentes',
                'UNIBE — Investigación en Salud',
              ].map(label => (
                <span key={label} className="credential-badge">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="stats-section" aria-label="Estadísticas de la clínica">
        <div className="stats-bar">
          <div className="stat-item scroll-reveal stagger-1" ref={patients.ref}>
            <div className="stat-number">{patients.count.toLocaleString()}+</div>
            <div className="stat-label">Pacientes Satisfechos</div>
          </div>
          <div className="stat-item scroll-reveal stagger-2" ref={years.ref}>
            <div className="stat-number">{years.count}+</div>
            <div className="stat-label">Años de Experiencia</div>
          </div>
          <div className="stat-item scroll-reveal stagger-3" ref={procedures.ref}>
            <div className="stat-number">{procedures.count.toLocaleString()}+</div>
            <div className="stat-label">Procedimientos Realizados</div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="section-padding section-bg-pattern" aria-labelledby="services-heading" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="floating-decor" style={{ width: '300px', height: '300px', top: '-5%', right: '-5%' }} aria-hidden="true" />

        <div className="section-header scroll-reveal">
          <p className="section-subtitle">Cuidado Médico Premium</p>
          <h2 id="services-heading" className="heading-lg">Nuestros Servicios Quirúrgicos</h2>
          <div className="section-divider" />
          <p className="text-body section-desc">
            Ofrecemos una gama completa de tratamientos quirúrgicos de vanguardia, combinando compasión médica y ciencia para resultados extraordinarios.
          </p>
        </div>

        <div className="services-grid">
          {services.map((svc, idx) => (
            <div key={svc.title} className={`card service-card scroll-reveal stagger-${idx + 1}`}>
              <div className="service-icon">
                <ServiceIcon type={svc.icon} />
              </div>
              <h4>{svc.title}</h4>
              <p>{svc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VIDEO GALLERY ===== */}
      <section className="section-padding section-dark" aria-labelledby="videos-heading">
        <div className="section-header scroll-reveal">
          <p className="section-subtitle">Salud en Acción</p>
          <h2 id="videos-heading" className="heading-lg">Consejos y Procedimientos</h2>
          <div className="section-divider" />
          <p className="text-body section-desc">
            Observa de cerca la precisión detrás de nuestras cirugías y consejos valiosos para tu salud.
          </p>
        </div>

        <div className="video-grid">
          {['IMG_1553.MP4', 'IMG_1554.MP4', 'IMG_1557.MP4', 'IMG_1551.MP4'].map((vid, idx) => (
            <div key={vid} className={`card video-card scroll-reveal stagger-${idx + 1}`}>
              <div className="video-wrapper">
                <LazyVideo src={`/media/videos/${vid}`} />
              </div>
              <div className="video-label">
                <h4>{videoLabels[idx].title}</h4>
                <p className="video-desc">
                  {videoLabels[idx].description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== GALLERY (ANTES/DESPUÉS) ===== */}
      <section id="gallery" className="section-padding" style={{ backgroundColor: 'var(--secondary-bg)' }} aria-labelledby="gallery-heading">
        <div className="section-header scroll-reveal">
          <p className="section-subtitle">Resultados Reales</p>
          <h2 id="gallery-heading" className="heading-lg">Casos de Éxito</h2>
          <div className="section-divider" />
          <p className="text-body section-desc">
            Descubre cómo hemos transformado la vida y la confianza de nuestros pacientes con resultados extraordinarios.
          </p>
        </div>

        <div className="gallery-grid">
          {[1, 2, 3, 4].map((num, idx) => (
            <div key={num} className={`gallery-item scroll-reveal-scale stagger-${idx + 1}`}>
              <Image
                src={`/media/antes_despues/photo_${num}_2026-04-10_18-48-36.jpg`}
                alt={`Caso clínico de éxito ${num}: resultado antes y después del tratamiento quirúrgico`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 300px"
              />
              <div className="gallery-overlay">
                <span className="gallery-overlay-title">Antes y Después</span>
                <span className="gallery-overlay-sub">Resultado real de paciente</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding section-dark" aria-labelledby="testimonials-heading">

        <div className="section-header scroll-reveal">
          <p className="section-subtitle">Voces de Confianza</p>
          <h2 id="testimonials-heading" className="heading-lg">Lo Que Dicen Nuestros Pacientes</h2>
          <div className="section-divider" />
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={t.name} className={`card testimonial-card scroll-reveal stagger-${idx + 1}`}>
              <div className="testimonial-quote-icon" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" /></svg>
              </div>
              <p className="testimonial-text">&ldquo;{t.quote}&rdquo;</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.initials}</div>
                <div className="author-info">
                  <strong>{t.name}</strong>
                  <span>{t.procedure}</span>
                </div>
              </div>
              <div className="testimonial-stars" aria-label="5 estrellas">
                {[...Array(5)].map((_, i) => <Star key={i} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="section-padding" style={{ backgroundColor: 'var(--secondary-bg)' }} aria-labelledby="faq-heading">
        <div className="section-header scroll-reveal">
          <p className="section-subtitle">Resolvemos tus Dudas</p>
          <h2 id="faq-heading" className="heading-lg">Preguntas Frecuentes</h2>
          <div className="section-divider" />
          <p className="text-body section-desc">
            Todo lo que necesitas saber sobre la cirugía bariátrica y el proceso de atención con la Dra. Patricia Veras.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className={`faq-item scroll-reveal stagger-${Math.min(idx + 1, 4)}`}
            >
              <button
                className={`faq-question ${openFaq === idx ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
                aria-controls={`faq-answer-${idx}`}
              >
                <span>{item.q}</span>
                <svg
                  className="faq-chevron"
                  width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                id={`faq-answer-${idx}`}
                className={`faq-answer ${openFaq === idx ? 'open' : ''}`}
              >
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--secondary-bg)' }} aria-labelledby="contact-heading">
        <div className="section-header scroll-reveal">
          <p className="section-subtitle">Estamos Para Ti</p>
          <h2 id="contact-heading" className="heading-lg">Visítanos</h2>
          <div className="section-divider" />
        </div>

        <div className="contact-grid">
          <div className="scroll-reveal">
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <h4>Dirección</h4>
                <p>Tu Dirección Aquí<br />Santo Domingo, República Dominicana</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <div>
                <h4>Teléfono</h4>
                <p>+1 (829) 962-9740</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div>
                <h4>Horarios</h4>
                <p>Lun - Vie: 9:00 AM - 6:00 PM<br />Sábado: 9:00 AM - 2:00 PM<br />Domingo: Cerrado</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <div>
                <h4>Email</h4>
                <p>info@drapatriciaveras.com</p>
              </div>
            </div>
          </div>

          <div className="scroll-reveal-scale">
            <div className="map-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>Mapa Interactivo</span>
              <span style={{ fontSize: '0.85rem' }}>Santo Domingo, RD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        {/* CTA Section */}
        <div className="footer-cta scroll-reveal">
          <h2>Empieza tu Transformación</h2>
          <p>
            No dejes para mañana la salud que mereces hoy. Contáctanos y recibe una valoración personalizada con la Dra. Patricia Veras.
          </p>
          <button onClick={handleCTA} className="btn-primary footer-cta-btn">
            Reservar Consulta VIP
          </button>
        </div>

        {/* Footer Grid */}
        <div className="footer-grid">
          <div className="footer-col">
            <Image
              src="/media/logo/logo.jpg"
              alt="Dra. Patricia Veras Deschamps"
              width={160}
              height={45}
              style={{ objectFit: 'contain', borderRadius: '4px', marginBottom: '0.75rem', filter: 'brightness(0) invert(1)' }}
            />
            <p>Clínica médica especializada en cirugía general, laparoscópica y bariátrica.</p>
            <div className="social-icons">
              {/* Instagram */}
              <a href="#" className="social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              {/* Facebook */}
              <a href="#" className="social-icon" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              {/* TikTok */}
              <a href="#" className="social-icon" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Enlaces</h4>
            <nav>
              <a href="#about">Nosotros</a>
              <a href="#services">Servicios</a>
              <a href="#gallery">Galería</a>
              <a href="#contact">Contacto</a>
            </nav>
          </div>

          <div className="footer-col">
            <h4>Horarios</h4>
            <p>Lun - Vie: 9:00 AM - 6:00 PM</p>
            <p>Sábado: 9:00 AM - 2:00 PM</p>
            <p>Domingo: Cerrado</p>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p>Recibe consejos de salud y bienestar integral.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Tu email" className="newsletter-input" aria-label="Dirección de email para newsletter" />
              <button type="submit" className="newsletter-btn">Enviar</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Dra. Patricia Veras. Todos los derechos reservados.</p>
          <p>Cirugía General, Laparoscópica y Bariátrica</p>
        </div>
      </footer>

      {/* ===== FLOATING WHATSAPP BUTTON ===== */}
      <a
        href={`https://wa.me/18299629740?text=${encodeURIComponent("¡Hola! Me gustaría agendar una consulta con la Dra. Patricia Veras, Cirujana General y Bariátrica.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="whatsapp-label">Escríbenos</span>
      </a>
    </main>
  );
}
