// rambling: json-ld構築用のファンクションを定義

// HOME画面（WebSite）
exports.buildJsonLdOfHome = function (url, title, desc, imageUrl, authorName, profileUrl, profileImageUrl) {
    var jsonld = '[' +
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "WebSite",' +
        '"@id": "' + url + '",' +
        '"url": "' + url + '",' +
        '"mainEntityOfPage": "' + url + '",' +
        '"inLanguage": "ja",' + '"name": "' + title + '",' +
        '"description": "' + desc + '",' +
        '"image": "' + imageUrl + '",' +
        '"publisher": {' +
        '"@id": "' + url + '#org"' +
        '},' +
        '"author": {' +
        '"@type": "' + 'Person' + '",' +
        '"@id": "' + url + '/#maker",' +
        '"name": "' + authorName + '",' +
        '"url": "' + profileUrl + '",' +
        '"image": "' + profileImageUrl + '"' +
        '}' +
        '},' +
        // breadcrumbs なし
        // Organization
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "Organization",' +
        '"@id": "' + url + '#org",' +
        '"name": "' + 'text",' +
        '"logo": {' +
        '"@type": "' + 'ImageObject' + '",' +
        '"@id": "' + url + '#logo",' +
        '"url": "' + imageUrl + '"' +
        '}' +
        '}' +
        ']';

    return jsonld;

}

// 記事ページ（blogposting）
exports.buildJsonLdOfPost = function (baseUrl, postUrl, profileUrl, profileImageUrl, title, brief, postKeywords, imageUrl,
    datePublished, dateModified, authorName, urlbc1, urlbc2) {
    var jsonld = '[' +
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "BlogPosting",' +
        '"@id": "' + postUrl + '",' +
        '"url": "' + postUrl + '",' +
        '"mainEntityOfPage": "' + postUrl + '",' +
        '"inLanguage": "ja",' +
        '"name": "' + title + '",' +
        '"description": "' + brief + '",' +
        '"headline": "' + brief + '",' +
        '"keywords": "' + postKeywords + '",' +
        '"image": "' + imageUrl + '",' +
        '"datePublished": "' + datePublished + '",' +
        '"dateModified": "' + dateModified + '",' +
        '"publisher": {' +
        '"@id": "' + baseUrl + '#org"' +
        '},' +
        '"author": {' +
        '"@type": "' + 'Person' + '",' +
        '"@id": "' + postUrl + '/#maker",' +
        '"name": "' + authorName + '",' +
        '"url": "' + profileUrl + '",' +
        '"image": "' + profileImageUrl + '"' +
        '}' +
        '},' +
        // breadcrumbs
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "BreadcrumbList",' +
        '"@id": "' + postUrl + '/#breadcrumb-list",' +
        '"itemListElement": [ ' +
        '{' +
        '"@type": "' + 'ListItem' + '",' +
        '"position": 1,' +
        '"item": {' +
        '"@id": "' + urlbc1 + '",' +
        '"name": "トップページ"' +
        '}' +
        '},' +
        '{' +
        '"@type": "' + 'ListItem' + '",' +
        '"position": 2,' +
        '"item": {' +
        '"@id": "' + urlbc2 + '",' +
        '"name": "記事一覧ページ"' +
        '}' +
        '}' +
        ']' +
        '},' +
        // Organization
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "Organization",' +
        '"@id": "' + urlbc1 + '#org",' +
        '"name": "' + 'text",' +
        '"logo": {' +
        '"@type": "' + 'ImageObject' + '",' +
        '"@id": "' + urlbc1 + '#logo",' +
        '"url": "' + imageUrl + '"' +
        '}' +
        '}' +
        ']';

    return jsonld;
}

// 記事一覧ページ（blog）
exports.buildJsonLdOfPostList = function (baseUrl, url, title, desc, imageUrl, authorName, profileUrl, profileImageUrl, urlbc1) {
    var jsonld = '[' +
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "Blog",' +
        '"@id": "' + url + '",' +
        '"url": "' + url + '",' +
        '"mainEntityOfPage": "' + url + '",' +
        '"inLanguage": "ja",' +
        '"name": "' + title + '",' +
        '"description": "' + desc + '",' +
        '"image": "' + imageUrl + '",' +
        '"publisher": {' +
        '"@id": "' + baseUrl + '#org"' +
        '},' +
        '"author": {' +
        '"@type": "' + 'Person' + '",' +
        '"@id": "' + url + '",' +
        '"name": "' + authorName + '",' +
        '"url": "' + profileUrl + '",' +
        '"image": "' + profileImageUrl + '"' +
        '}' +
        '},' +
        // breadcrumbs
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "BreadcrumbList",' +
        '"@id": "' + url + '#breadcrumb-list",' +
        '"itemListElement": [ ' +
        '{' +
        '"@type": "' + 'ListItem' + '",' +
        '"position": 1,' +
        '"item": {' +
        '"@id": "' + urlbc1 + '",' +
        '"name": "トップページ"' +
        '}' +
        '}' +
        ']' +
        '}' +
        ']';

    return jsonld;

}

// ギャラリーページ
exports.buildJsonLdOfGallery = function (baseUrl, url, title, desc, imageUrl, authorName, profileUrl, profileImageUrl, urlbc1) {
    var jsonld = '[' +
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "Blog",' +
        '"@id": "' + url + '",' +
        '"url": "' + url + '",' +
        '"mainEntityOfPage": "' + url + '",' +
        '"inLanguage": "ja",' +
        '"name": "' + title + '",' +
        '"description": "' + desc + '",' +
        '"image": "' + imageUrl + '",' +
        '"publisher": {' +
        '"@id": "' + baseUrl + '#org"' +
        '},' +
        '"author": {' +
        '"@type": "' + 'Person' + '",' +
        '"@id": "' + url + '",' +
        '"name": "' + authorName + '",' +
        '"url": "' + profileUrl + '",' +
        '"image": "' + profileImageUrl + '"' +
        '}' +
        '},' +
        // breadcrumbs
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "BreadcrumbList",' +
        '"@id": "' + url + '#breadcrumb-list",' +
        '"itemListElement": [ ' +
        '{' +
        '"@type": "' + 'ListItem' + '",' +
        '"position": 1,' +
        '"item": {' +
        '"@id": "' + urlbc1 + '",' +
        '"name": "トップページ"' +
        '}' +
        '}' +
        ']' +
        '}' +
        ']';

    return jsonld;
}

// コンタクトページ
exports.buildJsonLdOfContact = function (baseUrl, url, title, desc, imageUrl, authorName, profileUrl, profileImageUrl, urlbc1) {
    var jsonld = '[' +
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "Blog",' +
        '"@id": "' + url + '",' +
        '"url": "' + url + '",' +
        '"mainEntityOfPage": "' + url + '",' +
        '"inLanguage": "ja",' +
        '"name": "' + title + '",' +
        '"description": "' + desc + '",' +
        '"image": "' + imageUrl + '",' +
        '"publisher": {' +
        '"@id": "' + baseUrl + '#org"' +
        '},' +
        '"author": {' +
        '"@type": "' + 'Person' + '",' +
        '"@id": "' + url + '",' +
        '"name": "' + authorName + '",' +
        '"url": "' + profileUrl + '",' +
        '"image": "' + profileImageUrl + '"' +
        '}' +
        '},' +
        // breadcrumbs
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "BreadcrumbList",' +
        '"@id": "' + url + '#breadcrumb-list",' +
        '"itemListElement": [ ' +
        '{' +
        '"@type": "' + 'ListItem' + '",' +
        '"position": 1,' +
        '"item": {' +
        '"@id": "' + urlbc1 + '",' +
        '"name": "トップページ"' +
        '}' +
        '}' +
        ']' +
        '}' +
        ']';

    return jsonld;
}