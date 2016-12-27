var $ = require('jquery');

exports.events = {
    'click iconbtn-*': 'toggleBtn'
};

exports.handlers = {
    toggleBtn: function(id) {
        $(this.$('iconbtn-' + id)).removeClass('show').siblings().addClass('show');
        $(this.$('behind-list')).toggleClass('reverse').siblings().toggleClass('reverse');
    }
};
