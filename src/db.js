//db.js

const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

let dbconf = 'mongodb://heroku_qtgdqqlg:j5r6gj90d8utr4p6oi5h8ggshk@ds231739.mlab.com:31739/heroku_qtgdqqlg';

// my schema goes here!

const Item = new mongoose.Schema({
    name: String,
    newCost: Number,
    usedCost: Number,
    quantity: Number
});

const Plan = new mongoose.Schema({
    title: String,
    budget: Number,
    items: [Item], //embedded items
    notes: [String] //Notes about plan: positives/negatives
});

const User = new mongoose.Schema({
    id: String,
    username: String,
    password: String //password
    //plans: [Plan] //array of plan references
});

Plan.plugin(URLSlugs('title'));

mongoose.model('User', User);
mongoose.model('Item', Item);
mongoose.model('Plan', Plan);


//mongoose.connect('mongodb://localhost/final', {useMongoClient: true});

mongoose.connect(dbconf, {useMongoClient: true});
