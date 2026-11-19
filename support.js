/* Standalone runtime for the late-night arrival prototype: renders the screen template, keeps state, re-renders on tap. */
(function(){var m=document.createElement("meta");m.name="viewport";m.content="width=device-width,initial-scale=1";document.head.appendChild(m);})();
window.DCLogic=class{constructor(p){this.props=p||{};this.state={};}setState(s){Object.assign(this.state,typeof s==='function'?s(this.state):s);window.__dcRender&&window.__dcRender();}};
document.addEventListener('DOMContentLoaded',()=>{
  const h=document.querySelector('helmet');if(h){document.head.append(...h.childNodes);h.remove();}
  const st=document.createElement('style');
  st.textContent=`html,body{margin:0;background:#EDEAEA;min-height:100vh}
  #dc-stage{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px 0;box-sizing:border-box;gap:14px}
  #dc-phone{width:390px;height:844px;border-radius:44px;overflow:hidden;box-shadow:0 0 0 10px #1d1d1f,0 30px 80px rgba(0,0,0,.25);background:#fff;position:relative}
  #dc-bar{font:500 13px 'DM Sans',system-ui,sans-serif;color:#6A6A6A;display:flex;gap:16px}#dc-bar a{color:#222;text-decoration:underline}
  @media (max-width:500px){html,body{background:#fff}#dc-stage{padding:0;display:block}#dc-phone{width:100vw;height:100vh;border-radius:0;box-shadow:none}#dc-phone>div{width:100vw!important;height:100vh!important}#dc-bar{display:none}}`;
  document.head.appendChild(st);
  const x=document.querySelector('x-dc');const tpl=x.innerHTML;
  const sc=document.querySelector('script[data-dc-script]');let comp=null;
  if(sc){try{const C=new Function(sc.textContent+';return Component;')();comp=new C({});}catch(e){console.error(e)}}
  const stage=document.createElement('div');stage.id='dc-stage';
  const phone=document.createElement('div');phone.id='dc-phone';
  const bar=document.createElement('div');bar.id='dc-bar';bar.innerHTML='<a href="index.html">All screens</a><span>Unofficial concept · not affiliated with Airbnb</span>';
  stage.append(phone,bar);x.replaceWith(stage);
  const get=(e,s)=>{e=e.trim();if(e==='true')return true;if(e==='false')return false;return e.split('.').reduce((o,k)=>o==null?undefined:o[k],s);};
  const interp=(str,s)=>str.replace(/\{\{([^}]*)\}\}/g,(_,e)=>{const v=get(e,s);return v==null||typeof v==='function'?'':String(v);});
  function proc(node,s){
    for(const ch of [...node.childNodes]){
      if(ch.nodeType===3){if(ch.nodeValue.includes('{{'))ch.nodeValue=interp(ch.nodeValue,s);continue;}
      if(ch.nodeType!==1)continue;const tag=ch.tagName.toLowerCase();
      if(tag==='sc-if'){const m=(ch.getAttribute('value')||'').match(/\{\{([^}]*)\}\}/);if(m&&get(m[1],s)){proc(ch,s);ch.replaceWith(...ch.childNodes);}else ch.remove();continue;}
      if(tag==='sc-for'){const m=(ch.getAttribute('list')||'').match(/\{\{([^}]*)\}\}/);const list=(m&&get(m[1],s))||[];const as=ch.getAttribute('as')||'item';const fr=document.createDocumentFragment();for(const it of list){const c=ch.cloneNode(true);proc(c,Object.assign(Object.create(s),{[as]:it}));fr.append(...c.childNodes);}ch.replaceWith(fr);continue;}
      for(const a of [...ch.attributes]){if(!a.value.includes('{{'))continue;if(/^on/i.test(a.name)){const m=a.value.match(/\{\{([^}]*)\}\}/);const fn=m&&get(m[1],s);ch.removeAttribute(a.name);if(typeof fn==='function')ch.addEventListener(a.name.slice(2).toLowerCase(),ev=>{ev.preventDefault();fn(ev);});}else ch.setAttribute(a.name,interp(a.value,s));}
      proc(ch,s);
    }
  }
  window.__dcRender=()=>{const t=document.createElement('template');t.innerHTML=tpl;const vals=comp?(comp.renderVals()||{}):{};proc(t.content,vals);phone.replaceChildren(t.content);};
  const fit=()=>{if(innerWidth>500){phone.style.zoom=Math.min(1,(innerHeight-80)/864);}else phone.style.zoom='';};fit();addEventListener('resize',fit);
  window.__dcRender();
});
