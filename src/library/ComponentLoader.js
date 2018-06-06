/*!
 * Component Loader Framework
 * @author   Gabor Ivan <gixx@gixx-web.com>
 * @license  MIT
 */
'use strict';

const JSZip = require('jszip');
const JSZipUtils = require('jszip-utils');

/**
 * Component Loader Framework
 *
 * @param options
 * @return {{constructor: (function(*)), init: init, loadError: loadError}}
 * @constructor
 */
const ComponentLoader = function (options) {
    /** @type {Object} */
    let componentData = {};
    /** @type {boolean} */
    let initialized = false;
    /** @type {Object} */
    let defaultOptions = {
        verbose: false
    };

    // Complete the missing option elements.
    for (let i in defaultOptions) {
        if (defaultOptions.hasOwnProperty(i) && typeof options[i] === 'undefined') {
            options[i] = defaultOptions[i];
        }
    }

    /**
     * Looking for Component elements in the HTML source.
     */
    const lookForComponentElements = function () {
        options.verbose && console.group(
            '%c looking for components...',
            'color:black'
        );

        let componentElements = document.getElementsByTagName('x-component');
        let uniqueComponents = 0;

        for (let i in componentElements) {
            if (componentElements.hasOwnProperty(i)) {
                let element = componentElements[i];

                if (element.hasAttribute('type')) {
                    let type = element.getAttribute('type').trim();
                    let typeName = type.toLowerCase()
                        .replace(/-(.)/g, function (match, group1) {
                            return group1.toUpperCase();
                        })
                        .replace(/^(.)/g, function (match, group1) {
                            return group1.toUpperCase();
                        });

                    if (typeof componentData[typeName] === 'undefined') {
                        uniqueComponents++;
                        componentData[typeName] = {
                            pathName: type,
                            className: typeName + 'Component',
                            html: '',
                            js: '',
                            css: '',
                            images: ''
                        };
                    }
                }
            }
        }

        options.verbose && console.info(
            '%d component%s found...',
            uniqueComponents,
            (uniqueComponents > 1 ? 's' : '')
        );
        options.verbose && console.groupEnd();
    };

    /**
     * Downloads the Component resources.
     */
    const downloadComponents = function () {
        options.verbose && console.group(
            '%c Start downloading components...',
            'color:black'
        );

        for (let i in componentData) {
            if (componentData.hasOwnProperty(i)) {
                let typeName = i;
                let src = './components/' + componentData[typeName].pathName + '.zip';
                let eventName = typeName + 'ComponentDownloaded';

                document.addEventListener(eventName, function () {
                    if (componentData[typeName].html.length > 0 &&
                        componentData[typeName].css.length > 0 &&
                        componentData[typeName].js.length > 0
                    ) {
                        applyStyle(componentData[typeName].css);
                        applyMarkup(componentData[typeName].pathName, componentData[typeName].html);
                        applyScript(componentData[typeName].js);
                        initComponent(typeName + 'Component');
                    }
                });

                JSZipUtils.getBinaryContent(src, function (err, data) {
                    options.verbose && console.info(
                        '%c⚡%c downloading the ' + typeName + ' component...',
                        'color:orange;font-weight:bold;',
                        'color:black;font-weight:bold;'
                    );

                    if (err) {
                        options.verbose && console.info(
                            '%c✖%c cannot download the component ' + typeName + ' from ' + src,
                            'color:red; font-weight:bold;',
                            'color:black; font-weight:bold;'
                        );
                        return;
                    }

                    JSZip.loadAsync(data).then(function (zip) {
                        zip.file(componentData[typeName].pathName + '/index.html')
                            .async('text')
                            .then(function (txt) {
                                componentData[typeName].html = txt;
                                window.Util.triggerEvent(document, eventName);
                            });

                        zip.file(componentData[typeName].pathName + '/index.js')
                            .async('text')
                            .then(function (txt) {
                                componentData[typeName].js = txt;
                                window.Util.triggerEvent(document, eventName);
                            });

                        zip.file(componentData[typeName].pathName + '/index.css')
                            .async('text')
                            .then(function (txt) {
                                componentData[typeName].css = txt;
                                window.Util.triggerEvent(document, eventName);
                            });
                    });
                });
            }
        }
    };

    /**
     * Generates custom data attributes.
     *
     * @param {Object} customAttributesData
     * @return {string}
     */
    const generateCustomAttributes = function (customAttributesData) {
        let customAttributesString = '';

        for (let i in customAttributesData) {
            if (customAttributesData.hasOwnProperty(i)) {
                customAttributesString += 'data-' + i + '="' + customAttributesData[i] + '" ';
            }
        }

        return customAttributesString;
    };

    /**
     * Apply Component markup.
     *
     * @param {String} selector
     * @param {String} genericContent
     */
    const applyMarkup = function (selector, genericContent) {
        let componentElements = document.querySelectorAll('x-component[type=' + selector + ']');
        componentElements.forEach(function (element) {
            let classList = element.hasAttribute('classList')
                ? element.getAttribute('classList').replace(/,/g, ' ')
                : '';
            let label = element.hasAttribute('label')
                ? element.getAttribute('label')
                : selector;
            let name = element.hasAttribute('name')
                ? element.getAttribute('name')
                : selector;
            let value = element.hasAttribute('value')
                ? element.getAttribute('value')
                : '';
            let customAttributes = element.hasAttribute('customAttributes')
                ? generateCustomAttributes(JSON.parse(element.getAttribute('customAttributes')))
                : '';
            let content = genericContent.replace(/\{% classList %\}/, classList)
                .replace(/\{% label %\}/, label)
                .replace(/\{% name %\}/, name)
                .replace(/\{% value %\}/, value)
                .replace(/\{% customAttributes %\}/, customAttributes);

            let block = document.createElement('div');
            block.innerHTML = content;
            element.replaceWith(block.firstChild);
        });
    };

    /**
     * Apply Component style.
     *
     * @param {String} style
     */
    const applyStyle = function (style) {
        let styleBlock = document.getElementById('ComponentStyles');

        if (styleBlock === null) {
            styleBlock = document.createElement('style');
            styleBlock.setAttribute('type', 'text/css');
            styleBlock.setAttribute('id', 'ComponentStyles');
            document.head.appendChild(styleBlock);
        }

        styleBlock.appendChild(document.createTextNode(style));
    };

    /**
     * Apply Component JavaScript.
     *
     * @param {String} script
     */
    const applyScript = function (script) {
        let block = document.createElement('script');
        block.setAttribute('type', 'application/javascript');
        block.appendChild(document.createTextNode(script));
        document.body.appendChild(block);
    };

    if (typeof window.Util === 'undefined') {
        throw new ReferenceError('The Component Utility library is required to use this component.');
    }

    options.verbose && console.clear();
    options.verbose && console.info(
        '%cWelcome to the Component Loader Framework!',
        'color:black; font-weight:bold;font-size:20px'
    );

    /**
     * Initialize a component.
     *
     * @param componentName
     */
    const initComponent = function (componentName) {
        if (typeof window[componentName] !== 'undefined') {
            let component = new window[componentName](options);
            component.init();
        }
    };

    return {
        constructor: ComponentLoader,

        /**
         * Initialize the Component Loader Framework.
         */
        init: function () {
            if (initialized) {
                return;
            }

            // first, register the new custom tag
            document.registerElement('x-component');

            lookForComponentElements();
            downloadComponents();
            initialized = true;
        }
    };
};

// export
module.exports = ComponentLoader;
