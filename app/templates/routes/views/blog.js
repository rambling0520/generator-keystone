var keystone = require('keystone');
var async = require('async');

// rambling: moment.jsを読み込み
var moment = require('moment');

// rambling: 共通のViewコンポーネント初期化用
var ramblingCommonViewInitializer = require('./ramblingCommonViewInitializer');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category,

		// rambling: 掲載月で記事を検索するためのパラメータ
		publishedYearMonth: req.params.publishedYearMonth
	};
	locals.data = {
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
		// rambling: 記事一覧であることを判定するための変数
		ramblingIsPostListPage: true,
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

	// Load the posts
	view.on('init', function (next) {

		var q = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			// rambling: カテゴリを考慮したページネーションへ変更（filter内に条件を記載）
			// q.where('categories').in([locals.data.category]);
			q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10,
				filters: {
					state: 'published',
					categories: {$in:[locals.data.category]}
				},
			})
				.sort('-publishedDate')
				.populate('author categories');
		}

		// rambling: 掲載月でフィルターして記事を取得する
		if (locals.filters.publishedYearMonth) {
			var date = moment(locals.filters.publishedYearMonth, "YYYYMM");
			var startDateFilter = date.utcOffset('+0900').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
			var endDateFilter = date.add("month", 1).utcOffset('+0900').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
			// console.log(startDateFilter);
			// console.log(endDateFilter);

			// rambling: 掲載月を考慮したページネーションへ変更（filter内に条件を記載）
			// q.where('publishedDate', {
			// 	$gte: startDateFilter,
			// 	$lt: endDateFilter
			// })

			q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10,
				filters: {
					state: 'published',
					publishedDate: {$gte:startDateFilter, $lt: endDateFilter}
				},
			})
				.sort('-publishedDate')
				.populate('author categories');
			
		}

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('blog');
};
