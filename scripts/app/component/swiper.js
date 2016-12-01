var D = require('drizzlejs'),
    A = require('../util/animation'),
    Swiper;

Swiper = function(el, options) {
    this.el = el;
    this.options = options;

    this.current = 0;
    this.items = Array.prototype.slice.call(el.querySelectorAll('ul > li'));

    this.init();
};

D.assign(Swiper.prototype, {
    init: function() {
        this.el.classList.add('swiper-container');
        this.items[this.current].classList.add('current');

        this.insertPagination();
        this.bindListener();
        this.start();
    },

    goto: function(number) {
        var n = number % this.items.length,
            inEl,
            outEl;

        if (n === this.current) {
            return;
        }

        inEl = this.items[n];
        outEl = this.items[this.current];

        this.dots[this.current].classList.remove('current');
        this.dots[n].classList.add('current');

        this.current = n;

        outEl.classList.remove('current');
        A.animate(outEl, 'prev');
        inEl.classList.add('current');
    },

    start: function() {
        var me = this;
        if (!this.options.autoplay) return;
        this.timer = setInterval(function() {
            me.goto(me.current + 1);
        }, this.options.period || 5000);
    },

    stop: function() {
        if (!this.timer) return;
        clearInterval(this.timer);
    },

    insertPagination: function() {
        var me = this;
        this.pagination = document.createElement('div');
        this.pagination.classList.add('pagination');

        this.dots = this.items.map(function(item, i) {
            var d = document.createElement('div');
            d.classList.add('item');
            d.setAttribute('data-index', i);
            me.pagination.appendChild(d);
            return d;
        });

        this.dots[0].classList.add('current');
        this.el.appendChild(this.pagination);
    },

    removePagination: function() {
        this.el.removeChild(this.pagination);
    },

    bindListener: function() {
        var me = this;

        if (!this.actions) {
            this.actions = {
                in: function() { me.stop(); },
                out: function() { me.start(); },
                click: function(e) {
                    var idx = Number(e.target.getAttribute('data-index'));
                    me.goto(idx);
                }
            };
        }

        this.items.forEach(function(item) {
            item.addEventListener('mouseover', me.actions.in, false);
            item.addEventListener('mouseout', me.actions.out, false);
        });

        this.dots.forEach(function(item) {
            item.addEventListener('click', me.actions.click, false);
        });
    },

    unbindListener: function() {
        var me = this;
        this.items.forEach(function(item) {
            item.removeEventListener('mouseover', me.actions.in);
            item.removeEventListener('mouseout', me.actions.out);
        });

        this.dots.forEach(function(item) {
            item.removeEventListener('click', me.actions.click);
        });
    },

    destroy: function() {
        this.stop();
        this.unbindListener();
        this.removePagination();

        this.el.classList.remove('swiper-container');
        this.items[this.current].classList.remove('current');
    }
});

D.ComponentManager.register('swiper', function(view, el, options) {
    return new Swiper(el, options);
}, function(view, comp) {
    comp.destroy();
});
