var signIn = new OktaSignIn({
  baseUrl: "https://vanbeektech.okta.com",
  clientId: '0oa59g7abcimEmsxS1t7',
  redirectUri: 'http://localhost:9000',
  authParams: {
issuer: "https://vanbeektech.okta.com/oauth2/aus59g4uumuNQn5Wc1t7",
  responseType: ['id_token', 'token'],

  scopes: ['openid', 'email', 'groups']
},
idps: [
  {type: 'GOOGLE', id: '0oa4prxm32LWwm1D91t7'}
]
});


var authClient = new OktaAuth({
    url: 'https://vanbeektech.okta.com',
    clientId: '0oa59g7abcimEmsxS1t7',
    redirectUri: 'http://localhost:9000'
});

signIn.session.get((response) => {
    if (response.status !== 'INACTIVE') {

    } else {
    }

});

function tokenGraber(signIn, authClient){
this.signIn = signIn
this.authClient = authClient
this.token = function() {
if(this.signIn.tokenManager.get('my_access_token') != null){
 return this.signIn.tokenManager.get('my_access_token')
} else {
 this.authClient.token.parseFromUrl()
 .then(function(tokenOrTokens) {
    return tokenOrTokens
  })
    .catch(function(err) {
      // handle OAuthError
});
}
}
this.claims = function(){
if(this.token() != null){
 return authClient.token.decode(this.token().accessToken)
}
}
this.tokenUser = function(){
if(this.claims() != null){
 return this.claims().payload.comic
}
}
this.userGroupsClaims = function(){
if(this.claims() != null){
 var cleanedGroupClaims = []
 this.claims().payload.group.forEach(function(group) {
    var seperateGroup = group.split(":")
    cleanedGroupClaims.push(seperateGroup[0])
 });
}
return cleanedGroupClaims
}

};

var tokenToBeGrabbed = new tokenGraber(signIn, authClient)
var access_token = tokenToBeGrabbed.token()
var claims = tokenToBeGrabbed.claims()
var tokenUser = tokenToBeGrabbed.tokenUser()
console.log(tokenToBeGrabbed.userGroupsClaims())

signIn.renderEl({el: '#sign-in-container'}, function (res) {
  if (res.status !== 'SUCCESS') {
    return;
  }
console.log(res)
  // When specifying authParams.responseType as 'id_token' or 'token', the
  // response is the token itself
  signIn.tokenManager.add('my_access_token', res[1]);
  signIn.tokenManager.add('my_id_token', res[0]);
  window.location.href = "http://localhost:9000?token=" + res[1].accessToken
});
