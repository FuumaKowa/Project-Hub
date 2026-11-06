import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Moon, Sun, Shield, Plus, Minus, X } from 'lucide-react';
import type { Project } from '../types';
import { selectEditorialProjects } from '../lib/editorialProjects';
import { ProjectPreview, type PublicShowcaseViewProps } from './LiteraryPortfolio';
import './editorial-portfolio.css';

const contents = [{href:'#work',number:'01',label:'The work'}, {href:'#words',number:'02',label:'In the margins'}, {href:'#about',number:'03',label:'The person'}, {href:'#fragments',number:'04',label:'Fragments'}];
const portraits = [
  {src:'/images/niel-red-cutout.webp',alt:'Niel leaning forward in a burgundy shirt, with one hand resting in his hair',caption:'A study in warm light.',cutout:true},
  {src:'/images/niel-glasses.webp',alt:'Niel wearing black glasses and a grey hoodie in warm afternoon light',caption:'An ordinary afternoon.',cutout:false},
  {src:'/images/niel-knit.webp',alt:'Niel in a grey knit sweater, standing beside a mirror and dark curtain',caption:'A quieter frame.',cutout:false},
];
function projectHost(url: string) {try{return new URL(url).hostname.replace(/^www\./,'');}catch{return 'Live project';}}

function Portrait({ sketches }: { sketches: boolean }) {
  return <figure className={`ed-portrait${sketches ? '' : ' ed-portrait--quiet'}`}>
    <span className="ed-portrait-issue ed-mono">Niel / A personal collection</span>
    <span className="ed-monogram" aria-hidden="true">N</span>
    <svg className="ed-sketch" viewBox="0 0 500 620" fill="none" aria-hidden="true">
      <defs><pattern id="ed-portrait-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" stroke="currentColor" strokeWidth=".35" opacity=".3" /></pattern></defs>
      <path d="M30 45h435v510H30z" fill="url(#ed-portrait-grid)" />
      <g stroke="currentColor" strokeLinecap="round"><ellipse cx="250" cy="310" rx="163" ry="230" transform="rotate(13 250 310)" strokeWidth=".9" /><path d="M93 153C88 70 404 67 423 295S161 566 79 465" strokeWidth=".55" opacity=".65" /><path d="M60 95h30m-15-15v30M410 520h30m-15-15v30M33 378l91-50M365 185l74-32M67 584l352-2" strokeWidth=".9" /><path d="M66 151L439 462M55 477L417 68" strokeWidth=".6" strokeDasharray="3 6" opacity=".4" /></g>
    </svg>
    <span className="ed-hand ed-note-one">a work in progress.</span>
    <img className="ed-cutout" src="/images/niel-editorial.webp" width="1024" height="1536" alt="Niel in a tobacco-brown jacket, black shirt and dark trousers" fetchPriority="high" decoding="async" />
    <span className="ed-hand ed-note-two">the person<br />behind the pixels.</span>
    <span className="ed-portrait-edge ed-mono" aria-hidden="true">Design / Code / Curiosity</span>
    <figcaption><span className="ed-mono">Fig. 001 — Niel</span><span className="ed-hand">An unfinished practice.</span></figcaption>
  </figure>;
}

const ProjectLink: React.FC<{project: Project; onOpenProject: (project: Project) => void; children: React.ReactNode; className?: string}> = ({project, onOpenProject, children, className}) => {
  return <a className={className} href={project.url} target="_blank" rel="noopener noreferrer" onClick={event => {
    if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {event.preventDefault();onOpenProject(project);}
  }}>{children}</a>;
};

export function EditorialPortfolio({projects,onOpenProject,onSwitchToManager,onOpenOgModal,showAdminToggle=true,loading=false,loadError=null}: PublicShowcaseViewProps) {
  const [evening,setEvening] = useState(() => {try{return localStorage.getItem('portfolio_palette') === 'evening';}catch{return false;}});
  const [sketches,setSketches] = useState(true);
  const [indexOpen,setIndexOpen] = useState(false);
  const mobileNav = useRef<HTMLDetailsElement>(null);
  const lightbox = useRef<HTMLDialogElement>(null);
  const [portraitIndex,setPortraitIndex] = useState(0);
  const {featured,index,total} = useMemo(() => selectEditorialProjects(projects),[projects]);
  useEffect(() => {try {localStorage.setItem('portfolio_palette',evening ? 'evening' : 'paper');}catch {/* Palette remains usable without storage. */}},[evening]);
  const closeMenu = () => {if(mobileNav.current) mobileNav.current.open=false;};

  return <div className={`editorial-site${evening ? ' ed-evening' : ''}`}>
    <a className="ed-skip" href="#ed-main">Skip to content</a>
    <div className="ed-wrap">
      <header className="ed-header">
        <a href="#top" className="ed-brand" aria-label="Niel Studios home"><span aria-hidden="true">n.</span><span>Niel Studios</span></a>
        <nav className="ed-nav" aria-label="Main navigation">{contents.map(item => <a href={item.href} key={item.href}><span>{item.number}</span>{item.label}</a>)}<a href="#contact">Let’s talk <ArrowUpRight size={13}/></a></nav>
        <div className="ed-nav-actions"><button className="ed-theme" type="button" onClick={()=>setEvening(value=>!value)} aria-label={evening ? 'Switch to paper palette' : 'Switch to evening palette'} aria-pressed={evening}>{evening ? <Sun size={16}/> : <Moon size={16}/>}</button>
          <details className="ed-mobile-nav" ref={mobileNav}><summary>Contents <Plus size={15}/></summary><nav aria-label="Mobile navigation">{contents.map(item=><a key={item.href} href={item.href} onClick={closeMenu}><span className="ed-mono">{item.number}</span>{item.label}<ArrowDownRight size={16}/></a>)}<a href="#contact" onClick={closeMenu}>Let’s talk <ArrowDownRight size={16}/></a><a href="https://hub.nielstudios.com/">Project Hub <ArrowUpRight size={16}/></a></nav></details>
        </div>
      </header>

      <main id="ed-main" tabIndex={-1}>
        <section className="ed-cover" id="top" aria-labelledby="ed-title">
          <div className="ed-cover-copy"><p className="ed-eyebrow ed-mono">Independent design & development</p>
            <h1 id="ed-title"><span>Between</span><span><em>words</em> &</span><span>worlds.</span></h1>
            <p className="ed-cover-description">Thoughtful websites, applications, and useful tools. A practice in clarity, character, and attention to the details.</p>
            <a href="#work" className="ed-text-link">Explore selected work <ArrowDownRight size={17}/></a>
          </div><Portrait sketches={sketches}/>
          <div className="ed-cover-colophon"><span className="ed-mono">Design · Development · Curiosity</span><span className="ed-hand">still thinking. still making.</span><button type="button" onClick={()=>setSketches(value=>!value)} aria-pressed={sketches}>{sketches ? <Minus size={12}/> : <Plus size={12}/>}Sketch layer {sketches ? 'on' : 'off'}</button></div>
        </section>

        <section className="ed-introduction" aria-labelledby="ed-intro-heading"><span className="ed-mono">A note on the work</span><h2 id="ed-intro-heading">Useful by intention.<br /><em>Personal by nature.</em></h2><p>I care about what an experience needs to do, how it feels to use, and the small details that make it clear.<br /><br />Clarity in function. Character in detail.</p></section>

        <section className="ed-section ed-work-section" id="work" aria-labelledby="ed-work-heading">
          <div className="ed-section-heading"><span className="ed-mono">01 / Selected work</span><h2 id="ed-work-heading">Thoughts,<br /><em>made tangible.</em></h2><a className="ed-text-link" href="https://hub.nielstudios.com/">The full project directory <ArrowUpRight size={15}/></a></div>
          {loading ? <div className="ed-state" role="status"><span className="ed-mono">Opening the collection</span><p>The work is on its way.</p></div> : loadError ? <div className="ed-state" role="alert"><h3>The collection couldn’t be opened.</h3><p>{loadError}</p><button className="ed-text-link" type="button" onClick={()=>window.location.reload()}>Try again <ArrowUpRight size={15}/></button></div> : !total ? <div className="ed-state"><h3>A collection in the making.</h3><p>New projects will appear here as the work grows.</p></div> : <>
            <div className="ed-projects">{featured.map((project,i)=><article className={`ed-feature${i%2 ? ' ed-feature-reverse' : ''}`} key={project.id}>
              <div className="ed-feature-note"><span className="ed-feature-number">{String(i+1).padStart(2,'0')}</span><span className="ed-mono">{project.category}</span></div>
              <ProjectLink className={`ed-project-image ed-image-${i%4}`} project={project} onOpenProject={onOpenProject}><div className="ed-browser"><span aria-hidden="true">● ● ●</span><span className="ed-mono">{projectHost(project.url)}</span><ArrowUpRight size={12}/></div><div className="ed-image-crop"><ProjectPreview project={project}/></div><span className="ed-image-visit ed-mono">Explore live project <ArrowUpRight size={14}/></span><span className="ed-sr-only">{project.title} — opens in a new tab</span></ProjectLink>
              <div className="ed-feature-copy"><span className="ed-mono">Project {String(i+1).padStart(2,'0')} / {project.category}</span><h3><ProjectLink project={project} onOpenProject={onOpenProject}>{project.title}</ProjectLink></h3><p>{project.description || 'A project from the ongoing Niel Studios collection.'}</p>{project.tags.length>0 && <ul className="ed-tags" aria-label={`${project.title} tags`}>{project.tags.slice(0,4).map((tag,n)=><li key={`${tag}-${n}`}>{tag}</li>)}</ul>}<ProjectLink className="ed-text-link" project={project} onOpenProject={onOpenProject}>Visit project <ArrowUpRight size={16}/></ProjectLink></div>
            </article>)}</div>
            {index.length>0 && <div className="ed-project-index"><button className="ed-index-toggle" type="button" onClick={()=>setIndexOpen(value=>!value)} aria-expanded={indexOpen} aria-controls="ed-further-work"><span><span className="ed-mono">Further work / {index.length} more entries</span><span className="ed-index-title">The rest of the collection.</span></span>{indexOpen ? <Minus size={23}/> : <Plus size={23}/>}</button><div id="ed-further-work" hidden={!indexOpen}>{index.map((project,i)=><ProjectLink className="ed-index-entry" key={project.id} project={project} onOpenProject={onOpenProject}><span className="ed-mono">{String(featured.length+i+1).padStart(2,'0')}</span><span>{project.title}</span><span className="ed-mono">{project.category}</span><ArrowUpRight size={16}/></ProjectLink>)}</div></div>}
            <p className="ed-project-count ed-mono">{featured.length} featured / {total} projects in the collection <a href="https://hub.nielstudios.com/">Browse all on Project Hub ↗</a></p>
          </>}
        </section>

        <section className="ed-section ed-words" id="words" aria-labelledby="ed-words-heading"><div className="ed-section-heading"><span className="ed-mono">02 / In the margins</span><h2 id="ed-words-heading">A life between<br /><em>the lines.</em></h2><span className="ed-hand ed-reading-note">a few things I return to ↙</span></div>
          <div className="ed-reading-layout"><div className="ed-reading-intro"><p className="ed-lead">Literature is another way of paying attention.</p><p>An appreciation for language, atmosphere, and the significance of a small moment. These interests bring a wider perspective to the things I make.</p><div className="ed-word-sketch" aria-hidden="true"><svg viewBox="0 0 200 110" fill="none"><path d="M15 20q50-18 85 4 35-22 85-4v69q-45-16-85 0-42-16-85 0ZM100 24v65M28 36q34-9 59 2M28 48q34-9 59 2M28 60q34-9 59 2M113 38q25-11 58-2M113 50q25-11 58-2" stroke="currentColor" strokeWidth="1"/><path d="M9 96q90 17 182-4" stroke="currentColor" strokeWidth=".6"/></svg><span className="ed-hand">always another page.</span></div></div>
            <div className="ed-reading-list"><article><span className="ed-mono">Reading note / I</span><a href="https://www.penguinrandomhouse.com/books/832372/white-nights-by-fyodor-dostoevsky/" target="_blank" rel="noopener noreferrer"><h3>White Nights</h3><ArrowUpRight size={20}/></a><span className="ed-reading-author">Fyodor Dostoevsky</span><p>The atmosphere of a fleeting encounter. The weight of a small moment. An interest in character and the things left unspoken.</p></article><article><span className="ed-mono">Reading note / II</span><a href="https://www.penguinrandomhouse.com/books/23470/the-myth-of-sisyphus-by-albert-camus/" target="_blank" rel="noopener noreferrer"><h3>The Myth of Sisyphus</h3><ArrowUpRight size={20}/></a><span className="ed-reading-author">Albert Camus</span><p>Perspective, persistence, and the questions behind everyday experience. A reason to look a little more closely.</p></article></div>
          </div>
        </section>

        <section className="ed-section ed-about" id="about" aria-labelledby="ed-about-heading"><span className="ed-mono">03 / The person</span><div><h2 id="ed-about-heading">A little curiosity,<br /><em>beyond the work.</em></h2><p className="ed-lead">I build for the people on the other side of the screen.</p><p>Between projects: literature, poetry, and a few rounds of Valorant. Different ways of noticing, thinking, and staying curious.</p><a href="https://github.com/FuumaKowa" target="_blank" rel="noopener noreferrer" className="ed-text-link">More on GitHub <ArrowUpRight size={16}/></a></div><aside className="ed-field-notes"><span className="ed-mono">Field notes</span><div><span>01</span><p>Notice the details.</p></div><div><span>02</span><p>Make something useful.</p></div><div><span>03</span><p>Keep a little wonder.</p></div><span className="ed-hand">a practice, not a finish line.</span></aside></section>

        <section className="ed-section ed-fragments" id="fragments" aria-labelledby="ed-fragments-heading"><div className="ed-section-heading"><span className="ed-mono">04 / A few frames</span><h2 id="ed-fragments-heading">Different days.<br /><em>The same curiosity.</em></h2><span className="ed-hand">a little more human.</span></div><div className="ed-contact-sheet">{portraits.map((portrait,i)=><figure className={`ed-photo ed-photo-${i}${portrait.cutout ? ' ed-photo-cutout' : ''}`} key={portrait.src}><button type="button" onClick={()=>{setPortraitIndex(i);lightbox.current?.showModal();}} aria-label={`View portrait ${i+1}: ${portrait.caption}`}><img src={portrait.src} alt={portrait.alt} width="960" height="1280" loading="lazy" decoding="async"/><span className="ed-photo-expand" aria-hidden="true"><Plus size={18}/></span></button><figcaption><span className="ed-mono">Fig. {String(i+2).padStart(3,'0')}</span><span className="ed-hand">{portrait.caption}</span></figcaption></figure>)}</div><p className="ed-photo-note ed-mono">Small moments / A personal contact sheet</p></section>
        <footer className="ed-contact" id="contact"><span className="ed-mono">A conversation is a beginning.</span><div className="ed-contact-main"><h2>Leave a <em>note.</em></h2><div><p>For an idea, a collaboration,<br />or a simple hello.</p><a href="https://github.com/FuumaKowa" target="_blank" rel="noopener noreferrer" className="ed-text-link">Find me on GitHub <ArrowUpRight size={18}/></a></div></div><div className="ed-footer-meta"><span className="ed-mono">Niel Studios / A personal collection</span><a className="ed-mono" href="https://hub.nielstudios.com/">Project Hub <ArrowUpRight size={12}/></a><div>{onOpenOgModal && <button type="button" onClick={onOpenOgModal}>Share & preview</button>}{showAdminToggle && onSwitchToManager && <button type="button" onClick={onSwitchToManager}><Shield size={11}/>Admin Manager</button>}</div><a href="#top" className="ed-mono">Back to top ↑</a></div></footer>
      </main>
    </div>
    <dialog className="ed-lightbox" ref={lightbox} aria-label="Portrait viewer" onClick={event=>{if(event.target===event.currentTarget)lightbox.current?.close();}}><button type="button" className="ed-lightbox-close" onClick={()=>lightbox.current?.close()} aria-label="Close portrait viewer"><X size={20}/></button><img src={portraits[portraitIndex].src} alt={portraits[portraitIndex].alt}/><p className="ed-hand">{portraits[portraitIndex].caption}</p></dialog>
  </div>;
}

