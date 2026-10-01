/* Shared data validation and rendering helpers. No external dependencies. */
(function () {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function webURL(value) {
    try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch (_) { return ''; }
  }
  function photoURL(value) {
    if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value || '')) return value;
    if (/^assets\/[A-Za-z0-9_./-]+\.(jpg|jpeg|png|webp)$/i.test(value || '') && !value.includes('..')) return value;
    return webURL(value);
  }
  const keys = {
    interests:['title','description'], research:['title','kind','year','description','tags','url','linkLabel'],
    publications:['title','authors','year','kind','venue','details','doi','url','summary'],
    education:['degree','institution','year','details'], experience:['role','organization','period','description'],
    community:['role','organization','description'], awards:['title','details']
  };
  function normalize(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== 1 || !raw.profile || typeof raw.profile !== 'object') throw new Error('This is not a supported portfolio content file.');
    const out = {version:1,profile:{},appearance:{theme:'ocean'}};
    for (const k of ['name','role','institution','location','email','headline','intro','about','contactNote','photo','photoAlt','linkedin','researchgate','scholar']) out.profile[k]=String(raw.profile[k] ?? '');
    if (!out.profile.name.trim()) throw new Error('Please enter a name.');
    if (['ocean','forest','plum'].includes(raw.appearance?.theme)) out.appearance.theme=raw.appearance.theme;
    for (const [k, fields] of Object.entries(keys)) {
      if (!Array.isArray(raw[k])) throw new Error('The content file is missing the '+k+' list.');
      if (raw[k].length>100) throw new Error('Please keep each section to 100 entries or fewer.');
      out[k]=raw[k].map(row=>Object.fromEntries(fields.map(f=>[f,String(row?.[f]??'')])));
    }
    return out;
  }
  function validate(raw) {
    const data=normalize(raw), p=data.profile;
    const problems=[];
    if (!p.headline.trim()) problems.push('Profile: add a headline.');
    if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) problems.push('Contact: enter a valid email address.');
    for (const k of ['linkedin','researchgate','scholar']) if (p[k]&&!webURL(p[k])) problems.push('Contact: '+k+' must start with https:// or http://.');
    if (p.photo&&!photoURL(p.photo)) problems.push('Appearance: use a valid photo URL or upload a photo.');
    for (const [list, rows] of Object.entries(keys)) data[list].forEach((item,i)=>{
      const name=rows[0];
      if(!item[name].trim()) problems.push(list+' entry '+(i+1)+': add a '+name+'.');
      if(item.url&&!webURL(item.url)) problems.push(list+' entry '+(i+1)+': enter a complete website address.');
    });
    if(problems.length) throw new Error(problems.join('\n'));
    return data;
  }
  function serialize(data) {
    return '/* Edit with editor.html. This file contains public portfolio content only. */\nwindow.PORTFOLIO_CONTENT = '+JSON.stringify(validate(data),null,2).replace(/</g,'\\u003c')+';\n';
  }
  function parse(text) {
    if(text.length>6000000) throw new Error('This file is too large. Choose a content.js file smaller than 6 MB.');
    const clean=text.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '').trim();
    const match=clean.match(/^window\.PORTFOLIO_CONTENT\s*=\s*([\s\S]*?)\s*;?\s*$/);
    try { return normalize(JSON.parse(match ? match[1].replace(/;\s*$/,'') : clean)); } catch(e) { throw new Error('Could not read this content file. Choose an exported content.js file. '+e.message); }
  }
  function external(url,label,className='text-link') {
    const safe=webURL(url);
    return safe?'<a class="'+escape(className)+'" href="'+escape(safe)+'" target="_blank" rel="noopener noreferrer">'+escape(label)+'</a>':'';
  }
  function paragraphs(text) { return String(text||'').split(/\n\s*\n/).filter(x=>x.trim()).map(x=>'<p>'+escape(x).replace(/\n/g,'<br>')+'</p>').join(''); }
  function authors(text,name) {
    return escape(text).split(escape(name)).join('<strong>'+escape(name)+'</strong>');
  }
  window.PortfolioUtils={escape,webURL,photoURL,normalize,validate,serialize,parse,external,paragraphs,authors,keys};
})();
