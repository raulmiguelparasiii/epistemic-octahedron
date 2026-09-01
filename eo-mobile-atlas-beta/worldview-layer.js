(() => {
  'use strict';

  const loader = document.currentScript;
  const layerBase = new URL('.', (loader && loader.src) || document.baseURI);
  const atlasParts = [
    'worldviews.01.b64','worldviews.02.b64','worldviews.03.b64',
    'worldviews.04.b64','worldviews.05.b64','worldviews.06.b64',
    'worldviews.07.b64','worldviews.08.b64','worldviews.09.b64'
  ].map(name => new URL(name, layerBase).href);

  const normalizeText = value => String(value || '').replace(/\s+/g, ' ').trim();
  const coordinatePattern = /^\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/;
  const legacyLabels = [
    'If this feels like you',
    'Personal portrait',
    'Natural strength',
    'What can slip past you',
    'Growth without self-erasure',
    'Epistemic stage',
    'Orientation family',
    'Common-language teaching name',
    'Why this fits the hierarchy'
  ];

  const strengthLabels = [
    'What this gets right',
    'Its real strength',
    'Where this lens is useful',
    'What it protects',
    'The part worth keeping',
    'Why this can work'
  ];
  const slipLabels = [
    'What can go missing',
    'The pressure that arrives late',
    'Where it can drift',
    'What reality can still demand',
    'The neglected counterweight',
    'Where the frame can overreach'
  ];
  const growthLabels = [
    'What better looks like',
    'How this moves upward',
    'The next correction',
    'How it matures',
    'Growth without losing the strength',
    'What opens the frame'
  ];

  const style = document.createElement('style');
  style.textContent = `
    .eo-worldview-legacy-hidden{display:none!important}
    .eo-curated-worldview{margin:8px 0 4px;padding:2px 0 0;color:var(--text,#0f172a)}
    .eo-curated-worldview *{box-sizing:border-box}
    .eo-curated-head{display:grid;gap:4px;margin-bottom:9px}
    .eo-curated-kicker{font-size:9px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:var(--muted,#64748b)}
    .eo-curated-title{margin:0;font-size:19px;line-height:1.12;letter-spacing:-.02em}
    .eo-curated-alias{font-size:11px;color:var(--muted,#64748b);font-weight:650}
    .eo-curated-meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:2px}
    .eo-curated-chip{display:inline-flex;align-items:center;min-height:22px;padding:3px 7px;border:1px solid var(--border,#e2e8f0);border-radius:999px;font-size:9px;font-weight:800;letter-spacing:.02em;color:var(--muted,#64748b);background:var(--panel,#fff)}
    .eo-curated-lead,.eo-curated-body{margin:0 0 9px;font-size:13px;line-height:1.52}
    .eo-curated-lead{font-size:14px;line-height:1.48}
    .eo-curated-callout{margin:8px 0;padding:9px 10px;border:1px solid var(--border,#e2e8f0);border-radius:12px;background:color-mix(in srgb,var(--panel,#fff) 92%,var(--muted,#64748b) 8%)}
    .eo-curated-callout strong{display:block;margin-bottom:3px;font-size:10px;letter-spacing:.055em;text-transform:uppercase}
    .eo-curated-callout p{margin:0;font-size:12px;line-height:1.5}
    .eo-curated-callout.pressure{border-style:dashed}
    .eo-curated-quote{margin:8px 0 10px;padding-left:10px;border-left:2px solid var(--border,#cbd5e1);font-size:13px;line-height:1.5}
    .eo-curated-details{border-top:1px solid var(--border,#e2e8f0);margin-top:8px}
    .eo-curated-details details{border-bottom:1px solid var(--border,#e2e8f0);padding:0}
    .eo-curated-details summary{cursor:pointer;list-style:none;padding:9px 1px;font-size:11px;font-weight:800;color:var(--muted,#475569)}
    .eo-curated-details summary::-webkit-details-marker{display:none}
    .eo-curated-details summary::after{content:'+';float:right;font-size:14px;font-weight:500}
    .eo-curated-details details[open] summary::after{content:'–'}
    .eo-curated-detail-body{padding:0 1px 10px;font-size:11.5px;line-height:1.52}
    .eo-curated-detail-body p{margin:0 0 8px}
    .eo-curated-detail-body p:last-child{margin-bottom:0}
    .eo-curated-detail-label{font-weight:800}
    @media (max-width:520px){
      .eo-curated-title{font-size:18px}
      .eo-curated-lead{font-size:13.5px}
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  const visible = el => {
    if (!el || !el.isConnected) return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && el.getClientRects().length > 0;
  };

  const escapeHtml = value => String(value || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  const normalizeCoordinate = text => {
    const m = normalizeText(text).replace(/−/g,'-').match(coordinatePattern);
    if (!m) return '';
    const nums = m.slice(1).map(Number);
    if (nums.some(n => !Number.isFinite(n))) return '';
    return `(${nums.map(n => n.toFixed(1)).join(', ')})`;
  };

  const extractCoordinate = text => {
    const cleaned = normalizeText(text).replace(/−/g,'-');
    const m = cleaned.match(/\(\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\)/);
    return m ? normalizeCoordinate(m[0]) : '';
  };

  const commonAncestor = (a,b) => {
    if (!a || !b) return null;
    const seen = new Set();
    for (let n=a; n; n=n.parentElement) seen.add(n);
    for (let n=b; n; n=n.parentElement) if (seen.has(n)) return n;
    return null;
  };

  const exactTextNodes = (root, label) => {
    const wanted = normalizeText(label).toLowerCase();
    const nodes = [];
    const all = root.querySelectorAll('h1,h2,h3,h4,h5,h6,label,strong,b,span,p,div,dt,summary');
    for (const el of all) {
      if (!visible(el)) continue;
      if (normalizeText(el.textContent).toLowerCase() === wanted) nodes.push(el);
    }
    return nodes;
  };

  const findHost = () => {
    const direct = document.getElementById('worldviewPanel');
    if (direct) return direct;
    const portraits = exactTextNodes(document, 'Personal portrait');
    const hierarchy = exactTextNodes(document, 'Why this fits the hierarchy');
    for (const a of portraits) {
      for (const b of hierarchy) {
        const host = commonAncestor(a,b);
        if (host && host !== document.body && visible(host)) return host;
      }
    }
    const anchor = portraits[0] || hierarchy[0];
    if (!anchor) return null;
    let host = anchor.parentElement;
    while (host && host !== document.body && normalizeText(host.textContent).length < 220) host = host.parentElement;
    return host && host !== document.body ? host : anchor.parentElement;
  };

  const findCoordinate = (host, atlas) => {
    const x = Number(document.getElementById('coord-x')?.value);
    const y = Number(document.getElementById('coord-y')?.value);
    const z = Number(document.getElementById('coord-z')?.value);
    if ([x,y,z].every(Number.isFinite)) {
      const l1 = Math.abs(x) + Math.abs(y) + Math.abs(z);
      if (Math.abs(l1 - 1) > 0.02) return '';
      const directKey = normalizeCoordinate(`(${x}, ${y}, ${z})`);
      if (directKey && atlas.has(directKey)) return directKey;
      let nearestKey = '';
      let nearestDistance = Infinity;
      for (const key of atlas.keys()) {
        const match = key.match(coordinatePattern);
        if (!match) continue;
        const [ax,ay,az] = match.slice(1).map(Number);
        const distance = (x-ax)**2 + (y-ay)**2 + (z-az)**2;
        if (distance < nearestDistance) { nearestDistance = distance; nearestKey = key; }
      }
      if (nearestKey) return nearestKey;
    }
    const testScope = scope => {
      const candidates = scope.querySelectorAll('span,p,div,strong,b,h1,h2,h3,h4,h5,h6,code');
      for (const el of candidates) {
        if (!visible(el)) continue;
        const text = normalizeText(el.textContent);
        if (text.length > 100 || el.children.length > 2) continue;
        const key = extractCoordinate(text);
        if (key && atlas.has(key)) return key;
      }
      return '';
    };
    let scope = host;
    for (let i=0; scope && i<5; i++, scope=scope.parentElement) {
      const key = testScope(scope);
      if (key) return key;
    }
    return testScope(document.body);
  };

  const sectionForLabel = (labelEl, host) => {
    if (!labelEl) return null;
    let node = labelEl.parentElement || labelEl;
    for (let i=0; node && node !== host && i<4; i++, node=node.parentElement) {
      const txt = normalizeText(node.textContent);
      if (txt.length >= 40 && txt.length <= 900) return node;
      if (node.children.length > 8 || txt.length > 1600) break;
    }
    return labelEl.parentElement;
  };

  const hideLegacy = host => {
    if (host?.id === 'worldviewPanel') {
      const curated = host.querySelector('.eo-curated-worldview');
      const legacy = [...host.children].filter(el => el !== curated && !el.classList.contains('eo-curated-worldview'));
      for (const el of legacy) el.classList.add('eo-worldview-legacy-hidden');
      return legacy[0] || null;
    }
    let firstSection = null;
    for (const label of legacyLabels) {
      for (const node of exactTextNodes(host, label)) {
        const section = sectionForLabel(node, host);
        const curated = host.querySelector('.eo-curated-worldview');
        if (!section || section.classList.contains('eo-curated-worldview') || (curated && section.contains(curated))) continue;
        if (!firstSection) firstSection = section;
        section.classList.add('eo-worldview-legacy-hidden');
      }
    }
    return firstSection;
  };

  const showLegacy = host => {
    if (!host) return;
    for (const el of host.querySelectorAll('.eo-worldview-legacy-hidden')) el.classList.remove('eo-worldview-legacy-hidden');
  };

  const detail = (title, html) =>
    `<details><summary>${escapeHtml(title)}</summary><div class="eo-curated-detail-body">${html}</div></details>`;

  const callout = (label, text, cls='') =>
    `<div class="eo-curated-callout ${cls}"><strong>${escapeHtml(label)}</strong><p>${escapeHtml(text)}</p></div>`;

  const fieldDetail = (label, text) =>
    `<p><span class="eo-curated-detail-label">${escapeHtml(label)}:</span> ${escapeHtml(text)}</p>`;

  const renderMain = item => {
    const n = item.id || 0;
    const sLabel = strengthLabels[n % strengthLabels.length];
    const pLabel = slipLabels[(n + 2) % slipLabels.length];
    const gLabel = growthLabels[(n + 4) % growthLabels.length];
    const used = new Set(['feel']);
    let html = '';

    switch (item.layout) {
      case 'peak':
        used.add('portrait'); used.add('strength');
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
        html += `<p class="eo-curated-body">${escapeHtml(item.portrait)}</p>`;
        html += callout(sLabel,item.strength);
        break;
      case 'collapse':
        used.add('portrait'); used.add('slip'); used.add('growth');
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
        html += `<p class="eo-curated-body">${escapeHtml(item.portrait)}</p>`;
        html += callout(pLabel,item.slip,'pressure');
        html += callout(gLabel,item.growth);
        break;
      case 'clean':
        used.add('strength');
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
        html += callout(sLabel,item.strength);
        break;
      case 'clean-alt':
        used.add('portrait');
        html += `<p class="eo-curated-body">${escapeHtml(item.portrait)}</p>`;
        html += `<div class="eo-curated-quote">${escapeHtml(item.feel)}</div>`;
        break;
      case 'clean-compact':
        used.add('slip');
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
        html += callout(pLabel,item.slip,'pressure');
        break;
      case 'open':
        used.add('strength'); used.add('slip');
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
        html += callout(sLabel,item.strength);
        html += callout(pLabel,item.slip,'pressure');
        break;
      case 'open-alt':
        used.add('portrait'); used.add('growth');
        html += `<p class="eo-curated-body">${escapeHtml(item.portrait)}</p>`;
        html += callout(gLabel,item.growth);
        break;
      case 'open-split':
        used.add('strength'); used.add('growth');
        html += callout(sLabel,item.strength);
        html += `<p class="eo-curated-body">${escapeHtml(item.feel)}</p>`;
        html += callout(gLabel,item.growth);
        break;
      case 'open-portrait':
        used.add('portrait'); used.add('slip');
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
        html += `<p class="eo-curated-body">${escapeHtml(item.portrait)}</p>`;
        html += callout(pLabel,item.slip,'pressure');
        break;
      case 'sensitive':
      case 'borderline':
        used.add('slip'); used.add('growth');
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
        html += callout(pLabel,item.slip,'pressure');
        html += callout(gLabel,item.growth);
        break;
      case 'sensitive-alt':
      case 'borderline-alt':
        used.add('portrait'); used.add('strength');
        html += `<p class="eo-curated-body">${escapeHtml(item.portrait)}</p>`;
        html += callout(sLabel,item.strength);
        break;
      case 'sensitive-pressure':
      case 'borderline-pressure':
        used.add('slip');
        html += callout(pLabel,item.slip,'pressure');
        html += `<p class="eo-curated-body">${escapeHtml(item.feel)}</p>`;
        break;
      case 'sensitive-growth':
      case 'borderline-split':
        used.add('strength'); used.add('growth');
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
        html += callout(sLabel,item.strength);
        html += callout(gLabel,item.growth);
        break;
      case 'guarded':
      case 'fortified':
      case 'armored':
        used.add('strength'); used.add('slip');
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
        html += callout(sLabel,item.strength);
        html += callout(pLabel,item.slip,'pressure');
        break;
      case 'guarded-alt':
      case 'fortified-alt':
      case 'armored-alt':
        used.add('portrait'); used.add('slip');
        html += `<p class="eo-curated-body">${escapeHtml(item.portrait)}</p>`;
        html += callout(pLabel,item.slip,'pressure');
        break;
      case 'guarded-pressure':
      case 'fortified-pressure':
      case 'armored-pressure':
        used.add('slip'); used.add('growth');
        html += callout(pLabel,item.slip,'pressure');
        html += `<p class="eo-curated-body">${escapeHtml(item.feel)}</p>`;
        html += callout(gLabel,item.growth);
        break;
      case 'guarded-strength':
      case 'fortified-portrait':
      case 'armored-growth':
        used.add('strength'); used.add('growth');
        html += callout(sLabel,item.strength);
        html += `<p class="eo-curated-body">${escapeHtml(item.feel)}</p>`;
        html += callout(gLabel,item.growth);
        break;
      default:
        html += `<p class="eo-curated-lead">${escapeHtml(item.feel)}</p>`;
    }
    return {html,used};
  };

  const buildCard = item => {
    const {html:main,used} = renderMain(item);
    const showAlias = item.id === 1 || item.id === 402 || (item.id % 3 !== 0);
    const omitted = [];
    if (!used.has('portrait')) omitted.push(fieldDetail('Full portrait',item.portrait));
    if (!used.has('strength')) omitted.push(fieldDetail('Strength',item.strength));
    if (!used.has('slip')) omitted.push(fieldDetail('Pressure it can miss',item.slip));
    if (!used.has('growth')) omitted.push(fieldDetail('Growth direction',item.growth));

    return `
      <article class="eo-curated-worldview" data-eo-coordinate="${escapeHtml(item.coordinate)}">
        <header class="eo-curated-head">
          <div class="eo-curated-kicker">Worldview at ${escapeHtml(item.coordinate)}</div>
          <h2 class="eo-curated-title">${escapeHtml(item.teachingName)}</h2>
          ${showAlias ? `<div class="eo-curated-alias">${escapeHtml(item.portraitName)}</div>` : ''}
          <div class="eo-curated-meta">
            <span class="eo-curated-chip">${escapeHtml(item.stage)}</span>
            ${item.family && item.family !== 'Integration' && item.family !== 'Collapse' ? `<span class="eo-curated-chip">${escapeHtml(item.family)}</span>` : ''}
          </div>
        </header>
        ${main}
        <div class="eo-curated-details">
          ${detail('What this displacement means',`<p>${escapeHtml(item.displacement)}</p>`)}
          ${detail('Why this sits here',`<p>${escapeHtml(item.hierarchy)}</p>`)}
          ${omitted.length ? detail('Underlying atlas reading',omitted.join('')) : ''}
        </div>
      </article>`;
  };

  let atlas = null;
  let scheduled = false;

  const sync = () => {
    scheduled = false;
    if (!atlas) return;
    const host = findHost();
    if (!host) return;
    const key = findCoordinate(host, atlas);
    const current = host.querySelector('.eo-curated-worldview');
    if (!key) {
      if (current) current.remove();
      showLegacy(host);
      return;
    }

    if (current && current.dataset.eoCoordinate === key) {
      hideLegacy(host);
      return;
    }

    const item = atlas.get(key);
    if (!item) {
      if (current) current.remove();
      showLegacy(host);
      return;
    }
    if (current) current.remove();
    const firstLegacy = hideLegacy(host);
    const holder = document.createElement('div');
    holder.innerHTML = buildCard(item);
    const card = holder.firstElementChild;
    if (firstLegacy && firstLegacy.parentElement) firstLegacy.parentElement.insertBefore(card, firstLegacy);
    else host.appendChild(card);
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(sync);
  };

  Promise.all(atlasParts.map(async url => {
      const r = await fetch(url,{cache:'no-store'});
      if (!r.ok) throw new Error(`Could not load worldview atlas (${r.status})`);
      return (await r.text()).trim();
    }))
    .then(async parts => {
      const packed = parts.join('');
      const bytes = Uint8Array.from(atob(packed), c => c.charCodeAt(0));
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      return JSON.parse(await new Response(stream).text());
    })
    .then(rows => {
      atlas = new Map(rows.map(row => [normalizeCoordinate(row.coordinate), row]));
      const observer = new MutationObserver(schedule);
      observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class','style']});
      document.addEventListener('click',schedule,true);
      document.addEventListener('change',schedule,true);
      schedule();
    })
    .catch(err => console.error('[EO worldview atlas]',err));
})();
