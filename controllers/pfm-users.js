import asyncHandler from "express-async-handler";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import user from "../models/pfm-users-models.js";

//@desc Get Users Data by User.
//@route GET /api/PFM/user/:userid
//@access public
const getPfmUsersByUser = asyncHandler(async (req, res) => {
  console.log("get-users");
  const data = await user.find({
    user_id: req.params.userid,
  });
  console.log(data);
  res.status(200).json(data);
});

//@desc POST Users Data [SignUp].
//@route POST /api/PFM/user/
//@access public
const addPfmUsersData = asyncHandler(async (req, res) => {
  const { firstname, lastname, occupation, email, password, confirm_password } =
    req.body;
  if (
    !firstname ||
    !lastname ||
    !occupation ||
    !email ||
    !password ||
    !confirm_password
  ) {
    res.status(400);
    throw new Error("All fields are mandatory to pass");
  }

  const isUserAvailable = await user.findOne({ email });
  if (isUserAvailable) {
    res.status(400);
    throw new Error("User already registered.");
  }

  // Hash password using bcrypt...

  const hashedPassword = await hash(password, 10);
  console.log({ hashedPassword });
  const pfmUserAdded = await user.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    occupation,
  });
  if (pfmUserAdded) {
    res.status(201).json({ message: "User created." });
  } else {
    res.status(400);
    throw new Error("Something went wrong. User has not been created.");
  }
});

//@desc POST Login.
//@route POST /api/PFM/user/login
//@access public
const pfmUserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const isUserLoggedIn = await user.findOne({ email });

  if (isUserLoggedIn && (await compare(password, isUserLoggedIn.password))) {
    const userObject = {
      _id: isUserLoggedIn._id,
      firstname: isUserLoggedIn.firstname,
      lastname: isUserLoggedIn.lastname,
      occupation: isUserLoggedIn.occupation,
      email: isUserLoggedIn.email,
    };
    const accessToken = sign(
      {
        user: {
          ...userObject,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "25m" }
    );
    const refreshToken = sign(
      {
        user: {
          ...userObject,
        },
      },
      process.env.REFRESH_TOKEN_SECRET
    );

    const isRefreshTokenAddedToDB = await user.updateOne(
      { _id: isUserLoggedIn._id },
      { $set: { refresh_token: refreshToken } },
      { upsert: true }
    );

    res.clearCookie("jwt");

    res.cookie("jwt", `${accessToken}split${refreshToken}`, {
      httpOnly: true,
      secure: true,
      sameSite: "none", //  Enforce secure cookies & // Prevent CSRF attacks by setting sameSite
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      message: "You logged in successfully!",
      auth: {
        accessToken,
        user: {
          ...userObject,
        },
      },
    });
  } else {
    res.status(401);
    throw new Error("email or password is not valid.");
  }
});

//@desc POST User logout.
//@route POST /api/PFM/user/logout
//@access public
const pfmUserLogout = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  if (!req.headers.cookie) {
    res.status(401);
    throw new Error("User is not authorized or token is missing.");
  }
  let aToken = req.headers.cookie.split("=")[1].split("split")[0];
  let rToken = req.headers.cookie.split("=")[1].split("split")[1];

  let deleteRefreshTokenFromDB = await user.updateOne(
    { _id },
    { $unset: { refresh_token: 1 } }
  );

  console.log("Logged out...");

  res.clearCookie("jwt");
  res.status(201).json({ message: "User logged out" });
});

//@desc POST Check current user is loggedIn or not.
//@route POST /api/PFM/user/userloggedin
//@access public
const pfmCheckUserIsLoggedIn = asyncHandler(async (req, res) => {
  console.log(req.user);
  res.status(201).json({
    message: "You logged in successfully!",
    auth: {
      accessToken: req.accessToken,
      user: {
        ...req.user,
      },
    },
  });
});

//@desc POST Email Availability.
//@route POST /api/PFM/user/:email
//@access public
const pfmCheckEmailAvailability = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log({ email });
  const data = await user.findOne({ email });

  if (!data) {
    res.status(401);
    throw new Error("Email is not available");
  }
  res.status(201).json({ data: [{ email: req.body.email }] });
});

export {
  getPfmUsersByUser,
  addPfmUsersData,
  pfmUserLogin,
  pfmUserLogout,
  pfmCheckUserIsLoggedIn,
  pfmCheckEmailAvailability,
};
