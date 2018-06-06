/*!
 * Text Input Component
 * @author   Gabor Ivan <gixx@gixx-web.com>
 * @license  MIT
 */
'use strict';

/**
 * TextInput Component
 *
 * @type {{init}}
 */
const TextInputComponent = function (options) {
    /** @type {NodeList} */
    let textInputComponentElements;
    /** @type {number} */
    let idCounter = 1;
    /** @type {boolean} */
    let initialized = false;
    /** @type {Object} */
    const defaultOptions = {
        verbose: false
    };

    // Complete the missing option elements.
    for (let i in defaultOptions) {
        if (defaultOptions.hasOwnProperty(i) && typeof options[i] === 'undefined') {
            options[i] = defaultOptions[i];
        }
    }

    let TextInputElement = function (HTMLElement) {
        options.verbose && console.info(
            '%c✚%c a TextInput Component Element is initialized %o',
            'color:green; font-weight:bold;',
            'color:black;',
            '#' + HTMLElement.getAttribute('id')
        );

        return {
            constructor: TextInputElement
        };
    };

    if (typeof window.Util === 'undefined') {
        throw new ReferenceError('The Component Utility library is required to use this component.');
    }

    options.verbose && console.info(
        '%c✔%c the TextInput Component is loaded.',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        init: function () {
            if (initialized) {
                return;
            }

            options.verbose && console.group(
                '%c  looking for TextInput Component Elements...',
                'color:#cecece'
            );

            textInputComponentElements = document.querySelectorAll('.component.text-input');

            for (let i = 0, len = textInputComponentElements.length; i < len; i++) {
                if (!textInputComponentElements[i].hasAttribute('id')) {
                    textInputComponentElements[i].setAttribute('id', 'textInputComponentElement-' + (idCounter++));
                }

                textInputComponentElements[i].component = new TextInputElement(textInputComponentElements[i]);
            }

            console.groupEnd();

            window.Util.triggerEvent(document, 'TextInputComponentLoaded');
            initialized = true;
        }
    };
};

window['TextInputComponent'] = TextInputComponent;
