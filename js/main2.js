var scene, camera, renderer, controls;
var container;
var loader;
var w = window.innerWidth;
var h = window.innerHeight;
var mouseX, mouseY;
var globalUniforms;
var time = 0;
var video, videoLoaded = false, tex;
var fbMaterial
var time = 0.0;
var redx = 200;
var greenx = 0.0;
var bluex = 255;
var redy = 0.0;
var greeny = 0.0;
var bluey = 0.0;

var goo = 85.0;
var blurWidth = 1.0;
var lightWidth = 9.5;
var lightBrightness = 0.0;
initScene();
function initScene(){
	container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(50, w / h, 1, 100000);
    camera.position.set(0,0, 750);
    cameraRTT = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, -10000, 10000 );
	cameraRTT.position.z = 100;


    renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
    renderer.setSize(w, h);
    renderer.setClearColor(0xffffff, 1);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    initCanvasTex();

	window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    animate();
}
function initCanvasTex(){
	canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	ctx = canvas.getContext("2d");

    tex = new THREE.Texture(canvas);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;

    fbMaterial = new FeedbackMaterial(renderer, scene, cameraRTT, tex, [reposShader, blurShader, diffShader, passShader, bumpShader]);
    fbMaterial.init();
}

function animate(){
	window.requestAnimationFrame(animate);
	draw();
}
function bezierX(x1, y1, x2, y2, hue){

    ctx.beginPath();

   // ctx.moveTo(x1+(0.5+ 0.5*Math.sin(time)*canvas.width), y1);
    //ctx.lineTo(x2+(0.5+ 0.5*Math.sin(time)*canvas.width), y2);
    ctx.moveTo(x1+Math.cos(time/5)*canvas.width, y1);
    ctx.lineTo(x2-Math.sin(time/5)*canvas.width, y2);

    ctx.lineWidth = lineWidth;
    
    // line color
    ctx.strokeStyle = hue;
    ctx.stroke();   
}
function bezierY(x1, y1, x2, y2, hue){
    ctx.beginPath();

    ctx.moveTo(x1, y1-Math.cos(time/4)*canvas.height);
    ctx.lineTo(x2, y2+Math.sin(time/4)*canvas.height);

    ctx.lineWidth = lineWidth;
    
    // line color
    ctx.strokeStyle = hue;
    ctx.stroke();  
}
var time = 2.0;
function many(){
    time+=0.01;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var wy = canvas.width;
    var hy = 50;
    var wx = 50;
    var hx = canvas.height;
    var amp = 75;
    var distX = 2;
    var distY = 2;
    var alpha = 1.0;
    lineWidth = 0.5;



   for(var j = -canvas.height; j < canvas.height*2; j+=distY){
	redy = Math.floor(map(0.5+0.5*Math.cos(time*4/3), 1, 0, 255));
	greeny = Math.floor(map(j, h, 0, 255));
	bluey = Math.floor(map(0.5+0.5*Math.sin(time/2), 1, 0, 255));
    	var color = "rgba("+redy+","+greeny+", "+bluey+", "+alpha+")";
        bezierY(0,j, canvas.width, j, "#000000" /*hslaColor(j/5, 100, 50, alpha)*/);  
    }
    for(var i = -canvas.width; i < canvas.width*2; i+=distX){
    	var color = "rgba("+redx+","+greenx+", "+bluex+", "+alpha+")";
        bezierX(i, 0, i, canvas.height, /*color*/ hslaColor(i/5, 100, 50, alpha));  
    }
    //ctx.rotate(Math.PI/1000);


}

function hslaColor(h,s,l,a)
  {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }

function draw(){

	time+=0.001;

	many();
    tex.needsUpdate = true;

	fbMaterial.update();

    renderer.render(scene, cameraRTT);

    fbMaterial.getNewFrame();
    fbMaterial.swapBuffers();
}

function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}
function onWindowResize( event ) {
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    fbMaterial.resize();

    canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

}
function onDocumentMouseMove(event){
	unMappedMouseX = (event.clientX);
    unMappedMouseY = (event.clientY);
    mouseX = map(unMappedMouseX, window.innerWidth, -2.5,2.5);
    mouseY = map(unMappedMouseY, window.innerHeight, 0.5,1.5);

    fbMaterial.fbos[0].material.uniforms.mouse.value = new THREE.Vector2(mouseX, mouseY);
    fbMaterial.fbos[4].material.uniforms.mouse.value = new THREE.Vector2(unMappedMouseX, unMappedMouseY);
}