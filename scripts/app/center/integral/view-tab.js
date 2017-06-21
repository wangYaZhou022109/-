var $ = require('jquery');
exports.events = {
    'click rule': 'showRule',
    'click grade': 'showGrade',
};

exports.handlers = {
    showGrade: function() {
        $(this.$('rule')).attr('class', '');
        $(this.$('grade')).attr('class', 'active');
        this.module.regions.main.show('center/integral/grade');
    },
    showRule: function() {
        $(this.$('rule')).attr('class', 'active');
        $(this.$('grade')).attr('class', '');
        this.module.regions.main.show(this.module.items.main);
    },
};
