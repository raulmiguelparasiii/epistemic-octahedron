from pathlib import Path


def once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)

root = Path('philosophers-stone-atlas')
path = root / 'index.html'
s = path.read_text()

old_camera = r'''const cameraAnchor=`    const camera = new THREE.PerspectiveCamera(45, (viewport.clientWidth || window.innerWidth) / (viewport.clientHeight || window.innerHeight), 0.01, 100);`;
const cameraReplacement=`    const STONE_ORTHO_BASE_DISTANCE = 4.25;
const STONE_ORTHO_HALF_HEIGHT = STONE_ORTHO_BASE_DISTANCE * Math.tan(THREE.MathUtils.degToRad(22.5));
const STONE_ORTHO_INITIAL_ASPECT = (viewport.clientWidth || window.innerWidth) / (viewport.clientHeight || window.innerHeight);
const camera = new THREE.OrthographicCamera(
  -STONE_ORTHO_HALF_HEIGHT * STONE_ORTHO_INITIAL_ASPECT,
  STONE_ORTHO_HALF_HEIGHT * STONE_ORTHO_INITIAL_ASPECT,
  STONE_ORTHO_HALF_HEIGHT,
  -STONE_ORTHO_HALF_HEIGHT,
  0.01,
  100
);
camera.position.set(0, 0, STONE_ORTHO_BASE_DISTANCE);`;
if(!core.includes(cameraAnchor)) throw new Error('Perspective camera anchor was not found.');
core=core.replace(cameraAnchor,cameraReplacement);

const cameraPositionAnchor='      camera.position.set(0, 0, state.distance);';
const cameraPositionReplacement=`      camera.position.set(0, 0, STONE_ORTHO_BASE_DISTANCE);
  camera.zoom = STONE_ORTHO_BASE_DISTANCE / state.distance;
  camera.updateProjectionMatrix();`;
if(!core.includes(cameraPositionAnchor)) throw new Error('Camera distance anchor was not found.');
core=core.replace(cameraPositionAnchor,cameraPositionReplacement);

const resizeAnchor=`    function resizeRendererToViewport() {
      const { width, height } = getViewportSize();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }`;
const resizeReplacement=`    function resizeRendererToViewport() {
      const { width, height } = getViewportSize();
      const aspect = width / height;
      camera.left = -STONE_ORTHO_HALF_HEIGHT * aspect;
      camera.right = STONE_ORTHO_HALF_HEIGHT * aspect;
      camera.top = STONE_ORTHO_HALF_HEIGHT;
      camera.bottom = -STONE_ORTHO_HALF_HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }`;
if(!core.includes(resizeAnchor)) throw new Error('Camera resize anchor was not found.');
core=core.replace(resizeAnchor,resizeReplacement);'''

new_camera = r'''const cameraAnchor=`    const camera = new THREE.PerspectiveCamera(45, (viewport.clientWidth || window.innerWidth) / (viewport.clientHeight || window.innerHeight), 0.01, 100);`;
const cameraReplacement=`    const STONE_NATIVE_FOV = 45;
    const STONE_SEAM_FOV = 1.15;
    const camera = new THREE.PerspectiveCamera(
      STONE_NATIVE_FOV,
      (viewport.clientWidth || window.innerWidth) / (viewport.clientHeight || window.innerHeight),
      0.01,
      5000
    );
    let stoneProjectionBlend = 0;
    let stonePortalCameraDistance = null;`;
if(!core.includes(cameraAnchor)) throw new Error('Perspective camera anchor was not found.');
core=core.replace(cameraAnchor,cameraReplacement);

const cameraPositionAnchor='      camera.position.set(0, 0, state.distance);';
const cameraPositionReplacement=`      const stoneFov = THREE.MathUtils.lerp(STONE_NATIVE_FOV, STONE_SEAM_FOV, stoneProjectionBlend);
      camera.fov = stoneFov;
      camera.near = 0.01;
      camera.far = 5000;
      camera.updateProjectionMatrix();
      camera.position.set(0, 0, Number.isFinite(stonePortalCameraDistance) ? stonePortalCameraDistance : state.distance);`;
if(!core.includes(cameraPositionAnchor)) throw new Error('Camera distance anchor was not found.');
core=core.replace(cameraPositionAnchor,cameraPositionReplacement);'''

s = once(s, old_camera, new_camera, 'camera bridge')

old_helpers_start = r'''    const stonePortalTargetQuat=()=>stonePortalQuatFrom42(
      Math.PI/4,
      -Math.asin(1/Math.sqrt(3))
    );
    const STONE_PORTAL_MATCH_DISTANCE=
      STONE_ORTHO_BASE_DISTANCE/(2*STONE_ORTHO_HALF_HEIGHT*86/240);
    let stonePortalLayout=null;'''
new_helpers_start = r'''    const stoneLegacyPortalTargetQuat=()=>stonePortalQuatFrom42(
      Math.PI/4,
      -Math.asin(1/Math.sqrt(3))
    );
    const stoneReturnTargetQuat=()=>stonePortalQuatFrom42(
      Math.PI/4,
      Math.asin(1/Math.sqrt(3))
    );
    const stoneNativeTargetQuat=()=>makeCanonicalQuat(Math.PI/4,-0.55);
    const STONE_RETURN_SPIN_MIN=0.040;
    const STONE_RETURN_PREVIEW_RADIUS=THREE.MathUtils.degToRad(12);
    const STONE_RETURN_SETTLE_RADIUS=THREE.MathUtils.degToRad(0.35);
    const STONE_RETURN_SETTLE_SPEED=0.0012;
    const STONE_RETURN_DWELL_MS=1000;
    const STONE_ENTRANCE_DURATION=900;
    let stoneCompositionBridgeEnabled=false;
    let stonePortalLayout=null;
    let stoneEntranceTransition=null;
    let stoneReturnArmed=false;
    let stoneReturnDwellStarted=0;
    let stoneReturnReady=false;
    let stoneProjectionRecovery=null;'''
s = once(s, old_helpers_start, new_helpers_start, 'portal helper header')

old_helpers = r'''    const applyStonePortalCamera=()=>{
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
    };'''

new_helpers = r'''    const stoneSmoothstep=value=>value*value*(3-2*value);
    const stoneClamp01=value=>Math.max(0,Math.min(1,value));
    const stoneCurrentFov=()=>THREE.MathUtils.lerp(STONE_NATIVE_FOV,STONE_SEAM_FOV,stoneProjectionBlend);
    const stoneDistanceForScale=(height,unitScale,fov)=>
      height/(2*Math.max(unitScale,0.0001)*Math.tan(THREE.MathUtils.degToRad(fov)*0.5));
    const stoneBlackUnitScale=rect=>rect.height*86/240;
    const stoneNativeUnitScale=(height,distance=state.distance)=>
      height/(2*Math.max(distance,0.0001)*Math.tan(THREE.MathUtils.degToRad(STONE_NATIVE_FOV)*0.5));
    const applyStonePortalCamera=()=>{
      const {width,height}=getViewportSize();
      camera.aspect=width/height;
      camera.fov=stoneCurrentFov();
      camera.near=0.01;
      camera.far=5000;
      camera.updateProjectionMatrix();
      renderer.setSize(width,height);
      syncSceneMatrices();
      camera.position.set(0,0,Number.isFinite(stonePortalCameraDistance)?stonePortalCameraDistance:state.distance);
      camera.lookAt(rootGroup.position);
      camera.updateMatrixWorld();
    };
    const stoneFinishPortalLayout=()=>{
      if(!stonePortalLayout) return;
      const saved=stonePortalLayout;
      if(saved.viewportStyle===null) viewport.removeAttribute('style');
      else viewport.setAttribute('style',saved.viewportStyle);
      stonePortalLayout=null;
      stoneEntranceTransition=null;
      stoneProjectionBlend=0;
      stonePortalCameraDistance=null;
      resizeRendererToViewport();
      invalidateRender();
    };
    const restoreStonePortalViewport=()=>{
      if(!stonePortalLayout) return;
      const saved=stonePortalLayout;
      state.target.copy(saved.target);
      state.distance=saved.distance;
      state.zoomVel=0;
      state.panVel.set(0,0,0);
      stoneFinishPortalLayout();
    };
    const stoneBeginEntranceTransition=()=>{
      if(!stonePortalLayout) return false;
      const startRect=viewport.getBoundingClientRect();
      stoneEntranceTransition={
        started:performance.now(),
        duration:STONE_ENTRANCE_DURATION,
        startRect:{left:startRect.left,top:startRect.top,width:startRect.width,height:startRect.height},
        endRect:{...stonePortalLayout.nativeRect},
        startUnitScale:stoneBlackUnitScale(startRect)
      };
      stoneCompositionBridgeEnabled=true;
      stoneReturnArmed=false;
      stoneReturnDwellStarted=0;
      stoneReturnReady=false;
      stoneProjectionRecovery=null;
      state.angularSpeed=0;
      state.snapQuat=null;
      resetUprightStabilizer();
      state.panVel.set(0,0,0);
      state.zoomVel=0;
      state.target.set(0,0,0);
      invalidateRender();
      return true;
    };
    const stoneCancelReturnCapture=()=>{
      if(!stoneReturnArmed) return false;
      const startBlend=stoneProjectionBlend;
      stoneReturnArmed=false;
      stoneReturnDwellStarted=0;
      stoneReturnReady=false;
      stoneProjectionRecovery=startBlend>0.001?{started:performance.now(),startBlend}:null;
      resetUprightStabilizer();
      invalidateRender();
      return true;
    };
    const stoneArmReturnFromThrow=()=>{
      if(!stoneCompositionBridgeEnabled||stoneEntranceTransition) return false;
      if(stoneReturnArmed) return true;
      if(state.angularSpeed<STONE_RETURN_SPIN_MIN) return false;
      stoneReturnArmed=true;
      stoneReturnDwellStarted=0;
      stoneReturnReady=false;
      stoneProjectionRecovery=null;
      state.snapQuat=null;
      resetUprightStabilizer();
      invalidateRender();
      return true;
    };
    const stoneReturnDistance=()=>state.orientation.angleTo(stoneReturnTargetQuat());
    const stoneReturnAmount=()=>{
      if(!stoneReturnArmed) return 0;
      return stoneSmoothstep(stoneClamp01(1-stoneReturnDistance()/STONE_RETURN_PREVIEW_RADIUS));
    };
    const stoneApplyEntranceTransition=now=>{
      if(!stoneEntranceTransition||!stonePortalLayout) return;
      const tr=stoneEntranceTransition;
      const raw=stoneClamp01((now-tr.started)/tr.duration);
      const t=stoneSmoothstep(raw);
      const currentRect={
        left:tr.startRect.left+(tr.endRect.left-tr.startRect.left)*t,
        top:tr.startRect.top+(tr.endRect.top-tr.startRect.top)*t,
        width:tr.startRect.width+(tr.endRect.width-tr.startRect.width)*t,
        height:tr.startRect.height+(tr.endRect.height-tr.startRect.height)*t
      };
      setStonePortalViewportRect(currentRect);
      stoneProjectionBlend=1-t;
      const nativeScale=stoneNativeUnitScale(tr.endRect.height,state.distance);
      const desiredScale=tr.startUnitScale+(nativeScale-tr.startUnitScale)*t;
      stonePortalCameraDistance=stoneDistanceForScale(currentRect.height,desiredScale,stoneCurrentFov());
      if(!state.rotating&&!state.gestureRotating&&!state.continuingGestureRotate){
        state.orientation.slerp(stoneNativeTargetQuat(),0.008+0.048*t);
      }
      if(raw>=1){
        if(!state.rotating&&!state.gestureRotating&&!state.continuingGestureRotate){
          state.orientation.copy(stoneNativeTargetQuat());
        }
        stoneFinishPortalLayout();
      }
    };
    const stoneApplyProjectionRecovery=now=>{
      if(!stoneProjectionRecovery||stoneReturnArmed||stoneEntranceTransition) return;
      const raw=stoneClamp01((now-stoneProjectionRecovery.started)/180);
      const t=stoneSmoothstep(raw);
      stoneProjectionBlend=stoneProjectionRecovery.startBlend*(1-t);
      const {height}=getViewportSize();
      const nativeScale=stoneNativeUnitScale(height,state.distance);
      stonePortalCameraDistance=stoneProjectionBlend>0.001
        ? stoneDistanceForScale(height,nativeScale,stoneCurrentFov())
        : null;
      if(raw>=1){
        stoneProjectionBlend=0;
        stonePortalCameraDistance=null;
        stoneProjectionRecovery=null;
      }
    };
    const stoneApplyReturnCapture=now=>{
      if(!stoneReturnArmed) return;
      const target=stoneReturnTargetQuat();
      const speedPhase=stoneClamp01(1-state.angularSpeed/STONE_RETURN_SPIN_MIN);
      const gravity=0.0015+0.045*speedPhase*speedPhase;
      state.orientation.slerp(target,gravity);
      let distance=state.orientation.angleTo(target);
      if(distance<STONE_RETURN_SETTLE_RADIUS&&state.angularSpeed<STONE_RETURN_SETTLE_SPEED){
        state.orientation.copy(target);
        state.angularSpeed=0;
        resetUprightStabilizer();
        distance=0;
      }
      const amount=stoneReturnAmount();
      stoneProjectionBlend=amount;
      const {height}=getViewportSize();
      const nativeScale=stoneNativeUnitScale(height,state.distance);
      stonePortalCameraDistance=amount>0.001
        ? stoneDistanceForScale(height,nativeScale,stoneCurrentFov())
        : null;
      const untouched=state.activePointers.size===0&&!state.rotating&&!state.gestureRotating&&!state.continuingGestureRotate;
      if(distance===0&&untouched){
        if(!stoneReturnDwellStarted) stoneReturnDwellStarted=now;
        if(now-stoneReturnDwellStarted>=STONE_RETURN_DWELL_MS) stoneReturnReady=true;
      }else{
        stoneReturnDwellStarted=0;
        stoneReturnReady=false;
      }
    };
    const applyStonePortalDynamics=()=>{
      const now=performance.now();
      stoneApplyEntranceTransition(now);
      stoneApplyReturnCapture(now);
      stoneApplyProjectionRecovery(now);
    };
    const stonePortalState=()=>{
      applyStonePortalCamera();
      const canvasRect=renderer.domElement.getBoundingClientRect();
      const origin=new THREE.Vector3(0,0,0)
        .applyMatrix4(octaGroup.matrixWorld)
        .project(camera);
      const matrix=new THREE.Matrix4().makeRotationFromQuaternion(state.orientation);
      const elements=matrix.elements;
      const effectiveDistance=Number.isFinite(stonePortalCameraDistance)?stonePortalCameraDistance:state.distance;
      const unitScale=canvasRect.height/(2*Math.max(effectiveDistance,0.0001)*Math.tan(THREE.MathUtils.degToRad(camera.fov)*0.5));
      const returnDistance=stoneReturnDistance();
      const dwellProgress=stoneReturnDwellStarted
        ? stoneClamp01((performance.now()-stoneReturnDwellStarted)/STONE_RETURN_DWELL_MS)
        : 0;
      return {
        distance:state.orientation.angleTo(stoneLegacyPortalTargetQuat()),
        returnDistance,
        returnAmount:stoneReturnAmount(),
        returnArmed:stoneReturnArmed,
        returnReady:stoneReturnReady,
        returnDwellProgress:dwellProgress,
        angularSpeed:state.angularSpeed,
        projectionBlend:stoneProjectionBlend,
        pose:{
          yaw:Math.atan2(elements[8],elements[0]),
          pitch:Math.atan2(elements[6],elements[5])
        },
        metrics:{
          centerX:canvasRect.left+(origin.x+1)*0.5*canvasRect.width,
          centerY:canvasRect.top+(1-origin.y)*0.5*canvasRect.height,
          unitScale
        }
      };
    };'''
s = once(s, old_helpers, new_helpers, 'portal helper body')

old_methods = r'''      portalState(){
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
      },'''

new_methods = r'''      portalState(){
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
        stoneCompositionBridgeEnabled=true;
        stoneEntranceTransition=null;
        stoneReturnArmed=false;
        stoneReturnDwellStarted=0;
        stoneReturnReady=false;
        stoneProjectionRecovery=null;
        setStonePortalViewportRect(clean);
        state.orientation.copy(stonePortalQuatFrom42(yaw,pitch));
        state.snapQuat=null;
        state.angularSpeed=0;
        resetUprightStabilizer();
        state.panVel.set(0,0,0);
        state.zoomVel=0;
        state.target.set(0,0,0);
        stoneProjectionBlend=1;
        stonePortalCameraDistance=stoneDistanceForScale(clean.height,stoneBlackUnitScale(clean),STONE_SEAM_FOV);
        applyStonePortalCamera();
        invalidateRender();
        return true;
      },
      cancelPortalPreview(){
        stoneEntranceTransition=null;
        stoneProjectionBlend=0;
        stonePortalCameraDistance=null;
        restoreStonePortalViewport();
        return true;
      },
      activateFromPortal(){
        return stoneBeginEntranceTransition();
      },
      cancelReturnCapture(){
        return stoneCancelReturnCapture();
      },
      setPortalOrientation(){
        state.orientation.copy(stoneLegacyPortalTargetQuat());
        state.snapQuat=null;
        state.angularSpeed=0;
        resetUprightStabilizer();
        state.panVel.set(0,0,0);
        state.zoomVel=0;
        state.target.set(0,0,0);
        state.distance=4.25;
        stoneProjectionBlend=0;
        stonePortalCameraDistance=null;
        invalidateRender();
      },'''
s = once(s, old_methods, new_methods, 'STONE_VIEW portal methods')

# Inject dynamics into the native camera loop after native momentum/zoom integration.
needle = "      state.zoomVel *= ZOOM_DAMP;\n\n      syncSceneMatrices();"
replacement = "      state.zoomVel *= ZOOM_DAMP;\n\n      applyStonePortalDynamics();\n\n      syncSceneMatrices();"
insert = "const cameraDynamicsAnchor='" + needle.replace("'", "\\'") + "';"
# We patch the decompressed core at runtime, so append executable wrapper patch near the existing camera-position patch.
anchor = "if(!core.includes(cameraPositionAnchor)) throw new Error('Camera distance anchor was not found.');\ncore=core.replace(cameraPositionAnchor,cameraPositionReplacement);"
addition = anchor + "\n\nconst cameraDynamicsAnchor=`      state.zoomVel *= ZOOM_DAMP;\n\n      syncSceneMatrices();`;\nconst cameraDynamicsReplacement=`      state.zoomVel *= ZOOM_DAMP;\n\n      applyStonePortalDynamics();\n\n      syncSceneMatrices();`;\nif(!core.includes(cameraDynamicsAnchor)) throw new Error('Camera dynamics anchor was not found.');\ncore=core.replace(cameraDynamicsAnchor,cameraDynamicsReplacement);"
s = once(s, anchor, addition, 'camera dynamics patch')

# Fast-spin return takes precedence over native snap/throw handling.
view_replace_anchor = "if(!core.includes(viewAnchor)) throw new Error('Native view anchor was not found.');\n        core=core.replace(viewAnchor,viewBridge);"
physics_patch = view_replace_anchor + r'''

        const settleThrowAnchor=`    function settleThrowAfterRelease() {
      const topBottom = getTopBottomSnapInfo();`;
        const settleThrowReplacement=`    function settleThrowAfterRelease() {
      if (stoneArmReturnFromThrow()) return true;
      const topBottom = getTopBottomSnapInfo();`;
        if(!core.includes(settleThrowAnchor)) throw new Error('Throw release anchor was not found.');
        core=core.replace(settleThrowAnchor,settleThrowReplacement);

        const pointerDownAnchor=`    renderer.domElement.addEventListener('pointerdown', (e) => {
      rememberPointer(e);`;
        const pointerDownReplacement=`    renderer.domElement.addEventListener('pointerdown', (e) => {
      stoneCancelReturnCapture();
      rememberPointer(e);`;
        if(!core.includes(pointerDownAnchor)) throw new Error('Pointer-down anchor was not found.');
        core=core.replace(pointerDownAnchor,pointerDownReplacement);

        const singleReleaseAnchor=`        viewport.classList.remove('rotating');
        maybeSnapView();`;
        const singleReleaseReplacement=`        viewport.classList.remove('rotating');
        if (!stoneArmReturnFromThrow()) maybeSnapView();`;
        if(!core.includes(singleReleaseAnchor)) throw new Error('Single-spin release anchor was not found.');
        core=core.replace(singleReleaseAnchor,singleReleaseReplacement);

        const movingAnchor=`      const moving =
        state.rotating ||`;
        const movingReplacement=`      const moving =
        stoneReturnArmed ||
        Boolean(stoneEntranceTransition) ||
        Boolean(stoneProjectionRecovery) ||
        state.rotating ||`;
        if(!core.includes(movingAnchor)) throw new Error('Animation moving anchor was not found.');
        core=core.replace(movingAnchor,movingReplacement);'''
s = once(s, view_replace_anchor, physics_patch, 'native physics hooks')

old_state_loop = r'''          const postEmbeddedState=()=>{
            if(activePortalPointers.size>0){
              const state=frame.contentWindow?.STONE_VIEW?.portalState?.()??null;
              if(state) window.parent.postMessage({type:'stone-atlas-state',state,pointerActive:true},'*');
            }
            requestAnimationFrame(postEmbeddedState);
          };'''
new_state_loop = r'''          const postEmbeddedState=()=>{
            const state=frame.contentWindow?.STONE_VIEW?.portalState?.()??null;
            if(state){
              window.parent.postMessage({
                type:'stone-atlas-state',
                state,
                pointerActive:activePortalPointers.size>0
              },'*');
            }
            requestAnimationFrame(postEmbeddedState);
          };'''
s = once(s, old_state_loop, new_state_loop, 'embedded state loop')

path.write_text(s)

sw = root / 'service-worker.js'
sw_text = sw.read_text()
sw_text = once(
    sw_text,
    "const CACHE_NAME = 'philosophers-stone-atlas-offline-v5';",
    "const CACHE_NAME = 'philosophers-stone-atlas-offline-v6';",
    'service worker cache version'
)
sw.write_text(sw_text)

print('Hybrid transition patch applied.')
