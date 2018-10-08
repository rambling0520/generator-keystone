// rambling: 記事ページの目次構築用のファンクションを定義

const cheerio = require('cheerio')

// 記事ページコンテンツ（extended）のh3とh4要素に目次用のIDを付与した状態のHTMLと、
// 目次構成用のHTMLの双方を構築して返す
exports.buildPostTableOfContents = function (postExtended) {

    // cheerioのDOMオブジェクト生成
    const $ = cheerio.load(postExtended);

    // 目次生成用データを格納するjsonオブジェクト
    let toc = {};

    // h3を抽出して目次用のidを付与
    let i = 1;
    $('h3').each(function () {

        // 見出しの#を定義
        let hl = 'hl-' + i;

        // 見出しの#をidとして付与
        $(this).attr('id', hl);

        // 見出しの#をkeyとして目次ラベルを設定
        toc[hl] = $(this).text();
        i++;
    });

    // iの値を調整
    i = i - 1;

    // h4を抽出して目次用のidを付与。h3の存在を区切りとしてループ処理
    for (j = 1; j <= i; j++) {

        // h4の上位階層になるh3のidを定義
        let hlh3 = 'hl-' + j + '-children';

        // 末尾のh3より前のh4を、h3ごとに処理
        if (j + 1 <= i) {
            // console.log('i:' + i );
            // console.log('j:'+j);

            // h4階層の目次生成用データを格納するjsonオブジェクト
            let htmlTocH4 = {};

            // 自分（含めずに）の前のすべてのidを持たない兄弟H4要素を取得
            let k = 1;
            $($('#hl-' + (j + 1)).prevAll('h4:not([id])').get().reverse()).each(function () {

                // 見出しの#を定義
                let hlh4 = 'hl-' + j + '-' + k;

                //h4に目次用のidを付与
                $(this).attr('id', hlh4);

                // 見出しの#をkeyとして目次ラベルを設定
                htmlTocH4[hlh4] = $(this).text();
                toc[hlh3] = htmlTocH4;
        
                k++;
            });

        // 末尾のh3以降のh4を処理
        } else {
            //console.log('j:'+j);

             // h4階層の目次生成用データを格納するjsonオブジェクト
             let htmlTocH4 = {};

            // 自分（含めずに）の後のすべてのidを持たない兄弟H4要素を取得
            let k = 1;
            $('#hl-' + j).nextAll('h4:not([id])').each(function () {

                // 見出しの#を定義
                let hlh4 = 'hl-' + j + '-' + k;

                //h4に目次用のidを付与
                $(this).attr('id', hlh4);

                // 見出しの#をkeyとして目次ラベルを設定
                htmlTocH4[hlh4] = $(this).text();
                toc[hlh3] = htmlTocH4;

                k++;
            });
        }
    }

    // console.dir(toc);
    
    // 目次用のIDが付与されたコンテンツHTMLを取得
    let htmlContentsEdited = $.html();

    // 目次用のHTMLを生成
    let htmlToc = makeHtmlToc(toc);

    let retObj = {}
    retObj.htmlContentsEdited = htmlContentsEdited;
    retObj.htmlToc = htmlToc;
    // console.log('htmlToc' + retObj.htmlToc);
    return retObj;
}


// 記事ページ目次のHTMLを生成
makeHtmlToc = function (toc) {

    // 引数オブジェクトが空ではないかチェック
    if (toc === "" || toc === null || Object.keys(toc).length === 0) {
        return null;
    }

    // 記事コンテンツのH3、H4をパースして目次のHTMLを構築
    let htmlTocFragment = '<div id="rambling-post-toc-container">' +
        '<p class="rambling-post-toc-title">この記事の目次</p>' +
        '<ul class="rambling-post-toc-list">';

    // 上記のフラグメントからcheerioオブジェクトを生成
    let htmlToc = cheerio.load(htmlTocFragment);
    // console.log('htmlToc:' + htmlToc.html());

    // 処理対象のh3を指定する変数
    let h3num = 1;

    // 処理対象のh3テキストを格納する変数
    let h3Text;

    // 2階層の目次htmlを作成する
    do {

        // h3テキストを取得
        h3Text = toc['hl-' + h3num];

        // h3テキストが存在する場合
        if (h3Text !== "" && h3Text !== null && h3Text !== void 0) {
            // console.log('h3Text:' + h3Text);

            // h3テキスト向けの目次リンクを生成
            let h3LiTag = '<li class="rambling-post-toc-list-item"><a href="' + '#hl-' + h3num + '">' + h3Text + '</a>';

            // 処理対象のh3配下のh4を全て取得
            h4Array = toc['hl-' + h3num + '-children'];

            // h4配列が存在する場合
            if (h4Array !== "" && h4Array !== null && h4Array !== void 0 && Object.keys(h4Array).length !== 0) {

                // 処理対象のh4を指定する変数
                let h4num = 1;

                // 処理対象のh4テキストを格納する変数
                let h4Text;

                // h4テキスト向けの目次リンク生成用の変数
                let h4LiTag = '';

                do {
                    // 処理対象のh4テキストを取得
                    let hl = 'hl-' + h3num + '-' + h4num;
                    // console.log('hl:' + hl);
                    h4Text = h4Array[hl];
                    // console.log('h4Text:' + h4Text);

                    // h4テキストが存在する場合
                    if (h4Text !== "" && h4Text !== null && h4Text !== void 0) {

                        // 最初のh4テキストの場合、順序付きリストタグとリンクを生成
                        if (h4num == 1) {
                            h4LiTag = '<ol>' +
                                '<li class="rambling-post-toc-list-item"><a href="#hl-' + h3num + '-' + h4num + '">' + h4Text + '</a></li>';
                        } else {
                            h4LiTag = h4LiTag + '<li class="rambling-post-toc-list-item"><a href="#hl-' + h3num + '-' + h4num + '">' + h4Text + '</a></li>';
                        }                        
                    }

                    // 処理対象のh4をインクリメント
                    h4num++;

                // 処理対象のh4が存在する限り処理を繰り返す
                } while (h4Text !== "" && h4Text !== null && h4Text !== void 0)

                // 順序付きリストタグの閉じタグを生成
                h4LiTag = h4LiTag + '</ol>';

                // h3テキストリンクの配下にh4テキストリンクを追加
                h3LiTag = h3LiTag + h4LiTag;   
            }
            // h3テキストのリストを閉じる
            h3LiTag = h3LiTag + '</li>';
            // console.log('h3LiTag:' + h3LiTag);

            // h3テキストリンクをhtml化して、フラグメントHTML内に追加
            htmlTocFragment = htmlTocFragment + h3LiTag;
        }
        // 処理対象のh3をインクリメント
        h3num++;

    // 処理対象のh4が存在する限り処理を繰り返す
    } while (h3Text !== "" && h3Text !== null && h3Text !== void 0)

    // タグを閉じる
    htmlTocFragment = htmlTocFragment +
        '</ul>' +
        '</div>';

    // 構築した文字列を返却
    return htmlTocFragment;

}
