/***  Return the style name value of given element ***/
var getStyle = function(element, styleName) {
    var value = "";
    if(document.defaultView && document.defaultView.getComputedStyle) {
        value = document.defaultView.getComputedStyle(element, "").getPropertyValue(styleName);
        return value;
    }
    if(element.currentStyle) {
        styleName = styleName.replace(/\-(\w)/g, function (match, p1) {
            return p1.toUpperCase();
        });
        value = element.currentStyle[styleName];
    }
    return value;   
}

/***  converts centimetres to pixels  ***/
var cmToPixels = function(cm) {
    return cm * 37.795276;
}

/***  Activates button with id` id1, and deactivates button with id` id2, ***/
/***  and removes given class from the first button, and adds it to second button  ***/
var activeFirst_and_deactiveSecond = function(id1, id2, className) {
    if (id1 !== '') {
        var one = document.getElementById(id1);
        one.disabled = false;
        if(className !== '') one.classList.remove(className);
    }
    if (id2 !== ''){
        var two = document.getElementById(id2);
        two.disabled = true;
        if(className !== '') two.classList.add(className);
    } 
}
