// rambling: WebSubへのフィードを実施

var CronJob = require('cron').CronJob;
var async = require('async');
var request = require('request');
var moment = require('moment');

var log4js = require('log4js');
var logger = log4js.getLogger('out');

let ramblingCacheProvider = require('./ramblingCacheProvider');
const RAMBLING_WEBSUB_PUBLISHER_CACHE_DURATION = 3600;

let keystone;

/**
 * 
 * @param {*} ks 
 */
exports.startCronJob = function (ks) {
    keystone = ks

    // ジョブの定義
    var publishWebSubJob = new CronJob({
        // 20分おきに実行される
        cronTime: '0 */20 * * * *',
        // 引数なしの関数オブジェクトである必要あり
        onTick: postWebSub,
        start: false,
        timeZone: 'Asia/Tokyo'
    });

    // 定義したジョブの実行
    publishWebSubJob.start();

}

/**
 */
var postWebSub = function () {

    logger.info('WebSub送信ジョブが起動しました');

    // 公開中の記事全件を取得するクエリ
    let q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate');

    // 公開中の記事を取得
    q.exec(function (err, results) {

        if (err || !results.length) {
            return err;
        }

        // クエリで取得した記事の一覧を格納
        let publishedPosts = results;

        // 最新記事の最終更新日時を格納する変数
        let latestPostPublishedDate = null;

        if (publishedPosts.length !== null && publishedPosts.length > 0) {
            latestPostPublishedDate = moment(publishedPosts[0].publishedDate);
        }

        // 最終更新日時が取得できた場合
        if (latestPostPublishedDate != null) {

            // 前回実行時に得た最終更新日時をキャッシュから取得する

            // rambling: キャッシュのキー
            const CACHE_KEY = "RAMBLING_WEBSUB_PUBLISHED_DATE";

            // rambling: キャッシュに問い合わせしてキャッシュがあれば利用する
            ramblingCacheProvider.instance().get(CACHE_KEY, function (errGetCache, cachedVal) {

                if (errGetCache) console.error(errGetCache);

                if (!errGetCache) {

                    // WebSubの送信要否の制御用フラグ
                    let isPublishNeed = false;

                    if (cachedVal == undefined) {
                        // キャッシュに値がない場合
                        // console.log('cachedValue is undefined.');

                        // WebSubの送信フラグを「必要」に変更
                        isPublishNeed = true;

                    } else {
                        // キャッシュに値がある場合
                        // console.log('chachedValue is defined.')
                        // console.log(cachedVal);

                        // キャッシュの値と今回取得した最終更新日時を比較
                        if (latestPostPublishedDate.isAfter(cachedVal)) {
                            // 最終更新日時が新しくなっていれば、WebSubの送信フラグを「必要」に変更
                            isPublishNeed = true;
                        }
                    }

                    // WebSubの送信を行う場合、キャッシュの最終更新日時を更新して、WebSubを送信
                    if (isPublishNeed) {
                        ramblingCacheProvider.instance().set(
                            CACHE_KEY, latestPostPublishedDate,
                            RAMBLING_WEBSUB_PUBLISHER_CACHE_DURATION,
                            function (errSetCache, successSetCache) {
                                // console.log('result is being cached.');

                                if (!errSetCache & successSetCache) {
                                    // console.log(successSetCache);

                                    // WebSubサーバーにPostする
                                    var webSubPostUrl = keystone.get('ramblingWebSubUrl');

                                    async.each([webSubPostUrl], function (url, next) {
                                        httpRequestSuccessful(url, next);
                                    });

                                } else {
                                    // console.error(errSetCache);
                                }
                            });
                    }
                }
            })

        }
    })
}

/**
 * 
 * @param {String} url 
 * @param {function} next 
 */
function httpRequestSuccessful(url, next) {

    // Post送信のパラメータを設定
    let params = [];
    params['hub.mode'] = 'publish';
    params['hub.url'] = keystone.get('ramblingBaseUrl') + 'feed.atom';

    // WebSubサーバーにPost送信
    request.post({url, form: params},function (error, response, body) {
        if (error) {
            next(error);
        } else if (response.statusCode != 204) {
            logger.info('URL ' + url + ' gave status code ' + response.statusCode);
            next(Error("URL " + url + " gave status code " + response.statusCode));
        } else {
            // ステータスコード204が返れば成功
            logger.info('URL ' + url + ' へWebSubがPostされました');
            next();
        }
    });
}