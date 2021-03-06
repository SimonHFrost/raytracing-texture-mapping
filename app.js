var camera, scene, renderer;
var geometry, material, mesh;

var HEIGHT = 600;
var WIDTH = 800;

var CANVAS_WIDTH = 512;
var CANVAS_HEIGHT = 256;

var crateImage = new Image();
var smileImage = null;

crateImage.src = 'images/crate.gif';
crateImage.onload = function(){
  smileImage = new Image();
  smileImage.src = 'images/smile.png';
  smileImage.onload = function() {
    init();
    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'click', onMouseClick );
    window.requestAnimationFrame(render);
  }
}

function createCanvasTexture() {
  var canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  var context = canvas.getContext("2d");

  context.drawImage(crateImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  var texture = new THREE.Texture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return texture;
}

function init() {

  camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 0.01, 10 );

  camera.position.x = 0.125;
  camera.position.z = 0.25;
  camera.position.y = 0.25;

  var controls = new THREE.OrbitControls( camera );

  scene = new THREE.Scene();

  geometry = new THREE.BoxGeometry( 0.2, 0.05, 0.1 );

  var textureLoader = new THREE.TextureLoader();
  var texture = createCanvasTexture();
  var material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 1 );
  scene.add( new THREE.AmbientLight( 0xeef0ff ) );
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor (0xffffff, 1);
  renderer.setSize( WIDTH, HEIGHT );
  document.body.appendChild( renderer.domElement );

}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersect = null;

function onMouseMove(event) {
	mouse.x = ( event.clientX / WIDTH ) * 2 - 1;
	mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1;
}

function onMouseClick(event) {
  if (!intersect) {
    return
  }

  var canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  var context = canvas.getContext("2d");

  context.drawImage(crateImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const rectX = intersect.uv.x * CANVAS_WIDTH;
  // y coordinate needs to be inverted for some reason
  const rectY = CANVAS_HEIGHT - (intersect.uv.y * CANVAS_HEIGHT);

  context.drawImage(smileImage, rectX - 50, rectY - 50, 100, 100);

  document.querySelector('.display').innerHTML = 'Sticker position: ' + rectX + ', ' + rectY;

  var image = new Image();
  image.src = canvas.toDataURL();

  var texture = new THREE.Texture(image);
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  mesh.material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
}

function render() {

	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );

  if (intersects[0]) {
    intersect = intersects[0];
  } else {
    intersect = null
  }

	renderer.render( scene, camera );
  window.requestAnimationFrame(render);
}
