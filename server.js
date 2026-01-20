const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/register');
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

async function ensureUsersFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(usersFile);
  } catch (err) {
    await fs.writeFile(usersFile, '[]', 'utf8');
  }
}

app.post('/register', async (req, res) => {
  try {
    const { fullname, phone, password, confirmPassword, language, district } = req.body;
    if (!fullname || !phone || !password || !confirmPassword || !district) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    await ensureUsersFile();
    const raw = await fs.readFile(usersFile, 'utf8');
    const users = JSON.parse(raw || '[]');
    if (users.find(u => u.phone === phone)) {
      return res.status(400).json({ success: false, message: 'Phone already registered' });
    }

    const hashed = await bcrypt.hash(password, 8);
    const user = {
      id: Date.now(),
      fullname,
      phone,
      passwordHash: hashed,
      language: language || 'English',
      district,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8');

    res.json({ success: true, message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Missing username or password' });
    }
    await ensureUsersFile();
    const raw = await fs.readFile(usersFile, 'utf8');
    const users = JSON.parse(raw || '[]');
    const user = users.find(u => u.phone === username || u.fullname === username);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    // Authentication successful (no session implemented yet)
    res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
