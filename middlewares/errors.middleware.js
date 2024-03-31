const errorHandler = (error, req, res, next) => {
  return res.status(409).json({
    success: false,
    message: error.message,
  });
};

export default errorHandler;
