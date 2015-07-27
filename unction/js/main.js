var scene, camera, renderer, controls;
var container;
var w = window.innerWidth;
var h = window.innerHeight;

var time = 0;

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

var topLeft = document.getElementById("topLeft");
var topRight = document.getElementById("topRight");
var bottomLeft = document.getElementById("bottomLeft");
var bottomRight = document.getElementById("bottomRight");
var middle = document.getElementById("middle");
var lenght, squareCoords;
var halfWidth, halfHeight;
calculateSquare();

function calculateSquare(){
	if(window.innerWidth>=window.innerHeight){
		length = window.innerHeight;
	} else {
		length = window.innerWidth;
	}
	var div = document.getElementById("squareDiv");
	div.style.width = length;
	div.style.height = length;

	squareCoords = {
		topLeft: new THREE.Vector2(window.innerWidth/2 - length/2, window.innerHeight/2 - length/2),
		topRight: new THREE.Vector2(window.innerWidth/2 + length/2, window.innerHeight/2 - length/2),
		bottomLeft: new THREE.Vector2(window.innerWidth/2 - length/2, window.innerHeight/2 + length/2),
		bottomRight: new THREE.Vector2(window.innerWidth/2 + length/2, window.innerHeight/2 + length/2)
	}
	halfWidth = window.innerWidth/2;
	halfHeight = window.innerHeight/2;
}
topLeft.play();
topRight.play();
bottomLeft.play();
bottomRight.play();
middle.play();
initScene();
function initScene(){

    camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
	camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1);

	container = document.createElement('div');
    document.body.appendChild(container);
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

    fbMaterial = new FeedbackMaterial(renderer, scene, camera, tex, [reposShader, blurShader, diffShader, passShader, bumpShader]);
    fbMaterial.init();
}

function animate(){
	window.requestAnimationFrame(animate);
	draw();
}
function bezierX(x1, y1, x2, y2, hue){

    ctx.beginPath();

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
    	var color = "rgba("+redy+","+greeny+", "+bluey+", 1.0)";
        bezierY(0,j, canvas.width, j, "#000000");  
    }
    for(var i = -canvas.width; i < canvas.width*2; i+=distX){
    	var color = "rgba(200, 0, 255, 1.0)";
        bezierX(i, 0, i, canvas.height, color);  
    }
}

function hslaColor(h,s,l,a){
	return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
}

function draw(){
	time+=0.001;

	many();
    tex.needsUpdate = true;

	fbMaterial.update();

    renderer.render(scene, camera);

    fbMaterial.getNewFrame();
    fbMaterial.swapBuffers();

}

function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}

function onWindowResize( event ) {
    calculateSquare();
    renderer.setSize( window.innerWidth, window.innerHeight );
	camera.left = window.innerWidth / - 2;
	camera.right = window.innerWidth / 2;
	camera.top = window.innerHeight / 2;
	camera.bottom = window.innerHeight / - 2;
	// camera.updateProjectionMatrix();
    // fbMaterial.resize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseMove(event){
	unMappedMouseX = (event.clientX );
    unMappedMouseY = (event.clientY );
    mouseX = map(unMappedMouseX, window.innerWidth, -2.5,2.5);
    mouseY = map(unMappedMouseY, window.innerHeight, 0.5,1.5);


    fbMaterial.fbos[0].material.uniforms.mouse.value = new THREE.Vector2(mouseX, mouseY);
    fbMaterial.fbos[4].material.uniforms.mouse.value = new THREE.Vector2(unMappedMouseX, unMappedMouseY);

/*    var d2A = {  //distance to audio
    	topLeft: new THREE.Vector2(0 - unMappedMouseX, 0 - unMappedMouseY),
    	topRight: new THREE.Vector2(window.innerWidth - unMappedMouseX, 0 - unMappedMouseY),
    	bottomLeft: new THREE.Vector2(0 - unMappedMouseX, window.innerHeight - unMappedMouseY),
    	bottomRight: new THREE.Vector2(window.innerWidth - unMappedMouseX, window.innerHeight - unMappedMouseY),
    }*/
    var d2A = {  //distance to audio
    	topLeft: new THREE.Vector2(squareCoords.topLeft.x - unMappedMouseX, squareCoords.topLeft.y - unMappedMouseY),
    	topRight: new THREE.Vector2(squareCoords.topRight.x - unMappedMouseX, squareCoords.topRight.y - unMappedMouseY),
    	bottomLeft: new THREE.Vector2(squareCoords.bottomLeft.x - unMappedMouseX, squareCoords.bottomLeft.y - unMappedMouseY),
    	bottomRight: new THREE.Vector2(squareCoords.bottomRight.x - unMappedMouseX, squareCoords.bottomRight.y - unMappedMouseY),
    	middle: new THREE.Vector2(halfWidth - unMappedMouseX, halfHeight - unMappedMouseY),
    }    
    distObj = { //object to hold distances
    	topLeft: Math.sqrt((d2A["topLeft"].x*d2A["topLeft"].x) + (d2A["topLeft"].y*d2A["topLeft"].y)),
    	topRight: Math.sqrt((d2A["topRight"].x*d2A["topRight"].x) + (d2A["topRight"].y*d2A["topRight"].y)),
    	bottomLeft: Math.sqrt((d2A["bottomLeft"].x*d2A["bottomLeft"].x) + (d2A["bottomLeft"].y*d2A["bottomLeft"].y)),
    	bottomRight: Math.sqrt((d2A["bottomRight"].x*d2A["bottomRight"].x) + (d2A["bottomRight"].y*d2A["bottomRight"].y)),
    	middle: Math.sqrt((d2A["middle"].x*d2A["middle"].x) + (d2A["middle"].y*d2A["middle"].y))
	}
	handleAudio(distObj);

}
function handleAudio(distance){

	max = length*Math.sqrt(2)/2;
	if(distance.topLeft>=max)distance.topLeft = max;
	if(distance.bottomLeft>=max)distance.bottomLeft = max;
	if(distance.topRight>=max)distance.topRight = max;
	if(distance.bottomRight>=max)distance.bottomRight = max;

	var volTopLeft = map(distance.topLeft, max, 0.0, 1.0);
	var volTopRight = map(distance.topRight, max, 0.0, 1.0);
	var volBottomLeft = map(distance.bottomLeft, max, 0.0, 1.0);
	var volBottomRight = map(distance.bottomRight, max, 0.0, 1.0);
	var volMiddle = map(distance.middle, max, 0.0,1.0);

	topLeft.volume = volTopLeft;
	topRight.volume = volTopRight;
	bottomLeft.volume = volBottomLeft;
	bottomRight.volume = volBottomRight;
	middle.volume = volMiddle;
}