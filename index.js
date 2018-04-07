var Geometry = require("gl-geometry");
var glShader = require("gl-shader");
var glslify = require("glslify");
var THREE = require("three");
var dat = require("dat.gui");

var Empty = Object.freeze([]);
var geometry = new THREE.PlaneBufferGeometry(2, 2);
var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var startTime;
var uniforms;

function init() {
  var container = document.createElement("div");
  document.body.appendChild(container);

  // Uniform state
  var state = {
    fractalBounds: {
      x: -0.611,
      y: 0.74486,
      z: 0.0,
      w: 0.3
    },
    easings: {
      x: 1,
      y: 2,
      z: 3
    }
  };

  // Geometry
  uniforms = {
    uFractalBounds: {
      type: "4v",
      value: new THREE.Vector4(
        state.fractalBounds.x,
        state.fractalBounds.y,
        state.fractalBounds.z,
        state.fractalBounds.w
      )
    },
    uEasings: {
      type: "3v",
      value: new THREE.Vector3(
        state.easings.x,
        state.easings.y,
        state.easings.z
      )
    },
    uLocalPosition: {
      type: "3v",
      value: new THREE.Vector3(0, 0, 0)
    },
    uResolution: {
      type: "2v",
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    uTime: { value: 1.0 }
  };

  var customMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: glslify("./threetest.vert"),
    fragmentShader: glslify("./orbitTrap.frag")
  });

  var mesh = new THREE.Mesh(geometry, customMaterial);
  scene.add(mesh);

  // Renderer
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);

  // GUI
  var gui = new dat.GUI();
  var folder = gui.addFolder("Seed values");
  folder
    .add(state.fractalBounds, "x", -2.0, 2.0)
    .name("minX")
    .onChange(function(value) {
      state.fractalBounds.x = value;
      uniforms.uFractalBounds.value = new THREE.Vector4(
        state.fractalBounds.x,
        state.fractalBounds.y,
        state.fractalBounds.z,
        state.fractalBounds.w
      );
    });
  folder
    .add(state.fractalBounds, "y", -2.0, 2.0)
    .name("maxX")
    .onChange(function(value) {
      state.fractalBounds.y = value;
      uniforms.uFractalBounds.value = new THREE.Vector4(
        state.fractalBounds.x,
        state.fractalBounds.y,
        state.fractalBounds.z,
        state.fractalBounds.w
      );
    });
  folder
    .add(state.fractalBounds, "z", -2.0, 2.0)
    .name("minY")
    .onChange(function(value) {
      state.fractalBounds.z = value;
      uniforms.uFractalBounds.value = new THREE.Vector4(
        state.fractalBounds.x,
        state.fractalBounds.y,
        state.fractalBounds.z,
        state.fractalBounds.w
      );
    });
  folder
    .add(state.fractalBounds, "w", -2.0, 2.0)
    .name("maxY")
    .onChange(function(value) {
      state.fractalBounds.w = value;
      uniforms.uFractalBounds.value = new THREE.Vector4(
        state.fractalBounds.x,
        state.fractalBounds.y,
        state.fractalBounds.z,
        state.fractalBounds.w
      );
    });
  var folder = gui.addFolder("Easing methods");
  folder
    .add(state.easings, "x", [0, 1, 2, 3, 4, 5, 6, 7])
    .name("Easing 1")
    .onChange(function(value) {
      state.easings.x = value;
      uniforms.uEasings.value = new THREE.Vector3(
        state.easings.x,
        state.easings.y,
        state.easings.z
      );
    });
  folder
    .add(state.easings, "y", [0, 1, 2, 3, 4, 5, 6, 7])
    .name("Easing 2")
    .onChange(function(value) {
      state.easings.y = value;
      uniforms.uEasings.value = new THREE.Vector3(
        state.easings.x,
        state.easings.y,
        state.easings.z
      );
    });
  folder
    .add(state.easings, "z", [0, 1, 2, 3, 4, 5, 6, 7])
    .name("Easing 3")
    .onChange(function(value) {
      state.easings.z = value;
      uniforms.uEasings.value = new THREE.Vector3(
        state.easings.x,
        state.easings.y,
        state.easings.z
      );
    });
  // Start
  startTime = Date.now();
}
function onWindowResize() {
  uniforms.uResolution = {
    type: "2v",
    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
  };

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  uniforms.uTime.value = timestamp / 1000;
  renderer.render(scene, camera);
}

init();
animate();
