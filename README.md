
# CFTracker

A full-stack web application that allows users to securely connect their [Codeforces](https://codeforces.com/) handle and track performance in contests, ratings, and ranks. Built with modern web technologies including React, Express, MongoDB, and Node.js.

## 🌐 Live Demo
[Visit the Live Site](https://cftracker.onrender.com/)  

---

## 🚀 Features

- 🔐 **Authentication**: Sign up and log in using Google OAuth or email/password with OTP-based email verification.
- 🔗 **Codeforces Handle Linking**: Securely link your Codeforces handle via a smart handle-verification process.
- ⚙️ **Responsive UI**: Built with modern React libraries including ShadCN UI and Zustand for clean UX and global state management.
- ✨ **Handle Verification**: Users verify their Codeforces handle by submitting a unique code that triggers a compile error in a submission — no API key sharing required!

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **Vite**
- **Tailwind CSS**
- **ShadCN/UI**
- **Zustand** for state management

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **Nodemailer** for OTP-based email verification

---

## 🧪 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB
- Codeforces account

### Installation

#### Clone the repo
```bash
git clone https://github.com/goswamineelim/CFTracker.git
cd CFTracker
```

#### Backend Setup
```bash
cd backend
npm install
# Configure .env file with MongoDB URI and Email credentials
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Folder Structure

```
CFTracker/
├── frontend/         # React frontend
├── backend/         # Express backend
└── README.md
```

---

## 🧠 Contributing

Contributions are welcome! If you'd like to add a new feature, improve performance, or fix a bug:

1. Fork the repo
2. Create your branch (`git checkout -b feature-xyz`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-xyz`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## 📬 Contact

Made with 💻 by [@goswamineelim](https://github.com/goswamineelim), [@ankitkundu837](https://github.com/ankitkundu837), [@Shuva124](https://github.com/Shuva124)
