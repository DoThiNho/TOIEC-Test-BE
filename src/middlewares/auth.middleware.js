exports.loggedin = (req, res, next) => {
  if (req.session.loggedin) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.redirect(`${process.env.CLIENT_URL}login`);
  }
};

exports.isAuth = (req, res, next) => {
  if (req.session.loggedin) {
    res.locals.user = req.session.user;
    res.redirect(`${process.env.CLIENT_URL}home`);
  } else {
    next();
  }
};
