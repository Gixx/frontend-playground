import './index.scss';

const Util = require('../library/Util');
const ComponentLoader = require('../library/ComponentLoader');

// Register Global Object
window['Util'] = Util;

document.addEventListener('DOMContentLoaded', function () {
    // first, register the new custom tag
    document.registerElement('x-component');

    let CLF = new ComponentLoader({'verbose': true});
    CLF.init();
});
