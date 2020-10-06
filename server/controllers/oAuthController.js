const OAuth2Data = require('../oAuth.env');
const {
    OAuth2Client
} = require('google-auth-library');

const CLIENT_ID = OAuth2Data.client.id;
const CLIENT_SECRET = OAuth2Data.client.secret;
const REDIRECT_URL = OAuth2Data.client.redirect;


const oAuthController = {};


oAuthController.verifyToken = (req, res, next) => {
  const client = new OAuth2Client(CLIENT_ID);
  const { token } = req.body;

  async function verify() {
      
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
          });
          const payload = ticket.getPayload();
          const userId = payload['sub'];
          const { email, given_name, family_name } = payload;
          res.locals.userName = email;
          res.locals.firstName = given_name;
          res.locals.lastName = family_name;
          res.locals.oAuth = true;
          return next();
      
      }
      verify().catch(console.error);
  
}

module.exports = oAuthController;