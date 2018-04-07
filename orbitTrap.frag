#define MAXITER 128
#define M_PI 3.14159265358979323846

precision highp float;

#pragma glslify: ease1 = require(glsl-easings/sine-in-out)
#pragma glslify: ease2 = require(glsl-easings/bounce-in-out)
#pragma glslify: ease3 = require(glsl-easings/cubic-in-out)
#pragma glslify: ease4 = require(glsl-easings/elastic-in-out)
#pragma glslify: ease5 = require(glsl-easings/exponential-in-out)
#pragma glslify: ease6 = require(glsl-easings/sine-out)
#pragma glslify: ease7 = require(glsl-easings/sine-in)
#pragma glslify: ease8 = require(glsl-easings/bounce-in)

uniform vec4 uFractalBounds;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uEasings;

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
        if(dot(zi,zi) > 4.0)
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

  vec2 myZ = 2.*(2.*gl_FragCoord.xy - uResolution) / uResolution.x;
  float easing = getEasing(int(uEasings.x));
  float easing2 = getEasing(int(uEasings.y));
  float easing3 = getEasing(int(uEasings.z));
  vec2 myC = vec2(mix(uFractalBounds.x, uFractalBounds.y,easing), mix(uFractalBounds.z, uFractalBounds.w,easing));
  vec2 myC2 = vec2(mix(uFractalBounds.x, uFractalBounds.y,easing2), mix(uFractalBounds.z, uFractalBounds.w,easing2));
  vec2 myC3 = vec2(mix(uFractalBounds.x, uFractalBounds.y,easing3), mix(uFractalBounds.z, uFractalBounds.w,easing3));
  vec3 iter = julia(myZ, myC);
  vec3 iter2 = julia(myZ, myC2);
  vec3 iter3 = julia(myZ, myC3);
  vec4 color = gen_color(iter);
  vec4 color2 = gen_color(iter2);
  vec4 color3 = gen_color(iter3);
  gl_FragColor = vec4(1.-(color.rgb + color2.rgb + color3.rgb) * 0.25, 1.0);
}