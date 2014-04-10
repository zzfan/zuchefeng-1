var fs = require('fs');


exports.moveImage = function(file, dst, cb) {
    var tmpPath = file.path;
    var index = file.path.lastIndexOf('/');
    var filename = file.path.substr(index+1);
    //var targetPath = 'public/img/upload/'+filename;
    var targetPath = dst+filename;
    //var thumbnailPath = 'public/img/thumbnail/'+filename;
    //var url = '/img/thumbnail/'+filename;
    fs.rename(tmpPath, targetPath, function(err){
        if (err) throw err;
        cb(targetPath);
    });
};
exports.thumbnailImage = function(src, targetPath, cb) {
    var index = src.lastIndexOf('/');
    var filename = src.substr(index+1);
    var dst = targetPath+filename;
    var easyimage = require('easyimage');
    easyimage.thumbnail({
        src: src,
        dst: dst,
        height: 128,
        width: 128,
        x: 0,
        y: 0
    }, function(err, image) {
        if (err) throw err;
        cb(dst);
    });
};
/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

exports.errors = function (errors) {
  var keys = Object.keys(errors)
  var errs = []

  // if there is no validation error, just display a generic error
  if (!keys) {
    return ['Oops! There was an error']
  }

  keys.forEach(function (key) {
    errs.push(errors[key].message)
  })

  return errs
}

/**
 * Index of object within an array
 *
 * @param {Array} arr
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.indexof = function (arr, obj) {
  var index = -1; // not found initially
  var keys = Object.keys(obj);
  // filter the collection with the given criterias
  var result = arr.filter(function (doc, idx) {
    // keep a counter of matched key/value pairs
    var matched = 0;

    // loop over criteria
    for (var i = keys.length - 1; i >= 0; i--) {
      if (doc[keys[i]] === obj[keys[i]]) {
        matched++;

        // check if all the criterias are matched
        if (matched === keys.length) {
          index = idx;
          return idx;
        }
      }
    };
  });
  return index;
}

/**
 * Find object in an array of objects that matches a condition
 *
 * @param {Array} arr
 * @param {Object} obj
 * @param {Function} cb - optional
 * @return {Object}
 * @api public
 */

exports.findByParam = function (arr, obj, cb) {
  var index = exports.indexof(arr, obj)
  if (~index && typeof cb === 'function') {
    return cb(undefined, arr[index])
  } else if (~index && !cb) {
    return arr[index]
  } else if (!~index && typeof cb === 'function') {
    return cb('not found')
  }
  // else undefined is returned
}
