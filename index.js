// Add this to your existing Express app
app.get('/next-display', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>BART Next Trains</title>
      <style>
        body {
          background-color: black;
          color: red;
          font-family: "Arial Black", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 50px;
        }

        h1 {
          font-size: 3em;
          margin-bottom: 20px;
        }

        table {
          border-collapse: collapse;
          width: 600px;
          text-align: left;
        }

        th, td {
          border: 2px solid red;
          padding: 12px 15px;
          font-size: 1.8em;
        }

        th {
          font-size: 2em;
        }

        tr:nth-child(even) td {
          background-color: #330000; /* dark red stripes for realism */
        }

        .minutes {
          text-align: right;
        }
      </style>
    </head>
    <body>
      <h1 id="station-name">Loading Station...</h1>
      <table>
        <thead>
          <tr>
            <th>Destination</th>
            <th>Minutes</th>
            <th>Vehicle</th>
          </tr>
        </thead>
        <tbody id="trains-container">
        </tbody>
      </table>

      <script>
        async function fetchNextTrains() {
          try {
            const res = await fetch('/next');
            const data = await res.json();

            document.getElementById('station-name').textContent = data.station;

            const container = document.getElementById('trains-container');
            container.innerHTML = '';

            data.nextArrivals.forEach(train => {
              const tr = document.createElement('tr');

              tr.innerHTML = \`
                <td>\${train.destination}</td>
                <td class="minutes">\${train.minutesUntilArrival}</td>
                <td>\${train.vehicle}</td>
              \`;

              container.appendChild(tr);
            });
          } catch (err) {
            console.error('Failed to fetch train data:', err);
          }
        }

        fetchNextTrains();
        setInterval(fetchNextTrains, 30000); // refresh every 30s
      </script>
    </body>
    </html>
  `);
});
