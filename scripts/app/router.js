exports.routes = {
    home: 'showHome'
};

exports.showHome = function() {
    return this.app.show('content', 'home/layout');
};
