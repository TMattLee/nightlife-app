'use strict';

var fs = require('fs');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var axios = require('axios')
var findOrCreate = require('mongoose-findorcreate')

var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../../nl-auth.js'); // 
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var dummyData = require('./dummyData.js');

var app = express();

mongoose.connect( config.MONGOLAB_URI );

/*------------------------------------------------------------------------------
------------------------------ Mongoose Schemas --------------------------------
------------------------------------------------------------------------------*/

var Schema = mongoose.Schema;

var user = new Schema({
  userId: String,
  barList: {},
  isTwitterVerified: Boolean,
  twitterToken:  String,
  twitterHandle: String,
});

var bar = new Schema({
  barCounts: {}
});

bar.plugin( findOrCreate );

var User = mongoose.model( 'nightlifeappusers', user );
var Bar = mongoose.model( 'nightlifeappbars', bar );

//------------------------------------------------------------------------------


/*------------------------------------------------------------------------------
------------------------------ Passport Strategies -----------------------------
------------------------------------------------------------------------------*/

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'lululumoo';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  // database call:
  User.findOne(
    {
      userId: jwt_payload.userId
    },
    (error, docs) => {
      if(error){
        console.log(error);
        return next(error, false);
      }
      if (docs) {
        next(null, { 
          userId: docs.userId,
          displayName: docs.twitterHandle || docs.userId
        });
      } else {
        next(null, false);
      }
  });
});

var twitterLogin = new TwitterStrategy({
    consumerKey: config.TWITTER_CONSUMER_KEY,
    consumerSecret: config.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://www.tmattlee.com/nightlife-app/auth/twitter/callback"
  },
  ( token, tokenSecret, profile, done ) => {
    User.findOne(
      { 
        userId: profile.id 
      },
      ( err, user ) => {
        
        if ( !user ){
          let newUser = new User();
          newUser.userId = profile.id;
          newUser.barList = {
            test: null
          };
          newUser.isTwitterVerified = true;
          newUser.twitterToken =  token;
          newUser.twitterHandle = profile.username;
          newUser.save( ( error ) => {
            if ( error ) console.log( error );
            return done( err, newUser );
          });
        }
        else{
          return done( err, user );
        }
    });
  }
)

passport.use( strategy );

passport.use( twitterLogin );

//-----------------------------------------------------------------------------


app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(__dirname + '/../client'));
app.use(passport.initialize());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({ 
  secret: '1d03kdak2k39fjzjAjfdDijAjDJ',
  cookie: { 
    expires:  new Date(Date.now() + 60*60*1000),
  }
}));

passport.serializeUser( (user, done ) => {
  done(null, user);
});

passport.deserializeUser( (user, done ) => {
  done(null, user);
});

app.get('/auth', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send({
    auth:         'AUTHORIZED',
    userId:          req.user.userId,
    displayName:  req.user.displayName,
  });
});

app.get('/auth/twitter', passport.authenticate('twitter'), ( req, res ) => {
});

app.get('/auth/twitter/callback' , passport.authenticate('twitter', { failureRedirect: '/nightlife-app/fail' }),
  (req, res) => {
    let payload = { 
      userId: req.user.userId,
      displayName: req.user.twitterHandle
    };
    let token = jwt.sign(payload, jwtOptions.secretOrKey, {
      expiresIn: 60*60*1 // seconds
    });
    let currentDate = new Date();
    let expireDate = new Date(
      currentDate.setHours( currentDate.getHours() + 1 ) // expires in one hour
    );
    res.cookie('realcookie0202', token, {
      path: '/nightlife-app',
      expires: expireDate,
      secure: 'true',
    });
    
    // Successful authentication, redirect dashboard.
    res.redirect('/nightlife-app');
});
  

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/dashboard", (req, res) => {
  res.render("homepage");
});

app.get("/signout", ( req, res ) => {
  if( req.session ){
    req.session.destroy( ( error ) => {
      if ( error ) console.log( error );
      res.send('signed out');
    });
  }
})

app.get('/graphql', ( req, res ) => {
  if(!config.YELP_TOKEN){
    axios({
      method: 'POST',
      url:'https://api.yelp.com/oauth2/token',
      params:{
        client_id: config.YELP_CLIENT_ID,
        client_secret: config.YELP_CLIENT_SECRET
      },
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        grant_type: 'client_credentials',
      }
    })
      .then( response => {
        res.send('404')
      })
      .catch( error => {
        console.log( error )
      });
  }
});

app.post('/search/:location', ( req, res ) => {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + config.YELP_TOKEN;
  axios.get('https://api.yelp.com/v3/businesses/search?limit=20&categories=bars&location='+ req.params.location)
    .then( response => {
      const data = response.data.businesses;
      
      res.send( data );
    })
    .catch( error => {
      console.log( error )
    });
});

app.post('/getattendingcount', ( req, res ) => {
  const { itemKey, itemId } = req.query;
  Bar.findById(
    {
      _id: '598fecf5e559855e033c30ef'
    },
    ( error, result ) => {
      if ( error ) console.log( error );
      let barCounts = result.barCounts;
      if( !barCounts.hasOwnProperty( itemId ) ){
        result.barCounts[ itemId ] = 0;
      }
      Bar.findByIdAndUpdate(
        {
          _id: '598fecf5e559855e033c30ef'
        },
        {
          barCounts: result.barCounts,
        },
        {
          new: true,
        },
        ( error, newResult ) => {
        if ( error ) console.log( error );
        res.send( newResult )
      });
  });
});

app.post('/getattendingcountbars', ( req, res ) => {
  const { bars, userId } = req.body;
  let counter = 0;
  Bar.findById(
    {
      _id: '598fecf5e559855e033c30ef'
    },
    ( error, result ) => {
      if ( error ) console.log( error );
      let barCounts = result.barCounts;
      for ( let i = 0; i < bars.length; i++){
        if( !barCounts.hasOwnProperty( bars[ i ].id ) ){
          result.barCounts[ bars[ i ].id ] = 0;
        }
      }
      Bar.findByIdAndUpdate(
        {
          _id: '598fecf5e559855e033c30ef'
        },
        {
          barCounts: result.barCounts,
        },
        {
          new: true,
        },
        ( error, barsBeingAttended ) => {
          if ( error ) console.log( error );
          User.findOne(
            {
              userId: userId,
            },
            ( error, userResult ) => {
              if ( error ) console.log( error );
              if( !userResult ){
                res.send( {
                  userBarList: null,
                  barsBeingAttended: barsBeingAttended
                });
              }
              else {
                res.send( {
                  userBarList: userResult.barList,
                  barsBeingAttended: barsBeingAttended
                });
              }
          });
      });
  });
});

app.post('/set-is-going', ( req, res )  => {
  const { userId, itemId, count } = req.query;
  let queryString = 'barCounts.' + itemId; 
  let bars = null;
  Bar.findByIdAndUpdate(
    {
      _id: '598fecf5e559855e033c30ef',
    },
    {
      [queryString]: parseInt(count) + 1,
    },
    {
      new: true 
    },
    ( error, result ) => {
      bars = result
      if ( error ) console.log( error );
      User.findOne(
        {
          userId: userId,
        },
        ( error, result ) => {
          if ( error ) console.log( error );
          result.barList[ itemId ] = true;
          User.findOneAndUpdate(
            {
              userId: userId
            },
            {
              barList: result.barList
            },
            {
              new: true,
            },
            ( error, newResult ) => {
              if ( error ) console.log( error )
              res.send({
                userBarList: newResult.barList,
                bars: bars
              });
          });
      });
  });
});

app.post("/set-is-not-going", ( req, res ) => {
  const { userId, itemId, count } = req.query;
  let queryString = 'barCounts.' + itemId; 
  let bars = null;
  Bar.findByIdAndUpdate(
    {
      _id: '598fecf5e559855e033c30ef',
    },
    {
      [queryString]: parseInt(count) - 1,
    },
    {
      new: true 
    },
    ( error, result ) => {
      bars = result
      if ( error ) console.log( error );
      User.findOne(
        {
          userId: userId,
        },
        ( error, result ) => {
          if ( error ) console.log( error );
          result.barList[ itemId ] = false;
          User.findOneAndUpdate(
            {
              userId: userId
            },
            {
              barList: result.barList
            },
            {
              new: true,
            },
            ( error, newResult ) => {
              if ( error ) console.log( error )
              res.send({
                userBarList: newResult.barList,
                bars: bars
              });
          });
      });
  });
});

app.listen(3001, function(){
  console.log("Listening on port ", 3001)
});