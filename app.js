require('dotenv').config();

var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    User                = require("./models/user"),
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    flash               = require("connect-flash"),
    seedDB              = require("./seeds")

// require routes
    var commentRoutes       = require("./routes/comments"),
        campgroundRoutes    = require("./routes/campground"),
        authRoutes          = require("./routes/auth")

    // How to connect to MongoDb using Mongoose Npm package
    mongoose.connect('mongodb://localhost:27017/yelp_camp_v2', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");
    app.use(methodOverride("_method"));
    app.use(flash());

    
    // seedDB(); //seed the database
    app.use(express.static(__dirname + "/public"));

    
    app.locals.moment = require('moment');

    // PASSPORT CONFIG  
    app.use(require("express-session")({
      secret: "Rusty wins cutest dog!",
      resave: false,
      saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use(function(req, res, next){
      res.locals.currentUser = req.user;
      res.locals.error = req.flash("error");
      res.locals.success = req.flash("success");
      next();
    });

    app.use(authRoutes);
    app.use("/campgrounds/:id/comments", commentRoutes);
    app.use("/campgrounds", campgroundRoutes);


app.listen(3000, function(){
  console.log("YelpCamp connected on port 3000!")
});