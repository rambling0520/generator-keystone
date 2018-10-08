// rambling: node-cacheのプロバイダを定義

let nodeCache = require('node-cache');
let cache = null;

exports.start = function(done) {
    if (cache) return done();

    // mongooseで取得したオブジェクトがmutableであるため、cloneするとエラーになる
    // よって、useClonesオプションをfalseに設定
    cache = new nodeCache({ useClones: false });
}

exports.instance = function() {
    return cache;
}
