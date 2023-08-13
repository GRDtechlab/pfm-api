import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
const { verify, sign } = jwt;

const generateRefreshToken = (refreshToken, req, res, next) => {
  if (!refreshToken) {
    res.status(401);
    throw new Error("Refresh token is not provided.");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("Refresh token generation failed. Login again.");
    }

    const accessToken = sign(
      {
        user: { ...decoded.user },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "25m" }
    );

    res.clearCookie("jwt");

    res.cookie("jwt", `${accessToken}split${refreshToken}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict", //  Enforce secure cookies & // Prevent CSRF attacks by setting sameSite
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    req.user = decoded.user;
    req.accessToken = accessToken;
    next();
  });
};

const validateToken = asyncHandler(async (req, res, next) => {
  if (!req.headers.cookie) {
    res.status(401);
    throw new Error("User is not authorized or token is missing.");
  }

  let aToken = req.headers.cookie.split("=")[1].split("split")[0];
  let rToken = req.headers.cookie.split("=")[1].split("split")[1];
  let token;
  let authHeader =
    req.headers.Authorization || req.headers.authorization || aToken;

  authHeader = `Bearer ${authHeader}`;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          generateRefreshToken(rToken, req, res, next);
        } else {
          res.status(403);
          throw new Error("User is not authorized.");
        }
      }
      req.user = decoded.user;
      next();
    });
  }
  if (!token) {
    res.status(401);
    throw new Error("User is not authorized or token is missing.");
  }
});

export default validateToken;
