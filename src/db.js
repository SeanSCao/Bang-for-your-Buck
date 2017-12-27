//db.js

const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

let dbconf;
// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, 'config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // connection string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/final';
}


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
