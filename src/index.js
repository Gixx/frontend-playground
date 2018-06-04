import './index.scss';

const Util = require('./components/Util');
const ComponentLoader = require('./components/ComponentLoader');

// Register Global Object
window['Util'] = Util;

document.addEventListener('DOMContentLoaded', function () {
    let CLF = new ComponentLoader({'verbose': true});
    CLF.init();
});
