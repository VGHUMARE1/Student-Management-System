const mysql=require("mysql2");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vaishnavi',
    database: 'vaishnavi'
  })
  
  connection.connect()

//   connection.query('SELECT * from students', (err, rows, fields) => {
//     if (err) throw err
  
//     console.log('The solution is: ', rows)
//   })
  

  module.exports=connection;