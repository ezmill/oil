var passShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null }

		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform sampler2D texture; ",
		"varying vec2 vUv;",

		"void main() {",
		"    gl_FragColor = texture2D(texture, vUv);",
		"}"
	
	].join("\n")
	
}
var reposShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null },
			"goo"  : { type: "f", value: 75.0 }

		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		

		"varying vec2 vUv;",
		"uniform sampler2D texture;",
		"uniform vec2 mouse;",
		"uniform float goo;",

		"void main(){",

		"    vec2 tc = vUv;",
		"    vec4 look = texture2D(texture,tc);",
		"    vec2 offs = vec2(look.y-look.x,look.w-look.z)*vec2(mouse.x/goo, -mouse.y/goo);",
		"    vec2 coord = offs+tc;",
		"    vec4 repos = texture2D(texture, coord);",
		"    gl_FragColor = repos;",
		"} "
	
	].join("\n")
	
}
var diffShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null },
			"texture2"  : { type: "t", value: null },
			"texture3"  : { type: "t", value: null }

		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform sampler2D texture;",
		"uniform sampler2D texture2;",
		"uniform sampler2D texture3;",
		"varying vec2 vUv;",

		"void main() {",
		"  vec4 tex0 = texture2D(texture, vUv);",
		"  vec4 tex1 = texture2D(texture2, vUv);",
		"  vec4 tex2 = texture2D(texture3, vUv);",

		"  vec4 fc = (tex2 - tex1);",
		"  vec4 add = (fc + tex0);",
		"  gl_FragColor = vec4(fc);",
		"}"
	
	].join("\n")
	
}
var blurShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null }
		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform sampler2D texture;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",

		"void main() {",
		"  float step_w = 1.0/resolution.x;",
		"  float step_h = 1.0/resolution.y;",
		"  vec2 tc = vUv;",
		"  vec4 input0 = texture2D(texture,tc);",
		"   ",
		"  vec2 x1 = vec2(step_w, 0.0);",
		"  vec2 y1 = vec2(0.0, step_h);",
		"    ",
		"  input0 += texture2D(texture, tc+x1); // right",
		"  input0 += texture2D(texture, tc-x1); // left",
		"  input0 += texture2D(texture, tc+y1); // top",
		"  input0 += texture2D(texture, tc-y1); // bottom",

		"  input0 *=0.2;",

		"  gl_FragColor = input0;",
		"}"
	
	].join("\n")
	
}
var bumpShader =  {

	uniforms: THREE.UniformsUtils.merge( [

		{
			"texture"  : { type: "t", value: null },
			"mouse"  : { type: "v2", value: null },
			"resolution"  : { type: "v2", value: null },
			"time"  : { type: "f", value: null },
			"lightWidth"  : { type: "f", value: 9.5 },
			"lightBrightness"  : { type: "f", value: 0.0 }
		}
	] ),

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	
	].join("\n"),
	
	fragmentShader: [
		
		"uniform sampler2D texture;",
		"uniform vec2 mouse;",
		"uniform float time;",
		"uniform float lightWidth;",
		"uniform float lightBrightness;",
		"varying vec2 vUv;",
		"uniform vec2 resolution;",


		"void main() {",
		"	 vec2 texelWidth = 1.0/resolution;",
		"    vec4 input0 = texture2D(texture,vUv);",


		"    float step = 5.0;",
		"    float tl = abs(texture2D(texture, vUv + texelWidth * vec2(-step, -step)).x);   // top left",
		"    float  l = abs(texture2D(texture, vUv + texelWidth * vec2(-step,  0.0)).x);   // left",
		"    float bl = abs(texture2D(texture, vUv + texelWidth * vec2(-step,  step)).x);   // bottom left",
		"    float  t = abs(texture2D(texture, vUv + texelWidth * vec2( 0.0, -step)).x);   // top",
		"    float  b = abs(texture2D(texture, vUv + texelWidth * vec2( 0.0,  step)).x);   // bottom",
		"    float tr = abs(texture2D(texture, vUv + texelWidth * vec2( step, -step)).x);   // top right",
		"    float  r = abs(texture2D(texture, vUv + texelWidth * vec2( step,  0.0)).x);   // right",
		"    float br = abs(texture2D(texture, vUv + texelWidth * vec2( step,  step)).x);   // bottom right",

		"    float mult = 0.01;",

		"    float dX = tr*mult + 2.0*r*mult + br*mult -tl*mult - 2.0*l*mult - bl*mult;",
		"    float dY = bl*mult + 2.0*b*mult + br*mult -tl*mult - 2.0*t*mult - tr*mult;",
		"    ",

		"    vec4 diffuseColor = texture2D(texture, vUv);",

		"    vec3 color = normalize(vec3(dX,dY,1.0/50.0));",
		"    ",
		"    for( int i = 0; i<4; i++){",
		"      color +=color;",
		"    }",

		"    vec3 lightDir = vec3( vec2( mouse.x/resolution.x, 1.0-mouse.y/resolution.y)-(gl_FragCoord.xy / vec2(resolution.x,resolution.y)), lightWidth );",
		"    lightDir.x *= resolution.x/resolution.y;",

		"    float D = length(lightDir);",

		"    vec3 N = normalize(color);",
		"    vec3 L = normalize(lightDir);",
		"    vec3 H = normalize(L);",

		"    vec4 lightColor = input0;",
		"    vec4 ambientColor = vec4(vec3(input0.rgb*lightBrightness),0.5);",
		"    ",
		"    vec3 falloff = vec3(1.0,3.0,20.5);",
		"  ",
		"    vec3 diffuse = (lightColor.rgb * lightColor.a) * max(dot(N, L), 0.0);",
		"    vec3 ambient = ambientColor.rgb * ambientColor.a;",
		"    ",
		"    float shin = 1000.1;",
		"    float sf = max(0.0,dot(N,H));",
		"    sf = pow(sf, shin);",
		"  ",
		"    float attenuation = 1.0 / (falloff.x + (falloff.y*D) + (falloff.z * D * D) );",

		"    vec3 intensity =  ambient+(diffuse+sf ) * attenuation;",
		"    vec3 finalColor = (diffuseColor.rgb * intensity);",

		"    vec3 col = ambient+( finalColor+sf );",

		"    color *=0.5;",
		"    color +=0.5;",

		"    // vec4 C = index == 0 ? vec4(col, 1.0) : vec4(color, 1.0);",
		"    vec4 C = vec4(col, 1.0);",
		"    gl_FragColor = C;",
		"}"
	
	].join("\n")
	
}