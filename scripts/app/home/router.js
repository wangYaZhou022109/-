exports.routes = {
    'more/layout/:configId': 'showHomeMore',
    'error-page/:code': 'showErrorPage'
};

exports.showHomeMore = function(configId) {
    // document.cookie = 'moduleConfigId=' + configId;
    return this.app.show('content', 'home/default/more/layout', { moduleConfigId: configId, forceRender: true });
};

exports.showErrorPage = function(code) {
    return this.app.show('content', 'home/error-page', { code: code });
};

