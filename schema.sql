DROP TABLE IF EXISTS admin_logs;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  course TEXT,
  bio TEXT,
  avatar TEXT,
  joinedAt TEXT NOT NULL
);

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  condition TEXT,
  sellerId TEXT NOT NULL,
  sellerName TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  views INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  senderId TEXT NOT NULL,
  senderName TEXT NOT NULL,
  receiverId TEXT NOT NULL,
  receiverName TEXT NOT NULL,
  text TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  read INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS wishlists;
CREATE TABLE wishlists (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  productId TEXT NOT NULL
);

-- Mock Data Insertion
INSERT INTO users (id, name, email, password, course, bio, avatar, joinedAt) VALUES 
('u_maria', 'Maria Santos', 'maria@tip.edu.ph', 'cGFzc3dvcmQxMjM=', 'BS Computer Science', 'CS junior, selling old textbooks and gadgets!', 'M', '2024-06-01T08:00:00.000Z'),
('u_juan', 'Juan Dela Cruz', 'juan@tip.edu.ph', 'cGFzc3dvcmQxMjM=', 'BS Electronics Engineering', 'EE student. Clean seller, fast replies!', 'J', '2024-06-02T09:00:00.000Z'),
('u_ana', 'Ana Reyes', 'ana@tip.edu.ph', 'cGFzc3dvcmQxMjM=', 'BS Information Technology', 'IT sophomore. I sell notes and used supplies.', 'A', '2024-06-03T10:00:00.000Z');

INSERT INTO products (id, title, description, price, category, image, condition, sellerId, sellerName, createdAt, views) VALUES 
('p_mock1', 'Calculus Early Transcendentals (8th Ed.)', 'Lightly used Stewart Calculus textbook. Some highlighting on chapters 1–3 only. Complete with all pages. Perfect for Math majors.', 450, 'Books', '', 'Good', 'u_maria', 'Maria Santos', datetime('now', '-1 day'), 14),
('p_mock2', 'Casio fx-991EX Classwiz Scientific Calculator', 'Barely used Casio calculator. All functions work perfectly. Comes with original case and manual. No scratches.', 650, 'Electronics', '', 'Like New', 'u_juan', 'Juan Dela Cruz', datetime('now', '-2 days'), 22),
('p_mock3', 'TIP PE Uniform (Medium)', 'Official TIP PE uniform set — shirt and shorts. Worn only twice. Size medium. In great condition, no stains.', 280, 'Clothing', '', 'Like New', 'u_ana', 'Ana Reyes', datetime('now', '-3 days'), 8),
('p_mock4', 'Data Structures & Algorithms Notes (Complete)', 'Handwritten and typed notes for the entire DSA course. Includes sample problems with solutions. Ideal for review.', 120, 'Notes', '', 'Like New', 'u_maria', 'Maria Santos', datetime('now', '-4 days'), 31),
('p_mock5', 'Arduino Uno Starter Kit', 'Complete Arduino Uno R3 kit with breadboard, jumper wires, LEDs, resistors, and sensors. Used for one semester project.', 900, 'Electronics', '', 'Good', 'u_juan', 'Juan Dela Cruz', datetime('now', '-5 days'), 19),
('p_mock6', 'Engineering Drawing Set', 'Complete drafting set — T-square, triangles, compass, protractor, drafting pencils. Used for one term only.', 350, 'Supplies', '', 'Good', 'u_ana', 'Ana Reyes', datetime('now', '-6 days'), 7),
('p_mock7', 'Introduction to Programming (C++) Textbook', 'Good condition C++ programming book. Covers all basics to OOP. A few pencil marks but nothing distracting.', 300, 'Books', '', 'Good', 'u_juan', 'Juan Dela Cruz', datetime('now', '-7 days'), 11),
('p_mock8', 'Laptop Stand + USB Hub Combo', 'Adjustable aluminum laptop stand paired with a 4-port USB 3.0 hub. Improves ergonomics during long study sessions.', 550, 'Electronics', '', 'Like New', 'u_maria', 'Maria Santos', datetime('now', '-8 days'), 25);

INSERT INTO messages (id, senderId, senderName, receiverId, receiverName, text, createdAt, read) VALUES 
('m_mock1', 'u_maria', 'Maria Santos', 'u_juan', 'Juan Dela Cruz', 'Hi Juan, is your calculator still available?', datetime('now', '-2 days'), 1),
('m_mock2', 'u_juan', 'Juan Dela Cruz', 'u_maria', 'Maria Santos', 'Yes, it is! Want to meet at the library?', datetime('now', '-1 day', '+1 minute'), 1),
('m_mock3', 'u_maria', 'Maria Santos', 'u_juan', 'Juan Dela Cruz', 'Sure, tomorrow at 2 PM?', datetime('now', '-1 day', '+2 minutes'), 1),
('m_mock4', 'u_juan', 'Juan Dela Cruz', 'u_ana', 'Ana Reyes', 'Hey Ana, your PE uniform looks great!', datetime('now', '-1 day'), 1),
('m_mock5', 'u_ana', 'Ana Reyes', 'u_juan', 'Juan Dela Cruz', 'Thanks! It''s still available. Meet at the oval?', datetime('now', '-1 day', '+1 minute'), 1),
('m_mock6', 'u_ana', 'Ana Reyes', 'u_maria', 'Maria Santos', 'Maria, are your DSA notes still for sale?', datetime('now', '-3 days'), 1),
('m_mock7', 'u_maria', 'Maria Santos', 'u_ana', 'Ana Reyes', 'Yes! They''re in perfect condition.', datetime('now', '-3 days', '+1 minute'), 1);
