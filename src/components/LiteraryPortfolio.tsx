import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, Copy, Loader2, Moon, Search, Shield, Sun, X } from 'lucide-react';
import { Project } from '../types';
import './portfolio.css';
import './portfolio-live.css';

interface PublicShowcaseViewProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onSwitchToManager?: () => void;
  showAdminToggle?: boolean;
  onOpenOgModal?: () => void;
  loading?: boolean;
  loadError?: string | null;
}

function ProjectPreview({ project }: { project: Project }) {
  const [attempt, setAttempt] = useState(0);
  const fallback = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(project.url)}?w=1280&h=800`;
  const source = attempt === 0 ? project.thumbnailUrl || fallback : fallback;
  useEffect(() => setAttempt(0), [project.thumbnailUrl, project.url]);
  if (attempt >= 2) return <div className="preview-unavailable"><span className="serif">{project.title.slice(0, 1)}</span><span className="mono">Explore the live project <ArrowUpRight size={14} /></span></div>;
  return <img src={source} alt={`${project.title} website preview`} loading="lazy" decoding="async" onError={() => setAttempt(value => source === fallback ? 2 : value + 1)} />;
}

export const PublicShowcaseView: React.FC<PublicShowcaseViewProps> = ({ projects, onOpenProject, onSwitchToManager, showAdminToggle = true, onOpenOgModal, loading = false, loadError = null }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [evening, setEvening] = useState(() => {
    try { return localStorage.getItem('portfolio_palette') === 'evening'; } catch { return false; }
  });
  const note = useRef<HTMLDialogElement>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current); }, []);
  useEffect(() => {
    try { localStorage.setItem('portfolio_palette', evening ? 'evening' : 'paper'); } catch { /* The palette also works without storage. */ }
  }, [evening]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map(project => project.category).filter(Boolean)))], [projects]);
  useEffect(() => { if (!categories.includes(category)) setCategory('All'); }, [categories, category]);
  const filteredProjects = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return projects.filter(project => (category === 'All' || project.category === category) && [project.title, project.url, project.description || '', ...(project.tags || [])].some(value => value.toLocaleLowerCase().includes(query)));
  }, [projects, search, category]);
  const copyLink = async (project: Project) => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    try {
      await navigator.clipboard.writeText(project.url);
      setCopiedId(project.id);
      setFeedback(`Link copied for ${project.title}`);
    } catch {
      setCopiedId(null);
      setFeedback('The link could not be copied. You can open the project using its title.');
    }
    feedbackTimer.current = setTimeout(() => { setCopiedId(null); setFeedback(''); }, 3500);
  };
  const resetFilters = () => { setSearch(''); setCategory('All'); };

  return <div className={`portfolio-site${evening ? ' night' : ''}`}><div className="container">
    <header className="nav"><a href="#top" className="brand" aria-label="Niel Studios home"><span className="brand-mark" aria-hidden="true">n</span>niel studios</a><nav className="nav-right" aria-label="Portfolio navigation"><a href="#work">The work</a><a href="#margins">The margins</a><a href="#contact">Get in touch</a><button type="button" className="theme" aria-label={evening ? 'Switch to paper palette' : 'Switch to evening palette'} aria-pressed={evening} onClick={() => setEvening(value => !value)}>{evening ? <Sun size={16} /> : <Moon size={16} />}</button></nav></header>
    <main>
      <section className="hero" id="top" aria-labelledby="portfolio-heading"><div className="intro"><div className="intro-label mono">Independent design & development</div><h1 id="portfolio-heading">Between<br /><em>words</em><br />& worlds.</h1><p>Thoughtful websites, applications, and useful tools.<br />Built with clarity, character,<br />and attention to the details.</p><a className="text-link" href="#work">Turn to selected work <ArrowDownRight size={16} /></a><div className="hero-annotation"><button type="button" className="letter-open" onClick={() => note.current?.showModal()}>a note on the way I work</button></div></div>
        <div className="still-life" role="img" aria-label="A notebook page, a red bookmark, and a pressed flower"><div className="still-label">FRAGMENT 001 / ON MAKING</div><div className="bookmark" /><div className="sheet"><div className="page-no">FROM THE NOTEBOOK · 01</div><h2>A small thing,<br />carefully made.</h2><p>Good work begins<br />with attention.<br />To a purpose.<br />To the small details.<br />To the people<br />on the other side.</p><span className="draft">NOTES ON THE CRAFT</span></div><div className="pressed-flower" aria-hidden="true">✳</div><div className="ticket">ON WORDS & MAKING<b>an unfinished collection</b></div></div><div className="image-note" aria-hidden="true">a little thought in every detail ↗</div></section>
      <div className="divider" aria-hidden="true"><span>01 / Made with intention</span><span className="line" /><span className="star">✳</span><span className="line" /><span>Design · Development · Curiosity</span></div>
      <section className="works" id="work" aria-labelledby="work-heading"><div className="section-top"><div><span className="mono">Chapter one / Things I make</span><h2 id="work-heading">Selected works<span className="index-number mono">[ {loading ? '…' : `${String(filteredProjects.length).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`} ]</span></h2></div><p className="collection-note">An ongoing collection of ideas, brought to life.</p></div>
        <div className="portfolio-tools"><div className="portfolio-search"><Search size={15} aria-hidden="true" /><label className="portfolio-sr-only" htmlFor="portfolio-search">Search projects</label><input id="portfolio-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a project, a tool, a thought…" />{search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search"><X size={14} /></button>}</div><div className="filters" role="group" aria-label="Project categories">{categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item === 'All' ? 'All entries' : item}</button>)}</div></div>
        {loading ? <div className="portfolio-state" role="status"><Loader2 className="portfolio-spinner" size={22} /><h3>Opening the collection…</h3><p>Your projects are on their way.</p></div>
          : loadError ? <div className="portfolio-state" role="alert"><h3>The collection couldn’t be opened.</h3><p>{loadError}</p><button className="text-link" type="button" onClick={() => window.location.reload()}>Try again <ArrowUpRight size={14} /></button></div>
          : filteredProjects.length ? <div className="work-grid">{filteredProjects.map((project, index) => {
            let domain = project.url;
            try { domain = new URL(project.url).hostname.replace(/^www\./, ''); } catch { /* Keep the supplied URL visible. */ }
            return <article className="work" key={project.id}>
              <button type="button" className={`work-cover tone-${index % 4}`} onClick={() => onOpenProject(project)} aria-label={`Open ${project.title} in a new tab`}><span className="cover-index mono">{String(index + 1).padStart(2, '0')} / {project.category}</span><span className="project-window"><span className="browser-top" aria-hidden="true"><i /><i /><i /><small>{domain}</small></span><span className="project-image"><ProjectPreview project={project} /></span></span><span className="project-launch mono">Visit live <ArrowUpRight size={14} /></span></button>
              <div className="work-meta"><div><h3><a href={project.url} target="_blank" rel="noopener noreferrer" onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onOpenProject(project); } }}>{project.title}</a></h3><p>{project.description || `Explore the project at ${domain}.`}</p></div><button className="project-copy" type="button" aria-label={copiedId === project.id ? `Link copied for ${project.title}` : `Copy link for ${project.title}`} onClick={() => copyLink(project)}>{copiedId === project.id ? <Check size={16} /> : <Copy size={16} />}</button></div>
              {!!project.tags?.length && <ul className="project-tags" aria-label={`${project.title} tags`}>{project.tags.map((tag, tagIndex) => <li key={`${tag}-${tagIndex}`}>{tag}</li>)}</ul>}
            </article>;
          })}</div>
          : <div className="portfolio-state"><h3>{projects.length ? 'A page yet to be found.' : 'The first page is waiting.'}</h3><p>{projects.length ? 'Try another search or browse the whole collection.' : 'New projects will appear here as the collection grows.'}</p>{!!projects.length && <button type="button" className="text-link" onClick={resetFilters}>Show all projects <ArrowUpRight size={14} /></button>}</div>}
        <p className="portfolio-sr-only" role="status">{feedback}</p>{feedback && <div className="portfolio-feedback">{feedback}</div>}
      </section>
      <section className="chapter margins" id="margins" aria-labelledby="margins-heading"><div><span className="mono">Beyond the work / A few influences</span><h2 id="margins-heading">A wider<br /><em>perspective.</em></h2><p className="description">An interest in literature and poetry brings another perspective to the work: an appreciation for language, atmosphere, and the details people notice.</p></div><div><article className="reading-entry"><span className="num">I.</span><div><span className="author">Fyodor Dostoevsky / White Nights</span><h3>White Nights</h3><p>An appreciation for character, atmosphere, and the significance of a small moment.</p></div><a href="https://www.penguinrandomhouse.com/books/832372/white-nights-by-fyodor-dostoevsky/" target="_blank" rel="noopener noreferrer" aria-label="Read about White Nights"><ArrowUpRight size={16} /></a></article><article className="reading-entry"><span className="num">II.</span><div><span className="author">Albert Camus</span><h3>The Myth of Sisyphus</h3><p>An interest in philosophy, perspective, and the questions behind everyday experience.</p></div><a href="https://www.penguinrandomhouse.com/books/23470/the-myth-of-sisyphus-by-albert-camus/" target="_blank" rel="noopener noreferrer" aria-label="Read about The Myth of Sisyphus"><ArrowUpRight size={16} /></a></article></div></section>
      <section className="chapter off-duty" aria-labelledby="outside-heading"><div className="off-note"><span className="mono">Outside the studio</span><h3 id="outside-heading">A little curiosity,<br />beyond the work.</h3><p>Between projects: literature, poetry, and a few rounds of Valorant.</p></div></section>
    </main>
    <footer className="footer" id="contact"><div className="footer-main"><div><h2>Leave a <em>note.</em></h2><p>For an idea, a collaboration, or a simple hello.</p></div><a className="text-link" href="https://github.com/FuumaKowa" target="_blank" rel="noopener noreferrer">Find me on GitHub <ArrowUpRight size={16} /></a></div><div className="footer-meta"><span>NIEL STUDIOS / DESIGN & DEVELOPMENT</span><div className="portfolio-footer-actions">{onOpenOgModal && <button type="button" onClick={onOpenOgModal}>Share & preview</button>}{showAdminToggle && onSwitchToManager && <button type="button" onClick={onSwitchToManager}><Shield size={12} /> Admin Manager</button>}</div><span>WORK IN PROGRESS, ALWAYS.</span></div></footer>
  </div><dialog className="letter-modal" ref={note} aria-labelledby="craft-note-heading"><span className="mono">A note on the work</span><h2 id="craft-note-heading">Thoughtfully,<br />from the start.</h2><p>A useful experience begins with attention: to what it needs to do, how it feels to use, and the details that make it clear.</p><p>Clarity in function.<br />Character in detail.</p><button type="button" onClick={() => note.current?.close()}>Back to the work <ArrowUpRight size={14} /></button></dialog></div>;
};
