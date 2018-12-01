//varying vec2 vUv;


uniform vec4 uFractalBounds;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uEasings;
uniform vec3 uLocalPosition;
uniform vec3 uIntervals;
uniform vec2 uOffset;

attribute vec2 a_texcoord;

attribute vec3 vNormal;
attribute vec4 vTexCoord;
attribute vec4 vPosition;

varying float v_Dot;
varying vec2 v_texCoord;

varying lowp vec4 newPos;

// varying vec4 position;
// varying vec4 color;
varying vec4 colorV;

void main() {
  colorV = projectionMatrix * vec4(position, 1.);
  vec4 totalOffset = vec4(uOffset.x, uOffset.y, 1., 1.0);
  vec4 basePosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  colorV = basePosition - totalOffset + vec4(uLocalPosition, 1.) + dot(uLocalPosition, vNormal) * 10.;


  gl_Position = colorV;
//   = projectionMatrix * gl_Position;

  /*
  if(gl_Position.z < 0.) {
    gl_Position.z = 2. - gl_Position.z;
  }
  */

  // v_texCoord = vTexCoord.st;
  // vec3 transNormal = vNormal;
  // v_Dot = max(dot(transNormal.xyz, lightDir), 0.0);
}