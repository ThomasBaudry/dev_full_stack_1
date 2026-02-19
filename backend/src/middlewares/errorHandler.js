export const errorHandler = (err, req, res, _next) => {
  const status = err.status ?? 500;

  //console.error(err.message);

  res.status(status).json({
    error: status === 500 ? "Erreur interne du serveur" : err.message,
  });
};
