# 🗺️ Mapty App

An interactive workout tracking application that leverages **geolocation**, **object-oriented JavaScript**, and **Leaflet.js** to allow users to log running and cycling workouts on a map.

> This project was built as part of a hands-on learning journey to master JavaScript fundamentals, OOP, external API integration, and client-side data persistence.

## 🌐 Live Demo

👉 [**Try the App**](https://nkieu-mapty-app.vercel.app/)

---

## ✨ Features

- 🌍 **Map Integration (Leaflet.js)**  
  Real-time geolocation with dynamic map rendering and marker placement.

- 🏃‍♂️ **Track Multiple Workout Types**  
  Log both **Running** (with pace & cadence) and **Cycling** (with speed & elevation gain).

- 📌 **Custom Markers with Popups**  
  Visualize workouts using custom markers and descriptive popups.

- 📋 **Dynamic Workout List**  
  View all workouts in a sidebar with real-time rendering and interaction.

- 🔄 **Smart Map Navigation**  
  Instantly pan/zoom to a workout's location by clicking its list item.

- 💾 **Persistent Data (localStorage)**  
  All workouts are saved to the browser and persist across sessions.

- 🧠 **Intelligent Form UI**  
  Automatically toggles between cadence and elevation fields based on workout type.

- ✅ **Input Validation**  
  Ensures that all input values are positive and numeric.

---

## 🛠️ Tech Stack

| Technology            | Description                                          |
| --------------------- | ---------------------------------------------------- |
| **HTML5**             | Semantic structure with accessible forms             |
| **CSS3**              | Responsive layout, custom UI styles                  |
| **JavaScript (ES6+)** | Modern OOP principles with classes and encapsulation |
| **Leaflet.js**        | Open-source JS library for interactive maps          |
| **Geolocation API**   | Native browser API to retrieve user location         |
| **localStorage API**  | Client-side data persistence                         |

---

## 📚 What I Learned

This project deepened my understanding of:

- ✅ JavaScript **OOP & Inheritance**
- ✅ **Leaflet.js API** for dynamic maps and popups
- ✅ Working with the **Geolocation API**
- ✅ Managing app **state & data persistence**
- ✅ **DOM manipulation**, event delegation, and dynamic UI rendering
- ✅ Using **ES6 features** like arrow functions, destructuring, and private class fields

---

## 🚀 Getting Started

### 🖥️ Run Locally

```bash
git clone https://github.com/nkieu-config/mapty-app-project.git
```

Then open `index.html` in your browser.

> ✅ No build tools or dependencies required — just pure HTML, CSS, and JavaScript.

---

## 💡 How to Use

1. **Allow location access** when prompted.
2. **Click on the map** to add a new workout.
3. **Select workout type**: Running or Cycling.
4. **Enter workout data**: distance, duration, and either cadence or elevation gain.
5. **View your workouts**: Both on the map and in the workout list.
6. **Click a workout** in the list to zoom to its location on the map.
7. **Data is saved** automatically and restored on page reload.

---

## 🧠 Project Source

Built as part of:
📘 [_The Complete JavaScript Course_](https://www.udemy.com/course/the-complete-javascript-course/)
by [Jonas Schmedtmann](https://codingheroes.io)

---

## ⚠️ Disclaimer

This is a **practice project** created for educational purposes only.

---

## 📌 License

This project is open-source and available under the [MIT License](LICENSE).
