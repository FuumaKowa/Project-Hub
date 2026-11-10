import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { EDITORIAL_OPENING_DURATION_MS, EDITORIAL_OPENING_KEY, shouldShowEditorialOpening } from '../lib/editorialOpening';
import './editorial-opening.css';

function eligible() {
  if (typeof window === 'undefined') return false;
  let seen = false;
  try {seen = sessionStorage.getItem(EDITORIAL_OPENING_KEY) === 'seen';} catch {/* A disabled storage area must not block entry. */}
  const params = new URLSearchParams(window.location.search);
  return shouldShowEditorialOpening({
    seen,
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    hash: window.location.hash,
    managerRequest: params.get('view') === 'manager' || params.get('mode') === 'manager' || params.get('admin') === 'true'
      || ['pin','secret','adminKey','key'].some(key => params.has(key)),
  });
}

export function EditorialOpening() {
  const [active,setActive] = useState(eligible);
  const dialog = useRef<HTMLDialogElement>(null);
  const finish = useCallback(() => {
    dialog.current?.close();
    setActive(false);
    document.getElementById('ed-main')?.focus({preventScroll:true});
  },[]);

  useLayoutEffect(() => {
    if (!active) return;
    const element = dialog.current;
    if (!element || typeof element.showModal !== 'function') {setActive(false);return;}
    const previousOverflow = document.body.style.overflow;
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (preference?.matches) {setActive(false);return;}
    try {element.showModal();} catch {setActive(false);return;}
    document.body.style.overflow = 'hidden';
    try {sessionStorage.setItem(EDITORIAL_OPENING_KEY,'seen');} catch {/* Automatic and manual dismissal still work without storage. */}
    const timer = window.setTimeout(finish,EDITORIAL_OPENING_DURATION_MS);
    const handlePreference = () => {if(preference?.matches) finish();};
    const handleVisibility = () => {if(document.hidden) finish();};
    preference?.addEventListener('change',handlePreference);
    document.addEventListener('visibilitychange',handleVisibility);
    return () => {
      window.clearTimeout(timer);
      preference?.removeEventListener('change',handlePreference);
      document.removeEventListener('visibilitychange',handleVisibility);
      if(element.open) element.close();
      document.body.style.overflow = previousOverflow;
    };
  },[active,finish]);

  if(!active) return null;
  return <dialog ref={dialog} className="ed-opening" aria-labelledby="ed-opening-title" onCancel={event=>{event.preventDefault();finish();}}>
    <span className="ed-opening-corner">Niel Studios / A personal collection</span>
    <div className="ed-opening-center">
      <svg className="ed-opening-mark" viewBox="0 0 120 100" fill="none" aria-hidden="true">
        <path className="ed-opening-pencil" pathLength="1" d="M20 76Q29 77 31 69L38 29M32 53C42 26 72 26 68 51L64 70Q63 78 76 75" />
        <path className="ed-opening-flourish" pathLength="1" d="M18 84Q57 89 96 80" />
        <circle className="ed-opening-dot" cx="88" cy="75" r="3" />
      </svg>
      <h2 id="ed-opening-title">Between <em>words</em><br />& worlds.</h2>
      <p>Design · Development · Curiosity</p>
    </div>
    <div className="ed-opening-bottom"><span>A thought, taking shape.</span><button type="button" onClick={finish} autoFocus>Skip opening <span aria-hidden="true">↗</span></button></div>
  </dialog>;
}
