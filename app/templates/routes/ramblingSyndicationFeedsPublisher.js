// rambling: RSS2、Atomのフィードを構築

var async = require('async');
var feed = require('feed');
var keystone;
var publisher;

/**
 * RSS2.0フィードを出力
 * @param {*} ks 
 * @param {*} req 
 * @param {*} res 
 */
exports.rss = function(ks, req, res) {
    keystone = ks;
    
    async.series(
        [construct],
        function (err, results) {
            // console.log(publisher.rss2());
            res.set('Content-Type', 'application/xml');
            res.send(publisher.rss2());

        }
    );
}

/**
 * Atomフィードを出力
 * @param {*} ks 
 * @param {*} req 
 * @param {*} res 
 */
exports.atom = function(ks, req, res) {
    keystone = ks;

    async.series(
        [construct],
        function (err, results) {
            // console.log(publisher.atom1());
            res.set('Content-Type', 'application/xml');
            res.send(publisher.atom1());
        }
    );
}

/**
 * フィード生成処理
 * @param {*} next 
 */
var construct = function (next) {

    // フィードオブジェクトを生成して、サイト共通情報を設定
    publisher = new feed.Feed({
        title: keystone.get('ramblingSiteTitle'),
        description: keystone.get('ramblingSiteDescription'),
        id: keystone.get('ramblingBaseUrl'),
        link: keystone.get('ramblingBaseUrl'),
        image: keystone.get('ramblingBaseUrl') + 'images/logo.png',
        favicon: keystone.get('ramblingBaseUrl') + 'favicon.ico',
        copyright: keystone.get('ramblingSiteTitle') + ' All Rights Reserved.',
        language: 'ja',
        feedLinks: {
          rss: keystone.get('ramblingBaseUrl') + 'feed.rss',
          atom: keystone.get('ramblingBaseUrl') + 'feed.atom'
        },
        author: {
          name: keystone.get('ramblingAuthorName'),
        //   email: "johndoe@example.com",
          link: keystone.get('ramblingBaseUrl') + 'gallery'
        },
        hub: keystone.get('ramblingWebSubUrl')
      });


    // 公開中の記事全件を取得するクエリ
    let q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate');

    q.exec(function (err, results) {

        if (err || !results.length) {
            return next(err);
        }

        // クエリで取得した記事の一覧を格納
        let publishedPosts = results;

        // 記事一覧に対して処理をループして、フィード情報を設定
        if (publishedPosts.length !== null && publishedPosts.length > 0) {
            publishedPosts.forEach(function (v, i, a) {

                publisher.addItem({
                    title: v.title,
                    id: keystone.get('ramblingBaseUrl') + 'blog/post/' + v.slug,
                    link: keystone.get('ramblingBaseUrl') + 'blog/post/' + v.slug,
                    description: v.content.brief,
                    content: v.content.brief,
                    date: v.publishedDate,
                    image: v.image.url,
                    author: [{
                        name: keystone.get('ramblingAuthorName'),
                        link: keystone.get('ramblingBaseUrl') + 'gallery'
                    }]
                });

            });
        }
        
        // DBアクセス（非同期処理）終了後にコールバック関数next()を実行。ここで処理が同期される
        next(null);
    });
}