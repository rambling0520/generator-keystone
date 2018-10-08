// rambling: XmlSitemap構築用のファンクションを定義

var sitemap = require('express-sitemap');
var moment = require('moment');
var async = require('async');

// 各ページについてサイトマップ用の情報を格納する変数
// pageUrlはドメインを除き「/」から記載
var map = {};
var route = {};
var keystone;

/**
  * Initialize parsing of declared Express routes into sitemap.xml
  * @param keystone {object}		the keystone object created by application initialization
  * @param req {object}		express request object from sitemap.xml route handler function
  * @param res {object}		express response object from sitemap.xml route handler function
  */
exports.buildXmlSitemap = function (ks, req, res, opt) {

    keystone = ks;

    // console.log('start: buildXmlSitemap()');

    // ★作り上、一覧の絞り込みパターンが増えると要改修

    // map、routeに格納した情報から、express-sitemapを使ってサイトマップXMLを生成
    // 全ての非同期DBアクセス処理が完了してからXmlSitemapを書き出しする
    // （でなければサイトマップに含まれないページが発生する）
    async.parallel(
        [addGalleryAndContactPage,
            addPostAndTopAndPostListPage,
            addPostListCategoryPage,
            addPostListPubMonthPage],
        function (err, results) {
            createXmlFile(map, route, req, res)
        }
    );
}


/**
 * レスポンスとしてXMLを出力
 * @param {*} map 
 * @param {*} route 
 * @param {*} req 
 * @param {*} res 
 */
var createXmlFile = function (map, route, req, res) {

    // console.log('start: createXmlFile()');
    // console.log('map:' + map);
    // console.log('route:' + route);

    sitemap({
        map, route,
        url: req.hostname,
        http: req.get('x-forwarded-proto') || req.protocol
    }).XMLtoWeb(res);
}

/**
 * 記事一覧（掲載月の絞り込みありの場合） 
 * @param {function} next 
 */
var addPostListPubMonthPage = function (next) {

    // 記事の掲載月を取得するクエリ
    let q = keystone.list('Post').model.distinct('publishedDate').where('state', 'published');

    q.exec(function (err, results) {

        if (err || !results.length) {
            return next(err);
        }

        // 重複を省いて公開月を格納するためのSetオブジェクト
        let publishedYearMonthSet = new Set();

        // moment.jsを使って公開月にフォーマット変換。Setオブジェクトに格納
        results.forEach(function (value) {
            let publishedYearMonth = moment(value).format("YYYYMM");
            publishedYearMonthSet.add(publishedYearMonth);
        });

        // Setオブジェクトを配列に変換して逆順ソートした上でローカル変数に格納
        let publishedYearMonthArray = Array.from(publishedYearMonthSet).sort((a, b) => { return (b - a); });

        if (publishedYearMonthArray.length !== null && publishedYearMonthArray.length > 0) {
            publishedYearMonthArray.forEach(function (v, i, a) {

                map['/blog/pub-ym/' + v] = ['get'];
                route['/blog/pub-ym/' + v] = {
                    // lastmod: ,
                    priority: 0.8,
                    changefreq: 'always',
                };

            });
        }

        // DBアクセス（非同期処理）終了後にコールバック関数next()を実行。ここで処理が同期される
        next(null);

    });
}

/**
 * 記事一覧（カテゴリ絞り込みありの場合） 
 * @param {function} next 
 */
var addPostListCategoryPage = function (next) {

    // カテゴリ全件を取得するクエリ
    let q = keystone.list('PostCategory').model.find();

    q.exec(function (err, results) {

        if (err || !results.length) {
            return next(err);
        }

        let postCategories = results;

        if (postCategories.length !== null && postCategories.length > 0) {
            postCategories.forEach(function (v, i, a) {

                map['/blog/' + v.key] = ['get'];
                route['/blog/' + v.key] = {
                    // lastmod: ,
                    priority: 0.8,
                    changefreq: 'always',
                };

            });
        }

        // DBアクセス（非同期処理）終了後にコールバック関数next()を実行。ここで処理が同期される
        next(null);

    });
}

/**
 * 記事ページ、トップページ、記事一覧ページ（絞り込みなし）を設定
 * トップと記事一覧は最新の記事ページの最終更新日時に合わせる
 * @param {function} next 
 */
var addPostAndTopAndPostListPage = function (next) {

    // console.log('start: addPostAndTopAndPostListPage()');

    // 公開中の記事全件を取得するクエリ
    let q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate');

    q.exec(function (err, results) {

        if (err || !results.length) {
            return next(err);
        }

        // クエリで取得した記事の一覧を格納
        let publishedPosts = results;

        // トップページなどのために最新記事の最終更新日時を格納する変数
        let latestPostPublishedDate = null;

        // 記事一覧に対して処理をループして、noindex設定されていない記事ページをサイトマップに設定
        if (publishedPosts.length !== null && publishedPosts.length > 0) {
            publishedPosts.forEach(function (v, i, a) {

                // 配列のindexが0の場合（最新の記事の場合）、公開時間を変数に格納しておく
                if (i == 0) {
                    // console.log(moment(v.publishedDate).utc().format());
                    latestPostPublishedDate = moment(v.publishedDate).utc().format();
                }

                // noindex設定を確認してから設定
                if (v.meta.robots == 'index') {
                    map['/blog/post/' + v.slug] = ['get'];
                    route['/blog/post/' + v.slug] = {
                        lastmod: moment(v.publishedDate).utc().format(),
                        priority: 0.8,
                        changefreq: 'weekly',
                    };
                }

            });
        }


        // トップページ（最終更新日時は記事ページの最新記事に合わせる）
        map['/'] = ['get'];
        route['/'] = {
            lastmod: latestPostPublishedDate,
            priority: 1.0,
            changefreq: 'always',
        };

        // 記事一覧ページ（絞り込みなし。最終更新日時は記事ページの最新記事に合わせる）
        map['/blog'] = ['get'];
        route['/blog'] = {
            lastmod: latestPostPublishedDate,
            priority: 1.0,
            changefreq: 'always',
        };

        // DBアクセス（非同期処理）終了後にコールバック関数next()を実行。ここで処理が同期される
        next(null);

    });
}

/**
 * ギャラリーページとコンタクトページを設定（それぞれ存在している場合のみ）
 * @param {function} next 
 */
var addGalleryAndContactPage = function (next) {

    // console.log('start: addGalleryAndContactPage()');

    // keystoneのルートオブジェクトリストを取得する
    // express 4.x.x: keystone.app._router.stack
    // express 3.x.x: keystone.app.routes.get
    var routes = keystone.app._router.stack || keystone.app.routes.get;
    if (routes && routes.length > 0) {
        routes.forEach(function (v, i) {
            // express 4.x.x では、ルートオブジェクトはpathプロパティを持つ
            // express 3.x.x では、ルートオブジェクトはroute.pathプロパティを持つ
            var path = v.path ? v.path : (v.route ? v.route.path : null);
            // console.log('path:' + path);

            // ギャラリー （ただし存在する場合のみ）
            if (path != null && path.match(/\/gallery/) != null) {
                // console.log('gallery:' + path);

                // 最新のギャラリー記事を取得して最終更新日時の設定に用いる
                let q = keystone.list('Gallery').model.find().sort('-publishedDate').limit(1);
                q.exec(function (err, results) {

                    if (err || !results.length) {
                        return next(err);
                    }

                    let latestGalleryPosts = results;
                    let latestGalleryPostPublishedDate = null;

                    if (latestGalleryPosts.length !== null && latestGalleryPosts.length == 1) {
                        // console.log(moment(latestGalleryPosts[0].publishedDate).utc().format());
                        latestGalleryPostPublishedDate = moment(latestGalleryPosts[0].publishedDate).utc().format();
                    }

                    // sitemapのプロパティを設定
                    map['/gallery'] = ['get'];
                    route['/gallery'] = {
                        lastmod: latestGalleryPostPublishedDate,
                        priority: 0.8,
                        changefreq: 'monthly',
                    };

                    // DBアクセス（非同期処理）終了後にコールバック関数next()を実行。ここで処理が同期される
                    next(null);

                });
            }

            // コンタクト　（ただし存在する場合のみ。最終更新日時は月初日を登録する）
            if (path != null && path.match(/\/contact/) != null) {
                // console.log('contact:' + path);
                map['/contact'] = ['get'];
                route['/contact'] = {
                    lastmod: moment().date(1).hour(21).minute(30).second(45).utc().format(),
                    priority: 0.3,
                    changefreq: 'monthly',
                };
            }

            // プライバシーポリシー
            map['/privacy-policy'] = ['get'];
            route['/privacy-policy'] = {
                lastmod: moment().date(1).hour(21).minute(30).second(45).utc().format(),
                priority: 0.3,
                changefreq: 'monthly',
            };

            // HTMLサイトマップ
            map['/html-sitemap'] = ['get'];
            route['/html-sitemap'] = {
                lastmod: moment().date(1).hour(21).minute(30).second(45).utc().format(),
                priority: 0.3,
                changefreq: 'always',
            };
        })
    }
}

