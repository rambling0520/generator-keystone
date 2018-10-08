// rambling: UI操作用のスクリプト
// ページ末で読み込まれるので、ready()は記載せず

// スクロールでトップへもどる
let ramblingTopBtn = $('#rambling-page-top-btn');
ramblingTopBtn.click(function () {
    $('body,html').animate({
        scrollTop: 0
    }, 300);
    // console.log('page-to-btn');
    return false;
})

// 記事の文字数をカウントして、xx分で読めますと合わせて表示
let ramblingPostWordCount = $('span.rambling-post-word-count');
if (ramblingPostWordCount.length) {

    // 記事の文字数を空白を除いて取得
    let wc = $('article>.post').text().replace(/\s+/g,'').length;

    // 記事の読了時間を計算（1分あたり500文字）
    let duration = Math.ceil(wc/500);

    // テキストとして表示
    ramblingPostWordCount.each(function() {
        $(this).text(wc + '文字（' + duration + '分で読めます）');
    });
}
