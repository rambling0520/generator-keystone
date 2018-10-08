var keystone = require('keystone');

// rambling: moment.jsを読み込み
var moment = require('moment');

// rambling: 共通のViewコンポーネント初期化用
var ramblingCommonViewInitializer = require('./ramblingCommonViewInitializer');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// rambling: サイドバー表示対応
	locals.filters = {
		category: req.params.category,

		// rambling: 掲載月で記事を検索するためのパラメータ
		publishedYearMonth: req.params.publishedYearMonth
	};

	// rambling: サイドバー表示対応
	locals.data = {
		//rambling: 表示する記事を格納する変数
		posts: [],
		categories: [],
		// rambling: 絞り込み対象の記事カテゴリに含まれる記事件数の格納変数
		categoryPostCount: 0,
		// rambling: フッターナビゲーション用のカテゴリ格納変数
		ramblingFooterNavCats: [],
		// rambling: 公開日時のdistinct結果格納変数
		ramblingPublishedDates: [],
		// rambling: 新着記事の格納変数
		ramblingNewPostsSb: [],
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

	// rambling: 表示する記事を取得
	view.on('init', function (next) {
		var postNum = locals.ramblingNumTopNewPostList;
		
		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit(postNum);

		q.exec(function (err, results) {
			// rambling: 最新の記事を格納
			locals.data.post = results[0];
			
			// rambling: 最新の記事を削除してから格納
			results.shift();
			locals.data.posts = results;

			next(err);
		});

	});


	// Render the view
	view.render('index');
};
