var Geometry = require("gl-geometry");
var glShader = require("gl-shader");
var glslify = require("glslify");
var THREE = require("three");
var dat = require("dat.gui");


var Empty = Object.freeze([]);
// var geometry = new THREE.PlaneBufferGeometry(2, 2);
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var geometry = new THREE.BoxGeometry(WIDTH, WIDTH, 1);
// var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
var camera = new THREE.PerspectiveCamera(45, 1.5, 1, 1000);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var startTime;
var uniforms;
var mesh;

function init() {
  var container = document.createElement("div");
  document.body.appendChild(container);

  camera.position.z = 100;
  scene.add(camera);

  // Uniform state
  var state = {
    fractalBounds: {
      x: -0.611,
      y: 0.74486,
      z: 0.0,
      w: 0.3
    },
    easings: {
      x: 3,
      y: 4,
      z: 5
    },
    localPosition: {
      x: 0.5,
      y: 2.1,
      z: 0.3
    },
    offset: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    intervals: {
      x: 0.225,
      y: 0.732,
      z: 0.997
    }
  };

  // Geometry
  uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
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
      value: new THREE.Vector3(
        state.localPosition.x,
        state.localPosition.y,
        state.localPosition.z
      )
    },
    uIntervals: {
      type: "3v",
      value: new THREE.Vector3(
        state.intervals.x,
        state.intervals.y,
        state.intervals.z
      )
    },
    uOffset: {
      type: "2v",
      value: new THREE.Vector2(
        state.offset.x,
        state.offset.y
      )
    },
    uResolution: {
      type: "2v",
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    uTime: { value: 1.0 }
  };

  var customMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: glslify("./vert.vert"),
    fragmentShader: glslify("./frag.frag")
  });

  mesh = new THREE.Mesh(geometry, customMaterial);
  scene.add(mesh);
  mesh.rotation.set(0., 0., 0.);

  // Renderer
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.preserveDrawingBuffer = true;
  renderer.setClearColor(0x000000, 1);
  container.appendChild(renderer.domElement);
  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);

  // GUI
  var gui = new dat.GUI();
  var MIN_STEP = 0.01;
  var folder = gui.addFolder("Position");
  folder
    .add(state.localPosition, "x", -100.0, 100.0, MIN_STEP)
    .name("X")
    .onChange(function(value) {
      state.localPosition.x = value;
      uniforms.uLocalPosition.value = new THREE.Vector3(
        state.localPosition.x,
        state.localPosition.y,
        state.localPosition.z
      );
    });
  folder
    .add(state.localPosition, "y", -100.0, 100.0, MIN_STEP)
    .name("Y")
    .onChange(function(value) {
      state.localPosition.y = value;
      uniforms.uLocalPosition.value = new THREE.Vector3(
        state.localPosition.x,
        state.localPosition.y,
        state.localPosition.z
      );
    });
  folder
    .add(state.localPosition, "z", -100.0, 100.0, MIN_STEP)
    .name("Z")
    .onChange(function(value) {
      state.localPosition.z = value;
      uniforms.uLocalPosition.value = new THREE.Vector3(
        state.localPosition.x,
        state.localPosition.y,
        state.localPosition.z
      );
    });
    var folder = gui.addFolder("Offset");
    folder
      .add(state.offset, "x", -1.0, 1.0, MIN_STEP)
      .name("X")
      .onChange(function(value) {
        state.offset.x = value;
        uniforms.uOffset.value = new THREE.Vector2(
          state.offset.x,
          state.offset.y
        );
      });
    folder
      .add(state.offset, "y", -1.0, 1.0, MIN_STEP)
      .name("Y")
      .onChange(function(value) {
        state.offset.y = value;
        uniforms.uOffset.value = new THREE.Vector2(
          state.offset.x,
          state.offset.y
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
  // camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  uniforms.uTime.value = timestamp / 1000;
  mesh.rotation.y = Math.sin(uniforms.uTime.value * 0.3) + Math.PI;
  mesh.rotation.x = Math.sin(uniforms.uTime.value * 0.3) + Math.PI;
  renderer.render(scene, camera);
}

init();
animate();
