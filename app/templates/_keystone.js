// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');<% if (viewEngine == 'hbs') { %>
var handlebars = require('express-handlebars');<% } else if (viewEngine == 'nunjucks') { %>
var cons = require('consolidate');
var nunjucks = require('nunjucks');<% } else if (viewEngine == 'twig') { %>
var Twig = require('twig');<% } %>
<% if (includeGuideComments) { %>
// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
<% } %>
keystone.init({
	'name': '<%= projectName %>',
	'brand': '<%= projectName %>',
<% if (preprocessor === 'sass') { %>
	'sass': 'public',
<% } else if (preprocessor === 'less') { %>
	'less': 'public',
<% } else { %>
	'stylus': 'public',
<% } %>	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',<% if (viewEngine === 'nunjucks') { %>
	'view engine': '.html',
	'custom engine': cons.nunjucks,
<% } else if (viewEngine === 'hbs') { %>
	'view engine': '.hbs',
<% } else { %>
	'view engine': '<%= viewEngine %>',
<% } %><% if (viewEngine === 'hbs') { %>
	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,
<% } else if (viewEngine == 'twig') { %>
	'twig options': { method: 'fs' },
	'custom engine': Twig.render,
<% } %><% if (includeEmail) { %>
	'emails': 'templates/emails',
<% } %>
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': '<%= userModel %>',
	// rambling: set WYSISYG editor options
	'wysiwyg images': true, // Adds an image button which enables including images from other URLS in your WYSIWYG Editor.
	'wysiwyg menubar': true, // Show the menubar for wysiwyg editor.
	'wysiwyg additional plugins': 'searchreplace, textcolor, preview, table, media, codesample', // Allows for additional plugins.
	'wysiwyg additional buttons': 'searchreplace, forecolor backcolor, preview, table, media, codesample', // Allows to add additional extra functionality buttons.
	'wysiwyg additional options': {
		codesample_languages: [
			{text: 'HTML/XML', value: 'markup'},
			{text: 'JavaScript', value: 'javascript'},
			{text: 'CSS', value: 'css'},
			{text: 'PHP', value: 'php'},
			{text: 'Ruby', value: 'ruby'},
			{text: 'Python', value: 'python'},
			{text: 'Java', value: 'java'},
			{text: 'C', value: 'c'},
			{text: 'C#', value: 'csharp'},
			{text: 'C++', value: 'cpp'},
			{text: 'Pug', value: 'pug'} 
		], // Allows for additional TinyMCE options.
		paste_as_text: true, 
		forced_root_block : "", 
		force_br_newlines : true, 
		force_p_newlines : true, 
		relative_urls : false, 
		convert_urls: false,
		valid_elements: '*[*]'
	},
	'wysiwyg cloudinary images': true,
	// rambling: アクセスログ（morgan）のフォーマットを指定
	"logger": ':remote-user [:date[iso]] :remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
});
<% if (includeGuideComments) { %>
// Load your project's Models
<% } %>keystone.import('models');
<% if (includeGuideComments) { %>
// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
<% } %>keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});
<% if (includeGuideComments) { %>
// Load your project's Routes
<% } %>keystone.set('routes', require('./routes'));

<% if (includeGuideComments) { %>
// Configure the navigation bar in Keystone's Admin UI
<% } %>keystone.set('nav', {
	<% if (includeBlog) { %>posts: ['posts', 'post-categories'],
	<% } if (includeGallery) { %>galleries: 'galleries',
	<% } if (includeEnquiries) { %>enquiries: 'enquiries',
	<% } if (userModelPath.includes('-')) { %>'<%= userModelPath %>'<% } else { %><%= userModelPath %><% } %>: '<%= userModelPath %>',
});
<% if (includeGuideComments) { %>
// Start Keystone to connect to your database and initialise the web server
<% } %>
<% if (includeEmail) { %>
if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}
<% } %>

// rambling: log4jsの初期化
var log4js = require('log4js');
var log4jsConfig = require('./ramblingLog4jsConfig').config;
log4js.configure(log4jsConfig);

var logger = log4js.getLogger('keystone');
console.log = logger.info.bind(logger);
console.info = logger.info.bind(logger);
console.error = logger.error.bind(logger);
console.warn = logger.warn.bind(logger);
logger.info('log4js logger を初期化しました');

// rambling: set profiles
var ramblingProfiles = require('./ramblingProfiles').props;

keystone.set('ramblingSiteTitle', ramblingProfiles.siteTitle);
keystone.set('ramblingBaseUrl', (keystone.get('env') == 'production') ? ramblingProfiles.prodDomain : ramblingProfiles.devDomain);
keystone.set('ramblingSiteTitleSeparator', ramblingProfiles.siteTitleSeparator);
keystone.set('ramblingSiteDescription', ramblingProfiles.siteDescription);
keystone.set('ramblingSiteKeywords', ramblingProfiles.siteKeywords);
keystone.set('ramblingSiteThemeText', ramblingProfiles.siteThemeText);
keystone.set('ramblingDateFormat', ramblingProfiles.dateFormat);
keystone.set('ramblingAuthorName', ramblingProfiles.authorName);
keystone.set('ramblingAuthorImageUrl', ramblingProfiles.authorImageUrl);
keystone.set('ramblingRevision', ramblingProfiles.revision);

// rambling: Google Analytics、Google AdSenseの設定
keystone.set('ramblingIsGaEnabled', ramblingProfiles.isGaEnabled);
keystone.set('ramblingIsAdsenseEnabled', ramblingProfiles.isAdsenseEnabled);

// rambling: トップページの表示制御用の変数
keystone.set('ramblingNumTopNewPostList', ramblingProfiles.numTopNewPostList);
keystone.set('ramblingTextTopEyecatch', ramblingProfiles.textTopEyecatch);

// rambling: 記事ページの表示制御用の変数
keystone.set('ramblingNumPostNewPostList', ramblingProfiles.numPostNewPostList);

// rambling: サイドバー表示制御用の変数
keystone.set('ramblingIsSidebarAuthorProfileDisplayed', ramblingProfiles.isSidebarAuthorProfileDisplayed);
keystone.set('ramblingIsSidebarNewPostListDisplayed', ramblingProfiles.isSidebarNewPostListDisplayed);
keystone.set('ramblingNumSidebarNewPostList', ramblingProfiles.numSidebarNewPostList);
keystone.set('ramblingIsSidebarCategoryListDisplayed', ramblingProfiles.isSidebarCategoryListDisplayed);
keystone.set('ramblingIsSidebarPublishedMonthListDisplayed', ramblingProfiles.isSidebarPublishedMonthListDisplayed);
keystone.set('ramblingIsSidebarReferenceLinkListDisplayed', ramblingProfiles.isSidebarReferenceLinkListDisplayed);

// rambling: サイドバーのプロフィールにあるリンクの表示制御
keystone.set('ramblingIsSidebarProfileLinkRssDisplayed', ramblingProfiles.isSidebarProfileLinkRssDisplayed);
keystone.set('ramblingIsSidebarProfileLinkGithubDisplayed', ramblingProfiles.isSidebarProfileLinkGithubDisplayed);
keystone.set('ramblingUrlSidebarProfileLinkGithub', ramblingProfiles.urlSidebarProfileLinkGithub);
keystone.set('ramblingIsSidebarProfileLinkLinkedinDisplayed', ramblingProfiles.isSidebarProfileLinkLinkedinDisplayed);
keystone.set('ramblingUrlSidebarProfileLinkLinkedin', ramblingProfiles.urlSidebarProfileLinkLinkedin);

// rambling: ギャラリーページ上部にあるカルーセルの画像数
keystone.set('ramblingNumGalleryCarousel', ramblingProfiles.numGalleryCarousel);

// rambling: サイトマップ送信処理の要否
keystone.set('ramblingIsSitemapPublished', ramblingProfiles.isSitemapPublished);

// rambling: SPフッターメニューのおすすめリンク
keystone.set('ramblingSpRecommendedLink', ramblingProfiles.spRecommendedLink);

// rambling: 記事ページの文字数カウント&xx分で読めます表示の設定
keystone.set('ramblingIsPostWordCountEnabled', ramblingProfiles.isPostWordCountEnabled);

// rambling: WebSubサーバーへの送信処理の要否とWebSubサーバーのURL
keystone.set('ramblingIsWebSubPublished', ramblingProfiles.isWebSubPublished);
keystone.set('ramblingWebSubUrl', ramblingProfiles.webSubUrl);

// rambling: HTTPS通信の強制要否
keystone.set('ramblingIsHttpsForced', ramblingProfiles.isHttpsForced);

// rambling: SNSシェアボタンの表示制御
keystone.set('ramblingIsFacebookDisplayed', ramblingProfiles.isFacebookDisplayed);
keystone.set('ramblingIsTwitterDisplayed', ramblingProfiles.isTwitterDisplayed);
keystone.set('ramblingIsGoogleplusDisplayed', ramblingProfiles.isGoogleplusDisplayed);
keystone.set('ramblingIsHatenabookmarkDisplayed', ramblingProfiles.isHatenabookmarkDisplayed);
keystone.set('ramblingIsPocketDisplayed', ramblingProfiles.isPocketDisplayed);
keystone.set('ramblingIsFeedlyDisplayed', ramblingProfiles.isFeedlyDisplayed);
keystone.set('ramblingIsLineDisplayed', ramblingProfiles.isLineDisplayed);

// rambling: ampページの表示制御
keystone.set('ramblingIsAmpEnabled', ramblingProfiles.isAmpEnabled);

// rambling: Google Tag Mangerの設定
keystone.set('ramblingIsGtmEnabled', ramblingProfiles.isGtmEnabled);
keystone.set('ramblingIsGtmAmpEnabled', ramblingProfiles.isGtmAmpEnabled);

// rambling: Cloudinary画像のレスポンシブ対応
keystone.set('ramblingIsCloudinaryResponsiveImgEnabled', ramblingProfiles.isCloudinaryResponsiveImgEnabled);
keystone.set('ramblingCloudinaryCloudName', ramblingProfiles.cloudinaryCloudName);

// rambling: Basic tableの利用設定
keystone.set('ramblingIsBasicTableEnabled', ramblingProfiles.isBasicTableEnabled);

// rambling: set profiles (end)

// rambling: init node-cache
let ramblingCacheProvider = require('./routes/ramblingCacheProvider');
ramblingCacheProvider.start(function(err) {
    if (err) console.error(err);
});

// rambling: nodeｰsassでAMPページ用のCSSをコンパイル
if (ramblingProfiles.isAmpEnabled){

	var sass = require('node-sass');

	var result = sass.renderSync({
		file: 'public/styles/rambling-site-amp.scss',
		outputStyle: 'compressed',
		outFile: 'public/styles/rambling-site-amp.css'
		});
		 	
	var fs = require('fs');
	fs.writeFile('public/styles/rambling-site-amp.css', result.css, function(err){
		if(!err){
			logger.info('AMPページ用CSSファイルをコンパイルしました');
		} else {
			logger.error('AMPページ用CSSファイルのコンパイルに失敗しました');
		}
	});
}

// rambling: XmlSitemapのping送信処理を開始
if (ramblingProfiles.isSitemapPublished){
	let ramblingXmlSitemapPublisher = require('./routes/ramblingXmlSitemapPublisher');
	ramblingXmlSitemapPublisher.startCronJob(keystone);
	logger.info('XmlSitemapのping送信ジョブを開始しました');
}

// rambling: WebSubサーバーへのpost送信処理を開始
if (ramblingProfiles.isWebSubPublished){
	let ramblingWebSubPublisher = require('./routes/ramblingWebSubPublisher');
	ramblingWebSubPublisher.startCronJob(keystone);
	logger.info('WebSubサーバーへのpost送信ジョブを開始しました');
}

keystone.start();
