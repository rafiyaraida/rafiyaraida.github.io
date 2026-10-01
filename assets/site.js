(function () {
  'use strict';
  const U=window.PortfolioUtils, E=U.escape;
  function sectionHead(number,title,note='') {
    return '<div class="section-heading"><span class="section-number">'+number+'</span><h2>'+E(title)+'</h2>'+(note?'<span class="section-note">'+E(note)+'</span>':'')+'</div>';
  }
  function render(raw) {
    const d=U.normalize(raw), p=d.profile;
    document.documentElement.dataset.theme=d.appearance.theme;
    document.title=p.name+' | '+p.role;
    document.querySelector('meta[name="description"]').content=p.intro;
    const first=p.name.trim().split(/\s+/)[0];
    const initials=p.name.split(/\s+/).map(x=>x[0]).slice(0,2).join('');
    const papers=d.publications.filter(x=>x.kind==='Journal article').length;
    const posters=d.publications.filter(x=>x.kind==='Conference poster').length;
    const pic=U.photoURL(p.photo);
    const links=[['linkedin','LinkedIn'],['researchgate','ResearchGate'],['scholar','Google Scholar']].map(([k,l])=>U.external(p[k],l)).join('');
    const active=[['research','Research',d.research.length],['publications','Publications',d.publications.length],['about','About',p.about.trim()||d.education.length],['experience','Experience',d.experience.length||d.community.length||d.awards.length],['contact','Contact',true]].filter(x=>x[2]);
    const mail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)?'mailto:'+p.email:'';
    document.getElementById('portfolio').innerHTML=`
      <header class="site-header"><div class="shell header-inner">
        <a class="brand" href="#main" aria-label="${E(p.name)} homepage"><span class="brand-mark">${E(initials)}</span><span>${E(p.name)}</span></a>
        <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">Menu <span aria-hidden="true">☰</span></button>
        <nav id="main-nav" class="main-nav" aria-label="Main navigation">${active.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}<a class="nav-cv" href="cv.html">View CV</a></nav>
      </div></header>
      <main id="main">
        <section class="hero shell" aria-labelledby="hero-title">
          <div class="hero-copy"><p class="eyebrow">${E(p.role)}</p><h1 id="hero-title">${E(p.name)}</h1><p class="hero-headline">${E(p.headline).replace(/\n/g,'<br>')}</p><p class="hero-intro">${E(p.intro)}</p>
            <div class="hero-actions">${d.research.length?'<a class="button primary" href="#research">Explore my research</a>':''}<a class="button secondary" href="cv.html">View CV</a></div>
            <div class="hero-location">${E(p.institution)}<span aria-hidden="true"> / </span>${E(p.location)}</div>
          </div>
          <aside class="hero-aside" aria-label="Research interests">${pic?`<img class="profile-photo" src="${E(pic)}" alt="${E(p.photoAlt||p.name)}">`:''}
            <div class="interest-panel"><div class="panel-topline"><span>Research interests</span><span class="small-monogram" aria-hidden="true">${E(initials)}</span></div>
            ${d.interests.map((x,i)=>`<div class="interest"><span class="interest-index">0${i+1}</span><div><h2>${E(x.title)}</h2><p>${E(x.description)}</p></div></div>`).join('')}
            <div class="publication-totals">${papers?`<span><strong>${papers.toString().padStart(2,'0')}</strong> ${papers===1?'journal article':'journal articles'}</span>`:''}${posters?`<span><strong>${posters.toString().padStart(2,'0')}</strong> ${posters===1?'conference poster':'conference posters'}</span>`:''}</div></div>
          </aside>
        </section>
        ${d.research.length?`<section id="research" class="section shell">${sectionHead('01','Research','From questions to investigation')}<div class="research-grid">${d.research.map((x,i)=>`<article class="research-card"><div class="card-meta"><span>${E(x.kind)}</span><span>${E(x.year)}</span></div><h3>${E(x.title)}</h3><p>${E(x.description)}</p><div class="tags">${x.tags.split(',').map(t=>t.trim()).filter(Boolean).map(t=>`<span>${E(t)}</span>`).join('')}</div>${U.external(x.url,x.linkLabel||'View project')}</article>`).join('')}</div></section>`:''}
        ${d.publications.length?`<section id="publications" class="publications-section"><div class="section shell">${sectionHead('02','Publications','Articles & conference contributions')}<div class="publication-list">${d.publications.map((x,i)=>`<article class="publication"><div class="publication-year">${E(x.year)}<span>${E(x.kind)}</span></div><div class="publication-body"><h3>${E(x.title)}</h3><p class="authors">${U.authors(x.authors,p.name)}</p><p class="venue">${E(x.venue)}${x.details?' · '+E(x.details):''}</p><details class="pub-summary"><summary>About this ${x.kind==='Conference poster'?'poster':'paper'}</summary><p>${E(x.summary)}</p>${x.doi?`<p class="doi">DOI: ${E(x.doi)}</p>`:''}</details></div><div class="publication-link">${U.external(x.url,x.kind==='Conference poster'?'View poster':'Read paper','button paper-button')}</div></article>`).join('')}</div></div></section>`:''}
        ${p.about.trim()||d.education.length?`<section id="about" class="section shell">${sectionHead('03','A little about me')}<div class="about-grid"><div class="about-copy">${U.paragraphs(p.about)}</div><aside class="education-block"><h3>Education</h3>${d.education.map(x=>`<div class="education-item"><span class="eyebrow">${E(x.year)}</span><h4>${E(x.degree)}</h4><p class="institution">${E(x.institution)}</p><p>${E(x.details)}</p></div>`).join('')}</aside></div></section>`:''}
        ${d.experience.length||d.community.length||d.awards.length?`<section id="experience" class="section shell experience-section">${sectionHead('04','Beyond the laboratory')}<div class="experience-grid"><div><h3 class="subheading">Experience & teaching</h3>${d.experience.map(x=>`<article class="experience-item"><div><h4>${E(x.role)}</h4><span class="period">${E(x.period)}</span></div><p class="organization">${E(x.organization)}</p><p>${E(x.description)}</p></article>`).join('')}</div><div class="community-column">${d.community.length?`<h3 class="subheading">Community & leadership</h3>${d.community.map(x=>`<article class="community-item"><h4>${E(x.organization)}</h4><p class="community-role">${E(x.role)}</p>${x.description?`<p>${E(x.description)}</p>`:''}</article>`).join('')}`:''}${d.awards.length?`<h3 class="subheading award-heading">Recognition</h3><ul class="awards">${d.awards.map(x=>`<li><span>${E(x.title)}</span>${x.details?`<small>${E(x.details)}</small>`:''}</li>`).join('')}</ul>`:''}</div></div></section>`:''}
        <section id="contact" class="contact-section"><div class="shell contact-inner"><div><p class="eyebrow">Get in touch</p><h2>Let’s connect.</h2><p>${E(p.contactNote)}</p></div><div class="contact-links">${mail?`<a class="email-link" href="${E(mail)}">${E(p.email)}</a>`:''}<div class="social-links">${links}</div><p class="contact-location">${E(p.location)}</p></div></div></section>
      </main><footer class="shell footer"><span>© ${new Date().getFullYear()} ${E(p.name)}</span><div><a href="cv.html">View CV</a><a href="editor.html">Site editor</a></div></footer>`;
    const toggle=document.querySelector('.menu-toggle'), nav=document.getElementById('main-nav');
    toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true'; toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
    nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}});
  }
  window.renderPortfolio=render;
  try { render(window.PORTFOLIO_CONTENT); } catch(e) { document.getElementById('portfolio').innerHTML='<main class="shell error-page"><h1>Content could not be loaded</h1><p>'+E(e.message)+'</p><a href="editor.html">Open the content editor</a></main>'; }
  if(new URLSearchParams(location.search).get('preview')==='1') window.addEventListener('message',e=>{
    if(e.source!==window.parent || (location.protocol!=='file:'&&e.origin!==location.origin)) return;
    if(e.data?.type==='portfolio-preview') { try { render(e.data.content); } catch(_) {} }
  });
})();
