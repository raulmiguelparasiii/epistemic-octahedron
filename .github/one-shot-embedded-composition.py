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
    "const portalArrival=params.get('portal')==='from42';\nconst RETURN_URL='https://raulmiguelparasiii.github.io/42/';",
    "const portalArrival=params.get('portal')==='from42';\nconst embeddedMode=params.get('embedded')==='1';\nconst RETURN_URL='https://raulmiguelparasiii.github.io/42/';",
    'embedded query state'
)

s = once(
    s,
    "if(portalPreviewMode||portalArrival) boot.textContent='';",
    "if(portalPreviewMode||portalArrival||embeddedMode) boot.textContent='';",
    'embedded boot state'
)

s = once(
    s,
    "  if(portalPreviewMode||portalTransitioning) return;",
    "  if(portalPreviewMode||embeddedMode||portalTransitioning) return;",
    'embedded standalone preview guard'
)

s = once(
    s,
    "  if(portalPreviewMode||portalArrivalLocked||portalTransitioning) return false;",
    "  if(portalPreviewMode||embeddedMode||portalArrivalLocked||portalTransitioning) return false;",
    'embedded standalone return guard'
)

old_bridge_start = """    window.STONE_VIEW={
  portalDistance(){
    return state.orientation.angleTo(
      makeCanonicalQuat(Math.PI / 4, Math.asin(1 / Math.sqrt(3)))
    );
  },
  setPortalOrientation(){
    state.orientation.copy(
      makeCanonicalQuat(Math.PI / 4, Math.asin(1 / Math.sqrt(3)))
    );
    state.snapQuat=null;
    state.angularSpeed=0;
    resetUprightStabilizer();
    state.panVel.set(0,0,0);
    state.zoomVel=0;
    state.target.set(0,0,0);
    state.distance=4.25;
    invalidateRender();
  },
"""

new_bridge_start = r"""    const stonePortalQuatFrom42=(yaw,pitch)=>{
      const qx=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),pitch);
      const qy=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),yaw);
      return qx.multiply(qy).normalize();
    };
    const stonePortalTargetQuat=()=>stonePortalQuatFrom42(
      Math.PI/4,
      -Math.asin(1/Math.sqrt(3))
    );
    const STONE_PORTAL_MATCH_DISTANCE=
      STONE_ORTHO_BASE_DISTANCE/(2*STONE_ORTHO_HALF_HEIGHT*86/240);
    let stonePortalLayout=null;
    const stonePortalRect=rect=>{
      if(!rect) return null;
      const left=Number(rect.left),top=Number(rect.top),width=Number(rect.width),height=Number(rect.height);
      if(!Number.isFinite(left)||!Number.isFinite(top)||!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0) return null;
      return {left,top,width,height};
    };
    const setStonePortalViewportRect=rect=>{
      const clean=stonePortalRect(rect);
      if(!clean) return false;
      viewport.style.setProperty('position','fixed','important');
      viewport.style.setProperty('inset','auto','important');
      viewport.style.setProperty('left',clean.left+'px','important');
      viewport.style.setProperty('top',clean.top+'px','important');
      viewport.style.setProperty('width',clean.width+'px','important');
      viewport.style.setProperty('height',clean.height+'px','important');
      viewport.style.setProperty('margin','0','important');
      viewport.style.setProperty('transition','none','important');
      return true;
    };
    const applyStonePortalCamera=()=>{
      camera.zoom=STONE_ORTHO_BASE_DISTANCE/state.distance;
      camera.updateProjectionMatrix();
      resizeRendererToViewport();
      syncSceneMatrices();
      camera.lookAt(rootGroup.position);
      camera.updateMatrixWorld();
    };
    const restoreStonePortalViewport=(animate=false)=>{
      if(!stonePortalLayout) return;
      const saved=stonePortalLayout;
      const finish=()=>{
        if(saved.viewportStyle===null) viewport.removeAttribute('style');
        else viewport.setAttribute('style',saved.viewportStyle);
        stonePortalLayout=null;
        applyStonePortalCamera();
        invalidateRender();
      };
      if(!animate){
        state.target.copy(saved.target);
        state.distance=saved.distance;
        state.zoomVel=0;
        state.panVel.set(0,0,0);
        finish();
        return;
      }
      const startRect=viewport.getBoundingClientRect();
      const endRect=saved.nativeRect;
      const startDistance=state.distance;
      const endDistance=4.25;
      const started=performance.now();
      const duration=280;
      const step=now=>{
        const raw=Math.max(0,Math.min(1,(now-started)/duration));
        const t=raw*raw*(3-2*raw);
        setStonePortalViewportRect({
          left:startRect.left+(endRect.left-startRect.left)*t,
          top:startRect.top+(endRect.top-startRect.top)*t,
          width:startRect.width+(endRect.width-startRect.width)*t,
          height:startRect.height+(endRect.height-startRect.height)*t
        });
        state.target.set(0,0,0);
        state.distance=startDistance+(endDistance-startDistance)*t;
        state.zoomVel=0;
        state.panVel.set(0,0,0);
        applyStonePortalCamera();
        invalidateRender();
        if(raw<1){
          requestAnimationFrame(step);
          return;
        }
        finish();
      };
      requestAnimationFrame(step);
    };
    const stonePortalState=()=>{
      syncSceneMatrices();
      camera.lookAt(rootGroup.position);
      camera.updateMatrixWorld();
      const canvasRect=renderer.domElement.getBoundingClientRect();
      const origin=new THREE.Vector3(0,0,0)
        .applyMatrix4(octaGroup.matrixWorld)
        .project(camera);
      const matrix=new THREE.Matrix4().makeRotationFromQuaternion(state.orientation);
      const elements=matrix.elements;
      return {
        distance:state.orientation.angleTo(stonePortalTargetQuat()),
        pose:{
          yaw:Math.atan2(elements[8],elements[0]),
          pitch:Math.atan2(elements[6],elements[5])
        },
        metrics:{
          centerX:canvasRect.left+(origin.x+1)*0.5*canvasRect.width,
          centerY:canvasRect.top+(1-origin.y)*0.5*canvasRect.height,
          unitScale:camera.zoom*canvasRect.height/(2*STONE_ORTHO_HALF_HEIGHT)
        }
      };
    };
    window.STONE_VIEW={
      portalState(){
        return stonePortalState();
      },
      portalDistance(){
        return stonePortalState().distance;
      },
      syncFromBlack(yaw,pitch,rect){
        const clean=stonePortalRect(rect);
        if(!Number.isFinite(yaw)||!Number.isFinite(pitch)||!clean) return false;
        if(!stonePortalLayout){
          const nativeRect=viewport.getBoundingClientRect();
          stonePortalLayout={
            viewportStyle:viewport.getAttribute('style'),
            nativeRect:{left:nativeRect.left,top:nativeRect.top,width:nativeRect.width,height:nativeRect.height},
            target:state.target.clone(),
            distance:state.distance
          };
        }
        setStonePortalViewportRect(clean);
        state.orientation.copy(stonePortalQuatFrom42(yaw,pitch));
        state.snapQuat=null;
        state.angularSpeed=0;
        resetUprightStabilizer();
        state.panVel.set(0,0,0);
        state.zoomVel=0;
        state.target.set(0,0,0);
        state.distance=STONE_PORTAL_MATCH_DISTANCE;
        applyStonePortalCamera();
        invalidateRender();
        return true;
      },
      cancelPortalPreview(){
        restoreStonePortalViewport(false);
        return true;
      },
      activateFromPortal(){
        state.angularSpeed=0;
        resetUprightStabilizer();
        state.panVel.set(0,0,0);
        state.zoomVel=0;
        startSoftSnap(makeCanonicalQuat(Math.PI/4,-0.55));
        restoreStonePortalViewport(true);
        invalidateRender();
        return true;
      },
      setPortalOrientation(){
        state.orientation.copy(stonePortalTargetQuat());
        state.snapQuat=null;
        state.angularSpeed=0;
        resetUprightStabilizer();
        state.panVel.set(0,0,0);
        state.zoomVel=0;
        state.target.set(0,0,0);
        state.distance=4.25;
        invalidateRender();
      },
"""
s = once(s, old_bridge_start, new_bridge_start, 'exact embedded STONE_VIEW bridge')

load_anchor = """frame.addEventListener('load',()=>{
  const inner=frame.contentWindow;
  if(!inner) return;
"""
load_new = """frame.addEventListener('load',()=>{
  const inner=frame.contentWindow;
  if(!inner) return;
"""
s = once(s, load_anchor, load_new, 'load bridge anchor')

old_pointer = """  inner.addEventListener('pointerdown',event=>{
    activePortalPointers.add(event.pointerId);
  },true);
  inner.addEventListener('pointerup',event=>{
    activePortalPointers.delete(event.pointerId);
    setTimeout(()=>{
      if(activePortalPointers.size===0) commitReturnPortal();
    },0);
  },true);
  inner.addEventListener('pointercancel',event=>{
    activePortalPointers.delete(event.pointerId);
  },true);
"""
new_pointer = """  inner.addEventListener('pointerdown',event=>{
    activePortalPointers.add(event.pointerId);
  },true);
  inner.addEventListener('pointerup',event=>{
    activePortalPointers.delete(event.pointerId);
    if(embeddedMode){
      const releasedState=inner.STONE_VIEW?.portalState?.()??null;
      window.parent.postMessage({type:'stone-atlas-release',state:releasedState},'*');
      return;
    }
    setTimeout(()=>{
      if(activePortalPointers.size===0) commitReturnPortal();
    },0);
  },true);
  inner.addEventListener('pointercancel',event=>{
    activePortalPointers.delete(event.pointerId);
    if(embeddedMode){
      window.parent.postMessage({type:'stone-atlas-cancel'},'*');
    }
  },true);
"""
s = once(s, old_pointer, new_pointer, 'embedded pointer bridge')

old_srcdoc = """frame.srcdoc=core;
        frame.hidden=false;
        boot.remove();
        if(!portalPreviewMode) requestAnimationFrame(updatePortalPreview);
"""
new_srcdoc = """frame.srcdoc=core;
        frame.hidden=false;
        boot.remove();
        if(embeddedMode){
          const postEmbeddedState=()=>{
            if(activePortalPointers.size>0){
              const state=frame.contentWindow?.STONE_VIEW?.portalState?.()??null;
              if(state) window.parent.postMessage({type:'stone-atlas-state',state,pointerActive:true},'*');
            }
            requestAnimationFrame(postEmbeddedState);
          };
          window.addEventListener('message',event=>{
            if(event.source!==window.parent) return;
            const data=event.data||{};
            const view=frame.contentWindow?.STONE_VIEW;
            if(!view) return;
            if(data.type==='stone-composition-sync-from-black'){
              view.syncFromBlack?.(data.yaw,data.pitch,data.rect);
              return;
            }
            if(data.type==='stone-composition-cancel-black-preview'){
              view.cancelPortalPreview?.();
              return;
            }
            if(data.type==='stone-composition-activate-atlas'){
              view.activateFromPortal?.();
            }
          });
          window.parent.postMessage({type:'stone-atlas-ready'},'*');
          requestAnimationFrame(postEmbeddedState);
        }else if(!portalPreviewMode){
          requestAnimationFrame(updatePortalPreview);
        }
"""
s = once(s, old_srcdoc, new_srcdoc, 'embedded wrapper messaging')

p.write_text(s)

sw = Path('philosophers-stone-atlas/service-worker.js')
sws = sw.read_text()
sws = once(
    sws,
    "const CACHE_NAME = 'philosophers-stone-atlas-offline-v3';",
    "const CACHE_NAME = 'philosophers-stone-atlas-offline-v4';",
    'service worker cache bump'
)
sw.write_text(sws)
