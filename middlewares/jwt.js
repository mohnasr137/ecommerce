const expressJwt = require("express-jwt");

function authJwt() {
  return expressJwt({
    secret: "key",
    algorithm: ["HS256"]
  });
}

module.exports = authJwt;
