/**
 * @title ripple.js
 * @description This contains the necessary code for generating the ripple effect seen when clicking on buttons.
 * 
 * @author Alex Shandilis
 * @version 6/13/2021
 * 
*/

var rippleBtns = document.getElementsByClassName("addRippleBtn");

/**
 * @name ripple
 * @param {Number} id 
 * @param {String} rgb 
 * @purpose This method creates the ripple effect seen on buttons.
 */
function createRipple(btn, rgb, coordinates) {
    btn.classList.add("rippleBtn");
    console.log('ripple created');
    btn.style.overflow = "hidden"; //This is to ensure that the parent element of the ripple hides the overflow of the ripple object.
    let parentWidth = btn.offsetWidth,
        parentHeight = btn.offsetHeight,
        rippleSize = (parentWidth > parentHeight) ? parentWidth * 2 : parentHeight * 2,
        rippleContainer = document.createElement("div"),
        parentOffset = {
            offsetTop:btn.getBoundingClientRect().top,
            offsetLeft:btn.getBoundingClientRect().left
        };
    if(getComputedStyle(btn).position == "absolute" || getComputedStyle(btn).position == "relative" || getComputedStyle(btn).position == "static") parentOffset = { offsetTop: 0, offsetLeft:0 };
    btn.appendChild(rippleContainer); //Ripple container appended to the parent element.
    rippleContainer.classList.add("rippleContainer");
    rippleContainer.style.height = parentHeight + "px";
    rippleContainer.style.width = parentWidth + "px";
    rippleContainer.style.left = parentOffset.offsetLeft + "px";
    rippleContainer.style.top = parentOffset.offsetTop + "px";
    let rippleObject = document.createElement("div");
    rippleContainer.appendChild(rippleObject);
    rippleObject.style.position = "relative"; 
    rippleObject.style.width = (rippleSize*2) + "px";
    rippleObject.style.height = (rippleSize*2) + "px";
    let styleLeft = (coordinates.x - ((rippleSize*2)/2)),   //This calculates and stores the position values that will be used for the ripple object
        styleTop = (coordinates.y - ((rippleSize*2)/2));    //This calculates and stores the position values that will be used for the ripple object
    rippleObject.style.position = "relative";
    rippleObject.style.left = styleLeft+"px";
    rippleObject.style.top = styleTop+"px";
    rippleObject.style.backgroundColor = rgb;
    rippleObject.style.zIndex = 1;
    let overlay = btn.querySelectorAll("[overripple]");
    for(var i = 0; i < overlay.length; i++) {
        overlay[i].style.zIndex = 2;
        if(getComputedStyle(overlay[i]).position == "static") overlay[i].style.position = "relative";
    }
    rippleObject.style.animationDuration = 0.5 * rippleSize/50 + "s";
    rippleObject.classList.add("rippleEffect"); 
    //if (e.touches != undefined) rippleObject.targetX = e.touches[0].screenX, rippleObject.targetY = e.touches[0].screenY;
    if(!btn.hasAttribute("noshadow")) btn.style.boxShadow = "0px 3px 10px 2px rgba(0,0,0,0.3)";
    rippleObject.rippleStatus = "active";
    return rippleObject;
}

function removeRipple(btn) {
    if(btn.ripple.rippleStatus == "active") {
        btn.style.boxShadow = "0px 0px 5px 2px rgba(0,0,0,0)";
        btn.ripple.rippleStatus = "remove";
        btn.ripple.classList.add('rippleEnd');
        setTimeout(removeRippleObject, 2000, btn.ripple);
        btn.touchFiring = false;
        
    }
}

function getCenterCoordinates(element) {
    let x = element.getClientRects()[0].left + (element.width / 2) 
    let y = element.getClientRects()[0].top + (element.height / 2) 
    return { "x": x, "y": y };
}

/**
 * 
 * @param {Object} event event must be passed in to retrieve mouse coordinates
 * @param {Object} element 
 * @returns {JSON} coordinates of mouse in element
 */
function getRelativeCoordinates(event, element) {
    let x = ((event.clientX == undefined) ? event.touches[0].clientX : event.clientX) - element.getBoundingClientRect().left;
    let y = ((event.clientY == undefined) ? event.touches[0].clientY : event.clientY) - element.getBoundingClientRect().top;
    return { "x": x, "y": y };
}

/**
 * 
 * @param {Object} btn button that is being rippled
 * @param {String} rgb 
 * @returns 
 */
function getBtnRipple(btn, rgb) {
    let e = window.event;
    let coordinates = getRelativeCoordinates(e, btn);
    //if (e.touches != undefined) rippleObject.targetX = e.touches[0].screenX, rippleObject.targetY = e.touches[0].screenY;
    return createRipple(btn, rgb, coordinates);
}

for (var i = 0; i < rippleBtns.length; i++) {
    var currentElement = rippleBtns[i];
    let eventListeners = ["touchstart","mousedown"];
    for(var j = 0; j < eventListeners.length; j++) {
        currentElement.addEventListener(eventListeners[j], function(event) {
            this.rippleActive = true;
            var color = this.getAttribute("rippleColor");
            var nameID = this.getAttribute("id");
            var rippleElement
            if(event.type == "touchstart") {
                this.touchFiring = true;
                rippleElement = getBtnRipple(this, color);
            } else {
                if(this.touchFiring != true) {
                    rippleElement = getBtnRipple(this, color);
                }
            }
            this.ripple = rippleElement
            event.preventDefault();
            return false;
        });
        
    }
    let endEventListeners = ["touchcancel","touchend","touchmove","mouseleave","mouseup","contextmenu"];
    for(var j = 0; j < endEventListeners.length; j++) {
        currentElement.addEventListener(endEventListeners[j], function(event) {
            if(event.type == "touchmove") {
                let distanceX = event.touches[0].screenX - this.ripple.targetX;
                let distanceY = event.touches[0].screenY - this.ripple.targetY;
                let distance = Math.sqrt((Math.pow(distanceX,2)) + (Math.pow(distanceY,2)));
                if(distance > 20 && this.rippleActive == true) {
                    removeRipple(this, this.ripple);
                }
            } else {
                if(this.rippleActive == true) {
                    removeRipple(this);
                }
            }
            
        });
    }
}

function removeRippleObject(obj) {
    obj.parentElement.remove();
}