import m from"moment";require("moment-duration-format");const o=o=>(500>o.milliseconds()?o:m.duration(o).add(1,"s")).format("hh:mm:ss",{trim:!1});export{o as toTimeString};
//# sourceMappingURL=timeHelpers.mjs.map
