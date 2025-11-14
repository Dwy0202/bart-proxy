import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Serve static files (CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint for frontend to fetch train data
app.get('/trains', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-data.json'), 'utf-8'));
  res.json(data);
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Train display running at http://localhost:${PORT}`);
});
