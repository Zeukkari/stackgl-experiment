#define SHADER_NAME lsm.frag

precision highp float;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uFractalCoord;
uniform int uMouseButtons;
uniform float uMouseWheel;
uniform float uTime;

// image parameters in world coordinate
//vec2 center = vec2(-0.75,0.0); // center of the image in world units : http://mightymandel.mathr.co.uk/gallery.html
//float radius = 1.25; // Radius is defined as "the difference in imaginary coordinate between the center and the top of the axis-aligned view rectangle".
// vec2 center = vec2(-0.771139525,-0.115216065);
// vec2 center = vec2(0.0,0.0);
vec2 center = vec2(0.0,0.0);
// float radius = 0.001;

// escape time algorithm
float er2 = 4.0; // square of escape radius :  er2 = er*er  so er = 2.0
#define imax 500

// compute pixel coordinate in world units
vec2 GiveCoordinate(vec2 center, float radius, vec2 coord, vec3 uResolution) {
  // from pixel to world coordinate
  // start with pixel coordinate : now point=(0,0) is left bottom and point=(uResolution.x, uResolution.y) is right top
  float x = (coord.x -  uResolution.x/2.0)/ (uResolution.y/2.0);
  float y = (coord.y -  uResolution.y/2.0)/ (uResolution.y/2.0);
  vec2 c = vec2(center.x + radius*x, center.y + radius*y) ;
  return c ; // now coordinate are measured in world units : from 0.0 t 1.0
}

// based on the code by gltracy https://www.shadertoy.com/view/XsS3Rm
// square of vector ( = complex number)
vec2 complex_square( vec2 v ) {
  return vec2(
    v.x * v.x - v.y * v.y,
    v.x * v.y * 2.0	);
}

int GiveLevel(vec2 c) {
    int final_i = 0; // level
    vec2 z = vec2(0.0, 0.0); // initial value is a critical point

  // iterations
  for ( int i = 0 ; i < imax; i++ ) {

    z = c + complex_square( z ); // z = fc(z) = z^2+c
    z = c + complex_square( z ); // z = fc(z) = z^3+c
    final_i = i;
        if ( dot(z,z) > er2 ) {  break; }
  }
  return final_i;

}

vec3 GiveColor ( int i) {
    vec3 color;
    if ( i < imax ) {
      color.r = sin(float(i) / 3.0);
      color.g = cos(float(i) / 6.0);
      color.b = cos(float(i) / 12.0 + 3.14 / 4.0);
    } else {
      // interior of mandelbrot set
      color= vec3(0.0, 0.0, 0.0);
    }
    return color;
}

void main() {
    vec2 st = gl_FragCoord.xy;
    vec2 fractalCoord = vec2(uFractalCoord.x, uFractalCoord.y);
    vec2 c =  GiveCoordinate(fractalCoord, uMouseWheel, st, vec3(uResolution,0.0) );
    int level = GiveLevel(c);
    vec3 color = GiveColor(level);
    gl_FragColor = vec4(color,1.0);


    // gl_FragColor = vec4(mousePos, 0.0, 1.0);
    // gl_FragColor = vec4(1.0,1.0,0.0, 1.0);
}