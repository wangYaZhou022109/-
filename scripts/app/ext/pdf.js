var D = require('drizzlejs'),
    pdf = require('pdfjs-dist/build/pdf'),
    renderPage;

D.ComponentManager.register('pdf', function(view, el, options) {
    var opt = options || {},
        url = opt.url,
        pageNum = opt.pageNum || 1,
        scale = opt.scale || 1,
        pdfApplication,
        pdfWorkerPath = '/* @echo PDF_WORKER */';

    // @ifndef PDF_WORKER
    pdfWorkerPath = 'node_modules/pdfjs-dist/build/pdf.worker.js';
    pdf.PDFJS.workerSrc = pdfWorkerPath;
    // @endif

    // 获得PDF文件
    pdfApplication = pdf.getDocument(url);

    // 加载进度处理
    pdfApplication.onProgress = function(progressData) {
        var progressNum = (Number(progressData.loaded) / Number(progressData.total)) * 100;
        if (opt.callback) {
            opt.callback.call(this, window.parseInt(progressNum));
        }
    };

    // 渲染到面板
    return pdfApplication.then(function(pdfjs) {
        var callbackOptions = renderPage(pdfjs, el, pageNum, scale);
        D.assign(callbackOptions, {
            reset: function(params) {
                renderPage(pdfjs, el, params.pageNum, params.scale);
            }
        });
        return callbackOptions;
    });
}, function(view, comp) {
    comp;
});

renderPage = function(pdfjs, el, pageNum, scale) {
    var pdfViewer = pdfjs;
    pdfViewer.getPage(pageNum).then(function(page) {
        var viewport = page.getViewport(scale),
            canvas = el,
            context = canvas.getContext('2d'),
            renderContext = {
                canvasContext: context,
                viewport: viewport
            };
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render(renderContext);
    });
    pdfViewer.pageNum = pageNum;
    return pdfViewer;
};
