/*!
 * Text Field Component
 * @author   Gabor Ivan <gixx@gixx-web.com>
 * @license  MIT
 */
'use strict';

/**
 * TextField Component
 *
 * @type {{init}}
 */
const TextFieldComponent = function (options) {
    /** @type {NodeList} */
    let textFieldComponentElements;
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

    let TextFieldElement = function (HTMLElement) {
        options.verbose && console.info(
            '%c✚%c a TextField Component Element is initialized %o',
            'color:green; font-weight:bold;',
            'color:black;',
            '#' + HTMLElement.getAttribute('id')
        );

        return {
            constructor: TextFieldElement
        };
    };

    if (typeof window.Util === 'undefined') {
        throw new ReferenceError('The Component Utility library is required to use this component.');
    }

    options.verbose && console.info(
        '%c✔%c the TextField Component is loaded.',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        init: function () {
            if (initialized) {
                return;
            }

            console.group(
                '%c  looking for TextField Component Elements...',
                'color:#cecece'
            );

            textFieldComponentElements = document.querySelectorAll('.component.text-field');

            for (let i = 0, len = textFieldComponentElements.length; i < len; i++) {
                if (!textFieldComponentElements[i].hasAttribute('id')) {
                    textFieldComponentElements[i].setAttribute('id', 'textFieldComponentElement-' + (idCounter++));
                }

                textFieldComponentElements[i].component = new TextFieldElement(textFieldComponentElements[i]);
            }

            console.groupEnd();

            window.Util.triggerEvent(document, 'TextFieldComponentLoaded');
            initialized = true;
        }
    };
};

window['TextFieldComponent'] = TextFieldComponent;
