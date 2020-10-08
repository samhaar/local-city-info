const { OAuth2Client } = require('google-auth-library');

const oAuthController = {};

oAuthController.verifyToken = (req, res, next) => {
  const respondTokenNotValid = () => (
    res.status(401).json({ isLoggedIn: false })
  );

  const client = new OAuth2Client(process.env.CLIENT_ID);
  const { token } = req.body;

  if (!token) respondTokenNotValid();

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    if (!ticket) respondTokenNotValid();

    const payload = ticket.getPayload();
    const userId = payload.sub;
    const { email, given_name, family_name } = payload;
    res.locals.userId = userId;
    res.locals.username = email;
    res.locals.firstName = given_name;
    res.locals.lastName = family_name;
    res.locals.isLoggedIn = true;
    return next();
  }

  verify().catch(console.error);
};

module.exports = oAuthController;