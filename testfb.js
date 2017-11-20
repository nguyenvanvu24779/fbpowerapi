
var FB = require('fb');
FB.api('oauth/access_token', {
    client_id: '766982643351181',
    client_secret: '21f7ada18822c11a2c82c4e05bb51318',
    grant_type: 'client_credentials'
}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }

    var accessToken = res.access_token;
    var expires = res.expires ? res.expires : 0;
    
    console.log(accessToken);
});