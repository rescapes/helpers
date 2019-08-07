const t=function(t,a){const n=Math.PI/180,o=Math.cos,l=.5-o((a.lat-t.lat)*n)/2+o(t.lat*n)*o(a.lat*n)*(1-o((a.lon-t.lon)*n))/2;return 12742*Math.asin(Math.sqrt(l))};export{t as calculateDistance};
//# sourceMappingURL=geospatialHelpers.mjs.map
