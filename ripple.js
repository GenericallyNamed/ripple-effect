/**
 * @title ripple.js
 * @description This contains the necessary code for generating the ripple effect seen when clicking on buttons.
 * 
 * @author Alex Shandilis
 * @version 5/1/2021
 * 
 */

var rippleBtns = document.getElementsByClassName("addRippleBtn");

/**
 * @name ripple
 * @param {Number} id 
 * @param {String} rgb 
 * @purpose This method creates the ripple effect seen on buttons.
 */
function ripple(id, rgb) {    
    var elem = document.getElementById(id);
    elem.style.overflow = "hidden"; //This is to ensure that the parent element of the ripple hides the overflow of the ripple object.
    var e = window.event; //stores window.event in var "e"
    
    var parentWidth = parseInt((getComputedStyle(elem).width).substring(0,(getComputedStyle(elem).width).length-2)); //Get width of parent
    var parentHeight = parseInt((getComputedStyle(elem).height).substring(0,(getComputedStyle(elem).height).length-2)); //Get height of parent
    var rippleSize; //creates variable rippleSize, contains height of ripple 
    rippleSize = Math.sqrt(Math.pow(parentWidth,2) + Math.pow(parentHeight,2)); //Calculates the ripple size using the expression seen here
    var rippleContainer = document.createElement("div");
    rippleContainer.style.position = "relative"; //Creates a container for the ripple object, then set the position property in its style sheet to "relative"
    elem.appendChild(rippleContainer); //Ripple container appended to the parent element.
    var rippleObject = document.createElement("div"); //Creates the ripple object as a div
    rippleContainer.appendChild(rippleObject); //Appends the ripple object to the ripple container
    rippleObject.style.position = "relative"; //Set the position style of the ripple object to RELATIVE
    var parentObject = rippleObject.parentElement; //Get the parent of the ripple object.
    var x = e.clientX - parentObject.getBoundingClientRect().left;  //First get the RELATIVE x position of the mouse within the container by taking the mouse x-value
                                                                    //and subtracting the parent element's distance from the left
    var y = e.clientY - parentObject.getBoundingClientRect().top;   //First get the RELATIVE y position of the mouse within the container by taking the mouse y-value
                                                                    //and subtracting the parent element's distance from the top
    rippleObject.style.width = (rippleSize*2) + "px";
    rippleObject.style.height = (rippleSize*2) + "px";
    var styleLeft = (x - ((rippleSize*2)/2));   //This calculates and stores the position values that will be used for the ripple object
    var styleTop = (y - ((rippleSize*2)/2));    //This calculates and stores the position values that will be used for the ripple object
    rippleObject.style.position = "relative";
    rippleObject.style.left = styleLeft+"px";
    rippleObject.style.top = styleTop+"px";
    rippleObject.style.backgroundColor = rgb;
    rippleObject.style.zIndex = 1;
    rippleObject.classList.add("rippleEffect"); 
    let object = rippleObject;
    rippleObject.rippleStatus = "active"
    rippleObject.addEventListener("mouseup", function() {
        if(rippleObject.rippleStatus == "active") {
            rippleObject.rippleStatus = "remove";
            object.classList.add('rippleEnd');
            setTimeout(function() { //This setTimeout ensures that the fade-out animation on the ripple object will be allowed to run before the actual ripple 
                                    //object is deleted after 2 seconds.
                object.remove();
            }, 2000);
        }
    });
    rippleObject.addEventListener("mouseout", function() {  //This serves an identical purpose to the other event listener, except that it listens for the mouse
                                                            //no longer hovering over the ripple object.
        if(rippleObject.rippleStatus == "active") {
            rippleObject.rippleStatus = "remove";
            object.classList.add('rippleEnd');
            setTimeout(function() {
                object.parentNode.remove();
                object.remove();
            }, 2000);
        }
    });
    return;
}

for (var i = 0; i < rippleBtns.length; i++) {
    var currentElement = rippleBtns[i];
    currentElement.addEventListener('mousedown', function() {
        var color = this.getAttribute("rippleColor");
        var nameID = this.getAttribute("id");
        ripple(nameID, color);
    })
}