
const {
    OAuth2Client
} = require('google-auth-library');



const oAuthController = {};


oAuthController.verifyToken = (req, res, next) => {
  console.log('here');
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const { token } = req.body;
  
  async function verify() {
      
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
          });
          const payload = ticket.getPayload();
          const userId = payload['sub'];
          const { email, given_name, family_name } = payload;
          res.locals.username = email;
          res.locals.firstName = given_name;
          res.locals.lastName = family_name;
          res.locals.oAuth = true;
          return next();
      
      }
      verify().catch(console.error);
  
}

module.exports = oAuthController;