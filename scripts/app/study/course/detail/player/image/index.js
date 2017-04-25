var D = require('drizzlejs');
var opt = require('./app/study/course/detail/player/url/index'),
    config = {};

config.items = {
    main: 'main'
};

module.exports = D.assign({}, opt, config);
