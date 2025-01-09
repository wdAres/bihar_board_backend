const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const previousDataModel = require("../models/previousModel");
const ejs = require('ejs');
 const pdf = require('html-pdf'); 
 const archiver = require('archiver'); 
  const path = require('path');
const PreviousDataController = require("../controllers/PreviousDataController");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-csv", upload.single("file"), async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (data) => {
        // Log each row of data to verify CSV parsing
        console.log("Parsed Data:", data);
        results.push(data);
      })
      .on("end", async () => {
        try {
          // Log the entire results array to verify all data
          console.log("All Parsed Data:", results);
          for (const item of results) {
            const dataToSave = {
              student_name: item.student_name || "",
              student_father_name: item.student_father_name || "",
              student_mother_name: item.student_mother_name || "",
              dob_in_figures: item.dob_in_figures || "2000-01-01",
              student_category: item.student_category || "",
              student_sex: item.student_sex || "",
              student_aadhar_no: item.student_aadhar_no || "",
              pin_code_no: item.pin_code_no || "000000",
              school_name_2: item.school_name_2 || "",
              student_required_subject: item.student_required_subject || "",
              additional_subject: item.additional_subject || "",
              // student_signature: item.student_signature || "",
              // student_photo: item.student_photo || "",
              centre_name: item.centre_name || "",
              school_name: item.school_name || "",
              centre_code: item.centre_code || "",
              registration_no: item.registration_no || "",
              // student_parents_signature: item.student_parents_signature || "",
              // assistant_signature: item.assistant_signature || item.assistant_signature, // Ensure path is saved as-is
              // secretary_signature: item.secretary_signature || "",
              // exam_controller_signature: item.exam_controller_signature || "",
              permission_no: item.permission_no || "",
              roll_no: item.roll_no || "",
            };

            // Log the data that will be saved
            console.log("Data to Save:", dataToSave);

            await previousDataModel.create(dataToSave);
          }
          res.status(200).json({ message: "Data uploaded successfully" });
        } catch (saveError) {
          console.error("Error saving data:", saveError);
          res
            .status(500)
            .json({ message: "Error saving data to database", saveError });
        }
      });
  } catch (error) {
    console.error("Error reading CSV file:", error);
    res.status(500).json({ message: "Error reading CSV file", error });
  }
});



// router.get('/', async (req, res) => 
//     { try { const students = await previousDataModel.findAll(); 
//         res.status(200).json({ success: true, data: students });
//      } catch (error)
//       { res.status(500).json({ success: false, message: 'An error occurred while fetching students.', error: error.message });
//      } });

router.get('/',PreviousDataController.getDocument)

// router.get("/download-admit-card/:id", async (req, res, next) => {
//   try {
//     const studentId = req.params.id;
//     const studentData = await previousDataModel.findByPk(studentId);

//     if (!studentData) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     res.render("predata", { student: studentData,
//         board_logo:"http://127.0.0.1:8001/public/files/newLogo.png",
//         qr_code:"http://127.0.0.1:8001/public/files/qr.jpeg",
//      });
//   } catch (error) {
//     console.error("Error fetching student data:", error);
//     res.status(500).json({ message: "Error fetching student data", error });
//   }
// });

const generatePDF = async (student) => {
  return new Promise((resolve, reject) => {
    const templatePath = path.join(__dirname, "../","views","admit_card.ejs");
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    console.log(templateContent)
    const htmlContent = ejs.render(templateContent,
         {
        student_name: student.student_name,
                    student_father_name: student.student_father_name,
                    student_mother_name: student.student_mother_name,
                    dob_in_figures: "Date",
                    dob_in_words: student.dob_in_words,
                    student_cast: "",
                    student_category: (student.student_category).toUpperCase(),
                    student_sex: (student.student_sex).toUpperCase(),
                    student_aadhar_no: student.student_aadhar_number,
                    school_name: student?.center?.school_name,
                    student_required_subject: student.student_required_subject,
                    // additional_subject: student.additional_subject,
                    additional_subject: "MATH",
                    student_signature: student?.student_signature,
                    student_photo: student?.student_photo,
                    board_logo:"http://127.0.0.1:8001/public/files/newLogo.png",
                    qr_code:"http://127.0.0.1:8001/public/files/qr.jpeg",
                    school_name:student.school_name
     });
    const options = { format: "A4"  };
    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer);
    });
  });
};

router.get("/download-admit-cards", async (req, res) => {

    // const studentId = req.params.id;
    const students = await previousDataModel.findAll();

  const zip = archiver("zip", { zlib: { level: 9 } });
  res.attachment("admit-cards.zip");
  zip.pipe(res);
  for (const student of students) {
    const pdfBuffer = await generatePDF(student);
    zip.append(pdfBuffer, { name: `${student.student_name}.pdf` });
  }
  zip.finalize();
});


router.get("/view-admit-card", async (req, res) => {

    // const studentId = req.params.id;
    const student = await previousDataModel.findByPk(1);

    res.render("admit_card", {
        student_name: student.student_name,
                    student_father_name: student.student_father_name,
                    student_mother_name: student.student_mother_name,
                    dob_in_figures: "Date",
                    dob_in_words: student.dob_in_words,
                    student_cast: "",
                    student_category: (student.student_category).toUpperCase(),
                    student_sex: (student.student_sex).toUpperCase(),
                    student_aadhar_no: student.student_aadhar_number,
                    school_name: student?.center?.school_name,
                    student_required_subject: student.student_required_subject,
                    // additional_subject: student.additional_subject,
                    additional_subject: "MATH",
                    student_signature: student?.student_signature,
                    student_photo: student?.student_photo,
                    board_logo:"http://127.0.0.1:8001/public/files/newLogo.png",
                    qr_code:"http://127.0.0.1:8001/public/files/qr.jpeg",
                    school_name:student.school_name
     }
        
    )

});


module.exports = router;
