var D = require('drizzlejs'),
    A = require('../util/animation'),
    Swiper;

Swiper = function(el, options) {
    this.el = el;
    this.options = options;

    this.current = options.current || 0;
    this.items = Array.prototype.slice.call(el.querySelectorAll('ul > li'));

    this.init();
};

D.assign(Swiper.prototype, {
    init: function() {
        var i;
        this.el.classList.add('swiper-container');
        this.items[this.current].classList.add('current');

        for (i = 0; i < this.current; i++) {
            this.items[i].classList.add('prev');
        }

        this.insertNavigation();
        this.bindListener();
        this.start();
    },

    goto: function(number) {
        var n = number % this.items.length,
            inEl,
            outEl,
            i,
            toLeft = n > this.current,
            me = this;

        if (n === this.current) {
            return;
        }

        inEl = this.items[n];
        outEl = this.items[this.current];

        this.dots[this.current].classList.remove('current');
        this.dots[n].classList.add('current');

        this.current = n;
        this.el.classList.add('animating');
        Promise.all([
            A.transition(outEl, 'current', false),
            A.transition(inEl, 'current', true),
            toLeft ? A.transition(outEl, 'prev', true) : A.transition(inEl, 'prev', false)
        ]).then(function() {
            me.el.classList.remove('animating');
            for (i = 0; i < me.current; i++) {
                me.items[i].classList.add('prev');
            }
            for (i = me.current + 1; i < me.items.length; i++) {
                me.items[i].classList.remove('prev');
            }
        });
    },

    start: function() {
        var me = this;
        if (!this.options.autoplay) return;
        this.timer = setInterval(function() {
            me.goto(me.current + 1);
        }, this.options.period || 6000);
    },

    stop: function() {
        if (!this.timer) return;
        clearInterval(this.timer);
    },

    insertNavigation: function() {
        var me = this;
        this.navigation = document.createElement('div');
        this.navigation.classList.add('navigation');

        this.dots = this.items.map(function(item, i) {
            var d = document.createElement('div');
            d.classList.add('item');
            d.setAttribute('data-index', i);
            me.navigation.appendChild(d);
            return d;
        });

        this.dots[this.current].classList.add('current');
        this.el.appendChild(this.navigation);
    },

    removeNavigation: function() {
        this.el.removeChild(this.navigation);
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
        this.removeNavigation();

        this.el.classList.remove('swiper-container');
        this.items[this.current].classList.remove('current');
    }
});

D.ComponentManager.register('swiper', function(view, el, options) {
    return new Swiper(el, options);
}, function(view, comp) {
    comp.destroy();
});
