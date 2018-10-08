// rambling: log4jsのアペンダ設定

exports.config = {
	appenders: {
		out: {
			type: 'stdout',
			layout: {
				type: 'colored'
			}
		}
	},
	categories: {
		default: {
			appenders: ['out'],
			level: 'debug'
		}
	}
}