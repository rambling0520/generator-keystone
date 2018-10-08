var keystone = require('keystone');

// rambling: moment.jsを読み込み
var moment = require('moment');

// rambling: 共通のViewコンポーネント初期化用
var ramblingCommonViewInitializer = require('./ramblingCommonViewInitializer');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'html-sitemap';

	// rambling: サイドバー表示対応
	locals.filters = {
		category: req.params.category,

		// rambling: 掲載月で記事を検索するためのパラメータ
		publishedYearMonth: req.params.publishedYearMonth
	};

	// rambling: サイドバー表示対応
	locals.data = {
		// rambling: 絞り込み対象の記事カテゴリに含まれる記事件数の格納変数
		categoryPostCount: 0,
		// rambling: フッターナビゲーション用のカテゴリ格納変数
		ramblingFooterNavCats: [],
		// rambling: 公開日時のdistinct結果格納変数
		ramblingPublishedDates: [],
		// rambling: 新着記事の格納変数
        ramblingNewPostsSb: [],
        
        // rambling: 記事一覧（掲載月絞り込みあり）のリンク格納変数
        ramblingPostListPubMonthPageLinks: [],

        // rambling: 記事一覧（カテゴリ絞り込みあり）のリンク格納変数
        ramblingPostListCategoryPageLinks: {},

        // rambling: 記事ページのリンク格納変数
        ramblingPostPageLinks: {},

        // rambling: ギャラリーページのリンク格納
        ramblingGalleryPageLinks: [],

        // rambling: コンタクトページのリンク格納
        ramblingContactPageLinks: [],

	};

	// rambling: フッターナビゲーションの初期化処理
	ramblingCommonViewInitializer.initFooterNav(view, locals);

	// rambling: 掲載月サイドバーの初期化処理
	if (locals.ramblingIsSidebarPublishedMonthListDisplayed) {
		ramblingCommonViewInitializer.initSidebarPublishedMonthList(view, locals);
	}

	// rambling: 新着記事サイドバーの初期化処理
	if (locals.ramblingIsSidebarNewPostListDisplayed) {
		ramblingCommonViewInitializer.initSidebarNewPostList(view, locals);
	}

	// rambling: Load all categories
	ramblingCommonViewInitializer.loadAllCategories(view, locals);

	// rambling: Load the current category filter
    ramblingCommonViewInitializer.loadCurrentCategoryFilter(view, locals);
    
    // rambling: 記事一覧ページ（掲載月絞り込みあり）のリンク取得
    view.on('init', function (next) {

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
    
                    // リンクを格納用の変数に格納
                    locals.data.ramblingPostListPubMonthPageLinks.push('/blog/pub-ym/' + v);
                    // console.log('ramblingPostListPubMonthPageLinks: ' + locals.data.ramblingPostListPubMonthPageLinks);
    
                });
            }
    
            // DBアクセス（非同期処理）終了後にコールバック関数next()を実行。ここで処理が同期される
            next(null);
    
        });
    });

    // rambling: 記事一覧ページ（カテゴリ絞り込みあり）のリンク取得
    view.on('init', function (next) {

        // カテゴリ全件を取得するクエリ
        let q = keystone.list('PostCategory').model.find().sort('dispSeq');
    
        q.exec(function (err, results) {
    
            if (err || !results.length) {
                return next(err);
            }
    
            let postCategories = results;
    
            if (postCategories.length !== null && postCategories.length > 0) {
                postCategories.forEach(function (v, i, a) {
    
                    // リンクを格納用の変数に格納
                    locals.data.ramblingPostListCategoryPageLinks['/blog/' + v.key] = v.name;
                });
            }
    
            // DBアクセス（非同期処理）終了後にコールバック関数next()を実行。ここで処理が同期される
            next(null);
        });
    });
    
    // rambling: 記事ページのリンク取得
    view.on('init', function (next) {
 
        // 公開中の記事全件を取得するクエリ
        let q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate');
    
        q.exec(function (err, results) {
    
            if (err || !results.length) {
                return next(err);
            }
    
            // クエリで取得した記事の一覧を格納
            let publishedPosts = results;
    
            // 記事一覧に対して処理をループして、設定
            if (publishedPosts.length !== null && publishedPosts.length > 0) {
                publishedPosts.forEach(function (v, i, a) {
    
                    locals.data.ramblingPostPageLinks['/blog/post/' + v.slug] = v.title;
    
                });
            }
    
            // DBアクセス（非同期処理）終了後にコールバック関数next()を実行。ここで処理が同期される
            next(null);
    
        });
    });

    // rambling: ギャラリーページとコンタクトページのリンク取得
    view.on('init', function (next) {

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

                    locals.data.ramblingGalleryPageLinks.push('/gallery');
    
                }
    
                // コンタクト　（ただし存在する場合のみ。最終更新日時は月初日を登録する）
                if (path != null && path.match(/\/contact/) != null) {
                    
                    locals.data.ramblingContactPageLinks.push('/contact');
                }
                
            })
        }
        // DBアクセス（非同期処理）終了後にコールバック関数next()を実行。ここで処理が同期される
        next(null);
    });

	// Render the view
	view.render('rambling-html-sitemap');

};
