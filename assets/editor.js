(function () {
  'use strict';
  const U=window.PortfolioUtils,E=U.escape;
  const starting=U.normalize(window.PORTFOLIO_CONTENT);
  let data=structuredClone(starting), section='profile', dirty=false;
  const storageKey='portfolio-draft-v1:'+location.pathname;
  const form=document.getElementById('editor-form');
  const field=(key,label,type='text',help='',required=false,options=[])=>({key,label,type,help,required,options});
  const schemas={
    profile:{label:'Profile',title:'Introduce yourself',description:'Your name, headline, and story appear on the homepage.',fields:[field('name','Full name','text','',true),field('role','Academic title or role'),field('institution','University or institution'),field('headline','Homepage headline','textarea','Use a new line to split the headline.',true),field('intro','Short introduction','textarea'),field('about','About you','long','Leave a blank line between paragraphs.')]},
    interests:{label:'Research interests',title:'What interests you?',description:'Keep each description short. These appear beside your introduction.',singular:'research interest',fields:[field('title','Research area','text','',true),field('description','Short description','textarea')]},
    research:{label:'Research projects',title:'Share your research',description:'Describe your own work and distinguish completed research from reading projects.',singular:'research project',fields:[field('title','Project title','text','',true),field('kind','Project type','text','For example: Undergraduate thesis or Independent literature study.'),field('year','Year or date'),field('description','Description','long'),field('tags','Topic labels','text','Separate labels with commas.'),field('url','Project or poster link','url','Optional. Paste the complete website address.'),field('linkLabel','Link button text','text','For example: View conference poster.')]},
    publications:{label:'Publications',title:'Keep your papers up to date',description:'Use the publisher’s title and author list. Reorder entries to place your newest work first.',singular:'publication',fields:[field('title','Publication title','text','',true),field('authors','Authors in published order','textarea','Include your full name to highlight it on the website.'),field('year','Publication year'),field('kind','Publication type','select','',false,['Journal article','Conference poster','Conference paper','Preprint','Book chapter']),field('venue','Journal or conference'),field('details','Volume, pages, or conference details'),field('doi','DOI','text','Optional. Enter the identifier, without https://doi.org/.'),field('url','Read paper link','url','Use a DOI, publisher, or repository link.'),field('summary','Short description','textarea','A brief description, in your own words.')]},
    education:{label:'Education',title:'Your academic background',description:'Add degrees, institutions, dates, and any details you want visitors to see.',singular:'education entry',fields:[field('degree','Degree or qualification','text','',true),field('institution','Institution'),field('year','Graduation year or dates'),field('details','Details','textarea','For example: thesis topic, academic results, or scholarship.')]},
    experience:{label:'Experience',title:'Work, teaching & service',description:'Add relevant internships, employment, teaching, and coordination roles.',singular:'experience entry',fields:[field('role','Role','text','',true),field('organization','Organization'),field('period','Dates'),field('description','Description','textarea')]},
    community:{label:'Leadership',title:'Community & leadership',description:'Add organizations and roles that matter to you.',singular:'leadership entry',fields:[field('role','Role','text','',true),field('organization','Organization'),field('description','Description','textarea')]},
    awards:{label:'Recognition',title:'Awards & scholarships',description:'Add the exact award name and a short note or date.',singular:'award',fields:[field('title','Award or scholarship','text','',true),field('details','Details or year')]},
    contact:{label:'Contact',title:'Make it easy to connect',description:'Only add contact information and profile links you want to make public.',fields:[field('email','Public email address','email'),field('location','City and country'),field('contactNote','Contact invitation','textarea'),field('linkedin','LinkedIn profile','url'),field('researchgate','ResearchGate profile','url'),field('scholar','Google Scholar profile','url')]},
    appearance:{label:'Appearance',title:'Make it your own',description:'Choose a color palette and add an optional portrait. Your photo is stored in the same content file.',fields:[field('theme','Color palette','select','',false,[['ocean','Navy & teal'],['forest','Forest green'],['plum','Plum & berry']])]}
  };
  function message(text,kind='success'){
    const node=document.getElementById('editor-message');node.textContent=text;node.className='editor-message '+kind;node.hidden=false;
    if(kind==='error')node.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function saveDraft(){
    dirty=true;document.getElementById('draft-status').textContent='Draft updated · not published';
    try{localStorage.setItem(storageKey,JSON.stringify({data,savedAt:new Date().toISOString()}));}
    catch(_){message('Your edits are available in this tab. This browser could not save a backup; download your content before closing it.','error');}
    updatePreview();
  }
  function updatePreview(){
    let normalized;try{normalized=U.normalize(data);}catch(_){return;}
    const target=location.protocol==='file:'?'*':location.origin;
    for(const id of ['preview-frame','large-preview'])document.getElementById(id)?.contentWindow?.postMessage({type:'portfolio-preview',content:normalized},target);
  }
  function fieldHTML(f,value,index=null){
    const id='edit-'+section+'-'+(index??'single')+'-'+f.key;
    const attrs=`id="${id}" data-field="${f.key}"${index!==null?` data-index="${index}"`:''}`;
    let input='';
    if(f.type==='textarea'||f.type==='long')input=`<textarea ${attrs} class="${f.type==='long'?'long-text':''}" rows="${f.type==='long'?6:3}">${E(value)}</textarea>`;
    else if(f.type==='select')input=`<select ${attrs}>${f.options.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return `<option value="${E(v)}"${v===value?' selected':''}>${E(l)}</option>`;}).join('')}</select>`;
    else input=`<input ${attrs} type="${f.type}" value="${E(value)}"${f.type==='url'?' placeholder="https://…"':''}>`;
    return `<label class="editor-field" for="${id}"><span class="field-label">${E(f.label)}${f.required?'<span class="required-mark" aria-label="required">*</span>':''}</span>${input}${f.help?`<span class="field-help">${E(f.help)}</span>`:''}</label>`;
  }
  function sectionObject(){return section==='contact'?data.profile:section==='profile'?data.profile:section==='appearance'?data.appearance:null;}
  function renderForm(openIndex=null){
    const s=schemas[section];document.getElementById('editor-kicker').textContent=s.label;document.getElementById('editor-title').textContent=s.title;document.getElementById('editor-description').textContent=s.description;
    document.querySelectorAll('[data-section]').forEach(n=>{const active=n.dataset.section===section;n.classList.toggle('is-active',active);n.setAttribute('aria-pressed',String(active));});
    const obj=sectionObject();
    if(obj){
      form.innerHTML=s.fields.map(f=>fieldHTML(f,obj[f.key])).join('');
      if(section==='appearance'){
        const photo=U.photoURL(data.profile.photo);
        form.insertAdjacentHTML('beforeend',`<div class="photo-controls"><span class="field-label">Profile photo</span>${photo?`<img src="${E(photo)}" alt="Current profile photo">`:''}<p>Choose a JPG, PNG, or WebP photo, up to 5 MB. The editor will resize it for the website.</p><div class="photo-actions"><label class="small-button" for="upload-photo">Choose photo</label><input id="upload-photo" type="file" accept="image/jpeg,image/png,image/webp" hidden>${photo?'<button class="small-button" type="button" id="remove-photo">Remove photo</button>':''}</div></div>${fieldHTML(field('photoAlt','Photo description'),data.profile.photoAlt)}`);
        document.getElementById('upload-photo').addEventListener('change',uploadPhoto);
        document.getElementById('remove-photo')?.addEventListener('click',()=>{data.profile.photo='';saveDraft();renderForm();});
      }
    }else{
      const rows=data[section];
      form.innerHTML=(rows.length?'':'<p class="empty-list">No entries yet. Add one below. Empty sections are hidden on the website.</p>')+rows.map((item,i)=>`<details class="editor-item" data-row="${i}"${(openIndex===null?i===0:i===openIndex)?' open':''}><summary><span data-summary="${i}">${E(item[s.fields[0].key]||'New '+s.singular)}</span></summary><div class="editor-item-body">${s.fields.map(f=>fieldHTML(f,item[f.key],i)).join('')}</div><div class="editor-item-actions"><div><button class="small-button" type="button" data-action="up" data-index="${i}" ${i===0?'disabled':''} aria-label="Move entry ${i+1} up">Move up</button><button class="small-button" type="button" data-action="down" data-index="${i}" ${i===rows.length-1?'disabled':''} aria-label="Move entry ${i+1} down">Move down</button></div><button class="small-button remove-button" type="button" data-action="remove" data-index="${i}">Remove</button></div></details>`).join('')+`<button class="add-entry" type="button" id="add-entry">Add ${E(s.singular)}</button>`;
      document.getElementById('add-entry').addEventListener('click',()=>{const item=Object.fromEntries(s.fields.map(f=>[f.key,f.key==='kind'&&section==='publications'?'Journal article':'']));data[section].push(item);saveDraft();renderForm(data[section].length-1);form.querySelector('details:last-of-type input')?.focus();});
    }
    form.insertAdjacentHTML('beforeend','<p class="editing-tip">When you finish, select <strong>Download updated content</strong>. Upload that file to your GitHub repository to publish the changes.</p>');
  }
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('input',e=>{
    const field=e.target.dataset.field;if(!field)return;
    const index=e.target.dataset.index;
    if(index!==undefined){data[section][Number(index)][field]=e.target.value;const first=schemas[section].fields[0].key;if(field===first)form.querySelector(`[data-summary="${index}"]`).textContent=e.target.value||'New '+schemas[section].singular;}
    else if(section==='appearance'&&field==='photoAlt')data.profile.photoAlt=e.target.value;
    else sectionObject()[field]=e.target.value;
    saveDraft();
  });
  form.addEventListener('click',e=>{
    const button=e.target.closest('[data-action]');if(!button)return;
    const i=Number(button.dataset.index),rows=data[section],action=button.dataset.action;
    if(action==='remove'){
      if(!confirm('Remove this '+schemas[section].singular+' from your draft?'))return;
      rows.splice(i,1);saveDraft();renderForm(Math.min(i,rows.length-1));
    }else{const j=action==='up'?i-1:i+1;if(j<0||j>=rows.length)return;[rows[i],rows[j]]=[rows[j],rows[i]];saveDraft();renderForm(j);}
  });
  async function uploadPhoto(e){
    const file=e.target.files[0];if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){message('Choose a JPG, PNG, or WebP photo smaller than 5 MB.','error');return;}
    let url;
    try{
      url=URL.createObjectURL(file);const img=new Image();img.src=url;await img.decode();
      const ratio=Math.min(1,1000/Math.max(img.naturalWidth,img.naturalHeight));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));
      const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
      data.profile.photo=canvas.toDataURL('image/jpeg',.85);saveDraft();renderForm();message('Photo added to your draft. Download updated content to keep it.');
    }catch(_){message('The photo could not be opened. Please choose another JPG, PNG, or WebP image.','error');}finally{if(url)URL.revokeObjectURL(url);}
  }
  document.getElementById('editor-nav').innerHTML=Object.entries(schemas).map(([k,s])=>`<button type="button" data-section="${k}">${E(s.label)}</button>`).join('');
  document.getElementById('editor-nav').addEventListener('click',e=>{const button=e.target.closest('[data-section]');if(!button)return;section=button.dataset.section;renderForm();document.getElementById('editor-title').scrollIntoView({block:'nearest'});});
  document.getElementById('download-content').addEventListener('click',()=>{
    try{
      const text=U.serialize(data),blob=new Blob([text],{type:'text/javascript;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download='content.js';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
      dirty=false;document.getElementById('draft-status').textContent='Content downloaded · upload to publish';message('Your updated content.js file has been downloaded. In GitHub, open your repository, choose Add file → Upload files, upload content.js to the main folder, and select Commit changes. The website will update after GitHub publishes it.');
    }catch(e){message(e.message,'error');}
  });
  document.getElementById('import-content').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{const imported=U.parse(await file.text());if(dirty&&!confirm('Replace your current draft with this file?'))return;data=imported;saveDraft();renderForm();message('Content imported into your draft. Check the preview before downloading.');}catch(e){message(e.message,'error');}finally{e.target.value='';}
  });
  document.getElementById('reset-content').addEventListener('click',()=>{if(!confirm('Reset your draft to the content currently included in the website?'))return;data=structuredClone(starting);dirty=false;try{localStorage.removeItem(storageKey);}catch(_){}document.getElementById('draft-banner').hidden=true;renderForm();updatePreview();document.getElementById('draft-status').textContent='Website content loaded';message('Draft reset to website content.');});
  let saved=null;try{saved=JSON.parse(localStorage.getItem(storageKey)||'null');}catch(_){}
  if(saved?.data){document.getElementById('draft-banner').hidden=false;}
  document.getElementById('restore-draft').addEventListener('click',()=>{try{data=U.normalize(saved.data);saveDraft();renderForm();document.getElementById('draft-banner').hidden=true;message('Previous draft restored.');}catch(e){message('Could not restore this draft. '+e.message,'error');}});
  document.getElementById('discard-draft').addEventListener('click',()=>{if(!confirm('Discard the saved draft on this device?'))return;try{localStorage.removeItem(storageKey);}catch(_){}document.getElementById('draft-banner').hidden=true;});
  for(const id of ['preview-frame','large-preview'])document.getElementById(id).addEventListener('load',updatePreview);
  const dialog=document.getElementById('preview-dialog');
  document.getElementById('open-preview').addEventListener('click',()=>{dialog.showModal();updatePreview();});
  document.getElementById('close-preview').addEventListener('click',()=>dialog.close());
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  renderForm();
})();
