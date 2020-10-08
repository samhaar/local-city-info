const jwt = require('jsonwebtoken');

const SECRET = 'ooh what a secret that is, I can\'t believe it';
const EXPIRATION_TIME_IN_SECS = (3 * 24 * 60 * 60); // 3 days

const sessionController = {};

sessionController.setJWT = (req, res, next) => {
  const jwtOptions = {
    expiresIn: EXPIRATION_TIME_IN_SECS,
  };

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + (EXPIRATION_TIME_IN_SECS + 60) * 1000),
  };

  const { username } = res.locals;
  const payload = {
    username,
  };

  jwt.sign(payload, SECRET, jwtOptions, (err, token) => {
    if (err) return next(err);
    res.cookie('jwt', token, cookieOptions);
    return next();
  });
};

sessionController.validateSession = (req, res, next) => {
  if (!req.cookies) return next('no cookies!');

  const token = req.cookies.jwt;
  if (!token) return next('no JWT!');

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return next('JWT verification error!');

    const { username } = decoded;
    res.locals.username = username;
    return next();
  });
};

sessionController.logOut = (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 3 * 1000),
  };

  res.cookie('jwt', 'sjhdfkj', cookieOptions);
  return next();
};

module.exports = sessionController;
