import { createPlaneMarker } from "./objects/PlaneMarker";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { handleXRHitTest } from "./utils/hitTest";


import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";


import { AnaglyphEffect } from "three/examples/jsm/effects/AnaglyphEffect";


import {
  AmbientLight,
  AnimationClip,
  AnimationMixer,
  BoxBufferGeometry,
  Clock,
  CubeTextureLoader,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  XRFrame,
} from "three";

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';



export function createScene(renderer: WebGLRenderer) {
  const scene = new Scene()

  let mouseX = 0;
  let mouseY = 0;

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  // document.addEventListener( 'mousemove', onDocumentMouseMove );

  const camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
  //camera.position.z = 3;
  
  const path = '../assets/models/textures/';
  const format = '.png';
				const urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];
  const textureCube = new CubeTextureLoader().load( urls );
  scene.background = textureCube;

  // for ( let i = 0; i < 500; i ++ ) {

  //   const mesh = new Mesh( geometry, material );

  //   mesh.position.x = Math.random() * 10 - 5;
  //   mesh.position.y = Math.random() * 10 - 5;
  //   mesh.position.z = Math.random() * 10 - 5;

  //   mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

  //   scene.add( mesh );

  // }

  
  const width = window.innerWidth || 2;
  const height = window.innerHeight || 2;
  const effect  = new AnaglyphEffect( renderer );
  effect.setSize( width, height );


  const orbit = new OrbitControls(camera, renderer.domElement);

  camera.position.set(10, 10, 10);
  orbit.update();

  // const grid = new GridHelper(30, 30);

  // scene.add(grid);
  
  const gltfLoader = new GLTFLoader();

  let mixer: AnimationMixer;

  const loader = new FBXLoader();

  loader.load( '../assets/models/pau.fbx', function ( object ) {
    
    mixer = new AnimationMixer( object );
    const clips = object.animations;
    const clip = AnimationClip.findByName(clips,  "paul|animarion");
    const action = mixer.clipAction(clip);
    action.play();

    object.traverse( function ( child: any ) {
      // "paul|animarion"
      // if ( child.isMesh ) {

      //   child.castShadow = true;
      //   child.receiveShadow = true;

      // }

    } );

    object.scale.set( 0.03,  0.03, 0.03);

    scene.add( object );
  } );

  // gltfLoader.load("../assets/models/scene.glb", (gltf: GLTF) => {
  //   const model = gltf.scene;
  //   scene.add(model);
  //   mixer = new AnimationMixer(model);
  //   const clips = gltf.animations;
  //   const clip = AnimationClip.findByName(clips, 'animarion');
  //   const action = mixer.clipAction(clip);
  //   action.play();
  // }, undefined, (err) => console.log(err));

  const controller = renderer.xr.getController(0);
  scene.add(controller);
  
  const ambientLight = new AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);


  const clock = new Clock();

  const animationLoop = () => {
    if(mixer)
        mixer.update(clock.getDelta());
    render();
  }

  function render() {

    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    effect.render( scene, camera );

  }

  renderer.setAnimationLoop(animationLoop);


  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // function onDocumentMouseMove( event: any ) {

  //   mouseX = ( event.clientX - windowHalfX ) / 100;
  //   mouseY = ( event.clientY - windowHalfY ) / 100;

  // }
}
