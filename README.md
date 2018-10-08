# RamblingCMS (A Customized KeystoneJS Project) Generator

[KeystoneJS](http://keystonejs.com)をベースに作成したカスタムテンプレートである「RamblingCMS」の[Yeoman](http://yeoman.io) ジェネレーターです。

`yo ramblinｖgcms-on-keystonejs`を実行することで、RamblingCMSプロジェクトが生成され、様々なSEO対策や支援機能を持つNode.jsベースのブログ向けCMSをすぐに構築することができます。

## 利用手順

ここではサンプルプロジェクトを構築してローカル環境で動作確認するまでの手順を示します。

### 利用手順の詳細について
カスタマイズにより追加された機能やSEO対策の内容、ブログをセットアップしてインターネットに公開するまでの手順等は、以下リンクにある作成者のブログをご覧下さい。

リンク先のブログサイトは本テンプレートを使って構築されています。

RamblingCMSの利用手順詳細： [Rambling Blog](https://www.rambling.tokyo/blog/post/ramblingcms)


### 前提条件
ジェネレーターの実行、生成されたプロジェクトの実行には以下が必要となりますので、事前にインストールをお願いします。
- Node.js >= 0.12
- MongoDB >= 3.0
- Yeoman 

### 制約事項
KeystoneJSでは、複数のCSSプリプロセッサおよびテンプレートエンジンに対応していますが、RamblingCMSが対応しているのは以下のみとなります。
- CSSプリプロセッサ：SASS
- テンプレートエンジン：pug

### ジェネレーターの入手
以下のコマンドでNPMリポジトリからYeomanジェネレーターをインストールできます。
```
npm install -g generator-ramblingcms-on-keystonejs`
```

### デフォルト設定のプロジェクトを生成
以下のコマンド実行することで、デフォルト設定のプロジェクトが生成されます。
```
$ mkdir myproject
$ cd myproject
$ yo keystone auto
```
ジェネレーターの実行オプションについては、上述の作成者のブログをご覧下さい。


### プロジェクトの起動&動作確認
以下の手順でプロジェクトを起動し、サンプルプロジェクトのサイトを確認できます。
1. mongodbの起動
1. `node keystone`コマンドを実行
1. ブラウザから`http://localhost:3000`へアクセス


### 利用しているKeystoneJSのバージョン
RamblingCMSは以下のバージョンのKeystoneJSをベースとしています。
- [keystone@4.0.0](https://github.com/keystonejs/keystone/releases/)
- keystone-email@1.1.0


### 利用にあたり
KeystoneJS同様、画像のアップロード、問い合わせのメール受信などの機能を利用するには、以下サービスのアカウントが必要となります。

これらの機能利用は必須ではありませんが、動作確認および小規模サイトの運営レベルであれば無料利用の範囲に収まると思いますので、ご利用を検討ください。

* [Cloudinary](https://cloudinary.com/users/register/free) - Image serving and management in the cloud
* [Mailgun](https://app.mailgun.com/signup) - Easy email integration


## カスタマイズで追加されている機能
RamblingCMSでは、KeystoneJSのデフォルトテンプレートに対して、カスタマイズによって各種機能を追加しています。

カスタマイズは以下の4観点から実施しており、WordPressとの機能比較や、実際にKeystoneJSを使ってブログ運用する中で、管理人が不足していると感じた部分を対象としています。

1. SEO対策
1. コンテンツの制作支援
1. デザイン支援
1. セキュリティ向上

それぞれのカスタマイズについて、どのような理由で実施しているかを詳細に知りたい方は以下の記事をご覧下さい。

[RamblingCMSの概要説明](https://www.rambling.tokyo/blog/post/ramblingcms)


## ライセンス
[MIT License](http://en.wikipedia.org/wiki/MIT_License). Copyright (c) 2018 rambling

The generator-ramblingcms-on-keystnejs was forked from [generator-keystone](https://github.com/keystonejs/generator-keystone) of Jed Watson, which is subject to the same license.





