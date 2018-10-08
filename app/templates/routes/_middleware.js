<% if (includeGuideComments) { %>/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
<% } %>var _ = require('lodash');

// rambling: keystoneをインポート
var keystone = require('keystone');

// rambling: json-ld 構築用のモジュールをインポート
var ramblingJsonLd = require('./ramblingJsonLd');

// rambling: 目次構築用のモジュールをインポート
var ramblingPostTOC = require('./ramblingPostTOC');

// rambling: サムネイル付きリンク生成用のモジュールをインポート
var ramblingPostThumbnailLinks = require('./ramblingPostThumbnailLinks');

// rambling: サムネイル付きリンク生成用のモジュールをインポート
var ramblingPostThumbnailLinksAMP = require('./ramblingPostThumbnailLinksAMP');

/**
	Initialises the standard view locals<% if (includeGuideComments) { %>

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.<% } %>
*/
exports.initLocals = function (req, res, next) {
	//rambling: ヘッダーリンクのラベルを変更
	res.locals.navLinks = [
		{ label: 'ホーム', key: 'home', href: '/' },
		{ label: '記事一覧', key: 'blog', href: '/blog' },
		{ label: 'サイトプロフィール', key: 'gallery', href: '/gallery' },
		// rambling: 問い合わせページの利用有無によってヘッダーリンクを制御
		<% if (includeEnquiries) { %>
		{ label: '問い合わせ', key: 'contact', href: '/contact' },
		<% } %>
		// rambling: プライバシーポリシーページへのリンクを追加
		{ label: 'プライバシーポリシー', key: 'privacy-policy', href: '/privacy-policy' },
	];
	res.locals.user = req.user;

	// rambling: set profiles to response.locals
	res.locals.ramblingBaseUrl = keystone.get('ramblingBaseUrl');
	res.locals.ramblingSiteTitle = keystone.get('ramblingSiteTitle');
	res.locals.ramblingSiteKeywords = keystone.get('ramblingSiteKeywords');
	res.locals.ramblingSiteTitleSeparator = keystone.get('ramblingSiteTitleSeparator');
	res.locals.ramblingSiteDescription = keystone.get('ramblingSiteDescription');
	res.locals.ramblingSiteThemeText = keystone.get('ramblingSiteThemeText');
	res.locals.ramblingEnv = keystone.get('env');
	res.locals.ramblingDateFormat = keystone.get('ramblingDateFormat');
	res.locals.ramblingAuthorName = keystone.get('ramblingAuthorName');
	res.locals.ramblingAuthorImageUrl = keystone.get('ramblingAuthorImageUrl');
	res.locals.ramblingRevision = keystone.get('ramblingRevision');

	// rambling: Google Analytics、Google AdSenseの設定
	res.locals.ramblingIsGaEnabled = keystone.get('ramblingIsGaEnabled');
	res.locals.ramblingIsAdsenseEnabled = keystone.get('ramblingIsAdsenseEnabled');

	// rambling: json-ld 構築用のファンクション
	res.locals.ramblingBuildJsonLdOfHome = ramblingJsonLd.buildJsonLdOfHome;
	res.locals.ramblingBuildJsonLdOfPost = ramblingJsonLd.buildJsonLdOfPost;
	res.locals.ramblingBuildJsonLdOfPostList = ramblingJsonLd.buildJsonLdOfPostList;
	res.locals.ramblingBuildJsonLdOfGallery = ramblingJsonLd.buildJsonLdOfGallery;
	res.locals.ramblingBuildJsonLdOfContact = ramblingJsonLd.buildJsonLdOfContact;

	// rambling: 目次構築用のファンクション
	res.locals.ramblingBuildPostTableOfContents = ramblingPostTOC.buildPostTableOfContents;

	// rambling: サムネイル付きリンク生成用のファンクション
	res.locals.ramblingBuildPostThumbnailLinks = ramblingPostThumbnailLinks.buildPostThumbnailLinks;

	// rambling: サムネイル付きリンク生成用のファンクション
	res.locals.ramblingBuildPostThumbnailLinksAMP = ramblingPostThumbnailLinksAMP.buildPostThumbnailLinks;

	// rambling: トップページの表示制御用の変数
	res.locals.ramblingNumTopNewPostList = keystone.get('ramblingNumTopNewPostList');
	res.locals.ramblingTextTopEyecatch = keystone.get('ramblingTextTopEyecatch');

	// rambling: 記事ページの表示制御用の変数
	res.locals.ramblingNumPostNewPostList = keystone.get('ramblingNumPostNewPostList');

	// rambling: サイドバー表示制御用の変数
	res.locals.ramblingIsSidebarAuthorProfileDisplayed = keystone.get('ramblingIsSidebarAuthorProfileDisplayed');
	res.locals.ramblingIsSidebarNewPostListDisplayed = keystone.get('ramblingIsSidebarNewPostListDisplayed');
	res.locals.ramblingNumSidebarNewPostList = keystone.get('ramblingNumSidebarNewPostList');
	res.locals.ramblingIsSidebarCategoryListDisplayed = keystone.get('ramblingIsSidebarCategoryListDisplayed');
	res.locals.ramblingIsSidebarPublishedMonthListDisplayed = keystone.get('ramblingIsSidebarPublishedMonthListDisplayed');
	res.locals.ramblingIsSidebarReferenceLinkListDisplayed = keystone.get('ramblingIsSidebarReferenceLinkListDisplayed');

	// rambling: サイドバーのプロフィールにあるリンクの表示制御
	res.locals.ramblingIsSidebarProfileLinkRssDisplayed = keystone.get('ramblingIsSidebarProfileLinkRssDisplayed');
	res.locals.ramblingIsSidebarProfileLinkGithubDisplayed = keystone.get('ramblingIsSidebarProfileLinkGithubDisplayed');
	res.locals.ramblingUrlSidebarProfileLinkGithub = keystone.get('ramblingUrlSidebarProfileLinkGithub');
	res.locals.ramblingIsSidebarProfileLinkLinkedinDisplayed = keystone.get('ramblingIsSidebarProfileLinkLinkedinDisplayed');
	res.locals.ramblingUrlSidebarProfileLinkLinkedin = keystone.get('ramblingUrlSidebarProfileLinkLinkedin');

	// rambling: ギャラリーページ上部にあるカルーセルの画像数
	res.locals.ramblingNumGalleryCarousel = keystone.get('ramblingNumGalleryCarousel');

	// rambling: サイトマップ送信処理の要否
	res.locals.ramblingIsSitemapPublished = keystone.get('ramblingIsSitemapPublished');

	// rambling: SPフッターメニューのおすすめリンク
	res.locals.ramblingSpRecommendedLink = keystone.get('ramblingSpRecommendedLink');

	// rambling: 記事ページの文字数カウント&xx分で読めます表示の設定
	res.locals.ramblingIsPostWordCountEnabled = keystone.get('ramblingIsPostWordCountEnabled');

	// rambling: WebSubサーバーへの送信処理の要否とWebSubサーバーのURL
	res.locals.ramblingIsWebSubPublished = keystone.get('ramblingIsWebSubPublished');
	res.locals.ramblingWebSubUrl = keystone.get('ramblingWebSubUrl');

	// rambling: HTTPS通信の強制要否
	res.locals.ramblingIsHttpsForced = keystone.get('ramblingIsHttpsForced');

	// rambling: SNSシェアボタンの表示制御
	res.locals.ramblingIsFacebookDisplayed = keystone.get('ramblingIsFacebookDisplayed');
	res.locals.ramblingIsTwitterDisplayed = keystone.get('ramblingIsTwitterDisplayed');
	res.locals.ramblingIsGoogleplusDisplayed = keystone.get('ramblingIsGoogleplusDisplayed');
	res.locals.ramblingIsHatenabookmarkDisplayed = keystone.get('ramblingIsHatenabookmarkDisplayed');
	res.locals.ramblingIsPocketDisplayed = keystone.get('ramblingIsPocketDisplayed');
	res.locals.ramblingIsFeedlyDisplayed = keystone.get('ramblingIsFeedlyDisplayed');
	res.locals.ramblingIsLineDisplayed = keystone.get('ramblingIsLineDisplayed');

	// rambling: ampページの表示制御
	res.locals.ramblingIsAmpEnabled = keystone.get('ramblingIsAmpEnabled');

	// rambling: Google Tag Mangerの設定
	res.locals.ramblingIsGtmEnabled = keystone.get('ramblingIsGtmEnabled');
	res.locals.ramblingIsGtmAmpEnabled = keystone.get('ramblingIsGtmAmpEnabled');

	// rambling: Cloudinary画像のレスポンシブ対応
	res.locals.ramblingIsCloudinaryResponsiveImgEnabled = keystone.get('ramblingIsCloudinaryResponsiveImgEnabled');
	res.locals.ramblingCloudinaryCloudName = keystone.get('ramblingCloudinaryCloudName');

	// rambling: Basic tableの利用設定
	res.locals.ramblingIsBasicTableEnabled = keystone.get('ramblingIsBasicTableEnabled');

	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
