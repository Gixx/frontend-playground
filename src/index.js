import './index.scss';

const Util = require('./library/Util');
const ComponentLoader = require('./library/ComponentLoader');

// Register Global Object
window['Util'] = Util;

document.addEventListener('DOMContentLoaded', function () {
    let CLF = new ComponentLoader({'verbose': true});
    CLF.init();
});
