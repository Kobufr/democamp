import * as THREE from './vendor/three.module.js';

export const MAP_PITCH = 1.13;
const MAP_CAMERA_HEIGHT = 300;
const REFERENCE_FOV = 36;

export function createMapCamera(aspect = 1) {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 1200);
  return updateMapCamera(camera, {target:new THREE.Vector3(), distance:91, aspect});
}

export function updateMapCamera(camera, {target, distance, aspect}) {
  const halfHeight = distance * Math.tan(REFERENCE_FOV * Math.PI / 360);
  camera.left = -halfHeight * aspect;
  camera.right = halfHeight * aspect;
  camera.top = halfHeight;
  camera.bottom = -halfHeight;
  // Translate the camera and its center together, with no interpolation or lookAt.
  // Orthographic projection also prevents perspective/parallax changes while panning.
  camera.position.set(target.x, target.y + Math.sin(MAP_PITCH) * MAP_CAMERA_HEIGHT,
    target.z + Math.cos(MAP_PITCH) * MAP_CAMERA_HEIGHT);
  camera.rotation.set(-MAP_PITCH, 0, 0);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return camera;
}

export function mapPanDelta(camera, dx, dy, viewportHeight) {
  const unit = (camera.top - camera.bottom) / viewportHeight;
  return {x:-dx * unit, z:-dy * unit / Math.sin(MAP_PITCH)};
}
