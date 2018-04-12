// "GENERATORS REDUX" by Kali

#pragma glslify: ease1 = require(glsl-easings/sine-in-out)
#pragma glslify: ease2 = require(glsl-easings/bounce-in-out)
#pragma glslify: ease3 = require(glsl-easings/cubic-in-out)
#pragma glslify: ease4 = require(glsl-easings/elastic-in-out)
#pragma glslify: ease5 = require(glsl-easings/exponential-in-out)
#pragma glslify: ease6 = require(glsl-easings/sine-out)
#pragma glslify: ease7 = require(glsl-easings/sine-in)
#pragma glslify: ease8 = require(glsl-easings/bounce-in)
#pragma glslify: blend = require(glsl-blend-overlay)

#define ENABLE_VIBRATION

#define MIN_PACE 0.00000000000000001
#define RAY_STEPS 70
#define SHADOW_STEPS 50
#define LIGHT_COLOR vec3(.85,.9,1.)
#define AMBIENT_COLOR vec3(.8,.83,1.)
#define FLOOR_COLOR vec3(1.0,0.,0.)
#define ENERGY_COLOR vec3(0.95,0.05,0.005)
#define BRIGHTNESS 1.0
#define GAMMA 2.0
#define SATURATION .95
#define detail .000005
#define t uTime*.25

uniform vec4 uFractalBounds;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uEasings;
uniform vec3 uLocalPosition;
uniform vec3 uIntervals;

vec3 lightdir=normalize(vec3(0.5,-0.3,-1.));
vec3 ambdir=normalize(vec3(0.,0.,1.));
const vec3 origin=vec3(0.,3.11,0.);
vec3 energy=vec3(0.01);
float vibration=sin(uTime*uIntervals.y)*uIntervals.x;

float det=0.0;
vec3 pth1;


float getEasing(int easer, float pace) {
  pace += MIN_PACE;
  if(easer == 0) {
    return ease1(sin(uTime * pace));
  } else if(easer == 1) {
    return ease2(sin(uTime * pace));
  } else if(easer == 2) {
    return ease3(sin(uTime * pace));
  } else if(easer == 3) {
    return ease4(sin(uTime * pace));
  } else if(easer == 4) {
    return ease5(sin(uTime * pace));
  } else if(easer == 5) {
    return ease6(sin(uTime * pace));
  } else if(easer == 6) {
    return ease7(sin(uTime * pace));
  }
  return ease8(sin(uTime * pace));
}

// float vibration=getEasing(int(uEasings.x), uIntervals.x);

mat2 rot(float a) {
	return mat2(cos(a),sin(a),-sin(a),cos(a));
}

vec3 path(float ti) {
return vec3(sin(ti),.3-sin(ti*.632)*.3,cos(ti*.5))*.5;
}

float Sphere(vec3 p, vec3 rd, float r){//A RAY TRACED SPHERE
	float b = dot( -p, rd );
	float inner = b * b - dot( p, p ) + r * r;
	if( inner < 0.0 ) return -1.0;
	return b - sqrt( inner );
}

vec2 de(vec3 pos) {
	float hid=0.;
	vec3 tpos=pos;
	tpos.xz=abs(.5-mod(tpos.xz,1.));
	vec4 p=vec4(tpos,1.);
	float y=max(0.,.35-abs(pos.y-3.35))/.35;
	for (int i=0; i<7; i++) {//LOWERED THE ITERS
		p.xyz = abs(p.xyz)-vec3(-0.02,1.98,-0.02);
		p=p*(2.0+vibration*y)/clamp(dot(p.xyz,p.xyz),.4,1.)-vec4(0.5,1.,0.4,0.);
		p.xz*=mat2(-0.416,-0.91,0.91,-0.416);
	}
	float fl=pos.y-3.013;
	float fr=(length(max(abs(p.xyz)-vec3(0.1,5.0,0.1),vec3(0.0)))-0.05)/p.w;//RETURN A RRECT
	//float fr=length(p.xyz)/p.w;
	float d=min(fl,fr);
	d=min(d,-pos.y+3.95);
	if (abs(d-fl)<.001) hid=1.;
	return vec2(d,hid);
}


vec3 normal(vec3 p) {
	vec3 e = vec3(0.0,det,0.0);

	return normalize(vec3(
			de(p+e.yxx).x-de(p-e.yxx).x,
			de(p+e.xyx).x-de(p-e.xyx).x,
			de(p+e.xxy).x-de(p-e.xxy).x
			)
		);
}

float calcAO( const vec3 pos, const vec3 nor ) {
	float aodet=detail*200.;
	float totao = 0.0;
    float sca = 28.0;
    for( int aoi=0; aoi<5; aoi++ ) {
        float hr = aodet*float(aoi*aoi);
        vec3 aopos =  nor * hr + pos;
        float dd = de( aopos ).x;
        totao += -(dd-hr)*sca;
        sca *= 0.7;
    }
    return clamp( 1.0 - 5.0*totao, 0., 1.0 );
}

float _texture(vec3 p) {
	p=abs(.5-fract(p*10.));
	vec3 c=vec3(3.);
	float es, l=es=0.;
	for (int i = 0; i < 10; i++) {
			p = abs(p + c) - abs(p - c) - p;
			p/= clamp(dot(p, p), .0, 1.);
			p = p* -1.5 + c;
			if ( mod(float(i), 2.) < 1. ) {
				float pl = l;
				l = length(p);
				es+= exp(-1. / abs(l - pl));
			}
	}
	return es;
}

//PASSING IN THE NORMAL
vec3 light(in vec3 p, in vec3 dir, in vec3 n, in float hid) {
  float sh=calcAO(p,-2.5*lightdir);
	float ao=calcAO(p,n);
	float diff=max(0.,dot(lightdir,-n))*sh;
	float y=3.35-p.y;
	vec3 amb=max(.5,dot(dir,-n))*.5*AMBIENT_COLOR;
	if (hid<.5) {
		amb+=max(0.2,dot(vec3(0.,1.,0.),-n))*FLOOR_COLOR*pow(max(0.,.2-abs(3.-p.y))/.2,1.5)*2.;
		amb+=energy*pow(max(0.,.4-abs(y))/.4,2.)*max(0.2,dot(vec3(0.,-sign(y),0.),-n))*2.;
	}
	vec3 r = reflect(lightdir,n);
	float spec=pow(max(0.,dot(dir,-r))*sh,10.);
	vec3 col;
	float energysource=pow(max(0.,.04-abs(y))/.04,4.)*2.;
	if (hid>1.5) {col=vec3(1.); spec=spec*spec;}
	else{
		float k=_texture(p)*.23+.2;
		k=min(k,1.5-energysource);
		col=mix(vec3(k,k*k,k*k*k),vec3(k),.3);
		if (abs(hid-1.)<.001) col*=FLOOR_COLOR*1.3;
	}
	col=col*(amb+diff*LIGHT_COLOR)+spec*LIGHT_COLOR;
	if (hid<.5) {
		col=max(col,energy*2.*energysource);
	}
	col*=min(1.,ao+length(energy)*.5*max(0.,.1-abs(y))/.1);
	return col;
}

vec3 raymarch(in vec3 from, in vec3 dir) {
	float ey=mod(t*.5,1.);
	float glow,eglow,ref,sphdist,totdist=glow=eglow=ref=sphdist=0.;
	vec2 d=vec2(1.,0.);
	vec3 p, col=vec3(0.);
	vec3 origdir=dir,origfrom=from,sphNorm;

	for (int i=0; i<RAY_STEPS; i++) {
		if (d.x>det && totdist<3.0) {
			p=from+totdist*dir;
			d=de(p);
			det=detail*(1.+totdist*60.)*(1.+ref*5.);
			totdist+=d.x;
      vec3 newEnergyColor = ENERGY_COLOR*totdist;
			energy=newEnergyColor*(1.5+sin(uTime*20.+p.z*10.))*.25;
			if(d.x<0.015)glow+=max(0.,.015-d.x)*exp(-totdist);
			if (d.y<.5 && d.x<0.03){//ONLY DOING THE GLOW WHEN IT IS CLOSE ENOUGH
				float glw=min(abs(3.35-p.y-ey),abs(3.35-p.y+ey));//2 glows at once
				eglow+=max(0.,.03-d.x)/.03*
				(pow(max(0.,.05-glw)/.05,5.)
				+pow(max(0.,.15-abs(3.35-p.y))/.15,8.))*1.5;
			}
		}
	}
	float l=pow(max(0.,dot(normalize(-dir.xz),normalize(lightdir.xz))),2.);
	l*=max(0.2,dot(-dir,lightdir));
	vec3 backg=.5*(1.2-l)+LIGHT_COLOR*l*.7;
	backg*=AMBIENT_COLOR;
	if (d.x<=det) {
    //DO THE NORMAL CALC OUTSIDE OF LIGHTING (since we already have the sphere normal)
		vec3 norm=normal(p-abs(d.x-det)*dir);
		col=light(p-abs(d.x-det)*dir, dir, norm, d.y)*exp(-.2*totdist*totdist);
		col = mix(col, backg, 1.0-exp(-1.*pow(totdist,1.5)));
	} else {
		col=backg;
	}
	vec3 lglow=LIGHT_COLOR*pow(l,30.)*.5;
	col+=glow*(backg+lglow)*1.3;
	col+=pow(eglow,2.)*energy*.015;
	col+=lglow*min(1.,totdist*totdist*.3);
	if (ref>0.5) {
		vec3 sphlight=light(origfrom+sphdist*origdir,origdir,sphNorm,2.);
		col=mix(col*.3+sphlight*.7,backg,1.0-exp(-1.*pow(sphdist,1.5)));
	}
	return col;
}

vec3 move(inout mat2 rotview1,inout mat2 rotview2) {
	vec3 go=path(t);
	vec3 adv=path(t+.7);
	vec3 advec=normalize(adv-go);
	float an=atan(advec.x,advec.z);
	rotview1=mat2(cos(an),sin(an),-sin(an),cos(an));
		  an=advec.y*1.7;
	rotview2=mat2(cos(an),sin(an),-sin(an),cos(an));
	return go;
}

mat3 rotate3d(float _angle){
    return mat3(cos(_angle),-sin(_angle), 0.,
                sin(_angle),cos(_angle), 0.,
                0.,0.,1.);
}

void main() {
  float easing = getEasing(int(uEasings.x), uIntervals.x);
  float easing2 = getEasing(int(uEasings.y), uIntervals.y);

	pth1 = path(t+.3)+origin+vec3(0.,.01,0.);
	vec2 uv = gl_FragCoord.xy / uResolution.xy*2.-1.;
	vec2 uv2=uv;
	uv.y*=uResolution.y/uResolution.x;
	//vec2 mouse=(iMouse.xy/uResolution.xy-.5)*3.;
	//if (iMouse.z<1.) mouse=vec2(0.);
	mat2 rotview1, rotview2;
	vec3 from=origin+move(rotview1,rotview2);

  vec2 d1 = vec2(uFractalBounds.x, uFractalBounds.y);
  vec2 d2= vec2(uFractalBounds.z, uFractalBounds.w);
	vec3 dir=normalize(vec3((uv),1.));
  dir = rotate3d(easing)*dir;
  vec3 dir2=normalize(-1.*vec3((uv),1.));
  dir2 = rotate3d(uLocalPosition.y*easing2*0.01)*dir2;
	vec3 color=raymarch(from,dir);
  vec3 color2=raymarch(from,dir2*1.1);
	color=clamp(color,vec3(.0),vec3(1.));
	color=pow(color,vec3(GAMMA))*BRIGHTNESS;
	color=mix(vec3(length(color)),color,SATURATION);
	color2=clamp(color2,vec3(.0),vec3(1.));
	color2=pow(color2,vec3(GAMMA))*BRIGHTNESS;
	color2=mix(vec3(length(color2)),color2,SATURATION);
  vec3 newColor = blend(color, color2);
	gl_FragColor = vec4(newColor,1.);
}