var camera, scene, renderer;
var geometry, material, mesh;

var HEIGHT = 600;
var WIDTH = 800;

init();

function init() {

  camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 0.01, 10 );
  camera.position.z = 1;
  var controls = new THREE.OrbitControls( camera );

  scene = new THREE.Scene();

  geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
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
  console.log(intersect.point);
}

function render() {

	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );

  if (intersects[0]) {
    console.log('found', intersects[0].object.geometry.type);
    intersect = intersects[0];
  }

	renderer.render( scene, camera );
  window.requestAnimationFrame(render);
}

window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'click', onMouseClick );
window.requestAnimationFrame(render);
