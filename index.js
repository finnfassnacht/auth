const CE_APP = process.env.CE_APP
const CE_DOMAIN = process.env.CE_DOMAIN
const CE_SUBDOMAIN = process.env.CE_SUBDOMAIN
const url = "https://" + CE_APP + "." + CE_SUBDOMAIN + "." + CE_DOMAIN
const callback_url = (url + "/appid/callback")

const express = require('express'); 								
const session = require('express-session');							
const passport = require('passport');							
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;	

const app = express();
app.use(express.static('www'));
app.use(session({
	secret: '123456',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy({
    "tenantId": "dd961bcb-05c5-43f7-a533-bd07f7c95197",
    "clientId": "5a3cd5d7-b6bc-42d8-86b1-f0c4e50bbe05",
    "secret": "MWFmNzI5NGEtOTcxMi00NTk3LTllMjUtZWVjMmZhZTRmMGIz",
    "oAuthServerUrl": "https://us-east.appid.cloud.ibm.com/oauth/v4/dd961bcb-05c5-43f7-a533-bd07f7c95197",
    "profilesUrl": "https://us-east.appid.cloud.ibm.com", 
	"redirectUri": callback_url
}));

// Handle Login
app.get('/appid/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
	successRedirect: '/',
	forceLogin: true
}));
app.get('/appid/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
// Handle callback
app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.use('/secret', (req, res, next) => {
	if (req.user){
        next()
	} else {
		res.status(401).send("Unauthorized <a href='/appid/login'>log in</a>");
	}
})
app.get("/secret/secret", (req, res) => {
    res.send("<h2> Hey " + (req.user).name + " <br>secret info here</h2> <a href='/appid/logout'>Log out</a>")
    res.end()
})
app.get("/secret/test", (req, res) => {
    res.send("some test, secret route <a href='/appid/logout'>Log out</a>")
    res.end()
})
app.get("/test", (req, res) => {
    res.send("some test, no secret route " + callback_url)
    res.end()
})

// Start server
app.listen(8080, () => {
    console.log('Server is Running!!');
});