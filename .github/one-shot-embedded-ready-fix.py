from pathlib import Path


def once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)

p = Path('philosophers-stone-atlas/index.html')
s = p.read_text()
s = once(
    s,
    """  if(portalArrival) history.replaceState(null,'',location.pathname);
},{once:true});
""",
    """  if(portalArrival) history.replaceState(null,'',location.pathname);
  if(embeddedMode) window.parent.postMessage({type:'stone-atlas-ready'},'*');
},{once:true});
""",
    'ready after inner frame load'
)
s = once(
    s,
    """          window.parent.postMessage({type:'stone-atlas-ready'},'*');
          requestAnimationFrame(postEmbeddedState);
""",
    """          requestAnimationFrame(postEmbeddedState);
""",
    'remove premature ready signal'
)
p.write_text(s)

sw = Path('philosophers-stone-atlas/service-worker.js')
sws = sw.read_text()
sws = once(
    sws,
    "const CACHE_NAME = 'philosophers-stone-atlas-offline-v4';",
    "const CACHE_NAME = 'philosophers-stone-atlas-offline-v5';",
    'cache bump'
)
sw.write_text(sws)
