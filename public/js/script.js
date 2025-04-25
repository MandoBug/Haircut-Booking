document.getElementById('booking-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Stop form from reloading the page
  
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
  
    const response = await fetch('/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone, date, time })
    });
  
    const result = await response.json();
    document.getElementById('response-msg').textContent = result.message;
  
    // Clear form
    document.getElementById('booking-form').reset();
  });
  