#define SHADER_NAME julia.frag
precision highp float;

#pragma glslify: ease = require(glsl-easings/bounce-in-out)

uniform vec2 uResolution;
uniform float uTime;

const int i_max = 2055;

// const vec2 i_const = vec2( -0.028, -0.61);

float er2 = 4.0; // er= er*er escape radius

vec2 complex_square( vec2 v ) {
	return vec2(
		v.x * v.x - v.y * v.y,
		v.x * v.y * 2.0
	);
}

void main() {

    // compute coordinate
	vec2 coord = gl_FragCoord.xy - uResolution * 0.5;
	coord *= 2.5 / min( uResolution.x, uResolution.y );

  float c_x_min = -0.0201;
  float c_x_max = -0.0280;
  float c_y_min = -0.6100;
  float c_y_max = 0.74486;

  float c_y = mix(c_y_min, c_y_max, abs(sin(uTime)+0.1));
  float c_x = smoothstep(c_x_min, c_x_max, abs(cos(uTime)+0.1));

  vec2 fractalConstant = vec2(c_x, c_y);

	// float scale = 0.001;
  float scale = 1./2000.;

	int count = 0;


    // iterations
	for ( int i = 0 ; i < i_max; i++ ) {
		coord = fractalConstant + complex_square( coord );
    count = i;
    if ( dot(coord,coord) > er2 ) {  break; }
	}
    gl_FragColor=vec4(0.0,1.0,0.0,1.0);
  if (count == i_max-1) {
    // filled-in Julia set = red
    gl_FragColor = vec4(float( count ) * scale, 0.0,0.0,1.0);
  } else {
    // exterior
    gl_FragColor = vec4(1.0- float( count ) * scale );
  }
}