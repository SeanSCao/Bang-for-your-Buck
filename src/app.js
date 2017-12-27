//app.js

const express = require('express');
require('./db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const expressSession = require('express-session');
const mongoose = require('mongoose');
const Plan = mongoose.model('Plan');
const User = mongoose.model('User');
const passport = require('passport');
const flash = require('connect-flash')
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');


app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'hbs');

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

const sessionOptions = {
    secret: 'secret for signing session id',
    saveUninitialized: false,
    resave: false
};
app.use(expressSession(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function (user, done) {
    console.log('serializing user: ');
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        console.log('deserializing user:', user);
        done(err, user);
    });
});

login(passport);
signup(passport);

app.get('/', function (req, res) {
    // Display the Login page with any flash message, if any
    res.render('login', {
        message: req.flash('message')
    });
});

/* Handle Login POST */
app.post('/login', passport.authenticate('login', {
    successRedirect: '/plans',
    failureRedirect: '/',
    failureFlash: true
}));

/* GET Registration Page */
app.get('/signup', function (req, res) {
    res.render('signup', {
        message: req.flash('message')
    });
});

/* Handle Registration POST */
app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/plans',
    failureRedirect: '/signup',
    failureFlash: true
}));

/* GET Home Page */
app.get('/login', isAuthenticated, function (req, res) {
    res.redirect('/plans');
});

/* Handle Logout */
app.get('/signout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/plans', isAuthenticated, function (req, res) {
    Plan.find(function (err, plans, count) {
        if (err) {
            res.send(err);
        }

        res.render('all', {
            plans: plans
        });
    });
});

app.get('/create', isAuthenticated, function (req, res) {
    res.render('create');
});

app.get('/plans/:slug', isAuthenticated, function (req, res) {
    Plan.find({
        "slug": req.params.slug
    }, function (err, plans, count) {
        if (err) {
            res.send(err);
        }
        //console.log(plans[0].items.length);
        let newTotal = 0;
        let usedTotal = 0;
        let quantityTotal = 0;

//        for (let i = 0; i < plans[0].items.length; i++) {
//            newTotal += plans[0].items[i].newCost * plans[0].items[i].quantity;
//            usedTotal += plans[0].items[i].usedCost * plans[0].items[i].quantity;
//            quantityTotal += plans[0].items[i].quantity;
//        }

        if (plans[0].items.length > 0) {
            
            
            let tempNew = {};
            tempNew = plans[0].items.map(function (obj) {
                const newObj = {};
                newObj['newCost'] = obj.newCost * obj.quantity;
                return newObj;
            });
            
            let tempUsed = {};
            tempUsed = plans[0].items.map(function (obj) {
                const newObj = {};
                newObj['usedCost'] = obj.usedCost * obj.quantity;
                return newObj;
            });
            
            (a, b) => ({x: a.x + b.x})
            
            newTotal = tempNew.reduce(( acc, cur ) => ({newCost: acc.newCost + cur.newCost})).newCost;
            usedTotal = tempUsed.reduce(( acc, cur ) => ({usedCost: acc.usedCost + cur.usedCost})).usedCost;
            quantityTotal = plans[0].items.reduce(( acc, cur ) => ({quantity: acc.quantity + cur.quantity})).quantity;
        }





        res.render('plan', {
            plans: plans,
            newTotal: newTotal,
            usedTotal: usedTotal,
            quantityTotal: quantityTotal
        });
    });
});

app.post('/create', (req, res) => {
    const newPlan = new Plan({
        title: req.body.title,
        budget: req.body.budget
    });

    newPlan.save(function (err, plans, count) {
        res.redirect('/plans')
    });
});

app.post('/plans/add', (req, res) => {
    Plan.findOne({
        slug: req.body.slug
    }, function (err, plans, count) {
        if (err) {
            console.log(err);
        }
        plans.items.push({
            name: req.body["name"],
            newCost: req.body["newCost"],
            usedCost: req.body["usedCost"],
            quantity: req.body["quantity"]
        });
        plans.save(function (saveErr, savePlan, saveCount) {
            res.redirect('/plans/' + req.body.slug);
        });
    });
});

app.post('/plans/add-note', (req, res) => {
    Plan.findOne({
        slug: req.body.slug
    }, function (err, plans, count) {
        if (err) {
            console.log(err);
        }
        plans.notes.push(req.body.note);
        plans.save(function (saveErr, savePlan, saveCount) {
            res.redirect('/plans/' + req.body.slug);
        });
    });
});

app.post('/plans/del', (req, res) => {
    Plan.findOne({
        slug: req.body.slug
    }, function (err, plans, count) {

        console.log(plans);
        if (req.body.del) {
            if (Array.isArray(req.body.del)) {
                for (let i = 0; i < req.body.del.length; i++) {
                    plans.items.id(req.body.del[i]).remove();
                }
            } else {
                plans.items.id(req.body.del).remove();
            }
        }

        plans.save(function (saveErr, savePlan, saveCount) {
            res.redirect('/plans/' + req.body.slug);
        });
    });
});

app.post('/plans/del-note', (req, res) => {
    Plan.findOne({
        slug: req.body.slug
    }, function (err, plans, count) {
        console.log(plans);
        if (req.body.del) {
            if (Array.isArray(req.body.del)) {
                for (let i = 0; i < req.body.del.length; i++) {
                    const index = plans.notes.indexOf(req.body.del[i]);
                    plans.notes.splice(index, 1);
                }
            } else {
                const index = plans.notes.indexOf(req.body.del);
                plans.notes.splice(index, 1);
            }
        }

        plans.save(function (saveErr, savePlan, saveCount) {
            res.redirect('/plans/' + req.body.slug);
        });
    });
});

app.get('/compare', isAuthenticated, function (req, res) {
    Plan.find(function (err, plans, count) {
        if (err) {
            res.send(err);
        }

        res.render('compare', {
            plans: plans
        });
    });
});

app.post('/compare', (req, res) => {

    Plan.find({
        _id: {
            $in: [req.body.compare1, req.body.compare2]
        }
    }, function (err, plans, count) {
        if (err) {
            res.send(err);
        }

        let newTotal1 = 0;
        let usedTotal1 = 0;
        let quantityTotal1 = 0;
        let newTotal2 = 0;
        let usedTotal2 = 0;
        let quantityTotal2 = 0;

        for (let i = 0; i < plans[0].items.length; i++) {
            newTotal1 += plans[0].items[i].newCost * plans[0].items[i].quantity;
            usedTotal1 += plans[0].items[i].usedCost * plans[0].items[i].quantity;
            quantityTotal1 += plans[0].items[i].quantity;
        }

        for (let i = 0; i < plans[1].items.length; i++) {
            newTotal2 += plans[1].items[i].newCost * plans[1].items[i].quantity;
            usedTotal2 += plans[1].items[i].usedCost * plans[1].items[i].quantity;
            quantityTotal2 += plans[1].items[i].quantity;
        }

        plans[0]["newTotal"] = newTotal1;
        plans[0]["usedTotal"] = usedTotal1;
        plans[0]["quantityTotal"] = quantityTotal1;

        plans[1]["newTotal"] = newTotal2;
        plans[1]["usedTotal"] = usedTotal2;
        plans[1]["quantityTotal"] = quantityTotal2;

        res.render('comparePlans', {
            plans: plans
        });

    });
});

//Most of my passport code was from this tutorial (Reference 4 in my readMe)
//https://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
function login(passport) {

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            // check in mongo if a user with username exists or not
            User.findOne({
                    'username': username
                },
                function (err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user) {
                        console.log('User Not Found with username ' + username);
                        return done(null, false, req.flash('message', 'User Not found.'));
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)) {
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    console.log("LOGGED IN");
                    return done(null, user);
                }
            );

        }));


    const isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    }

}

function signup(passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {

            findOrCreateUser = function () {
                // find a user in Mongo with provided username
                User.findOne({
                    'username': username
                }, function (err, user) {
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        const newUser = new User({
                            username: username,
                            password: createHash(password)
                        });

                        // save the user
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));

    // Generates hash using bCrypt
    const createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

app.listen(process.env.PORT || 3000);