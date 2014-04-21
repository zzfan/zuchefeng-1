
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      service: 'postmark',
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      key: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }
  , imgRoot = 'public/img/'
  , imgUpload = imgRoot+'upload/'

module.exports = {
  development: {
    db: 'mongodb://localhost/noobjs_dev',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    imgRoot: imgRoot,
    imgUpload: imgUpload,
  },
  test: {
    db: 'mongodb://localhost/noobjs_test',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Nodejs Express Mongoose Demo'
    },
    imgRoot: imgRoot,
    imgUpload: imgUpload,
  },
  production: {
    db: 'mongodb://localhost/zuchefeng',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'zuchefeng'
    },
    imgRoot: imgRoot,
    imgUpload: imgUpload
  }
}
