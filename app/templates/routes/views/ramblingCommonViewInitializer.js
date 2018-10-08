// rambling: viewの共通コンポーネントの初期化処理

var keystone = require('keystone');
var async = require('async');

// rambling: moment.jsを読み込み
var moment = require('moment');

// rambling: サイドバー用クエリのキャッシュ設定(キャッシュの更新時間は600秒=10分)
let ramblingCacheProvider = require('../ramblingCacheProvider');
const RAMBLING_SIDEBAR_CACHE_DURATION = 3600;


// rambling: フッターナビゲーション用のカテゴリ取得処理
exports.initFooterNav = function (view, locals) {

    // rambling: フッターナビゲーション用のカテゴリを取得
    view.on('init', function (next) {

        // rambling: footerNavがdisplayedのカテゴリのみを取得。表示順序でソート
        var q = keystone.list('PostCategory').model.find().where('footerNav', 'displayed').sort('dispSeq');

        // rambling: キャッシュのキー
        const CACHE_KEY = "RAMBLING_FOOTER_NAV";

        // rambling: キャッシュに問い合わせしてキャッシュがあれば利用する
        ramblingCacheProvider.instance().get(CACHE_KEY, function (errGetCache, cachedVal) {

            if (errGetCache) console.error(errGetCache);

            if (!errGetCache) {
                if (cachedVal == undefined) {
                    // console.log('cachedValue is undefined. Executing query.');
                    q.exec(function (errQuery, result) {

                        // console.log('query is executed.');
                        // console.log(result);

                        // cacheに格納
                        ramblingCacheProvider.instance().set(CACHE_KEY, result, RAMBLING_SIDEBAR_CACHE_DURATION, function (errSetCache, successSetCache) {
                            // console.log('result is being cached.');

                            if (!errSetCache & successSetCache) {
                                // console.log(successSetCache);								
                            } else {
                                // console.error(errSetCache);
                            }
                        });

                        // View用のローカル変数に格納
                        locals.data.ramblingFooterNavCats = result;
                    });
                } else {
                    // console.log('chachedValue is defined.')
                    // console.log(cachedVal);
                    locals.data.ramblingFooterNavCats = cachedVal;
                }
            }
            // 処理完了を同期
            next();
        })
    });

}


// rambling: 掲載月サイドバー用の公開日時のdistinct結果取得処理
exports.initSidebarPublishedMonthList = function (view, locals) {
    view.on('init', function (next) {

        // rambling: footerNavがdisplayedのカテゴリのみを取得
        var q = keystone.list('Post').model.distinct('publishedDate').where('state', 'published');

        // rambling: キャッシュのキー
        const CACHE_KEY = "RAMBLING_SIDEBAR_PUBLISHED_YEAR_MONTH";

        // rambling: キャッシュに問い合わせしてキャッシュがあれば利用する
        ramblingCacheProvider.instance().get(CACHE_KEY, function (errGetCache, cachedVal) {

            if (errGetCache) console.error(errGetCache);

            if (!errGetCache) {
                if (cachedVal == undefined) {
                    // console.log('cachedValue is undefined. Executing query.');
                    q.exec(function (errQuery, result) {

                        // console.log('query is executed.');
                        // console.log(result);

                        // 重複を省いて公開月を格納するためのSetオブジェクト
                        var publishedYearMonthSet = new Set();

                        // moment.jsを使って公開月にフォーマット変換。Setオブジェクトに格納
                        result.forEach(function (value) {
                            var publishedYearMonth = moment(value).format("YYYY年MM月");
                            publishedYearMonthSet.add(publishedYearMonth);
                        });

                        // Setオブジェクトを配列に変換して逆順ソートした上でローカル変数に格納
                        var publishedYearMonthArray = Array.from(publishedYearMonthSet).sort((a, b) => { return (b - a); });
                        // console.log(locals.data.ramblingPublishedDates);

                        // cacheに格納
                        ramblingCacheProvider.instance().set(CACHE_KEY, publishedYearMonthArray, RAMBLING_SIDEBAR_CACHE_DURATION, function (errSetCache, successSetCache) {
                            // console.log('result is being cached.');

                            if (!errSetCache & successSetCache) {
                                // console.log(successSetCache);								
                            } else {
                                // console.error(errSetCache);
                            }
                        });

                        // View用のローカル変数に格納
                        locals.data.ramblingPublishedDates = publishedYearMonthArray;
                    });
                } else {
                    // console.log('chachedValue is defined.')
                    // console.log(cachedVal);
                    locals.data.ramblingPublishedDates = cachedVal;
                }
            }
            // 処理完了を同期
            next();
        })
    });

}



// rambling: 新着記事サイドバー用の新着記事取得処理
exports.initSidebarNewPostList = function (view, locals) {

    view.on('init', function (next) {

        // rambling: 取得する新着記事数を設定
        var newPostsNum = locals.ramblingNumSidebarNewPostList;

        // rambling: 新着記事を指定の数だけ取得
        var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit(newPostsNum);

        // rambling: キャッシュのキー
        const CACHE_KEY = "RAMBLING_SIDEBAR_NEW_POSTS";

        // rambling: キャッシュに問い合わせしてキャッシュがあれば利用する
        ramblingCacheProvider.instance().get(CACHE_KEY, function (errGetCache, cachedVal) {

            if (errGetCache) console.error(errGetCache);

            if (!errGetCache) {
                if (cachedVal == undefined) {
                    // console.log('cachedValue is undefined. Executing query.');
                    q.exec(function (errQuery, result) {

                        // console.log('query is executed.');
                        // console.log(result);

                        // cacheに格納
                        ramblingCacheProvider.instance().set(CACHE_KEY, result, RAMBLING_SIDEBAR_CACHE_DURATION, function (errSetCache, successSetCache) {
                            // console.log('result is being cached.');

                            if (!errSetCache & successSetCache) {
                                // console.log(successSetCache);								
                            } else {
                                // console.error(errSetCache);
                            }
                        });

                        // View用のローカル変数に格納
                        locals.data.ramblingNewPostsSb = result;
                    });
                } else {
                    // console.log('chachedValue is defined.')
                    // console.log(cachedVal);
                    locals.data.ramblingNewPostsSb = cachedVal;
                }
            }
            // 処理完了を同期
            next();
        })
    });
}


// Load all categories
exports.loadAllCategories = function (view, locals) {

    view.on('init', function (next) {

        // rambling: 表示順序でソートして取得
        keystone.list('PostCategory').model.find().sort('dispSeq').exec(function (err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.categories = results;

            /* rambling: 不要と思われる処理なのでコメントアウト
            // Load the counts for each category
            async.each(locals.data.categories, function (category, next) {
    
                keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
                    category.postCount = count;
                    next(err);
                });
    
            }, function (err) {
                next(err);
            });
            */
            next(err);
        });
    });
}

// Load the current category filter
exports.loadCurrentCategoryFilter = function (view, locals) {

    view.on('init', function (next) {

        if (locals.filters.category) {
            keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
                locals.data.category = result;

                if (err || !result) {
                    next(err);

                } else {
                    // rambling: カテゴリ内の公開中の記事件数を取得する
                    keystone.list('Post').model.count().where('categories').in([locals.data.category.id]).where('state', 'published').exec(function (err, count) {
                        locals.data.categoryPostCount = count;
                        next(err);
                    });
                }
            });
        } else {
            next();
        }
    });
}