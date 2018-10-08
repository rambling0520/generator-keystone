// rambling: プロファイル変数を定義

/**
    * このファイルにはサイトのプロファイルを設定します。
    * 設定された値は、サイト全体にわたって共通的に使用されます。
    * 各項目の設定内容については以下のサイトを参考にして下さい。
    * https://www.rambling.tokyo/blog/post/ramblingcms-2
    */

   exports.props = {

    // サイト基本情報
    prodDomain: 'https://<本番環境で使用するドメイン>/',
    devDomain: 'http://localhost:3000/',
    siteTitle: '<サイトタイトル>',
    siteDescription: '<サイト共通でdescriptionメタタグに設定する文字列>',
    siteKeywords: '<サイト共通でkeywordsメタタグに設定する文字列>',
    authorName: '<サイト制作者の名前>',
    authorImageUrl: '/images/profile/author-profile.png',
    siteThemeText: '<サイト共通でサイトのテーマを説明する文字列>',
    siteTitleSeparator: ' | ',
    dateFormat: 'YYYY/MM/DD',
    revision: '0.0.1',

    // 画面表示の制御（サイドバー）
    isSidebarAuthorProfileDisplayed: true,
    isSidebarNewPostListDisplayed: true,
    numSidebarNewPostList: 10,
    isSidebarCategoryListDisplayed: true,
    isSidebarPublishedMonthListDisplayed: true,
    isSidebarReferenceLinkListDisplayed: true,
    isSidebarProfileLinkRssDisplayed: true,
    isSidebarProfileLinkGithubDisplayed: true,
    urlSidebarProfileLinkGithub: 'https://github.com/',
    isSidebarProfileLinkLinkedinDisplayed: true,
    urlSidebarProfileLinkLinkedin: 'https://www.linkedin.com/',

    // 画面表示の制御（サイドバー以外）
    numTopNewPostList: 10,
    textTopEyecatch: 'アイキャッチのテキスト',
    numPostNewPostList: 10,
    numGalleryCarousel: 5,
    isPostWordCountEnabled: true,
    isFacebookDisplayed: true,
	isTwitterDisplayed: true,
	isGoogleplusDisplayed: true,
	isHatenabookmarkDisplayed: true,
	isPocketDisplayed: true,
	isFeedlyDisplayed: true,
    isLineDisplayed: true,
    isAmpEnabled: true,
    spRecommendedLink: 'blog',
    isCloudinaryResponsiveImgEnabled: true,
    cloudinaryCloudName: 'keystone-demo',
    isBasicTableEnabled: true,

    // 管理系機能の制御
    isGtmEnabled: false,
    isGaEnabled: false,
    isAdsenseEnabled: false,
    isGtmAmpEnabled: false,
    isSitemapPublished: false,
    isWebSubPublished: false,
    webSubUrl: 'https://pubsubhubbub.appspot.com',
    isHttpsForced: false
    
}