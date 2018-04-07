#define PI 3.14159265359
#define TWO_PI 6.28318530718

precision highp float;

uniform vec2 uResolution;
uniform float uTime;

float plot(vec2 st, float pct){
    return  smoothstep( pct-0.02, pct, st.y) - smoothstep( pct, pct+0.02, st.y);
}

vec3 graph(vec2 st, float pct) {
    float y = st.x;
    vec3 color2 = vec3(y);
    float pct2 = plot(st,y);
    return (1.0-pct2)*color2+pct2*vec3(0.0,1.0,0.0);
}

float circle(in vec2 st, in float radius, in vec2 center) {
    float pct = distance(st,center);
    float pct1 = step(radius-0.001, pct);
    float pct2 = step(radius+0.001, pct);

    return pct1-pct2;
}

vec3 triangle(in vec2 coord, in vec2 center) {
    coord.x *= uResolution.x/uResolution.y;

    vec2 st = coord - vec2(0.5) + center;

    vec3 color = vec3(0.0);
    float d = 0.0;

    // Remap the space to -1. to 1.
    st = st *2.-1.;

    // Number of sides of your shape
    int N = 3;

    // Angle and radius from the current pixel
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/float(N);

    // Shaping function that modulate the distance
    d = cos(floor(.5+a/r)*r-a)*length(st);

    color = vec3(1.0-smoothstep(.4,.45,d));
    // color = vec3(d);

    return color;
}

float box(in vec2 _st, in vec2 _size) {
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size, _size+vec2(0.001), _st);
    uv *= smoothstep(_size, _size+vec2(0.001), vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size) {
    return box(_st, vec2(_size,_size/4.)) + box(_st, vec2(_size/4.,_size));
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle), sin(_angle),cos(_angle));
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,0.0,_scale.y);
}

void main() {


    /*
    vec2 st = gl_FragCoord.xy/uResolution;
    float third = 1.0/3.0;
    vec3 circle1 = vec3(circle(st, 0.5, vec2(third, third)));
    vec3 circle2 = vec3(circle(st, 0.5, vec2(2.*third, third)));
    vec3 circle3 = vec3(circle(st, 0.5, vec2(0.5, 2.*third)));
    gl_FragColor = vec4( circle1+circle2+circle3, 1.0 );
    */

    /*
    vec2 st = gl_FragCoord.xy/uResolution;
    gl_FragColor = polygon(st);
    */


    /*
    vec2 st = gl_FragCoord.xy/uResolution;
    vec3 color = polygon(st, vec2(0.5));
    gl_FragColor = vec4(color,1.0);
    */

    /*
    vec2 st = gl_FragCoord.xy/uResolution;
    vec3 color = triangle(st, vec2(0.45, 0.45));
    vec3 color2 = triangle(st, vec2(0.65,0.65));
    vec3 color3 = triangle(st, vec2(0.15,0.95));
    gl_FragColor = vec4(color+color2+color3,1.0);
    */

    /*
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    vec3 color = vec3(0.0);
    vec2 translate = vec2(cos(uTime),sin(uTime));
    st += translate*0.35;
    color += vec3(cross(st,0.05));
    gl_FragColor = vec4(color,1.0);
    */

    /*
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    vec2 newCoord = vec2(st.x, st.y);
    newCoord -= vec2(0.5,0.5);
    newCoord = rotate2d(45.)*newCoord;
    newCoord += vec2(0.5,0.5);


    vec3 color = vec3(0.0);
    color += vec3(cross(newCoord,0.5));
    gl_FragColor = vec4(color,1.0);
    */


    /*
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    vec2 centerCoord = vec2(0.5,0.5);
    centerCoord += vec2(cos(uTime)*0.15,sin(uTime)*0.15);

    vec2 newCoord = vec2(st.x, st.y);
    newCoord -= centerCoord;
    newCoord = scale(vec2(sin(uTime)+1.0)*15.)*newCoord;
    newCoord += centerCoord;

    newCoord -= centerCoord;
    newCoord = rotate2d(sin(uTime)*PI)*newCoord;
    newCoord += centerCoord;

    vec3 color = vec3(0.0);
    color += vec3(cross(newCoord,0.5));
    gl_FragColor = vec4(color,1.0);

    */

    vec2 st = gl_FragCoord.xy/uResolution;
    vec2 st1 = vec2(st.x,st.y);
    vec2 st2 = vec2(st.x,st.y);
    vec2 st3 = vec2(st.x,st.y);

    st1 = rotate2d( smoothstep(0.9,1.0, sin(uTime)) )*st1;
    st2 = rotate2d( -1.0 * smoothstep(1.0,0.9, sin(uTime*2.0)) )*st2;
    st3 = rotate2d( -1.0 * smoothstep(0.9,1.0, sin(uTime*2.5)) )*st3;

    st1 = scale( vec2(2.0) + sin(uTime) )*st1;
    st2 = scale( vec2(2.0) + cos(uTime) )*st2;
    st3 = scale( vec2(2.0) + cos(uTime)*sin(uTime))*st3;



    vec3 color = triangle(st1, vec2(0.5, 0.5));
    vec3 color2 = triangle(st2, vec2(0.5,0.5));
    vec3 color3 = triangle(st3, vec2(0.5,0.5));
    gl_FragColor = vec4(color.r,color2.g,color3.b,1.0);

    // gl_FragColor = vec4(1.0,1.0,1.0,1.0);


}
