const express = require('express')
const app = express()
const session = require('express-session');


app.set('view engine', 'ejs')

const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://vanbeektech.okta.com/oauth2/aus59g4uumuNQn5Wc1t7'
})

app.use(session({
  secret: 'this should be secure',
  resave: true,
  saveUninitialized: true
}));


app.use(express.static('public'))
app.get('/', (req, res) => {
  var token = req.query.token
  if(req.session.oktaSession){
    console.log(req.session.oktaSession)
    res.render('index')
  }
  oktaJwtVerifier.verifyAccessToken(token)
  .then(jwt => {
    console.log(jwt.claims);
    var expressSession = req.session;
    expressSession.oktaSession = true;
    res.redirect('/')
  })
  .catch(err => {
    res.redirect('/login')
  });
})



app.get('/login', (req, res) => {
  // res.redirect('https://localhost:9000')
  console.log(req.session.oktaSession)
  if(req.session.oktaSession){
    res.redirect('http://localhost:9000')
  } else {
    res.render('login')
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect("/login")
})


server = app.listen(9000)

const io = require("socket.io")(server)


io.on('connection', (socket) => {
   console.log('New User Connected')
   socket.username = "Anonymous"
   socket.on('change_username', (data) => {
     socket.username = data.username
   })

   socket.on('new_message', (data) => {
     io.sockets.emit('new_message', {message: data.message, username: socket.username})
   })

})
