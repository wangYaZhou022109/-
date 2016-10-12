var D = require('drizzlejs'),
    options = require('../popup/index');

module.exports = D.assign({}, options, { mixin: D.assign({}, options.mixin, {
    animateIn: 'fadeIn',
    animateOut: 'fadeOut'
}) });
