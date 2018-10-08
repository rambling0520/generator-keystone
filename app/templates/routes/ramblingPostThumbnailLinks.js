// rambling: サムネイル付きリンク生成、Amazonリンク生成、吹き出しテキスト生成用のファンクションを定義

const cheerio = require('cheerio')

// 記事ページコンテンツ（extended）をパースしてサムネイル付きリンクを生成して返す
exports.buildPostThumbnailLinks = function (postExtended) {

    // cheerioのDOMオブジェクト生成
    const $ = cheerio.load(postExtended);

    // サムネイル付きリンク生成
    // コンテンツHTML（引数）をパースしてサムネイル付きリンクの設定箇所を取得
    // 取得条件は、"rambling-link-box"クラスが付与されており、data-link属性が設定されているdiv要素であること
    // <div class="rambling-link-box" data-link="http://keystonejs.com/" data-title="Node.js CMS &amp; web app platform"></div>
    // data-internal="true" の場合は、内部リンクなのでnofollowにしない
    // アンカーテキストをdiv要素内に設定するように変更
    $('div.rambling-link-box[data-link]').each(function () {

        // リンクからドメイン部分のみを抽出
        let dataLink = $(this).attr('data-link');
        let domain = dataLink.substr(dataLink.indexOf('://') + 3);
        domain = domain.substring(0, domain.indexOf('/'));

        // サムネイル付きリンクの要素を生成
        // data-link属性とdiv内のテキストリンクの情報を設定
        let thumbnailLinkHtml = "";

        // data-internal="true" の場合は、内部リンクなのでnofollowを付けない
        if ($(this).attr('data-internal') == 'true') {
            thumbnailLinkHtml = '<a class="rambling-link-box-item" href="' + $(this).attr('data-link') + '" target="_blank">'
        } else {
            thumbnailLinkHtml = '<a class="rambling-link-box-item" href="' + $(this).attr('data-link') + '" rel="nofollow" target="_blank">'
        }

        thumbnailLinkHtml = thumbnailLinkHtml +
            '<figure class="rambling-link-box-item-img">' +
            '<img src="https://s.wordpress.com/mshots/v1/' + $(this).attr('data-link') + '?w=72&amp;h=72" alt="' + domain + ' | ' + $(this).text() + '">' +
            '</figure>' +
            '<div class="rambling-link-box-item-content">' +
            '<div class="rambling-link-box-item-content-title">' + domain + ' | ' + $(this).text() + '</div>' +
            '<div class="rambling-link-box-item-content-domain">' +
            '<img class="rambling-link-box-item-content-favicon" src="https://www.google.com/s2/favicons?domain=' + domain + '">' +
            '<span class="rambling-link-box-item-content-domain-name">' + domain + '</span>' +
            '</div>' +
            '</div>' +
            '</a>';

        // 取得したdiv要素内にサムネイル付きリンクの要素を設定
        $(this).empty();
        $(this).append(thumbnailLinkHtml);

    });

    // Amazonリンクの生成
    // コンテンツHTML（引数）をパースしてサムネイル付きリンクの設定箇所を取得
    // 取得条件は、"rambling-amzn-link-box"クラスが付与されており、data-link属性とdata-title属性が設定されているdiv要素であること
    // div要素内に画像リンクが記載されていること
    // <div class="rambling-amzn-link-box" data-title="プログラマ脳を鍛える数学パズル" data-link="https://amzn.to/2Oe6dpI"><a href="https://www.amazon.co.jp/%E3%83%9.... /></div>
    $('div.rambling-amzn-link-box[data-link][data-title]').each(function () {

        // ドメインを設定
        let domain = 'amazon.co.jp';

        // サムネイル付きamazonリンクの要素を生成
        // data-link属性とdata-title属性、子要素のaタグからリンクの情報を設定
        let amznLinkHtml = '<div class="rambling-amzn-link-box-item-img">' +
            $(this).html() +
            '</div>' +
            '<div class="rambling-amzn-link-box-item-content">' +
            '<div class="rambling-link-box-item-content-title">' +
            '<a href="' + $(this).attr('data-link') + '" rel="nofollow" target="_blank">' +
            $(this).attr('data-title') +
            '</a>' +
            '</div>' +
            '<div class="rambling-amzn-link-box-item-content-domain">' +
            '<img class="rambling-amzn-link-box-item-content-favicon" src="https://www.google.com/s2/favicons?domain=amazon.co.jp">' +
            '<span class="rambling-link-box-item-content-domain-name">' + domain + '</span>' +
            '</div>';

        // 取得したdiv要素内にサムネイル付きリンクの要素を設定
        $(this).empty();
        $(this).append(amznLinkHtml);

    });

    // 吹き出しテキストを表示
    // 取得条件は、"rambling-post-balloon"クラスが付与されており、data-direction属性、data-speaker-image属性が設定されているdiv要素であること
    // div要素内のテキストを吹き出し内に出力する
    // <div class="rambling-post-balloon" data-direction="left" data-speaker-image="/images/profile/speaker1.jpg" data-speaker-name="rambling-left">キーワードも大事。</div>
    $('div.rambling-post-balloon[data-direction][data-speaker-image]').each(function () {

        // 吹き出しテキストの要素を生成
        let balloonTextHtml = '<ul class="rambling-post-balloon-flexbox">';

        if ($(this).attr('data-direction') == 'left') {
            balloonTextHtml = balloonTextHtml + '<li class="rambling-post-balloon-left-speaker">';

        } else if ($(this).attr('data-direction') == 'right') {
            balloonTextHtml = balloonTextHtml + '<li class="rambling-post-balloon-right-speaker">';

        } else {
            // directionの設定がleft/rightでない場合は処理を抜ける
            return true;
        }

        balloonTextHtml = balloonTextHtml + '<div class="rambling-post-balloon-speaker-img">' +
            '<img src="' + $(this).attr('data-speaker-image') + '" width="60px" height="60px" />' +
            '</div>' +
            '<div class="rambling-post-balloon-speaker-name">' + $(this).attr('data-speaker-name') + '</div>' +
            '</li>';

        if ($(this).attr('data-direction') == 'left') {
            balloonTextHtml = balloonTextHtml + '<li class="rambling-post-balloon-left-content"></div>' +
                '<div class="rambling-post-balloon-left-balloon">';

        } else if ($(this).attr('data-direction') == 'right') {
            balloonTextHtml = balloonTextHtml + '<li class="rambling-post-balloon-right-content"></div>' +
                '<div class="rambling-post-balloon-right-balloon">';

        } else {
            // directionの設定がleft/rightでない場合は処理を抜ける
            return true;
        }

        balloonTextHtml = balloonTextHtml + '<p class="rambling-post-balloon-text">' + $(this).text() + '</p>' +
            '</div>' +
            '</li>' +
            '</ul>' +
            '</div>';

        // 取得したdiv要素内にサムネイル付きリンクの要素を設定
        $(this).empty();
        $(this).append(balloonTextHtml);

    });

    // html要素化して返却
    return $.html();

}

