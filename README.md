# FarmHelp Hub — Registration Prototype

Simple Node.js + Express prototype for farmer equipment-rental registration.

Getting started

1. Install dependencies

```bash
npm install
```

2. Start the server

```bash
npm start
# or for development with auto-reload (if installed):
npm run dev
```

3. Open http://localhost:3000/register in your browser.

Files created

- [server.js](server.js) — Express server and POST `/register` handler
- [public/register.html](public/register.html) — registration form
- [public/styles.css](public/styles.css) — page styles
- [data/users.json](data/users.json) — stored user records (JSON array)

Notes

- Passwords are hashed via `bcryptjs` before saving.
- This is a simple prototype; for production, add input sanitization, rate limits, and a database.
