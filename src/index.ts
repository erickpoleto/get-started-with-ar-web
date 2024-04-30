import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { createScene } from "./scene";
import {
  browserHasImmersiveArCompatibility,
  displayIntroductionMessage,
  displayUnsupportedBrowserMessage,
} from "./utils/domUtils";

import "./styles.css";

function initializeXRApp() {
  const { devicePixelRatio, innerHeight, innerWidth } = window;
  
  // Create a new WebGL renderer and set the size + pixel ratio + background and add to body.
  const renderer = new WebGLRenderer({});
  renderer.setSize(innerWidth, innerHeight);
  
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement );
  // renderer.setClearColor(0xA3A3A3);

  // Create scene
  createScene(renderer);
};

async function start() {
  initializeXRApp();
}

start();
