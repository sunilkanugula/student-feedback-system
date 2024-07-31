const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const dbPath = "./feedback.db";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
let db;

const connectDB = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        console.log("Database connected successfully");

        // Check if the students table exists
        const tableExists = await db.get(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='students'"
        );

        if (!tableExists) {
         
            // If the students table doesn't exist, create it
            await createTable();
        }
    } catch (error) {
        console.error("Error connecting to database", error.message);
        process.exit(1);
    }
};

const createTable = async () => {
    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS students (
                student_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                branch TEXT NOT NULL,
                semester INTEGER NOT NULL,
                current_academic_year TEXT NOT NULL
            )
        `);
        console.log("Table created successfully");
    } catch (error) {
        console.error("Error creating table", error.message);
    }
};

const PORT =  process.env.PORT || 5000;;
const SECRET_KEY = "MY_SECRET_KEY";

// Route to handle form submission and insert data into database
app.post("/register", async (req, res) => {
    const { username, password, branch, student_id } = req.body;
   

    try {
        // Check if the username already exists
        const checkUsernameQuery = `
            SELECT COUNT(*) AS count
            FROM students
            WHERE username = ?
        `;
        const { count } = await db.get(checkUsernameQuery, [username]);
        
        if (count > 0) {
    
            // Username already exists, send a message indicating so
            return res.status(400).send("Username already exists");
        }

        // If username doesn't exist, proceed with registration
        const final_password = await bcrypt.hash(password, 10);
        const insertQuery = `
            INSERT INTO students (student_id, username, password, branch)
            VALUES (?, ?, ?, ?)
        `;
        await db.run(insertQuery, [student_id, username, final_password, branch]);
        
        res.send("Registration successful");
    } catch (error) {
        console.error("Error registering student", error.message);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/hod-register", async (req, res) => {
    const { hod_id, username, password, branch } = req.body;
    const final_password = await bcrypt.hash(password, 10);
    try {
        // Check if the username already exists
        const checkUsernameQuery = `SELECT * FROM hod_details WHERE username = ?`;
        const existingUser = await db.get(checkUsernameQuery, [username]);
        if (existingUser) {
            res.status(400).send("Username already exists");
            return; // Exit the function
        }

        // If the username doesn't exist, proceed with registration
        const insertQuery = `INSERT INTO hod_details (hod_id, username, password, branch) VALUES (?, ?, ?, ?)`;
        await db.run(insertQuery, [hod_id, username, final_password, branch]);
        res.send("Registration successful");
    } catch (error) {
        console.log("Error registering HOD", error.message);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/principal-register", async (req, res) => {
    const { principal_id, username, password } = req.body;
    const final_password = await bcrypt.hash(password, 10);

    try {
        // Check if the username already exists
        const checkUsernameQuery = `SELECT * FROM Principal WHERE username = ?`;
        const existingUser = await db.get(checkUsernameQuery, [username]);

        if (existingUser) {
            res.status(400).send("Username already exists");
            return; // Exit the function
        }

        // If the username doesn't exist, proceed with registration
        const insertQuery = `INSERT INTO Principal (principal_id, username, password) VALUES (?, ?, ?)`;
        await db.run(insertQuery, [principal_id, username, final_password]);

        res.send("Registration successful");
    } catch (error) {
        console.error("Error registering Principal:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle login
app.post("/login", async (req, res) => {
    const { username, password ,branch} = req.body;
    
    try {
        const user = await db.get(
            "SELECT * FROM students WHERE username = ?",
            [username] 
        );
       
        if (!user) {
           
            res.status(400).send("Invalid username or password");
            return;
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (isPasswordMatched) {
            const payload = {
                username: user.username,
            };
            const jwt_token = jwt.sign(payload, SECRET_KEY);
            res.json({ jwt_token });
        } else {
          
            res.status(400).send("Invalid username or password");
        }
    } catch (error) {
        console.error("Error during login", error.message);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/hod-login", async (req, res) => {
    const { username, password ,branch} = req.body;
    
    try {
        const user = await db.get(
            "SELECT * FROM hod_details WHERE username = ? AND branch = ?",
            [username,branch]
        );
       
       
        if (!user) {
           
            res.status(400).send("Invalid username or password");
            return;
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        
        if (isPasswordMatched) {
            const payload = {
                username: user.username,
            };
            const jwt_token = jwt.sign(payload, SECRET_KEY);
            res.json({ jwt_token });
        } else {
            
            res.status(400).send("Invalid username or password");
        }
    } catch (error) {
        console.error("Error during login", error.message);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/principal-login", async (req, res) => {
    const { username, password } = req.body;
    try {
        

        // Fetch the user from the database
        const user = await db.get(
            "SELECT * FROM Principal WHERE username = ?",
            [username]
        );

        console.log("User fetched from database:", user);

        if (!user) {
            res.status(400).send("Invalid username or password");
            return;
        }

        // Compare the provided password with the stored hashed password
        const isPasswordMatched = await bcrypt.compare(password, user.password);
    

        if (isPasswordMatched) {
            const payload = {
                username: user.username,
            };

            // Sign the JWT token
            const jwt_token = jwt.sign(payload, SECRET_KEY);
            res.json({ jwt_token });
        } else {
            res.status(400).send("Invalid username or password");
        }
    } catch (error) {
        console.error("Error during login", error.message);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/saveFormData", async (req, res) => {
    const { formName, department, semester, academicYear, section, subjects, feedback, subjectType } = req.body;
  
    // Check for required fields
    if (!formName || !department || !semester || !academicYear || !section || !feedback || !subjectType || subjects.length === 0) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
  
    try {
      // Check for existing combination
      const checkCombination = await db.get(
        `SELECT * FROM form_data WHERE department = ? AND semester = ? AND academic_year = ? AND section = ? AND feedback_attempt = ? AND subjectType = ?`,
        [department, semester, academicYear, section, feedback,subjectType]
      );
  
      if (checkCombination) {
        console.log("Combination already exists");
        return res.status(400).json({ error: 'You have already created' });
      }
  
      // Insert form data into 'form_data' table
      const formInsertResult = await db.run(
        `INSERT INTO form_data (form_name, department, semester, academic_year, section, feedback_attempt, subjectType) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [formName, department, semester, academicYear, section, feedback, subjectType]
      );
  
      const formId = formInsertResult.lastID;
  
      // Insert subject allocation data into 'subject_allocation' table
      await Promise.all(subjects.map(async ({ subjectName, facultyName }) => {
        await db.run(
          `INSERT INTO subject_allocation (form_id, subject_name, faculty_name) VALUES (?, ?, ?)`,
          [formId, subjectName, facultyName]
        );
      }));
  
      res.json({ message: "Form data saved successfully" });
    } catch (error) {
      console.error("Error saving form data:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

app.post("/fetchFacultyAndSubjects", async (req, res) => {
    const { department, semester, academicYear, section,feedback,subjectType } = req.body;
    //console.log(req.body)
    try {
        // Fetch faculty names and subject names based on user inputs from the database
        const query = `
            SELECT faculty_name
            FROM subject_allocation
            WHERE form_id IN (
                SELECT form_id
                FROM form_data
                WHERE department = ? AND semester = ? AND academic_year = ? AND section = ? AND feedback_attempt = ? AND subjectType = ?
            )
        `;
        const facultyNames = await db.all(query, [department, semester, academicYear, section,feedback,subjectType]);
       // console.log(facultyNames)
        const subjectQuery = `
            SELECT  subject_name
            FROM subject_allocation
            WHERE form_id IN (
                SELECT form_id
                FROM form_data
                WHERE department = ? AND semester = ? AND academic_year = ? AND section = ? AND feedback_attempt = ? AND subjectType = ?
            )
        `;
        
        const subjectNames = await db.all(subjectQuery, [department, semester, academicYear, section,feedback,subjectType]);
        console.log(subjectNames)
        
        const getFeedBackIdQuery =  `SELECT form_id
        FROM form_data WHERE department = ? AND semester = ? AND academic_year = ? AND section = ? AND feedback_attempt = ? AND subjectType = ?`
        const formId = await db.get(getFeedBackIdQuery, [department, semester, academicYear, section,feedback,subjectType]);
        const query2 = `SELECT  total_submissions FROM FeedBackData where form_id= ?`
        const totalSubmissions = await db.get(query2, [formId.form_id]);
        //console.log(totalSubmissions)
        res.json({ facultyNames, subjectNames ,formId,totalSubmissions});
    } catch (error) {
        console.error("Error fetching faculty names and subject names:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/FeedbackData', async (req, res) => {
    
    try {
        const {allSubjectsReview,formId} = req.body;
        
        // Iterate over the received feedback data
        for (const subjectName in allSubjectsReview) {
            const feedback = allSubjectsReview[subjectName];
            for (const category in feedback) {
                const rating = parseInt(feedback[category]);

                // Check if a row already exists for this (formId, subjectName, category) combination
                const existingFeedback = await db.get(
                    'SELECT * FROM FeedbackData WHERE form_id = ? AND subjectName = ? AND category = ?',
                    [formId, subjectName, category]
                );
    
                if (existingFeedback) {
                    // If a row exists, update the existing rating with the new rating
                    await db.run(
                        'UPDATE FeedbackData SET rating = rating + ?, total_submissions = total_submissions + 1 WHERE form_id = ? AND subjectName = ? AND category = ?',
                        [rating, formId, subjectName, category]
                    );
                    
                } else {
                    // If no row exists, insert a new row with the new rating
                    await db.run(
                        'INSERT INTO FeedbackData (form_id, subjectName, category, rating,total_submissions) VALUES (?, ?, ?, ?,?)',
                        [formId, subjectName, category, rating,1]
                    );
                }
            }
        }

        res.status(200).json({ message: 'Feedback data inserted/updated successfully' });
    } catch (error) {
        console.error('Error inserting/updating feedback data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//principal

app.post("/checkResults", async (req, res) => {
    
  const {facultyName,subjectName,formId} = req.body
  
  const {faculty_name } = facultyName
  const {subject_name} = subjectName
  const query1 = `SELECT category, rating FROM FeedBackData WHERE subjectName = ? AND form_id = ? ORDER BY category ASC`;

    const feedBackList = await db.all(query1, [subject_name,formId]);
    const query2 = `SELECT  total_submissions FROM FeedBackData where subjectName = ? AND form_id= ?`
    const totalSubmissions = await db.get(query2, [subject_name,formId]);
   
   res.json({feedBackList,totalSubmissions})
});

//Show Register Button settings
app.get('/registerSettings', async (req, res) => {
    try {
        const query = `SELECT showRegisterButton FROM registration_settings;`;
        const getResult = await db.get(query); // Assuming db is your database connection object

         // Debugging: log the result to see what is fetched

        // Assuming getResult is an object or JSON-serializable value
        res.json(getResult); // Send the fetched result as JSON response
    } catch (error) {
        console.error("Error fetching register settings:", error);
        res.status(500).json({ error: "Failed to fetch register settings" });
    }
});

app.put('/registerBtnUpdates', async (req, res) => {
    
    const {showRegisterButton} = req.body;
    
    try {
        // Update the value in the database
        const query = `UPDATE registration_settings SET showRegisterButton = ?`;
        await db.run(query, [showRegisterButton]);
        
        // Respond with updated value
        res.json({ showRegisterButton});
    } catch (error) {
        console.error('Error updating showRegisterButton:', error);
        res.status(500).json({ error: 'Failed to update showRegisterButton' });
    }
});


// Start the server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();
