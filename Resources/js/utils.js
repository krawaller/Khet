var $ = function(id){ return document.getElementById(id); };
$.extend = function(destination, source) {
   for (var property in source)
       destination[property] = source[property];
   return destination;
};

$.hasClass = function(el, cls){ return new RegExp("\\b" + cls + "\\b", "i").test(el.className); }
$.addClass = function(el, cls){ if(!$.hasClass(el, cls)){ el.className += cls; } }
$.removeClass = function(el, cls){ el.className = el.className.replace(new RegExp("\\b" + cls + "\\b", "ig"), ""); }
    
