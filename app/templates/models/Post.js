var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	// rambling: タイトルの変更でslugが変わらないように「fixed: true」を追加
	autokey: { path: 'slug', from: 'title', unique: true, fixed: true },
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: '<%= userModel %>', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	// rambling: 記事ページ個別のタイトルとディスクリプション、robotsの設定
	meta: {
		title: { type: String },
		description: { type: String },
		keywords: { type: String },
		robots: { type: Types.Select, options: 'index, noindex', default: 'index' }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
});

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

// rambling: postのフルURL取得Util関数
Post.schema.virtual('ramblingFullPostUrl').get(function() {
    return keystone.get('ramblingBaseUrl') + 'blog/post/' + this.slug;
});

// rambling: AMPページのフルURL取得Util関数
Post.schema.virtual('ramblingFullAmpPostUrl').get(function() {
    return keystone.get('ramblingBaseUrl') + 'blog/post/amp/' + this.slug;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
