const express=require("express")
const path=require("path")
const router = express.Router({ mergeParams: true });
const dbcon=require("../dbutil/connection");
router.use(express.static(path.join(__dirname, "/public")));
router.use(express.urlencoded({ extended: true }));
const middleware=require("./../middlewares/authenticat");
const studentController=require("../controllers/students")
const {validateStudents}=require("./validateStudents")

const query=require("../dbutil/queries");
router.get("/",(req,res)=>{
     res.render("templates/home.ejs");
});


router.get("/get-student-by-id",middleware.isLoggedIn,(req,res)=>{
    res.render("templates/getStudentForm.ejs");
})
router.post("/get-student-by-id",middleware.isLoggedIn,studentController.getStudent)
router.get("/delete-student",middleware.isLoggedIn,(req,res)=>{  
    res.render("templates/deleteStudentForm.ejs");
})

router.post("/delete-student",middleware.isLoggedIn,studentController.deleteStudent)



router.get("/add-student",middleware.isLoggedIn,studentController.renderStudentForm)



router.post("/add-student",middleware.isLoggedIn,validateStudents,studentController.addStudent)


router.get("/show-students",middleware.isLoggedIn,studentController.showStudents)
module.exports=router;