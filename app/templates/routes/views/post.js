var keystone = require('keystone');

// rambling: moment.jsを読み込み
var moment = require('moment');

// rambling: 共通のViewコンポーネント初期化用
var ramblingCommonViewInitializer = require('./ramblingCommonViewInitializer');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,

		// rambling: サイドバー表示対応
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
		// rambling: 記事ページであることを判定するための変数
		ramblingIsPostPage: true,
		// rambling: AMPページであることを判定するための変数
		ramblingIsAmpPage: false,
	};

	// rambling: URLをチェックしてAMPページであることを判定する
	if (req.path.indexOf('/amp/') > -1) {
		locals.data.ramblingIsAmpPage = true;
	}

	// rambling: 一覧ページへ戻るために遷移元のページURL（リファラ）を取得。遷移元が記事一覧ページでない場合は格納しない
	let ramblingReferrer = req.header('Referrer');
	if (ramblingReferrer !== null && ramblingReferrer !== '' && ramblingReferrer !== void 0) {
		if (ramblingReferrer.indexOf('/blog') > -1 && ramblingReferrer.indexOf('/post') == -1) {
			locals.ramblingPostListReferrer = '/' + ramblingReferrer.replace(locals.ramblingBaseUrl, '');
		}
	}

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

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.post = result;
			next(err);
		});

	});

	// Load other posts
	view.on('init', function (next) {

		// 記事とカテゴリの存在確認
		if (locals.data.post !== null && locals.data.post !== void 0 &&
			locals.data.post.categories !== null && locals.data.post.categories !== void 0) {

			// rambling: 表示件数の設定
			var postNum = locals.ramblingNumPostNewPostList;

			// rambling: 同一カテゴリから重複を除外して新着記事を取得。カテゴリが複数設定されている場合、いずれかのカテゴリに含まれる記事を取得する

			// カテゴリを格納する配列
			let catIds = [];
			for (let v of locals.data.post.categories) {
				catIds.push(v.id);
			}

			var q = keystone.list('Post').model.find().where('state', 'published').where({ 'categories': { $in: catIds } }).where('slug', { '$ne': locals.data.post.slug }).sort('-publishedDate').populate('author categories').limit(postNum);

			q.exec(function (err, results) {
				locals.data.posts = results;
				next(err);
			});
		} else if (locals.data.post !== null && locals.data.post !== void 0) {
			// 記事は存在し、カテゴリがない場合は記事を表示する
			next();
		} else {
			// 記事もカテゴリも存在しない場合は404を返す
			// ようにしたいが、現状では方法がないらしく、200で返ってしまう。
			// return res.status(404).send(keystone.wrapHTMLError('Sorry, no page could be found at this address (404)'));
			next();
		}

	});

	// Render the view
	if(locals.data.ramblingIsAmpPage) {
		view.render('rambling-post-amp');
	} else {
		view.render('post');
	}
};
