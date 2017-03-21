var D = require('drizzlejs'),
    A = require('../util/animation'),
    Swiper;

Swiper = function(el, options) {
    this.el = el;
    this.options = options;

    this.current = options.current || 0;
    this.list = el.querySelectorAll('ul')[0];
    this.items = Array.prototype.slice.call(this.list.children);
    // this.swiperHeight = this.items[0].clientHeight;
    // this.list.style.height = this.swiperHeight + 'px';
    // console.log(this.swiperHeight);

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
        this.insertBtn();
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

    translate: function(num) {
        var me = this.el,
            list = me.querySelector('ul'),
            transformWidth = list.clientWidth,
            transform = transformWidth * num;

        list.style.webkitTransform = 'translateX(' + transform + 'px)';
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

    toPrev: function() {
        if(this.current > 0) {
            this.goto(this.current - 1);
        };
    },

    toNext: function() {
        if(this.current < this.items.length) {
            this.goto(this.current + 1);
        };
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

    insertBtn: function() {
        if (!this.options.slider && !this.options.btn) return;

        this.btnPrev = document.createElement('div');
        this.btnPrev.classList.add('btn-prev');
        this.btnPrev.icon = document.createElement('i');
        this.btnPrev.icon.classList.add('iconfont');
        this.btnPrev.icon.classList.add('icon-arrow-left');
        this.btnPrev.appendChild(this.btnPrev.icon);

        this.btnNext = document.createElement('div');
        this.btnNext.classList.add('btn-next');
        this.btnNext.icon = document.createElement('i');
        this.btnNext.icon.classList.add('iconfont');
        this.btnNext.icon.classList.add('icon-arrow-right');
        this.btnNext.appendChild(this.btnNext.icon);

        this.el.appendChild(this.btnPrev);
        this.el.appendChild(this.btnNext);
    },

    removeBtn: function() {
        this.el.removeChild(this.btnPrev);
        this.el.removeChild(this.btnNext);
    },


    bindListener: function() {
        var me = this,
            num = 0,
            list = me.el.querySelector('ul'),
            listWidth = this.items[0].clientWidth * this.items.length,
            transformWidth = list.clientWidth;

        if (!this.actions) {
            this.actions = {
                in: function() { me.stop(); },
                out: function() { me.start(); },
                click: function(e) {
                    var idx = Number(e.target.getAttribute('data-index'));
                    me.goto(idx);
                },

                translateLeft: function() {
                    num++;

                    if (num > 0) {
                        num = 0;
                        return;
                    }

                    me.translate(num);
                    console.log(num);
                },

                translateRight: function() {
                    num--;
                    if (num < -Math.floor(listWidth / transformWidth)) {
                        num = -Math.floor(listWidth / transformWidth);
                        console.log(num);
                        return;
                    }
                    if (num === -Number(listWidth / transformWidth)) {
                        num = -Number(listWidth / transformWidth) + 1;
                        return;
                    }
                    me.translate(num);

                },

                toPrev: function() { me.toPrev(); },
                toNext: function() { me.toNext(); }
            };
        }

        this.items.forEach(function(item) {
            item.addEventListener('mouseover', me.actions.in, false);
            item.addEventListener('mouseout', me.actions.out, false);
        });

        this.dots.forEach(function(item) {
            item.addEventListener('click', me.actions.click, false);
        });

        if (this.options.slider) {
            this.btnPrev.addEventListener('click', me.actions.translateLeft, false);
            this.btnNext.addEventListener('click', me.actions.translateRight, false);
        };

        if (this.options.btn) {
            this.btnPrev.addEventListener('click', me.actions.toPrev, false);
            this.btnNext.addEventListener('click', me.actions.toNext, false);
        }
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

        if (this.options.slider) {
            this.btnPrev.removeEventListener('click', me.actions.translateLeft);
            this.btnNext.removeEventListener('click', me.actions.translateRight);
        };

        if (this.options.slider) {
            this.btnPrev.removeEventListener('click', me.actions.toPrev);
            this.btnNext.removeEventListener('click', me.actions.toNext);
        };

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
