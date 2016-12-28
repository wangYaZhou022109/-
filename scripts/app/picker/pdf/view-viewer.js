var progressBar;

exports.bindings = {
    state: false
};

exports.components = [function() {
    var me = this,
        state = me.bindings.state.data;
    return {
        id: 'viewPdf',
        name: 'pdf',
        options: {
            url: state.pdfUrl,
            pageNum: state.pageNum,
            scale: state.scale,
            callback: function(data) {
                progressBar(me, data);
            }
        }
    };
}];


exports.afterRender = function() {
    var pdf = this.components.viewPdf;
    this.module.dispatch('updatePage', {
        pageCount: pdf.numPages,
        pageNum: pdf.pageNum
    });
};

progressBar = function(view, loadNum) {
    var loadingText = loadNum + '%',
        loadLabel = view.$('progressLabel'),
        loadProgress = view.$('progress');
    if (loadNum < 100) {
        loadLabel.innerText = loadingText;
        loadProgress.style.width = loadingText;
    } else {
        loadLabel.style.display = 'none';
        loadProgress.style.display = 'none';
    }
};
