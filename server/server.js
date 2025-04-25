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
    const { name, phone, date, time, locationType, locationDetails } = req.body;
  
    // ✅ Validate location fields
    if (!locationType || !locationDetails) {
      return res.json({ message: 'Please provide location information.' });
    }
  
    // Optional: check for double bookings
    const exists = bookings.find(b => b.date === date && b.time === time);
    if (exists) {
      return res.json({ message: 'Sorry, that slot is already booked!' });
    }
  
    bookings.push({ name, phone, date, time, locationType, locationDetails });
    console.log('New Booking:', { name, phone, date, time, locationType, locationDetails });
  
    res.json({ message: 'Appointment booked successfully!' });
  });
  

// Weekly schedule (Tuesdays and Thursdays only)
const weeklySchedule = {
    Tuesday: ["10:30", "13:30", "14:30"],
    Thursday: ["10:30", "13:30", "14:30"]
  };
  
  // Function to get day of week from a date string
  function getDayName(dateString) {
    const [year, month, day] = dateString.split('-');
    const localDate = new Date(+year, +month - 1, +day);
    return localDate.toLocaleDateString("en-US", { weekday: "long" });
  }
  
  
    app.get('/slots', (req, res) => {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
  
    const dayName = getDayName(date);
  
    // If it's not a day you're available, return empty
    if (!weeklySchedule[dayName]) {
      return res.json({ slots: [] });
    }
  
    // Get all bookings for that date
    const bookedSlots = bookings
      .filter(b => b.date === date)
      .map(b => b.time);
  
    const available = weeklySchedule[dayName].filter(
      slot => !bookedSlots.includes(slot)
    );
  
    res.json({ slots: available });
  });