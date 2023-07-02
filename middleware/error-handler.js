import PFM_ERROR_CODES from "../constants.js";

const errorHandler = (err, req, res, next) => {
  console.log(res.statusCode, " s-code");
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case PFM_ERROR_CODES.VALIDATION:
      res.json({
        title: "Validation Failed",
        error: err.message,
        statckTrace: err.statck,
      });
      break;
    case PFM_ERROR_CODES.NOT_FOUND:
      res.json({
        title: "Not Found",
        error: err.message,
        statckTrace: err.statck,
      });
      break;
    case PFM_ERROR_CODES.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        error: err.message,
        statckTrace: err.statck,
      });
      break;
    case PFM_ERROR_CODES.FORBIDDEN:
      res.json({
        title: "Forbidden",
        error: err.message,
        statckTrace: err.statck,
      });
      break;
    case PFM_ERROR_CODES.SERVER:
      res.json({
        title: "Server error",
        error: err.message,
        statckTrace: err.statck,
      });
      break;
    default:
      console.log("No error..");
      break;
  }
};

export default errorHandler;
