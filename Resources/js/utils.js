var $ = function(id){ return document.getElementById(id); };
$.extend = function(destination, source) {
   for (var property in source)
       destination[property] = source[property];
   return destination;
};

$.hasClass = function(el, cls){ return new RegExp("\\b" + cls.split(" ").join("|") + "\\b", "i").test(el.className); };
$.addClass = function(el, cls){ if(!$.hasClass(el, cls)){ el.className += ' ' + cls; } };
$.removeClass = function(el, cls){ el.className = el.className.replace(new RegExp("\\b" + cls.split(" ").join("|") + "\\b", "ig"), ""); };
    
Array.prototype.pluck = function(key){
    return this.map(function(obj){ return obj[key]; });
};

Array.prototype.compact = function() {
    return this.filter(function(value){ return !!value; });
};

Array.prototype.without = function(without){
    return this.filter(function(value){ return value != without; });
};
