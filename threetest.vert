varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x+10.0, position.y, position.z+5.0, 1.0);
}
