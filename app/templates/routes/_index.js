<% if (includeGuideComments) { %>/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

<% } %>var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// rambling: sitemap.xml対応
var sitemap = require('./ramblingXmlSitemap');

// rambling: シンジケーションフィード対応
var feedPublisher = require('./ramblingSyndicationFeedsPublisher');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// rambling: 本番環境かつHTTPSアクセスの強制要否がtrueの場合に、HTTPSアクセスへのリダイレクト処理を設定
var ramblingProfiles = require('../ramblingProfiles').props;
if (keystone.get('env') == 'production' && ramblingProfiles.isHttpsForced) {
    var enforce = require('express-sslify');
    keystone.pre('routes', enforce.HTTPS({ trustProtoHeader: true }));
    console.info('HTTPアクセスを強制的にHTTPSアクセスへリダイレクトします');
}

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {

    // rambling: x-powered-byを非表示に
    app.set('x-powered-by', false);

	// rambling: sitemap.xml対応
	app.get('/sitemap.xml', function(req, res) {
        //sitemap.create(keystone, req, res);
        sitemap.buildXmlSitemap(keystone, req, res);

	});

	// rambling: RSS対応
    app.get('/feed.rss', function(req, res){
        feedPublisher.rss(keystone, req, res)
    });

    // rambling: Atom対応
    app.get('/feed.atom', function(req, res){
        feedPublisher.atom(keystone, req, res)
    });

	// Views
	app.get('/', routes.views.index);
<% if (includeBlog) { %>	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
<% } %><% if (includeGallery) { %>	app.get('/gallery', routes.views.gallery);
<% } %><% if (includeEnquiries) { %>	app.all('/contact', routes.views.contact);
<% } %>
    
    // rambling: 掲載年月を指定した記事一覧への遷移
    app.get('/blog/pub-ym/:publishedYearMonth?', routes.views.blog);

    // rambling: プライバシーポリシーページへの遷移
    app.get('/privacy-policy', routes.views.ramblingPrivacyPolicy);

    // rambling: HTMLサイトマップページへの遷移
    app.get('/html-sitemap', routes.views.ramblingHtmlSitemap);

    // rambling: AMPページへの遷移（プロファイル変数で利用設定されている場合のみ）
    if (keystone.get('ramblingIsAmpEnabled')) {
        app.get('/blog/post/amp/:post', routes.views.post);
    }

<% if (includeGuideComments) { %>
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
<% } %>
};
