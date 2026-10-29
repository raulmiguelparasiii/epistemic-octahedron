from pathlib import Path

ui = Path('philosophers-stone-atlas/stone-ui-v2.js')
s = ui.read_text()

style_anchor = "      @media(min-width:700px){.stone-semantics-grid{grid-template-columns:1fr 1fr}.stone-audit{grid-template-columns:1fr 1fr}}"
paper_styles = """      #plotPanel.stone-plot-scroll{overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;scrollbar-gutter:stable}
      .stone-paper{margin:18px 0 8px;padding:15px 1px 8px;border-top:1px solid var(--border,#e2e8f0)}
      .stone-paper-kicker{margin:0 0 4px;font-size:9.5px;font-weight:850;letter-spacing:.065em;text-transform:uppercase;color:var(--muted,#64748b)}
      .stone-paper h3{margin:0;font-size:15px;line-height:1.25;letter-spacing:-.01em;color:var(--text,#0f172a)}
      .stone-paper-subtitle{margin:3px 0 11px;font-size:11.5px;line-height:1.4;color:var(--muted,#475569)}
      .stone-paper-preview-link{display:block;border:1px solid var(--border,#e2e8f0);border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 1px 3px rgba(15,23,42,.08)}
      .stone-paper-preview{display:block;width:100%;height:auto;background:#fff}
      .stone-paper-download{display:flex;align-items:center;justify-content:center;width:100%;box-sizing:border-box;margin:10px 0 2px;padding:10px 12px;border:1px solid #0f172a;border-radius:10px;background:#0f172a;color:#fff!important;text-decoration:none;font:800 11.5px/1 system-ui,sans-serif;letter-spacing:.01em}
      #stonePaperScrollCue{position:absolute;left:50%;bottom:10px;z-index:30;width:34px;height:28px;display:grid;place-items:center;pointer-events:none;opacity:0;transform:translateX(-50%);transition:opacity 150ms ease}
      #stonePaperScrollCue.is-visible{opacity:1}
      #stonePaperScrollCue::before{content:'';width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid rgba(15,23,42,.92);animation:stone-paper-nudge 1.15s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(255,255,255,.75))}
      @keyframes stone-paper-nudge{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
      @media(prefers-reduced-motion:reduce){#stonePaperScrollCue::before{animation:none}}
      @media(min-width:700px){.stone-semantics-grid{grid-template-columns:1fr 1fr}.stone-audit{grid-template-columns:1fr 1fr}}"""
assert s.count(style_anchor) == 1
s = s.replace(style_anchor, paper_styles, 1)

fn_anchor = "  function installReferents(worldviewPanel,referentBtn){"
fn = r'''  function installPlotPaper(plotBtn){
    const plotPanel=$('#plotPanel');
    if(!plotPanel) return null;
    const negative=$('#negativeStabilityLabel');
    const positive=$('#positiveStabilityLabel');
    if(negative) negative.textContent='Insulation';
    if(positive) positive.textContent='Answerability';
    plotPanel.classList.add('stone-plot-scroll');

    let section=$('#stonePaperSection');
    if(!section){
      const base=document.baseURI;
      const previewUrl=new URL('paper/page-01.jpg',base).href;
      const pdfUrl=new URL('paper/The-Philosophers-Stone-The-Objective-Structure-of-Maturity.pdf',base).href;
      section=document.createElement('section');
      section.id='stonePaperSection';
      section.className='stone-paper';
      section.innerHTML=`<div class="stone-paper-kicker">Research monograph</div><h3>The Philosopher’s Stone</h3><p class="stone-paper-subtitle">The Objective Structure of Maturity</p><a class="stone-paper-preview-link" href="${pdfUrl}" target="_blank" rel="noopener" aria-label="Open The Philosopher’s Stone PDF"><img class="stone-paper-preview" src="${previewUrl}" alt="First page of The Philosopher’s Stone: The Objective Structure of Maturity"></a><a class="stone-paper-download" href="${pdfUrl}" download="The-Philosophers-Stone-The-Objective-Structure-of-Maturity.pdf">Download PDF</a>`;
      plotPanel.appendChild(section);
    }

    const root=plotPanel.parentElement;
    if(!root) return {section};
    if(getComputedStyle(root).position==='static') root.style.position='relative';
    let cue=$('#stonePaperScrollCue',root);
    if(!cue){
      cue=document.createElement('div');
      cue.id='stonePaperScrollCue';
      cue.setAttribute('aria-hidden','true');
      root.appendChild(cue);
    }
    const updateCue=()=>{
      const active=plotBtn.classList.contains('active')||plotBtn.classList.contains('selected')||plotBtn.getAttribute('aria-selected')==='true';
      const atTop=plotPanel.scrollTop<=1;
      const hasMore=plotPanel.scrollHeight>plotPanel.clientHeight+2;
      cue.classList.toggle('is-visible',active&&atTop&&hasMore);
    };
    plotPanel.addEventListener('scroll',updateCue,{passive:true});
    plotBtn.addEventListener('click',()=>requestAnimationFrame(updateCue));
    new MutationObserver(updateCue).observe(plotBtn,{attributes:true,attributeFilter:['class','aria-selected']});
    if(window.ResizeObserver) new ResizeObserver(updateCue).observe(plotPanel);
    $('.stone-paper-preview',section)?.addEventListener('load',updateCue,{once:true});
    window.addEventListener('resize',updateCue,{passive:true});
    requestAnimationFrame(updateCue);
    return {section,cue,updateCue};
  }

'''
assert s.count(fn_anchor) == 1
s = s.replace(fn_anchor, fn + fn_anchor, 1)

boot_anchor = "    installStyles();\n    referentBtn.textContent='Referent';"
boot_replacement = "    installStyles();\n    installPlotPaper(plotBtn);\n    referentBtn.textContent='Referent';"
assert s.count(boot_anchor) == 1
s = s.replace(boot_anchor, boot_replacement, 1)
ui.write_text(s)

wrapper = Path('philosophers-stone-atlas/index.html')
w = wrapper.read_text()
old_q = 'stone-ui-v2.js?v=stone-v11-20261028'
new_q = 'stone-ui-v2.js?v=stone-v12-20261029'
assert w.count(old_q) == 1
w = w.replace(old_q, new_q, 1)
wrapper.write_text(w)

# Validate only intended semantic/UI hooks.
s = ui.read_text()
for required in [
    "negative.textContent='Insulation'",
    "positive.textContent='Answerability'",
    "id='stonePaperSection'",
    "paper/page-01.jpg",
    "The-Philosophers-Stone-The-Objective-Structure-of-Maturity.pdf",
    "id='stonePaperScrollCue'",
    "plotPanel.scrollTop<=1",
    "plotPanel.scrollHeight>plotPanel.clientHeight+2",
]:
    assert required in s, required
assert 'Negative Stability' not in s
assert 'Positive Stability' not in s
assert new_q in wrapper.read_text()
