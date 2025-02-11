const dbcon = require("./connection");

module.exports.addStudent = (id, name, city, phone_number) => {
    return new Promise((resolve, reject) => {
        dbcon.query(`INSERT INTO students (id, name, city, phone_number) VALUES (?, ?, ?, ?);`,
    [id, name, city, phone_number], (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    };

module.exports.deleteStudent = (id) => {
  return new Promise((resolve, reject) => {
    dbcon.query(`delete from students where id=${id};`, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

module.exports.showStudents = () => {
  return new Promise((resolve, reject) => {
    dbcon.query(`SELECT * from students`, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

module.exports.getStudent = (id) => {
  return new Promise((resolve, reject) => {
    dbcon.query(`SELECT * from students where id=${id}`, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

