const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db");

db.serialize(() => {
  db.run(`CREATE TABLE leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      country VARCHAR(100),
      number VARCHAR(20),
      city VARCHAR(100),
      demo TINYINT(1) DEFAULT 1,
      otp VARCHAR(10),
      otpValidated TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  console.log("Done");
});
