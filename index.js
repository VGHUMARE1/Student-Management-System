const express=require("express");
const app=express();
const path=require("path");
const cors=require("cors");
const mysql=require("mysql2");
const ejs=require("ejs");
const engine = require('ejs-mate');
const flash=require("connect-flash");
const db=require("./dbutil/connection")
const ExpressError = require("./utils/ExpressError.js");
app.use(express.static('public'));
app.set("view engine", "views");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

const studentRouter=require("./services/studentRouter");
const userRouter=require("./services/userRouter");


// Session management

app.use(
    session({
      secret: 'secretKey',
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(flash());
  
  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    // console.log(req.user);
    res.locals.currUser=req.user;
    next();
  });



// Passport Local Strategy
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return done(err);

      if (!results.length) return done(null, false, { message: 'Incorrect email.' });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) return done(null, user);
      else return done(null, false, { message: 'Incorrect password.' });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.userid);
});

passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM users WHERE userid = ?', [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});













// app.use(cors());

app.listen(3033,()=>{
    console.log("server started....");
})

app.use(studentRouter);
app.use(userRouter);
// app.get("/",(req,res)=>{
//     res.render("./templates/home",{name:"Vaishnavi"})
// })

app.use((err, req, res, next) => {
  let { status = 500, message = "Somthing going to be wrong" } = err;
  res.render("templates/error.ejs", { message });
})

