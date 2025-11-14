import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

// -------- Mock API (replace this with your real API later) --------
app.get('/trains', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'sample-data.json'), 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read train data' });
  }
});

// -------- BART-style display --------
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>BART Station Display</title>
      <style>
        body {
          background-color: black;
          color: red;
          font-family: "Arial Black", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 50px;
        }
        .station-name {
          font-size: 3em;
          margin-bottom: 30px;
        }
        .train {
          margin: 10px;
          padding: 10px 20px;
          border: 2px solid red;
          width: 600px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.5em;
        }
        .route {
          font-weight: bold;
        }
        .minutes {
          font-size: 1.8em;
        }
      </style>
    </head>
    <body>
      <div class="station-name" id="station-name">Loading Station...</div>
      <div id="trains-container"></div>

      <script>
        async function fetchTrains() {
          try {
            const res = await fetch('/trains');
            const data = await res.json();

            document.getElementById('station-name').textContent = data.stop.name;

            const container = document.getElementById('trains-container');
            container.innerHTML = '';

            data.upcomingTrips.forEach(trip => {
              const trainEl = document.createElement('div');
              trainEl.className = 'train';
              trainEl.style.borderColor = trip.routeColor;
              trainEl.innerHTML = \`
                <div class="route" style="color:\${trip.routeColor}">\${trip.routeName}</div>
                <div class="headsign">\${trip.headsign}</div>
                <div class="minutes">\${trip.minutesUntilArrival} min</div>
              \`;
              container.appendChild(trainEl);
            });
          } catch (err) {
            console.error('Failed to fetch train data:', err);
          }
        }

        fetchTrains();
        setInterval(fetchTrains, 30000); // refresh every 30s
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`BART display running at http://localhost:${PORT}`);
});
