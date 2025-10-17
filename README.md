# C-GPA Calculator Web App

A React Native (Expo) web app for calculating GPA and CGPA based on different Bangladeshi universities’ grading systems. This app allows students to add courses, input grades and credits, track semester GPAs, and calculate the overall CGPA.

---

## 📌 Features

- **Grading System Selector:** Supports multiple universities. (Ref: https://en.wikipedia.org/wiki/Academic_grading_in_Bangladesh)

- **Add Courses:** Input course name, grade, and credit to calculate GPA.

- **Add Semesters:** Track multiple semesters and calculate cumulative CGPA.

- **Persistent Storage:** Data saved using local storage (AsyncStorage).

- **Responsive Web UI:** Works smoothly on desktop and mobile web.

- **Clear Data Button:** Reset all courses, semesters, GPA, and CGPA.

---

## 🛠 Tech Stack

- **Frontend:** React Native + Expo

- **Web Support:** Expo for Web

---

## 📂 Folder Structure
c_gpaproject/

├── app/

│   └── _layout.jsx

│   └── index.jsx

├── components/

│   └── Colors.js

│   └── ThemeContext.js

├── utils/

│   └── storage.js

├── index.web.jsx

└── README.md

---

## ⚡ Installation & Running Locally

- Clone the repository

```bash
git clone https://github.com/yourusername/c_gpaproject.git
cd c_gpaproject

```

- Install dependencies

```bash
npm install

```

- Run web version

```bash
npx expo start --web

```

- Open **http://localhost:8081** in your browser to test.

---

## 🧾 Usage

- Select your university grading system.

- Enter course name, grade, and credit.

- Press **Add Course** to see GPA calculation.

- Enter semester GPA and press **Add Semester** to calculate CGPA.

- Press **Clear** to reset all data.
