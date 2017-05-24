var $ = require('jquery'),
    helper = require('./app/util/helpers'),
    minute = 1000 * 60,
    hour = minute * 60;

exports.events = {
    'click all': 'all',
    'click previousWeek': 'previousWeek',
    'click previousThreeMonth': 'previousThreeMonth',
    'click previousYear': 'previousYear',
    'change start': 'change',
    'change end': 'change'
};

exports.handlers = {
    all: function() {
        $(this.$('start')).val('');
        $(this.$('end')).val('');
        this.module.dispatch('search', { startTime: '', endTime: '' });
    },
    previousWeek: function() {
        var now = new Date(),
            previousWeek = now.getTime() - (7 * 24 * hour);
        $(this.$('start')).val('');
        $(this.$('end')).val('');
        this.module.dispatch('search', { startTime: helper.date(previousWeek), endTime: helper.date(now) });
    },
    previousThreeMonth: function() {
        var now = new Date(),
            previousThreeMonth = new Date();
        $(this.$('start')).val('');
        $(this.$('end')).val('');
        previousThreeMonth.setMonth(previousThreeMonth.getMonth() - 3);
        this.module.dispatch('search', { startTime: helper.date(previousThreeMonth), endTime: helper.date(now) });
    },
    previousYear: function() {
        var now = new Date(),
            previousYear = new Date();
        $(this.$('start')).val('');
        $(this.$('end')).val('');
        previousYear.setFullYear(previousYear.getFullYear() - 1);
        this.module.dispatch('search', { startTime: helper.date(previousYear), endTime: helper.date(now) });
    },
    change: function() {
        this.module.dispatch('search', {
            startTime: helper.lastDay($(this.$('start')).val()),
            endTime: helper.lastDay($(this.$('end')).val())
        });
    }
};

exports.components = [{
    id: 'start',
    name: 'monthpicker'
}, {
    id: 'end',
    name: 'monthpicker'
}];

