(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("gl-matrix"));
	else if(typeof define === 'function' && define.amd)
		define(["gl-matrix"], factory);
	else if(typeof exports === 'object')
		exports["ArGL"] = factory(require("gl-matrix"));
	else
		root["ArGL"] = factory(root["window"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_gl_matrix__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webgl-obj-loader/dist/webgl-obj-loader.min.js":
/*!********************************************************************!*\
  !*** ./node_modules/webgl-obj-loader/dist/webgl-obj-loader.min.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():undefined}("undefined"!=typeof self?self:this,function(){return function(e){function t(a){if(r[a])return r[a].exports;var n=r[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};return t.m=e,t.c=r,t.d=function(exports,e,r){t.o(exports,e)||Object.defineProperty(exports,e,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=3)}([function(e,exports,t){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e){switch(e){case"BYTE":case"UNSIGNED_BYTE":return 1;case"SHORT":case"UNSIGNED_SHORT":return 2;case"FLOAT":return 4}}Object.defineProperty(exports,"__esModule",{value:!0});var n=exports.Layout=function e(){r(this,e);for(var t=arguments.length,a=Array(t),n=0;n<t;n++)a[n]=arguments[n];this.attributes=a;var s=0,l=0,o=!0,u=!1,c=void 0;try{for(var f,h=a[Symbol.iterator]();!(o=(f=h.next()).done);o=!0){var p=f.value;if(this[p.key])throw new i(p);s%p.sizeOfType!=0&&(s+=p.sizeOfType-s%p.sizeOfType),this[p.key]={attribute:p,size:p.size,type:p.type,normalized:p.normalized,offset:s},s+=p.sizeInBytes,l=Math.max(l,p.sizeOfType)}}catch(e){u=!0,c=e}finally{try{!o&&h.return&&h.return()}finally{if(u)throw c}}s%l!=0&&(s+=l-s%l),this.stride=s;var v=!0,d=!1,y=void 0;try{for(var m,M=a[Symbol.iterator]();!(v=(m=M.next()).done);v=!0){this[m.value.key].stride=this.stride}}catch(e){d=!0,y=e}finally{try{!v&&M.return&&M.return()}finally{if(d)throw y}}},i=function e(t){r(this,e),this.message="found duplicate attribute: "+t.key},s=function e(t,n,i){arguments.length>3&&void 0!==arguments[3]&&arguments[3];r(this,e),this.key=t,this.size=n,this.type=i,this.normalized=!1,this.sizeOfType=a(i),this.sizeInBytes=this.sizeOfType*n};n.POSITION=new s("position",3,"FLOAT"),n.NORMAL=new s("normal",3,"FLOAT"),n.TANGENT=new s("tangent",3,"FLOAT"),n.BITANGENT=new s("bitangent",3,"FLOAT"),n.UV=new s("uv",2,"FLOAT"),n.MATERIAL_INDEX=new s("materialIndex",1,"SHORT"),n.MATERIAL_ENABLED=new s("materialEnabled",1,"UNSIGNED_SHORT"),n.AMBIENT=new s("ambient",3,"FLOAT"),n.DIFFUSE=new s("diffuse",3,"FLOAT"),n.SPECULAR=new s("specular",3,"FLOAT"),n.SPECULAR_EXPONENT=new s("specularExponent",3,"FLOAT"),n.EMISSIVE=new s("emissive",3,"FLOAT"),n.TRANSMISSION_FILTER=new s("transmissionFilter",3,"FLOAT"),n.DISSOLVE=new s("dissolve",1,"FLOAT"),n.ILLUMINATION=new s("illumination",1,"UNSIGNED_SHORT"),n.REFRACTION_INDEX=new s("refractionIndex",1,"FLOAT"),n.SHARPNESS=new s("sharpness",1,"FLOAT"),n.MAP_DIFFUSE=new s("mapDiffuse",1,"SHORT"),n.MAP_AMBIENT=new s("mapAmbient",1,"SHORT"),n.MAP_SPECULAR=new s("mapSpecular",1,"SHORT"),n.MAP_SPECULAR_EXPONENT=new s("mapSpecularExponent",1,"SHORT"),n.MAP_DISSOLVE=new s("mapDissolve",1,"SHORT"),n.ANTI_ALIASING=new s("antiAliasing",1,"UNSIGNED_SHORT"),n.MAP_BUMP=new s("mapBump",1,"SHORT"),n.MAP_DISPLACEMENT=new s("mapDisplacement",1,"SHORT"),n.MAP_DECAL=new s("mapDecal",1,"SHORT"),n.MAP_EMISSIVE=new s("mapEmissive",1,"SHORT")},function(e,exports,t){"use strict";function r(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),i=t(0),s=function(){function e(t,n){a(this,e),n=n||{},n.materials=n.materials||{},n.enableWTextureCoord=!!n.enableWTextureCoord,n.indicesPerMaterial=!!n.indicesPerMaterial;var i=this;i.vertices=[],i.vertexNormals=[],i.textures=[],i.indices=[],i.textureStride=n.enableWTextureCoord?3:2,this.name="";var s=[],l=[],o=[],u={},c=[],f={},h=-1,p=0;u.verts=[],u.norms=[],u.textures=[],u.hashindices={},u.indices=[[]],u.materialIndices=[],u.index=0;for(var v=/^v\s/,d=/^vn\s/,y=/^vt\s/,m=/^f\s/,M=/\s+/,b=/^usemtl/,x=t.split("\n"),I=0;I<x.length;I++){var A=x[I].trim();if(A&&!A.startsWith("#")){var _=A.split(M);if(_.shift(),v.test(A))s.push.apply(s,r(_));else if(d.test(A))l.push.apply(l,r(_));else if(y.test(A)){var k=_;_.length>2&&!n.enableWTextureCoord?k=_.slice(0,2):2===_.length&&n.enableWTextureCoord&&k.push(0),o.push.apply(o,r(k))}else if(b.test(A)){var T=_[0];T in f||(c.push(T),f[T]=c.length-1,n.indicesPerMaterial&&f[T]>0&&u.indices.push([])),h=f[T],n.indicesPerMaterial&&(p=h)}else if(m.test(A))for(var w=!1,F=0,S=_.length;F<S;F++){3!==F||w||(F=2,w=!0);var E=_[0]+","+h,g=_[F]+","+h;if(g in u.hashindices)u.indices[p].push(u.hashindices[g]);else{var O=_[F].split("/"),B=O.length-1;if(u.verts.push(+s[3*(O[0]-1)+0]),u.verts.push(+s[3*(O[0]-1)+1]),u.verts.push(+s[3*(O[0]-1)+2]),o.length){var L=n.enableWTextureCoord?3:2;u.textures.push(+o[(O[1]-1)*L+0]),u.textures.push(+o[(O[1]-1)*L+1]),n.enableWTextureCoord&&u.textures.push(+o[(O[1]-1)*L+2])}u.norms.push(+l[3*(O[B]-1)+0]),u.norms.push(+l[3*(O[B]-1)+1]),u.norms.push(+l[3*(O[B]-1)+2]),u.materialIndices.push(h),u.hashindices[g]=u.index,u.indices[p].push(u.hashindices[g]),u.index+=1}3===F&&w&&u.indices[p].push(u.hashindices[E])}}}i.vertices=u.verts,i.vertexNormals=u.norms,i.textures=u.textures,i.vertexMaterialIndices=u.materialIndices,i.indices=n.indicesPerMaterial?u.indices:u.indices[p],i.materialNames=c,i.materialIndices=f,i.materialsByIndex={},n.calcTangentsAndBitangents&&this.calculateTangentsAndBitangents()}return n(e,[{key:"calculateTangentsAndBitangents",value:function(){var e={};e.tangents=[].concat(r(new Array(this.vertices.length))).map(function(e){return 0}),e.bitangents=[].concat(r(new Array(this.vertices.length))).map(function(e){return 0});var t=void 0;t=Array.isArray(this.indices[0])?[].concat.apply([],this.indices):this.indices;for(var a=this.vertices,n=this.vertexNormals,i=this.textures,s=0;s<t.length;s+=3){var l=t[s+0],o=t[s+1],u=t[s+2],c=a[3*l+0],f=a[3*l+1],h=a[3*l+2],p=i[2*l+0],v=i[2*l+1],d=a[3*o+0],y=a[3*o+1],m=a[3*o+2],M=i[2*o+0],b=i[2*o+1],x=a[3*u+0],I=a[3*u+1],A=a[3*u+2],_=i[2*u+0],k=i[2*u+1],T=d-c,w=y-f,F=m-h,S=x-c,E=I-f,g=A-h,O=M-p,B=b-v,L=_-p,N=k-v,R=O*N-B*L,P=1/(Math.abs(R<1e-4)?1:R),D=(T*N-S*B)*P,C=(w*N-E*B)*P,U=(F*N-g*B)*P,j=(S*O-T*L)*P,z=(E*O-w*L)*P,H=(g*O-F*L)*P,W=n[3*l+0],G=n[3*l+1],V=n[3*l+2],K=n[3*o+0],q=n[3*o+1],X=n[3*o+2],Y=n[3*u+0],J=n[3*u+1],Q=n[3*u+2],Z=D*W+C*G+U*V,ee=D*K+C*q+U*X,te=D*Y+C*J+U*Q,re=D-W*Z,ae=C-G*Z,ne=U-V*Z,ie=D-K*ee,se=C-q*ee,le=U-X*ee,oe=D-Y*te,ue=C-J*te,ce=U-Q*te,fe=Math.sqrt(re*re+ae*ae+ne*ne),he=Math.sqrt(ie*ie+se*se+le*le),pe=Math.sqrt(oe*oe+ue*ue+ce*ce),ve=j*W+z*G+H*V,de=j*K+z*q+H*X,ye=j*Y+z*J+H*Q,me=j-W*ve,Me=z-G*ve,be=H-V*ve,xe=j-K*de,Ie=z-q*de,Ae=H-X*de,_e=j-Y*ye,ke=z-J*ye,Te=H-Q*ye,we=Math.sqrt(me*me+Me*Me+be*be),Fe=Math.sqrt(xe*xe+Ie*Ie+Ae*Ae),Se=Math.sqrt(_e*_e+ke*ke+Te*Te);e.tangents[3*l+0]+=re/fe,e.tangents[3*l+1]+=ae/fe,e.tangents[3*l+2]+=ne/fe,e.tangents[3*o+0]+=ie/he,e.tangents[3*o+1]+=se/he,e.tangents[3*o+2]+=le/he,e.tangents[3*u+0]+=oe/pe,e.tangents[3*u+1]+=ue/pe,e.tangents[3*u+2]+=ce/pe,e.bitangents[3*l+0]+=me/we,e.bitangents[3*l+1]+=Me/we,e.bitangents[3*l+2]+=be/we,e.bitangents[3*o+0]+=xe/Fe,e.bitangents[3*o+1]+=Ie/Fe,e.bitangents[3*o+2]+=Ae/Fe,e.bitangents[3*u+0]+=_e/Se,e.bitangents[3*u+1]+=ke/Se,e.bitangents[3*u+2]+=Te/Se}this.tangents=e.tangents,this.bitangents=e.bitangents}},{key:"makeBufferData",value:function(e){var t=this.vertices.length/3,r=new ArrayBuffer(e.stride*t);r.numItems=t;for(var a=new DataView(r),n=0,s=0;n<t;n++){s=n*e.stride;var l=!0,o=!1,u=void 0;try{for(var c,f=e.attributes[Symbol.iterator]();!(l=(c=f.next()).done);l=!0){var h=c.value,p=s+e[h.key].offset;switch(h.key){case i.Layout.POSITION.key:a.setFloat32(p,this.vertices[3*n],!0),a.setFloat32(p+4,this.vertices[3*n+1],!0),a.setFloat32(p+8,this.vertices[3*n+2],!0);break;case i.Layout.UV.key:a.setFloat32(p,this.textures[2*n],!0),a.setFloat32(p+4,this.vertices[2*n+1],!0);break;case i.Layout.NORMAL.key:a.setFloat32(p,this.vertexNormals[3*n],!0),a.setFloat32(p+4,this.vertexNormals[3*n+1],!0),a.setFloat32(p+8,this.vertexNormals[3*n+2],!0);break;case i.Layout.MATERIAL_INDEX.key:a.setInt16(p,this.vertexMaterialIndices[n],!0);break;case i.Layout.AMBIENT.key:var v=this.vertexMaterialIndices[n],d=this.materialsByIndex[v];if(!d)break;a.setFloat32(p,d.ambient[0],!0),a.setFloat32(p+4,d.ambient[1],!0),a.setFloat32(p+8,d.ambient[2],!0);break;case i.Layout.DIFFUSE.key:var y=this.vertexMaterialIndices[n],m=this.materialsByIndex[y];if(!m)break;a.setFloat32(p,m.diffuse[0],!0),a.setFloat32(p+4,m.diffuse[1],!0),a.setFloat32(p+8,m.diffuse[2],!0);break;case i.Layout.SPECULAR.key:var M=this.vertexMaterialIndices[n],b=this.materialsByIndex[M];if(!b)break;a.setFloat32(p,b.specular[0],!0),a.setFloat32(p+4,b.specular[1],!0),a.setFloat32(p+8,b.specular[2],!0);break;case i.Layout.SPECULAR_EXPONENT.key:var x=this.vertexMaterialIndices[n],I=this.materialsByIndex[x];if(!I)break;a.setFloat32(p,I.specularExponent,!0);break;case i.Layout.EMISSIVE.key:var A=this.vertexMaterialIndices[n],_=this.materialsByIndex[A];if(!_)break;a.setFloat32(p,_.emissive[0],!0),a.setFloat32(p+4,_.emissive[1],!0),a.setFloat32(p+8,_.emissive[2],!0);break;case i.Layout.TRANSMISSION_FILTER.key:var k=this.vertexMaterialIndices[n],T=this.materialsByIndex[k];if(!T)break;a.setFloat32(p,T.transmissionFilter[0],!0),a.setFloat32(p+4,T.transmissionFilter[1],!0),a.setFloat32(p+8,T.transmissionFilter[2],!0);break;case i.Layout.DISSOLVE.key:var w=this.vertexMaterialIndices[n],F=this.materialsByIndex[w];if(!F)break;a.setFloat32(p,F.dissolve,!0);break;case i.Layout.ILLUMINATION.key:var S=this.vertexMaterialIndices[n],E=this.materialsByIndex[S];if(!E)break;a.setInt16(p,E.illumination,!0);break;case i.Layout.REFRACTION_INDEX.key:var g=this.vertexMaterialIndices[n],O=this.materialsByIndex[g];if(!O)break;a.setFloat32(p,O.refractionIndex,!0);break;case i.Layout.SHARPNESS.key:var B=this.vertexMaterialIndices[n],L=this.materialsByIndex[B];if(!L)break;a.setFloat32(p,L.sharpness,!0);break;case i.Layout.ANTI_ALIASING.key:var N=this.vertexMaterialIndices[n],R=this.materialsByIndex[N];if(!R)break;a.setInt16(p,R.antiAliasing,!0)}}}catch(e){o=!0,u=e}finally{try{!l&&f.return&&f.return()}finally{if(o)throw u}}}return r}},{key:"makeIndexBufferData",value:function(){var e=new Uint16Array(this.indices);return e.numItems=this.indices.length,e}},{key:"addMaterialLibrary",value:function(e){for(var t in e.materials)if(t in this.materialIndices){var r=e.materials[t],a=this.materialIndices[r.name];this.materialsByIndex[a]=r}}}]),e}();exports.default=s},function(e,exports,t){"use strict";function r(e){return Array.isArray(e)?e:Array.from(e)}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),i=exports.Material=function e(t){a(this,e),this.name=t,this.ambient=[0,0,0],this.diffuse=[0,0,0],this.specular=[0,0,0],this.emissive=[0,0,0],this.transmissionFilter=[0,0,0],this.dissolve=0,this.specularExponent=0,this.transparency=0,this.illumination=0,this.refractionIndex=1,this.sharpness=0,this.mapDiffuse=null,this.mapAmbient=null,this.mapSpecular=null,this.mapSpecularExponent=null,this.mapDissolve=null,this.antiAliasing=!1,this.mapBump=null,this.mapDisplacement=null,this.mapDecal=null,this.mapEmissive=null,this.mapReflections=[]};exports.MaterialLibrary=function(){function e(t){a(this,e),this.data=t,this.currentMaterial=null,this.materials={},this.parse()}return n(e,[{key:"parse_newmtl",value:function(e){var t=e[0];this.currentMaterial=new i(t),this.materials[t]=this.currentMaterial}},{key:"parseColor",value:function(e){if("spectral"!=e[0]&&"xyz"!=e[0]){if(3==e.length)return e.map(parseFloat);var t=parseFloat(e[0]);return[t,t,t]}}},{key:"parse_Ka",value:function(e){this.currentMaterial.ambient=this.parseColor(e)}},{key:"parse_Kd",value:function(e){this.currentMaterial.diffuse=this.parseColor(e)}},{key:"parse_Ks",value:function(e){this.currentMaterial.specular=this.parseColor(e)}},{key:"parse_Ke",value:function(e){this.currentMaterial.emissive=this.parseColor(e)}},{key:"parse_Tf",value:function(e){this.currentMaterial.transmissionFilter=this.parseColor(e)}},{key:"parse_d",value:function(e){this.currentMaterial.dissolve=parseFloat(e.pop())}},{key:"parse_illum",value:function(e){this.currentMaterial.illumination=parseInt(e[0])}},{key:"parse_Ni",value:function(e){this.currentMaterial.refractionIndex=parseFloat(e[0])}},{key:"parse_Ns",value:function(e){this.currentMaterial.specularExponent=parseInt(e[0])}},{key:"parse_sharpness",value:function(e){this.currentMaterial.sharpness=parseInt(e[0])}},{key:"parse_cc",value:function(e,t){t.colorCorrection="on"==e[0]}},{key:"parse_blendu",value:function(e,t){t.horizontalBlending="on"==e[0]}},{key:"parse_blendv",value:function(e,t){t.verticalBlending="on"==e[0]}},{key:"parse_boost",value:function(e,t){t.boostMipMapSharpness=parseFloat(e[0])}},{key:"parse_mm",value:function(e,t){t.modifyTextureMap.brightness=parseFloat(e[0]),t.modifyTextureMap.contrast=parseFloat(e[1])}},{key:"parse_ost",value:function(e,t,r){for(;e.length<3;)e.push(r);t.u=parseFloat(e[0]),t.v=parseFloat(e[1]),t.w=parseFloat(e[2])}},{key:"parse_o",value:function(e,t){this.parse_ost(e,t.offset,0)}},{key:"parse_s",value:function(e,t){this.parse_ost(e,t.scale,1)}},{key:"parse_t",value:function(e,t){this.parse_ost(e,t.turbulence,0)}},{key:"parse_texres",value:function(e,t){t.textureResolution=parseFloat(e[0])}},{key:"parse_clamp",value:function(e,t){t.clamp="on"==e[0]}},{key:"parse_bm",value:function(e,t){t.bumpMultiplier=parseFloat(e[0])}},{key:"parse_imfchan",value:function(e,t){t.imfChan=e[0]}},{key:"parse_type",value:function(e,t){t.reflectionType=e[0]}},{key:"parseOptions",value:function(e){var t={colorCorrection:!1,horizontalBlending:!0,verticalBlending:!0,boostMipMapSharpness:0,modifyTextureMap:{brightness:0,contrast:1},offset:{u:0,v:0,w:0},scale:{u:1,v:1,w:1},turbulence:{u:0,v:0,w:0},clamp:!1,textureResolution:null,bumpMultiplier:1,imfChan:null},r=void 0,a=void 0,n={};for(e.reverse();e.length;){var i=e.pop();i.startsWith("-")?(r=i.substr(1),n[r]=[]):n[r].push(i)}for(r in n)if(n.hasOwnProperty(r)){a=n[r];var s=this["parse_"+r];s&&s.bind(this)(a,t)}return t}},{key:"parseMap",value:function(e){var t=void 0,a=void 0;if(e[0].startsWith("-"))t=e.pop(),a=e;else{var n=r(e);t=n[0],a=n.slice(1)}return a=this.parseOptions(a),a.filename=t,a}},{key:"parse_map_Ka",value:function(e){this.currentMaterial.mapAmbient=this.parseMap(e)}},{key:"parse_map_Kd",value:function(e){this.currentMaterial.mapDiffuse=this.parseMap(e)}},{key:"parse_map_Ks",value:function(e){this.currentMaterial.mapSpecular=this.parseMap(e)}},{key:"parse_map_Ke",value:function(e){this.currentMaterial.mapEmissive=this.parseMap(e)}},{key:"parse_map_Ns",value:function(e){this.currentMaterial.mapSpecularExponent=this.parseMap(e)}},{key:"parse_map_d",value:function(e){this.currentMaterial.mapDissolve=this.parseMap(e)}},{key:"parse_map_aat",value:function(e){this.currentMaterial.antiAliasing="on"==e[0]}},{key:"parse_map_bump",value:function(e){this.currentMaterial.mapBump=this.parseMap(e)}},{key:"parse_bump",value:function(e){this.parse_map_bump(e)}},{key:"parse_disp",value:function(e){this.currentMaterial.mapDisplacement=this.parseMap(e)}},{key:"parse_decal",value:function(e){this.currentMaterial.mapDecal=this.parseMap(e)}},{key:"parse_refl",value:function(e){this.currentMaterial.mapReflections.push(this.parseMap(e))}},{key:"parse",value:function(){var e=this.data.split(/\r?\n/),t=!0,a=!1,n=void 0;try{for(var i,s=e[Symbol.iterator]();!(t=(i=s.next()).done);t=!0){var l=i.value;if((l=l.trim())&&!l.startsWith("#")){var o=l.split(/\s/),u=void 0,c=o,f=r(c);u=f[0],o=f.slice(1);var h=this["parse_"+u];h&&h.bind(this)(o)}}}catch(e){a=!0,n=e}finally{try{!t&&s.return&&s.return()}finally{if(a)throw n}}delete this.data,this.currentMaterial=null}}]),e}()},function(e,exports,t){e.exports=t(4)},function(e,exports,t){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.version=exports.deleteMeshBuffers=exports.initMeshBuffers=exports.downloadMeshes=exports.downloadModels=exports.Layout=exports.MaterialLibrary=exports.Material=exports.Mesh=void 0;var r=t(1),a=function(e){return e&&e.__esModule?e:{default:e}}(r),n=t(2),i=t(0),s=t(5);exports.Mesh=a.default,exports.Material=n.Material,exports.MaterialLibrary=n.MaterialLibrary,exports.Layout=i.Layout,exports.downloadModels=s.downloadModels,exports.downloadMeshes=s.downloadMeshes,exports.initMeshBuffers=s.initMeshBuffers,exports.deleteMeshBuffers=s.deleteMeshBuffers,exports.version="1.1.3"},function(e,exports,t){"use strict";function r(e,t){var r=["mapDiffuse","mapAmbient","mapSpecular","mapDissolve","mapBump","mapDisplacement","mapDecal","mapEmissive"];t.endsWith("/")||(t+="/");var a=[];for(var n in e.materials)if(e.materials.hasOwnProperty(n)){n=e.materials[n];var i=!0,s=!1,l=void 0;try{for(var o,u=r[Symbol.iterator]();!(i=(o=u.next()).done);i=!0){var c=o.value;(function(e){var r=n[e];if(!r)return"continue";var i=t+r.filename;a.push(fetch(i).then(function(e){if(!e.ok)throw new Error;return e.blob()}).then(function(e){var t=new Image;return t.src=URL.createObjectURL(e),r.texture=t,new Promise(function(e){return t.onload=e})}).catch(function(){}))})(c)}}catch(e){s=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(s)throw l}}}return Promise.all(a)}function a(e){var t=[],a=!0,n=!1,i=void 0;try{for(var s,o=e[Symbol.iterator]();!(a=(s=o.next()).done);a=!0){var f=s.value;!function(e){var a=[];if(!e.obj)throw new Error('"obj" attribute of model object not set. The .obj file is required to be set in order to use downloadModels()');var n={};n.indicesPerMaterial=!!e.indicesPerMaterial,n.calcTangentsAndBitangents=!!e.calcTangentsAndBitangents;var i=e.name;if(!i){var s=e.obj.split("/");i=s[s.length-1].replace(".obj","")}if(a.push(Promise.resolve(i)),a.push(fetch(e.obj).then(function(e){return e.text()}).then(function(e){return new u.default(e,n)})),e.mtl){var l=e.mtl;"boolean"==typeof l&&(l=e.obj.replace(/\.obj$/,".mtl")),a.push(fetch(l).then(function(e){return e.text()}).then(function(t){var a=new c.MaterialLibrary(t);if(!1!==e.downloadMtlTextures){var n=e.mtlTextureRoot;return n||(n=l.substr(0,l.lastIndexOf("/"))),Promise.all([Promise.resolve(a),r(a,n)])}return Promise.all(Promise.resolve(a))}).then(function(e){return e[0]}))}t.push(Promise.all(a))}(f)}}catch(e){n=!0,i=e}finally{try{!a&&o.return&&o.return()}finally{if(n)throw i}}return Promise.all(t).then(function(e){var t={},r=!0,a=!1,n=void 0;try{for(var i,s=e[Symbol.iterator]();!(r=(i=s.next()).done);r=!0){var o=i.value,u=l(o,3),c=u[0],f=u[1],h=u[2];f.name=c,h&&f.addMaterialLibrary(h),t[c]=f}}catch(e){a=!0,n=e}finally{try{!r&&s.return&&s.return()}finally{if(a)throw n}}return t})}function n(e,t,r){void 0===r&&(r={});var a=[];for(var n in e){(function(t){if(!e.hasOwnProperty(t))return"continue";var r=e[t];a.push(fetch(r).then(function(e){return e.text()}).then(function(e){return[t,new u.default(e)]}))})(n)}Promise.all(a).then(function(e){var a=!0,n=!1,i=void 0;try{for(var s,o=e[Symbol.iterator]();!(a=(s=o.next()).done);a=!0){var u=s.value,c=l(u,2),f=c[0],h=c[1];r[f]=h}}catch(e){n=!0,i=e}finally{try{!a&&o.return&&o.return()}finally{if(n)throw i}}return t(r)})}function i(e,t){t.normalBuffer=f(e,e.ARRAY_BUFFER,t.vertexNormals,3),t.textureBuffer=f(e,e.ARRAY_BUFFER,t.textures,t.textureStride),t.vertexBuffer=f(e,e.ARRAY_BUFFER,t.vertices,3),t.indexBuffer=f(e,e.ELEMENT_ARRAY_BUFFER,t.indices,1)}function s(e,t){e.deleteBuffer(t.normalBuffer),e.deleteBuffer(t.textureBuffer),e.deleteBuffer(t.vertexBuffer),e.deleteBuffer(t.indexBuffer)}Object.defineProperty(exports,"__esModule",{value:!0});var l=function(){function e(e,t){var r=[],a=!0,n=!1,i=void 0;try{for(var s,l=e[Symbol.iterator]();!(a=(s=l.next()).done)&&(r.push(s.value),!t||r.length!==t);a=!0);}catch(e){n=!0,i=e}finally{try{!a&&l.return&&l.return()}finally{if(n)throw i}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();exports.downloadModels=a,exports.downloadMeshes=n,exports.initMeshBuffers=i,exports.deleteMeshBuffers=s;var o=t(1),u=function(e){return e&&e.__esModule?e:{default:e}}(o),c=t(2),f=(t(0),function(e,t,r,a){var n=e.createBuffer(),i=t===e.ARRAY_BUFFER?Float32Array:Uint16Array;return e.bindBuffer(t,n),e.bufferData(t,new i(r),e.STATIC_DRAW),n.itemSize=a,n.numItems=r.length/a,n})}])});

/***/ }),

/***/ "./src/FBHelper.js":
/*!*************************!*\
  !*** ./src/FBHelper.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FBhelper; });
/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shader */ "./src/shader.js");


function FBhelper(Argl) {
  const quadVertices = [
    // positions   // texture Coords
    -1.0, 1.0, 0.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 0.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 1.0,
    1.0, -1.0, 0.0, 1.0, 0.0,
  ]


  const fbvs = `#version 300 es

  layout (location = 0) in vec3 a_position;
  layout (location = 1) in vec2 a_texCoord;

  out vec2 TexCoord;

  void main()
  {
      TexCoord = a_texCoord;
      gl_Position = vec4(a_position, 1.0);
  }
  `

  const fbfs = `#version 300 es

  precision mediump float;

  out vec4 FragColor;
  in vec2 TexCoord;

  uniform sampler2D scene;

  void main()
  {
    FragColor = texture(scene, TexCoord);
  }
  `
  const depthFS = `#version 300 es

  precision mediump float;

  out vec4 FragColor;
  in vec2 TexCoord;

  uniform sampler2D depthMap;

  void main()
  {
    float depthValue = texture(depthMap, TexCoord).r;
    FragColor = vec4(vec3(depthValue), 1.0);
  }
  `

  Argl.prototype.drawQuad = function (textures) {
    // self.gl.bindVertexArray(null)
    if (this.quadVAO === undefined) {
      this.quadVAO = this.gl.createVertexArray()
      let quadVBO = this.gl.createBuffer()
      this.gl.bindVertexArray(this.quadVAO)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quadVBO)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(quadVertices), this.gl.const_DRAW)
      this.gl.enableVertexAttribArray(0)
      this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, true, 20, 0)
      this.gl.enableVertexAttribArray(1)
      this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, true, 20, 12)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
      this.gl.bindVertexArray(null)
    }
    this.gl.bindVertexArray(this.quadVAO)
    if (textures.length === 1) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, textures[0])
    } else {
      for (let i in textures) {
        this.gl.activeTexture(this.gl.TEXTURE0 + Number(i))
        this.gl.bindTexture(this.gl.TEXTURE_2D, textures[i])
      }
    }

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
    this.gl.bindVertexArray(null)
  }

  Argl.prototype.drawFB = function (texture) {
    if (this.fbShader === undefined) {
      this.fbShader = new _shader__WEBPACK_IMPORTED_MODULE_0__["default"](this.gl, fbvs, fbfs)
    }
    this.fbShader.use()
    this.fbShader.setInt('scene', 0)
    this.drawQuad([texture])
  }

  Argl.prototype.drawDepth = function (texture) {
    if (this.fbShader === undefined) {
      this.fbShader = new _shader__WEBPACK_IMPORTED_MODULE_0__["default"](this.gl, fbvs, depthFS)
    }
    this.fbShader.use()
    this.fbShader.setInt('depthMap', 0)
    this.drawQuad([texture])
  }
}


/***/ }),

/***/ "./src/argl.js":
/*!*********************!*\
  !*** ./src/argl.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webgl-obj-loader */ "./node_modules/webgl-obj-loader/dist/webgl-obj-loader.min.js");
/* harmony import */ var webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./input */ "./src/input.js");
/* harmony import */ var _FBHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FBHelper */ "./src/FBHelper.js");






class ArGL {
  constructor({
    width = 300,
    height = 150,
    desktopInput = true,
    touchInput = true
  }) {
    this.options = { width, height, desktopInput, touchInput }

    this.el = document.createElement('div')
    this.canvas = document.createElement('canvas')
    this.el.style.width = width.toString() + 'px'
    this.el.style.height = height.toString() + 'px'
    this.canvas.style.width = width.toString() + 'px'
    this.canvas.style.height = height.toString() + 'px'

    this.loadingBar = document.createElement('progress')
    this.loadingBar.value = 0
    this.loadingBar.max = 100
    this.loadingBar.style.width = width + 'px'
    this.el.appendChild(this.loadingBar)

    this.resource = {
      images: []
    }
    this.resourceCount = 0
    this.loadProgress = []
    let self = this
    this.loadProgressProxy = new Proxy(this.loadProgress, {
      set: function (target, key, value, receiver) {
        let sum = self.loadProgress.reduce((p, v) => { return p + Number(v) }, 0)
        // console.log('progress: ' + Math.round(sum / self.resourceCount) + '%')
        if (self.resourceCount !== 0) {
          self.loadingBar.value = sum / self.resourceCount
        }
        return Reflect.set(target, key, value, receiver)
      }
    })


    this.gl = this.canvas.getContext('webgl2')
    if (!this.gl) {
      console.error('Unable to initialize WebGL2. Your browser or machine may not support it.')
      return null
    }

    this.deltaTime = 0
    this.lastFrame = 0

    if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["mobilecheck"])()) {
      this.mobile = true
    } else {
      this.mobile = false
    }

    if (this.options.desktopInput) {
      let dio = { lockPointer: true }
      if (typeof this.options.desktopInput !== 'boolean') {
        dio = this.options.desktopInput
      }
      let [currentlyPressedKeys, mouseInput] = ArGL.desktopInput(this.canvas, dio)
      this.currentlyPressedKeys = currentlyPressedKeys
      this.mouseInput = mouseInput

    }

    if (touchInput) {
      let ongoingTouches = ArGL.touchInput(this.canvas)
      this.ongoingTouches = ongoingTouches
    }
  }

  resize() {
    // 获取浏览器中画布的显示尺寸
    let displayWidth = this.canvas.clientWidth
    let displayHeight = this.canvas.clientHeight

    // 检尺寸是否相同
    if (this.canvas.width != displayWidth ||
      this.canvas.height != displayHeight) {

      // 设置为相同的尺寸
      this.canvas.width = displayWidth
      this.canvas.height = displayHeight
    }

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
  }

  draw(time) { }
  started() { }

  render(time) {
    this.deltaTime = time - this.lastFrame
    this.lastFrame = time
    this.resize()
    this.draw(time)

    if (this.options.touchInput) {
      for (let i in this.ongoingTouches) {
        this.ongoingTouches[i].deltaX = 0
        this.ongoingTouches[i].deltaY = 0
      }
    }
    if (this.options.desktopInput) {
      this.mouseInput.deltaX = 0
      this.mouseInput.deltaY = 0
      if (this.mouseInput.drag) {
        this.mouseInput.dragX = 0
        this.mouseInput.dragY = 0
      }
      this.mouseInput.wheelDeltaY = 0
    }
    requestAnimationFrame(this.render.bind(this))
  }

  loadMesh(objString) {
    let mesh = new webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0__["Mesh"](objString)
    Object(webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0__["initMeshBuffers"])(this.gl, mesh)
    return mesh
  }

  setMeshVAO(mesh, shader) {
    let a_position = this.gl.getAttribLocation(shader.program, 'a_position')
    let a_texCoord = this.gl.getAttribLocation(shader.program, 'a_texCoord')
    let a_normal = this.gl.getAttribLocation(shader.program, 'a_normal')

    let vao = this.gl.createVertexArray()
    this.gl.bindVertexArray(vao)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexBuffer)
    this.gl.vertexAttribPointer(a_position, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(a_position)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.textureBuffer)
    this.gl.vertexAttribPointer(a_texCoord, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(a_texCoord)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.normalBuffer)
    this.gl.vertexAttribPointer(a_normal, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(a_normal)

    this.gl.bindVertexArray(null)

    return vao
  }

  drawMesh(mesh, vao) {
    this.gl.bindVertexArray(vao)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer)
    this.gl.drawElements(this.gl.TRIANGLES, mesh.indexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0)
    this.gl.bindVertexArray(null)
  }

  async start() {
    let textures = await this.loadTexture()

    this.loadingBar.remove()
    this.el.appendChild(this.canvas)
    this.render(this.lastFrame)
    this.textures = textures
    this.started()
  }

  setImageResource(images) {
    this.resource.images = images
  }

  async loadTexture() {
    let textures = []
    this.resourceCount += this.resource.images.length
    let promises = this.resource.images.map((element, index) => {
      return ArGL.loadImage(element, (ratio) => {
        this.loadProgressProxy[index] = ratio
      })
    })

    let loadedImgs = await Promise.all(promises)
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
    loadedImgs.forEach((element, index) => {
      textures[index] = this.gl.createTexture()
      this.gl.activeTexture(this.gl.TEXTURE0 + index)
      this.gl.bindTexture(this.gl.TEXTURE_2D, textures[index])
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, element)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    })

    return textures

  }

}
ArGL.loadImage = _util__WEBPACK_IMPORTED_MODULE_1__["loadImage"]
Object(_input__WEBPACK_IMPORTED_MODULE_2__["default"])(ArGL)
Object(_FBHelper__WEBPACK_IMPORTED_MODULE_3__["default"])(ArGL)

/* harmony default export */ __webpack_exports__["default"] = (ArGL);


/***/ }),

/***/ "./src/camera/camera.js":
/*!******************************!*\
  !*** ./src/camera/camera.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "gl-matrix");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(gl_matrix__WEBPACK_IMPORTED_MODULE_0__);


class Camera {
  constructor(position = [0, 0, 0], orientation = [0, 0, 0, 1], zoom = 45) {
    this.position = position
    this.orientation = orientation
    this.zoom = zoom
    this.update()
  }

  getViewMatrix() {
    this.update()
    let view = gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].create()
    let center = [0, 0, 0]
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["vec3"].add(center, this.position, this.front)
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].lookAt(view, this.position, center, this.up)
    return view
  }

  translate(v) {
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["vec3"].add(this.position, this.position, v)
    // this.position += v * this.orientation
  }

  rotate(angle, axis) {
    let t = gl_matrix__WEBPACK_IMPORTED_MODULE_0__["quat"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["quat"].setAxisAngle(t, axis, angle)
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["quat"].mul(this.orientation, this.orientation, t)
    // this.orientation *= glm.angleAxis(angle, axis * this.orientation)
    this.update()
  }

  yaw(angle) {
    this.rotate(angle, this.up)
  }
  pitch(angle) {
    this.rotate(angle, this.right)
  }
  roll(angle) {
    this.rotate(angle, this.front)
  }

  update() {
    let m = gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].fromQuat(m, this.orientation)
    this.right = [-m[0], -m[4], -m[8]]
    this.up = [m[1], m[5], m[9]]
    this.front = [m[2], m[6], m[10]]
  }

  processZoom(yoffset) {
    if (this.zoom >= 1.0 && this.zoom <= 45.0)
      this.zoom -= yoffset / 200
    if (this.zoom <= 1.0)
      this.zoom = 1.0
    if (this.zoom >= 45.0)
      this.zoom = 45.0
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Camera);


/***/ }),

/***/ "./src/camera/free-move-camrea.js":
/*!****************************************!*\
  !*** ./src/camera/free-move-camrea.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ "./src/camera/camera.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "gl-matrix");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(gl_matrix__WEBPACK_IMPORTED_MODULE_1__);




const CameraMovement = {
  FORWARD: 0,
  BACKWARD: 1,
  LEFT: 2,
  RIGHT: 3,
  UP: 4,
  DOWN: 5
}

class FreeMoveCamera extends _camera__WEBPACK_IMPORTED_MODULE_0__["default"] {

  processMove(direction, step) {
    let dirvec = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
    if (direction == FreeMoveCamera.Movement.FORWARD) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.front, step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.BACKWARD) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.front, -step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.LEFT) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.right, -step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.RIGHT) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.right, step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.UP) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.up, step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.DOWN) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.up, -step)
      this.translate(dirvec)
    }
  }


  desktopFreeMoveControl(currentlyPressedKeys, step, mouseInput, mouseSensitivity, keys = ['w', 's', 'a', 'd', ' ', 'Shift', 'q', 'e']) {
    if (currentlyPressedKeys.get(keys[0])) {
      this.processMove(FreeMoveCamera.Movement.FORWARD, step)
    }
    if (currentlyPressedKeys.get(keys[1])) {
      this.processMove(FreeMoveCamera.Movement.BACKWARD, step)
    }
    if (currentlyPressedKeys.get(keys[2])) {
      this.processMove(FreeMoveCamera.Movement.LEFT, step)
    }
    if (currentlyPressedKeys.get(keys[3])) {
      this.processMove(FreeMoveCamera.Movement.RIGHT, step)
    }
    if (currentlyPressedKeys.get(keys[4])) {
      this.processMove(FreeMoveCamera.Movement.UP, step)
    }
    if (currentlyPressedKeys.get(keys[5])) {
      this.processMove(FreeMoveCamera.Movement.DOWN, step)
    }

    let toRadian = degree => degree / 180 * Math.PI
    if (currentlyPressedKeys.get(keys[6])) {
      this.roll(toRadian(-step * 5))
    }
    if (currentlyPressedKeys.get(keys[7])) {
      this.roll(toRadian(step * 5))
    }

    let radianX = toRadian(mouseInput.deltaX * mouseSensitivity)
    let radianY = toRadian(mouseInput.deltaY * mouseSensitivity)


    this.pitch(radianY)
    this.rotate(radianX, [0, 1, 0])
    this.processZoom(mouseInput.wheelDeltaY)
  }

}
FreeMoveCamera.Movement = CameraMovement

/* harmony default export */ __webpack_exports__["default"] = (FreeMoveCamera);


/***/ }),

/***/ "./src/camera/orbit-camera.js":
/*!************************************!*\
  !*** ./src/camera/orbit-camera.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ "./src/camera/camera.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "gl-matrix");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(gl_matrix__WEBPACK_IMPORTED_MODULE_1__);



function rotateVec(vec, normal, angle) {
  let direction = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
  let t1 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
  let t2 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()

  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].normalize(normal, normal)

  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(t1, vec, Math.cos(angle))
  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].cross(t2, normal, vec)
  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(t2, t2, Math.sin(angle))
  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].add(direction, t1, t2)
  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].normalize(direction, direction)
  return direction
}

class OrbitCamera extends _camera__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(position = [0, 0, 5], center = [0, 0, 0], zoom = 45) {
    let direction = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].sub(direction, center, position)
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].normalize(direction, direction)

    let dirX = [direction[0], 0, direction[2]]
    let dirY = [0, direction[1], Math.sqrt(1 - direction[1] ** 2)]
    let angleX = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].length(dirX) === 0 ? 0 : gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].angle([0, 0, 1], dirX)
    angleX = direction[0] > 0 ? -angleX : angleX
    let angleY = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].length(dirY) === 0 ? 0 : gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].angle([0, 0, 1], dirY)
    angleY = direction[1] > 0 ? -angleY : angleY
    console.log(direction, angleX, angleY)
    console.log(dirX, dirY)
    let orientation = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["quat"].create()

    super(position, orientation, zoom)
    this.yaw(angleX)
    this.pitch(angleY)

    this.center = center
    this.distance = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].distance(center, position)

  }

  processRotate(radianX, radianY) {

    let t1 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(t1, this.front, -1)
    t1 = rotateVec(t1, [0, 1, 0], -radianX)

    let t2 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].cross(t2, this.up, t1)
    t1 = rotateVec(t1, t2, -radianY)
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(t1, t1, this.distance)
    this.position = t1

    this.rotate(radianX, [0, 1, 0])
    this.pitch(radianY)

  }

  orbitControl(argl) {
    if (argl.mouseInput.drag) {
      let radianX = argl.mouseInput.dragX / argl.canvas.clientWidth * Math.PI * 2
      let radianY = argl.mouseInput.dragY / argl.canvas.clientHeight * Math.PI * 2
      this.processRotate(radianX, radianY)
    }
    this.processZoom(argl.mouseInput.wheelDeltaY)
  }

}

/* harmony default export */ __webpack_exports__["default"] = (OrbitCamera);


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: ArGL, Camera, Shader, OrbitCamera, FreeMoveCamera, util, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _argl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./argl */ "./src/argl.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ArGL", function() { return _argl__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _camera_camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./camera/camera */ "./src/camera/camera.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Camera", function() { return _camera_camera__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shader */ "./src/shader.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Shader", function() { return _shader__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _camera_orbit_camera__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./camera/orbit-camera */ "./src/camera/orbit-camera.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OrbitCamera", function() { return _camera_orbit_camera__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _camera_free_move_camrea__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./camera/free-move-camrea */ "./src/camera/free-move-camrea.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FreeMoveCamera", function() { return _camera_free_move_camrea__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "util", function() { return _util__WEBPACK_IMPORTED_MODULE_5__; });









/* harmony default export */ __webpack_exports__["default"] = (_argl__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/input.js":
/*!**********************!*\
  !*** ./src/input.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Input; });

function Input(Argl) {
  Argl.desktopInput = function (el, options) {
    let currentlyPressedKeys = new Map()
    let mouseInput = {
      deltaX: 0,
      deltaY: 0,
      wheelDeltaY: 0
    }

    function handleKeyDown(e) {
      currentlyPressedKeys.set(e.key, true)
    }
    function handleKeyUp(e) {
      currentlyPressedKeys.set(e.key, false)
    }
    function mouse_callback(e) {
      mouseInput.deltaX = e.movementX || 0
      mouseInput.deltaY = e.movementY || 0
      if (mouseInput.drag) {
        mouseInput.dragX = e.movementX || 0
        mouseInput.dragY = e.movementY || 0
      }
    }
    function wheel_callback(e) {
      mouseInput.wheelDeltaY = e.wheelDeltaY
    }
    function handleDragStart(e) {
      mouseInput.drag = true
      mouseInput.dragX = 0
      mouseInput.dragY = 0
    }
    function handleDragEnd(e) {
      mouseInput.drag = false
    }
    function addInputListener() {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      document.addEventListener('mousemove', mouse_callback)
      document.addEventListener('mousedown', handleDragStart)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('wheel', wheel_callback)
    }
    function removeInputListener() {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', mouse_callback)
      document.removeEventListener('mousedown', handleDragStart)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('wheel', wheel_callback)
    }

    if (options.lockPointer) {
      el.requestPointerLock = el.requestPointerLock ||
        el.mozRequestPointerLock
      el.exitPointerLock = el.exitPointerLock ||
        el.mozExitPointerLock
      el.onclick = function () {
        el.requestPointerLock()
      }
      document.addEventListener('pointerlockchange', handleLockChange, false)
      document.addEventListener('mozpointerlockchange', handleLockChange, false)
      function handleLockChange() {
        if (document.pointerLockElement === el ||
          document.mozPointerLockElement === el) {
          addInputListener()
        } else {
          removeInputListener()
        }
      }
    } else {
      el.contentEditable = 'true'
      el.style.cursor = 'default'
      el.addEventListener('focus', addInputListener)
      el.addEventListener('blur', removeInputListener)
    }

    return [currentlyPressedKeys, mouseInput]
  }

  Argl.touchInput = function (el) {

    const ongoingTouches = []
    // 移动端横屏 应在具体应用中实现
    //-----------
    // let tip = document.createElement('span')
    // tip.innerText = '横屏以获取最佳体验'

    // //screen.width screen.height
    // //window.innerHeight  window.innerWidth

    // function detectOrient(){
    //   if (screen.orientation.angle % 180 === 0) {
    //     self.el.appendChild(tip)
    //     el.width = Math.min(self.options.width, screen.width-16)
    //     el.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight) -16)
    //   } else {
    //     tip.remove()
    //     el.width = Math.min(self.options.width, screen.width-16)
    //     el.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight)  -16)
    //   }
    // }
    // detectOrient()
    // window.addEventListener('orientationchange',detectOrient)

    el.addEventListener("touchstart", handleStart, false)
    el.addEventListener("touchend", handleEnd, false)
    el.addEventListener("touchmove", handleMove, false)


    function handleStart(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let touch = {
          pageX: touches[i].pageX,
          pageY: touches[i].pageY,
          startX: touches[i].pageX,
          startY: touches[i].pageY,
          deltaX: 0,
          deltaY: 0,
          identifier: touches[i].identifier
        }
        ongoingTouches.push(touch)
      }
    }

    function handleEnd(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier)
        ongoingTouches.splice(idx, 1)
      }
    }
    function handleMove(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier)

        let touch = {
          pageX: touches[i].pageX,
          pageY: touches[i].pageY,
          startX: ongoingTouches[idx].startX,
          startY: ongoingTouches[idx].startY,
          deltaX: touches[i].pageX - ongoingTouches[idx].pageX,
          deltaY: touches[i].pageY - ongoingTouches[idx].pageY,
          identifier: touches[i].identifier
        }
        ongoingTouches.splice(idx, 1, touch)  // swap in the new touch record
      }

    }

    function ongoingTouchIndexById(idToFind) {
      for (let i = 0; i < ongoingTouches.length; i++) {
        let id = ongoingTouches[i].identifier

        if (id === idToFind) {
          return i
        }
      }
      return -1   // not found
    }

    return ongoingTouches
  }

}


/***/ }),

/***/ "./src/shader.js":
/*!***********************!*\
  !*** ./src/shader.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Shader; });

class Shader {
  constructor(gl, vsSource, fsSource) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    // 创建着色器程序
    let shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    // 创建失败
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
      return null
    }

    this.gl = gl
    this.program = shaderProgram
  }

  use() {
    this.gl.useProgram(this.program)
  }

  setBool(name, value) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), Number(value))
  }
  setInt(name, value) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), Math.round(Number(value)))
  }
  setFloat(name, value) {
    this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), Number(value))
  }
  setVec2(name, vec2) {
    this.gl.uniform2fv(this.gl.getUniformLocation(this.program, name), vec2)
  }
  setVec3(name, vec3) {
    this.gl.uniform3fv(this.gl.getUniformLocation(this.program, name), vec3)
  }
  setVec4(name, vec4) {
    this.gl.uniform4fv(this.gl.getUniformLocation(this.program, name), vec4)
  }
  setMat2(name, mat2) {
    this.gl.uniformMatrix2fv(this.gl.getUniformLocation(this.program, name), false, mat2)
  }
  setMat3(name, mat3) {
    this.gl.uniformMatrix3fv(this.gl.getUniformLocation(this.program, name), false, mat3)
  }
  setMat4(name, mat4) {
    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, mat4)
  }

}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}


/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: mobilecheck, loadImage, loadBinary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mobilecheck", function() { return mobilecheck; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadImage", function() { return loadImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadBinary", function() { return loadBinary; });

function mobilecheck() {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}

function loadImage(imageUrl, onprogress) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    let notifiedNotComputable = false

    xhr.open('GET', imageUrl, true)
    xhr.responseType = 'arraybuffer'

    xhr.onprogress = function (ev) {
      if (ev.lengthComputable) {
        onprogress(Math.round((ev.loaded / ev.total) * 100))
      } else {
        if (!notifiedNotComputable) {
          notifiedNotComputable = true
          onprogress(-1)
        }
      }
    }

    xhr.onloadend = function () {
      if (!xhr.status.toString().match(/^2/)) {
        reject(xhr)
      } else {
        if (!notifiedNotComputable) {
          onprogress(100)
        }

        let options = {}
        let headers = xhr.getAllResponseHeaders()
        let m = headers.match(/^Content-Type\:\s*(.*?)$/mi)

        if (m && m[1]) {
          options.type = m[1]
        }

        let blob = new Blob([this.response], options)
        let imageUrl = window.URL.createObjectURL(blob)
        let img = new Image()
        img.src = imageUrl
        img.onload = () => resolve(img)
      }
    }

    xhr.send()
  })
}


function loadBinary(uri, onprogress) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    let notifiedNotComputable = false

    xhr.open('GET', uri, true)
    xhr.responseType = 'arraybuffer'

    xhr.onprogress = function (ev) {
      if (ev.lengthComputable) {
        onprogress(Math.round((ev.loaded / ev.total) * 100))
      } else {
        if (!notifiedNotComputable) {
          notifiedNotComputable = true
          onprogress(-1)
        }
      }
    }

    xhr.onloadend = function () {
      if (!xhr.status.toString().match(/^2/)) {
        reject(xhr)
      } else {
        if (!notifiedNotComputable) {
          onprogress(100)
        }
        resolve(this.response)
      }
    }
    xhr.send()
  })
}


/***/ }),

/***/ "gl-matrix":
/*!***************************************************************************************************!*\
  !*** external {"root":"window","commonjs":"gl-matrix","commonjs2":"gl-matrix","amd":"gl-matrix"} ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_gl_matrix__;

/***/ })

/******/ });
});
//# sourceMappingURL=argl.js.map