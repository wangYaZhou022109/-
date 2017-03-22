var D = require('drizzlejs'),
    ModalRegion,
    animates,
    zIndex = 1000;

animates = {
    modal: { IN: 'flipInY', OUT: 'flipOutY' },
    popup: { IN: 'fadeInRightBig', OUT: 'bounceOutRight' },
    ground: { IN: 'slideInUp', OUT: 'slideOutDown' }
};
/* eslint-disable no-underscore-dangle */
ModalRegion = function() {
    ModalRegion.__super__.constructor.apply(this, arguments);

    this.depth = 0;
    this.overlay = document.createElement('div');
    this.overlay.className = 'dialog-overlay hidden';
    this._el.appendChild(this.overlay);
};

D.extend(ModalRegion, D.MultiRegion, {
    push: function(renderable, options, type) {
        this.depth ++;
        this.style = type;
        if (renderable.options.large) this.style += ' large';
        if (renderable.options.small) this.style += ' small';
        if (renderable.options.auto) this.style += ' auto';
        this._moveOverlay();

        return this.show('main/modal', {
            key: this.depth + '',
            options: D.assign({ animation: animates[type] }, options, { view: renderable })
        });
    },

    pop: function() {
        var key = this.depth + '';
        delete this.style;
        this.depth --;
        this._moveOverlay();

        return this.chain(this._items[key]._close(), function() {
            delete this._items[key];
            delete this._elements[key];
        });
    },

    _moveOverlay: function() {
        var zidx = this._zIndex();
        this.overlay.className = 'dialog-overlay' + (zidx === zIndex ? ' hidden' : '');
        this.overlay.setAttribute('style', 'z-index:' + (zidx - 1));
    },

    _zIndex: function() {
        return zIndex + (this.depth * 5);
    },

    _createElement: function() {
        var el = ModalRegion.__super__._createElement.apply(this, arguments);
        el.className = this.style;
        el.setAttribute('style', 'z-index:' + this._zIndex());
        return el;
    }
});
/* eslint-enable no-underscore-dangle */

D.registerRegion('modal', ModalRegion);
