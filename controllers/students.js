const query=require("./../dbutil/queries");
module.exports.showStudents=(req,res,next)=>{

   query.showStudents().then((data)=>{
   res.render("templates/showStudent.ejs",{students : data});
   }).catch((err)=>{
      next(err);
   });
    
}

module.exports.addStudent=(req,res,next)=>{
    const {id,name,city,phone_number}=req.body;

     query.addStudent(id,name,city,phone_number).then((data)=>{
        req.flash('success_msg', 'Student added Successfully.');
        res.redirect("/");
        }).catch((err)=>{
            req.flash('error_msg', err.message);
          res.redirect("/");
        });
     
}

module.exports.renderStudentForm=(req,res)=>{
   
    res.render("templates/addStudentForm.ejs");
}

module.exports.deleteStudent=(req,res)=>{
    const {id}=req.body;
     let student=query.deleteStudent(id).then((data)=>{
        req.flash('success_msg', 'Student deleted Successfully.');
        res.redirect('/');
        }).catch((err)=>{
            req.flash('error_msg', err.message);
        return res.redirect('/');
        });
}

module.exports.renderDeleterStudent=(req,res)=>{
    
    res.render("templates/deleteStudentForm.ejs");
}

module.exports.getStudent=(req,res)=>{
    const {id}=req.body;
    query.getStudent(id).then((data)=>{
        res.render("templates/showStudent.ejs",{students : data});
        }).catch((err)=>{
           res.send(err);
        });
}