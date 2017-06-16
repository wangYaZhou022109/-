var D = require('drizzlejs'),
    Flatpickr = require('flatpickr'),
    $ = require('jquery'),
    zh = require('flatpickr/dist/l10n/zh').zh;


D.ComponentManager.register('flatpickr', function(view, el, options) {
    var opt = options || {},
        config = {
            locale: zh,
            enableTime: false,
            mode: 'single',
            onReady: function(dateObj, dateStr, instance) {
                var $cal = $(instance.calendarContainer);
                if ($cal.find('.flatpickr-clear').length < 1) {
                    $cal.append('<div class="flatpickr-clear pointer">清除</div>');
                    $cal.find('.flatpickr-clear').on('click', function() {
                        instance.clear();
                        instance.close();
                    });
                }
            }
        };

    if (!el) return null;

    D.assign(config, opt);
    return new Flatpickr(el, config);
}, function(view, comp) {
    comp && comp.destroy();
});
