// const Users=require("../modules/users");
const bcrypt = require("bcrypt");


// const bcrypt = require("bcrypt");
const db = require("./../dbutil/connection");
const { redirecturl } = require("../middlewares/authenticat");
module.exports.renderRegisterForm = (req, res) => {
  res.render("templates/registerForm.ejs");
};

module.exports.renderloginForm = (req, res) => {
  res.render("templates/loginForm.ejs");
};

module.exports.register = async (req, res) => {
  const { fname, lname, email, phone_number, password, status } = req.body;

  if (!fname || !lname || !email || !phone_number || !password || !status) {
    req.flash("error_msg", "Please fill in all fields.");
    return res.redirect("/");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
      INSERT INTO users (fname, lname, email, phone_number, password, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(
    query,
    [fname, lname, email, phone_number, hashedPassword, status],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          req.flash("error_msg", "Email or phone number already exists.");
          return res.redirect("/");
        }
        req.flash("error_msg", err.message);
        return res.redirect("/");
      }

      // Fetch the newly registered user
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err || !results.length) {
            req.flash("error_msg", err.message);
            return res.redirect("/");
          }

          const user = results[0];

          // Automatically log in the user
          req.login(user, (err) => {
            if (err) {
              req.flash("error_msg", "Login failed after registration.");
              return res.redirect("/");
            }
            req.flash(
              "success_msg",
              `Registration successful! Welcome, ${user.fname} ${user.lname}!`
            );
            res.redirect("/");
          });
        }
      );
    }
  );
};

module.exports.login = (req, res) => {
  req.flash("success_msg", "login successfully");
  res.redirect(res.locals.redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error_msg", "Error logging out.");
      return res.redirect("/");
    }
    req.flash("success_msg", "Successfully logged out.");
    res.redirect("/");
  });
};

module.exports.randerEditProfileForm = (req, res) => {
  res.render("templates/editProfileForm.ejs");
};

module.exports.editProfile = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    req.flash("error_msg", "New password and confirm password do not match.");
    return res.redirect("/editProfile");
  }

  try {
    // Compare the old password with the stored hash
    const isMatch = await bcrypt.compare(oldPassword, req.user.password);

    if (!isMatch) {
      req.flash("error_msg", "Old password is incorrect.");
      return res.redirect("/editProfile");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updateQuery = "UPDATE users SET password = ? WHERE userid = ?";
    db.query(updateQuery, [hashedPassword, req.user.userid], (err, result) => {
      if (err) {
        req.flash("error_msg", err.message);
        return res.redirect("/editProfile");
      }
      req.flash("success_msg", "Password updated successfully.");
      return res.redirect("/");
    });
  } catch (err) {
    req.flash("error_msg", err.message);
    return res.redirect("/editProfile");
  }
};
