#define SHADER_NAME orbitTrap.frag
#define MAXITER 128
precision highp float;

#pragma glslify: ease1 = require(glsl-easings/sine-in)
#pragma glslify: ease2 = require(glsl-easings/bounce-in)
#pragma glslify: ease3 = require(glsl-easings/sine-out)
#pragma glslify: ease4 = require(glsl-easings/quintic-out)
#pragma glslify: ease5 = require(glsl-easings/exponential-in)
#pragma glslify: ease6 = require(glsl-easings/linear)
#pragma glslify: ease7 = require(glsl-easings/cubic-in-out)
#pragma glslify: ease8 = require(glsl-easings/cubic-in)

uniform vec2 uResolution;
uniform float uTime;
uniform int uEasingIndex;

vec2 cmul(vec2 i1, vec2 i2)
{
    return vec2(i1.x*i2.x - i1.y*i2.y, i1.y*i2.x + i1.x*i2.y);
}

vec3 julia(vec2 z, vec2 c)
{
    int i = 0;
    vec2 zi = z;

    float trap1 = 10e5;
    float trap2 = 10e5;

    for(int n=0; n < MAXITER; ++n)
    {
        if(dot(zi,zi) > 8.0)
            break;
        i++;
        zi = cmul(zi,zi) + c;

        // Orbit trap
        trap1 = min(trap1, sqrt(zi.x*zi.y));
        trap2 = min(trap2, sqrt(zi.y*zi.y));
    }

    return vec3(i,trap1,trap2);
}

vec4 gen_color(vec3 iter)
{
    float t1 = 1.0+log(iter.y)/8.0;
    float t2 = 1.0+log(iter.z)/16.0;
    float t3 = t1/t2;

    //vec3 comp = vec3(t1,t1,t1);
    vec3 red = vec3(0.9,0.2,0.1);
    vec3 black = vec3(1.0,1.0,1.0);
    vec3 blue = vec3(0.1,0.2,0.9);
    vec3 comp = mix(blue,black,vec3(t2));
    comp = mix(red,comp,vec3(t1));

    return vec4(comp, 1.0);
}

float getEasing(int easer) {
  if(easer == 0) {
    return ease1(sin(uTime * 0.3));
  } else if(easer == 1) {
    return ease2(sin(uTime * 0.3));
  } else if(easer == 2) {
    return ease3(sin(uTime * 0.3));
  } else if(easer == 3) {
    return ease4(sin(uTime * 0.3));
  } else if(easer == 4) {
    return ease5(sin(uTime * 0.3));
  } else if(easer == 5) {
    return ease6(sin(uTime * 0.3));
  } else if(easer == 6) {
    return ease7(sin(uTime * 0.3));
  }
  return ease8(sin(uTime * 0.3));
}

void main() {

  vec2 z = 2.*(2.*gl_FragCoord.xy - uResolution) / uResolution.x;
  // Display the julia fractal for C = (-0.8, [0.0;0.3]).
  float easing = getEasing(uEasingIndex);
  float easing2 = getEasing(uEasingIndex+1);
  float easing3 = getEasing(uEasingIndex-1);
  if(uEasingIndex==0) {
    easing3 = getEasing(7);
  }
  if(uEasingIndex==8) {
    easing2 = getEasing(0);
  }
  vec2 myC = vec2(mix(-0.6110, 0.74486,easing), mix(0.0, 0.3,easing));
  vec2 myC2 = vec2(mix(-0.6110, 0.74486,easing2), mix(0.0, 0.3,easing2));
  vec2 myC3 = vec2(mix(-0.6110, 0.74486,easing3), mix(0.0, 0.3,easing3));
  vec3 iter = julia(z, myC);
  vec3 iter2 = julia(z, myC2);
  vec3 iter3 = julia(z, myC3);
  vec4 color = gen_color(iter);
  vec4 color2 = gen_color(iter2);
  vec4 color3 = gen_color(iter3);
  gl_FragColor = vec4(1.-(color.rgb + color2.rgb + color3.rgb) * 0.25, 1.0);
}