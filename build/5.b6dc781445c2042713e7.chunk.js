webpackJsonp([5],{"./app/containers/MapPage/constants.js":function(n,t,e){"use strict";e.d(t,"a",function(){return u}),e.d(t,"b",function(){return i}),e.d(t,"c",function(){return r}),e.d(t,"d",function(){return a});var u="WINDOW_RESIZED",i="CHANGE_MAP_REQUEST",r="UPDATE_MAP_SUCCESS",a="UPDATE_BUILDS_SUCCESS"},"./app/containers/MapPage/reducer.js":function(n,t,e){"use strict";function u(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a,t=arguments[1];switch(t.type){case r.a:return n.updateIn(["window","width"],function(){return t.width}).updateIn(["window","height"],function(){return t.height});case r.b:return n.set("map_id",t.map_id);case r.d:return n.updateIn(["builds"],function(n){return n.merge(t.builds)}).updateIn(["links"],function(n){return n.merge(t.links)});case r.c:return n.set("map",t.map);default:return n}}Object.defineProperty(t,"__esModule",{value:!0});var i=e("./node_modules/immutable/dist/immutable.js"),r=(e.n(i),e("./app/containers/MapPage/constants.js")),a=e.i(i.fromJS)({window:{width:0,height:0},map_id:null,map:{},builds:[],links:[]});t.default=u}});