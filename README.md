Author: Alex Shandilis
Version: 6/13/2021

Probably buggy.

To use:
1. Add buttons to the "addRippleEffect" class.
2. Add and set attribute "rippleColor" to any desired color. Any color value supported by CSS is valid.
3. By default, the buttons will cast a shadow when pressed along with the ripple. This can be disabled by adding the attribute "noshadow" to the button.
4. By default, the ripple will be cast over any text and elements that are inside the button. Although I plan to add better support to correct this, you can try adding the attribute "overripple" to any elements such as spans, images, etc. that are children of the button. Unfortunately, this does not apply to any text that is placed directly inside the button.
