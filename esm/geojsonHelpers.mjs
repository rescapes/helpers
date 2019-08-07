import{reduceBy as e,match as r,map as t,set as a,lensProp as o,pathOr as f,concat as s}from"ramda";const c=e((e,r)=>e.concat(r),[]),d=/(.+)\/\d+/,m=c(e=>r(d,e.id)[1]),u=e=>t(r=>a(o("features"),r,e),m(f([],["features"],e))),i=(e,r,t)=>"features"===e?s(r,t):t;export{i as concatFeatures,m as featureByType,u as geojsonByType};
//# sourceMappingURL=geojsonHelpers.mjs.map
