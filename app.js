import express from "express";
import path from "path";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
const PORT = 4001;

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:6001/api";


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

// Serve the HTML form
app.get("/", (req, res) => {  
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// Handle form submission -> forward to Flask API
app.post("/submit", async (req, res) => {
  const { name, email } = req.body;

  try {
    const response = await fetch(`${BACKEND_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    const data = await response.json();

    if (response.ok) {
      res.send(`<h2>${data.message}</h2><a href="/">Go Back</a>`);
    } else {
      res.status(400).send(`<h2>Error: ${data.error}</h2><a href="/">Go Back</a>`);
    }
  } catch (err) {
    console.error("Error contacting Flask API:", err);
    res.status(500).send("<h2>Internal Server Error</h2><a href='/'>Go Back</a>");
  }
});

// Start server
app.listen(PORT, () => {
    console.log(BACKEND_URL);
  console.log(`Express frontend running at http://localhost:${PORT}`);
});
