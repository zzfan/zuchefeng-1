/**
 * @file models/order.js
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , utils = require('../../lib/utils')
    , helpers = require('../../config/helpers')
    ;

var OrderSchema = new Schema({
    //TODO necessary?
    from: { type: String, default: helpers.yyyymmdd()},
    to: { type: String, default: helpers.yyyymmdd1()},
    createdAt: { type: Date, default: Date.now},
    buyer: { type: Schema.ObjectId, ref: 'User'},
    car: { type: Schema.ObjectId, ref: 'Car'}
});

mongoose.model('Order', OrderSchema);
