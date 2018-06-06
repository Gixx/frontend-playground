'use strict';

/**
 * Utility methods for the components.
 *
 * @type {{isset: (function(): boolean), isArray: (function(): boolean), isObject: (function(): boolean), isFunction: (function(): boolean), isNull: (function(): boolean), inArray: Util.inArray, has: Util.has}}
 */
const Util = {
    /**
     * Determines whether the given argument is defined or not.
     *
     * @param {*} [arguments] The variable to check.
     * @return {boolean}   TRUE if defined, FALSE otherwise.
     */
    isset: function () {
        return typeof arguments[0] !== 'undefined';
    },

    /**
     * Checks if the given argument is an array.
     *
     * @param {*} [arguments] The variable to check.
     * @return {boolean}   TRUE if Array, ELSE otherwise.
     */
    isArray: function () {
        return (arguments[0] instanceof Array);
    },

    /**
     * Checks if the given argument is an object.
     *
     * @param {*} [arguments] The variable to check.
     * @return {boolean}   TRUE if Object, ELSE otherwise.
     */
    isObject: function () {
        return typeof arguments[0] === 'object';
    },

    /**
     * Checks if the given argument is a function.
     *
     * @param {*} [arguments] The variable to check.
     * @return {boolean}   TRUE if Function, ELSE otherwise.
     */
    isFunction: function () {
        return typeof arguments[0] === 'function';
    },

    /**
     * Checks if the given argument is a NULL value.
     *
     * @param {*} [arguments] The variable to check.
     * @return {boolean}   TRUE if NULL, ELSE otherwise.
     */
    isNull: function () {
        return arguments[0] === null;
    },

    /**
     * Checks if the given needle is present in haystack array.
     *
     * @param {*} needle       The searched value.
     * @param {*} haystack     The array to search in.
     * @return {boolean}   TRUE if found, FALSE otherwise.
     */
    inArray: function (needle, haystack) {
        let strict = (this.isset(arguments[2])) ? arguments[2] : false;

        if (this.isArray(haystack)) {
            for (let i = 0; i < haystack.length; i++) {
                if (haystack[i] === needle) {
                    return !(strict && haystack[i] !== needle);
                }
            }
        }

        return false;
    },

    /**
     * Checks if the given needle is present in haystack object.
     *
     * @param {*} needle       The searched value.
     * @param {*} haystack     The object to search in.
     * @return {boolean}   TRUE if found, FALSE otherwise.
     */
    has: function (needle, haystack) {
        if (this.isObject(haystack)) {
            return Object.prototype.hasOwnProperty.call(haystack, needle);
        }

        return false;
    }
};

/**
 * Clones an object
 *
 * @param {object} obj The object to clone
 * @return {object} The cloned object
 */
Util.clone = function (obj) {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (obj === null || typeof obj !== 'object') return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
        }
        return copy;
    }

    console.error('Unable to copy obj! Its type isn\'t supported.');
};

/**
 * Makes an XmlHttpRequest.
 *
 * @param {*} settings
 * @return {XMLHttpRequest}
 * @example  {
 *   url: '/index',
 *   method: 'POST',
 *   data: {
 *     name: 'John Doe',
 *     email: 'johndoe@foo.org'
 *   },
 *   async: true,
 *   success: function(data) { alert('Done'); },
 *   failure: function(data) { alert('Failed'); }
 * }
 */
Util.ajax = function (settings) {
    let rnd = new Date().getTime();
    let url = typeof settings.url !== 'undefined' ? settings.url : '/';
    let method = typeof settings.method !== 'undefined' ? settings.method : 'POST';
    let async = typeof settings.async !== 'undefined' ? settings.async : true;
    let data = typeof settings.data !== 'undefined' ? settings.data : '';
    let successCallback = typeof settings.success === 'function' ? settings.success : function (data) {};
    let failureCallback = typeof settings.failure === 'function' ? settings.failure : function (data) {};
    let xhr = new XMLHttpRequest();

    url = url + (url.lastIndexOf('?') === -1 ? '?' : '&') + 'timestamp=' + rnd;

    xhr.open(method, url, async);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            try {
                if (xhr.status === 200) {
                    successCallback(xhr.responseText);
                } else {
                    failureCallback(xhr.responseText);
                }
            } catch (exp) {
                console.warn('JSON parse error. Continue', exp);
            }
        }
    };

    if (!(data instanceof FormData)) {
        if (typeof data === 'object') {
            data = JSON.stringify(data);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        } else {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
    }

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(data);

    return xhr;
};

/**
 * Adds event listeners to elements.
 *
 * @param {Array|NodeList}         elementList
 * @param {string}                 eventList
 * @param {EventListener|Function} callback
 * @param {*}                      [bindObject]
 */
Util.addEventListeners = function (elementList, eventList, callback, bindObject) {
    let events = eventList.split(' ');
    if (typeof bindObject === 'undefined') {
        bindObject = null;
    }

    if (typeof elementList.length === 'undefined') {
        elementList = [elementList];
    }

    for (let i = 0, len = events.length; i < len; i++) {
        for (let j = 0, els = elementList.length; j < els; j++) {
            if (bindObject !== null) {
                elementList[j].addEventListener(events[i], callback.bind(bindObject), true);
            } else {
                elementList[j].addEventListener(events[i], callback, true);
            }
        }
    }
};

/**
 * Triggers an event on an element.
 *
 * @param {Node}   element
 * @param {string} eventName
 * @param {*}      [customData]
 */
Util.triggerEvent = function (element, eventName, customData) {
    let event;

    if (typeof customData !== 'undefined') {
        event = new CustomEvent(eventName, {'detail': customData});
    } else {
        event = new Event(eventName);
    }

    element.dispatchEvent(event);
};

/**
 * Returns the event element path.
 *
 * @param {Event} event
 * @return {Array}
 */
Util.getEventPath = function (event) {
    let path = (event.composedPath && event.composedPath()) || event.path;
    let target = event.target;

    if (typeof path !== 'undefined') {
        // Safari doesn't include Window, and it should.
        path = (path.indexOf(window) < 0) ? path.concat([window]) : path;
        return path;
    }

    if (target === window) {
        return [window];
    }

    function getParents (node, memo) {
        memo = memo || [];
        let parentNode = node.parentNode;

        if (!parentNode) {
            return memo;
        } else {
            return getParents(parentNode, memo.concat([parentNode]));
        }
    }

    return [target]
        .concat(getParents(target))
        .concat([window]);
};

/**
 * Toggles browser fullscreen (experimental)
 */
Util.toggleFullscreen = function () {
    let doc = window.document;
    let docEl = doc.documentElement;

    let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
};

// export
module.exports = Util;
