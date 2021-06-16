const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, 'secretkey', {
    expiresIn: '1d',
  });
};

module.exports = generateToken;