(function(){
  'use strict';
  const U=window.PortfolioUtils,E=U.escape,d=U.normalize(window.PORTFOLIO_CONTENT),p=d.profile;
  document.documentElement.dataset.theme=d.appearance.theme;document.title=p.name+' | Academic CV';
  const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)?`<a href="mailto:${E(p.email)}">${E(p.email)}</a>`:'';
  document.getElementById('cv').innerHTML=`<header><h1>${E(p.name)}</h1><p class="cv-role">${E(p.role)}</p><p class="cv-contact">${email}${email&&p.location?' · ':''}${E(p.location)}</p><div class="cv-links">${U.external(p.linkedin,'LinkedIn')}${U.external(p.researchgate,'ResearchGate')}${U.external(p.scholar,'Google Scholar')}</div></header>
    ${d.education.length?`<section><h2>Education</h2>${d.education.map(x=>`<div class="cv-item"><div><h3>${E(x.degree)}</h3><span class="cv-meta">${E(x.year)}</span></div><p>${E(x.institution)}</p><p class="cv-meta">${E(x.details)}</p></div>`).join('')}</section>`:''}
    ${d.interests.length?`<section><h2>Research interests</h2><p>${d.interests.map(x=>E(x.title)).join(' · ')}</p></section>`:''}
    ${d.research.length?`<section><h2>Research experience</h2>${d.research.map(x=>`<div class="cv-item"><div><h3>${E(x.title)}</h3><span class="cv-meta">${E(x.year)}</span></div><p class="cv-meta">${E(x.kind)}</p><p>${E(x.description)}</p></div>`).join('')}</section>`:''}
    ${d.publications.length?`<section><h2>Publications & conference contributions</h2><ol>${d.publications.map(x=>`<li>${U.authors(x.authors,p.name)} (${E(x.year)}). <strong>${E(x.title)}.</strong> <em>${E(x.venue)}</em>${x.details?', '+E(x.details):''}. <span class="cv-meta">[${E(x.kind)}]</span>${x.doi?`<p class="cv-meta">${U.external('https://doi.org/'+x.doi,'https://doi.org/'+x.doi)}</p>`:x.url?`<p class="cv-meta">${U.external(x.url,'View publication')}</p>`:''}</li>`).join('')}</ol></section>`:''}
    ${d.experience.length?`<section><h2>Experience & teaching</h2>${d.experience.map(x=>`<div class="cv-item"><div><h3>${E(x.role)}</h3><span class="cv-meta">${E(x.period)}</span></div><p>${E(x.organization)}</p><p class="cv-meta">${E(x.description)}</p></div>`).join('')}</section>`:''}
    ${d.community.length?`<section><h2>Leadership & community</h2>${d.community.map(x=>`<div class="cv-item"><h3>${E(x.organization)}</h3><p>${E(x.role)}</p>${x.description?`<p class="cv-meta">${E(x.description)}</p>`:''}</div>`).join('')}</section>`:''}
    ${d.awards.length?`<section><h2>Awards & scholarships</h2><ul>${d.awards.map(x=>`<li>${E(x.title)}${x.details?' · '+E(x.details):''}</li>`).join('')}</ul></section>`:''}<p class="cv-caption">To download a PDF, select “Print / Save as PDF” and choose “Save as PDF” as the destination.</p>`;
  document.getElementById('print-cv').addEventListener('click',()=>window.print());
})();
