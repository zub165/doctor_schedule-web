const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// Mock data for schedules
function generateMockSchedules(month, year) {
  const schedules = [];
  const locations = ['MCH1', 'MCH2', 'MDH', 'BAH', 'MPH'];
  const names = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Jones', 'Dr. Brown'];
  const types = ['duty', 'timeOff', 'holiday'];
  
  // Generate schedules for the month
  const daysInMonth = new Date(year, month, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    // Add 2-3 schedules per day
    const schedulesPerDay = 2 + (day % 2);
    
    for (let i = 0; i < schedulesPerDay; i++) {
      const date = new Date(year, month - 1, day, 8 + (i * 8), 0);
      const scheduleType = types[i % types.length];
      const location = locations[(day + i) % locations.length];
      const name = names[(day + i) % names.length];
      
      schedules.push({
        id: day * 100 + i,
        title: scheduleType === 'duty' 
            ? 'Regular Shift' 
            : (scheduleType === 'timeOff' ? 'Time Off' : 'Holiday'),
        name: name,
        location: location,
        date: date.toISOString(),
        description: `Description for ${name} at ${location} on ${date.toISOString().substring(0, 10)}`,
        type: scheduleType,
      });
    }
  }
  
  return schedules;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple mock authentication
  if (username && password) {
    res.json({
      user: {
        id: '1',
        username: username,
        email: `${username}@example.com`,
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      access_token: 'mock_token_12345',
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get schedules endpoint
app.get('/api/schedules', (req, res) => {
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();
  
  const schedules = generateMockSchedules(month, year);
  res.json(schedules);
});

// Create schedule endpoint
app.post('/api/schedules', (req, res) => {
  const schedule = req.body;
  
  // Add an ID and timestamps to the schedule
  const newSchedule = {
    ...schedule,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  res.status(201).json(newSchedule);
});

// Update schedule endpoint
app.put('/api/schedules/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const schedule = req.body;
  
  // In a real app, you would update the schedule in a database
  const updatedSchedule = {
    ...schedule,
    id: id,
    updatedAt: new Date().toISOString(),
  };
  
  res.json(updatedSchedule);
});

// Delete schedule endpoint
app.delete('/api/schedules/:id', (req, res) => {
  // In a real app, you would delete the schedule from a database
  res.status(204).send();
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
}); 