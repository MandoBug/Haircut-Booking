document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const form = document.getElementById('bookingForm');
    const messageDiv = document.getElementById('message');
  
    // Disable non-Tuesday and non-Thursday dates in the calendar
    dateInput.addEventListener('input', () => {
      const selectedDate = new Date(dateInput.value);
      const day = selectedDate.getDay(); // 0=Sunday, 1=Monday,... 6=Saturday
  
      // If it's not Tuesday (2) or Thursday (4), reset the date field and show an alert
      if (day !== 2 && day !== 4) {
        alert('Sorry! I only cut hair on Tuesdays and Thursdays.');
        dateInput.value = ''; // Reset the date field
      }
    });
  
    dateInput.addEventListener('change', async () => {
      const date = dateInput.value;
      timeSelect.innerHTML = '<option value="">Loading...</option>';
  
      const res = await fetch(`/slots?date=${date}`);
      const data = await res.json();
  
      timeSelect.innerHTML = '<option value="">Select a time</option>';
      data.slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
      });
  
      if (data.slots.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No available slots';
        timeSelect.appendChild(option);
      }
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      const res = await fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await res.json();
      messageDiv.textContent = result.message;
      form.reset();
      timeSelect.innerHTML = '<option value="">Select a time</option>';
    });
  });
  