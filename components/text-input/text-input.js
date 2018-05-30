/**
 * TextInput component
 *
 * @param HTMLElement
 * @return {{constructor: (function(*))}}
 * @constructor
 */
const TextInput = function(HTMLElement) {
    "use strict";

    const definition = HTMLElement;

    console.info(
        '%c✚%c a TextInput component is initialized %o',
        'color:green; font-weight:bold;',
        'color:black;',
        '#someId'
    );

    return {
        constructor: TextInput
    }
};
