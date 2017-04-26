var D = require('drizzlejs');
var opt = require('./app/study/course/detail/player/url/index'),
    config = {};

config.items = {
    pdf: 'pdf'
};

module.exports = D.assign({}, opt, config);
