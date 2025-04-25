const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Temporary in-memory storage for appointments
const bookings = [];

app.post('/book', (req, res) => {
  const { name, phone, date, time } = req.body;

  // Optional: check for double bookings
  const exists = bookings.find(b => b.date === date && b.time === time);
  if (exists) {
    return res.json({ message: 'Sorry, that slot is already booked!' });
  }

  bookings.push({ name, phone, date, time });
  console.log('New Booking:', { name, phone, date, time });

  res.json({ message: 'Appointment booked successfully!' });
});
