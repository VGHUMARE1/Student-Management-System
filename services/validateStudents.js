module.exports.validateStudents = (req, res, next) => {
  const { id, name, city, phone_number } = req.body;
  if (!id || !name || !city || !phone_number) {
    req.flash("error_msg", "add all filds");
    return res.redirect("/add-student");
  }
  if (phone_number > 10000000000 || phone_number < 999999999) {
    req.flash("error_msg", "Enter Valide Phone number");
    return res.redirect("/add-student");
  }
  if (isNaN(id)) {
    req.flash("error_msg", "Enter Valide Id");
    return res.redirect("/add-student");
  }
  next();
};
