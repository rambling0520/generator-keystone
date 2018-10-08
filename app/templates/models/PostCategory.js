var keystone = require('keystone');

// rambling: 項目フィールドのタイプ定義
var Types = keystone.Field.Types;


/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
	// rambling: 名称変更でslugが変わらないように「fixed: true」を追加
	autokey: { from: 'name', path: 'key', unique: true, fixed: true },
});

PostCategory.add({
	name: { type: String, required: true },
	// rambling: カテゴリの表示順序
	dispSeq: {type: Types.Number, index:true},
	// rambling: フッターナビゲーションの表示有無フラグ
	footerNav: { type: Types.Select, options: 'none, displayed', default: 'none', index: true },
});

PostCategory.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });

PostCategory.register();
