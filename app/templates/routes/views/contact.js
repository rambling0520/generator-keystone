var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

// rambling: moment.jsを読み込み
var moment = require('moment');

// rambling: HTMLサニタイジング用
var ramblingHtmlSanitizer = require('../ramblingHtmlSanitizer');

// rambling: 共通のViewコンポーネント初期化用
var ramblingCommonViewInitializer = require('./ramblingCommonViewInitializer');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// rambling: サイドバー表示対応
	locals.filters = {
		category: req.params.category,

		// rambling: 掲載月で記事を検索するためのパラメータ
		publishedYearMonth: req.params.publishedYearMonth
	};

	// rambling: サイドバー表示対応
	locals.data = {
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

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		// rambling: HTMLのサニタイズを行う
		if (req.body['name.full'] !== null && req.body['name.full'] !== "" && req.body['name.full'] !== void 0) {
			// console.log('before: ' + req.body['name.full']);
			req.body['name.full'] = ramblingHtmlSanitizer.escapeHTML(req.body['name.full']);
			// console.log('after: ' + req.body['name.full']);
		}

		if (req.body.email !== null && req.body.email !== "" && req.body.email !== void 0) {
			// console.log('before: ' + req.body.email);
			req.body.email = ramblingHtmlSanitizer.escapeHTML(req.body.email);
			// console.log('after: ' + req.body.email);
		}

		if (req.body.phone !== null && req.body.phone !== "" && req.body.phone !== void 0) {
			// console.log('before: ' + req.body.phone);
			req.body.phone = ramblingHtmlSanitizer.escapeHTML(req.body.phone);
			// console.log('after: ' + req.body.phone);
		}

		if (req.body.enquiryType !== null && req.body.enquiryType !== "" && req.body.enquiryType !== void 0) {
			// console.log('before: ' + req.body.enquiryType);
			req.body.enquiryType = ramblingHtmlSanitizer.escapeHTML(req.body.enquiryType);
			// console.log('after: ' + req.body.enquiryType);
		}

		if (req.body.message !== null && req.body.message !== "" && req.body.message !== void 0) {
			// console.log('before: ' + req.body.message);
			req.body.message = ramblingHtmlSanitizer.escapeHTML(req.body.message);
			// console.log('after: ' + req.body.message);
		}
		// rambling: サニタイズここまで

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('contact');
};
