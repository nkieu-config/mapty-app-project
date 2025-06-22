"use strict";

/////////////////////
// Workout Base Class
class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10); // Generates a  unique id based on timestamp
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng] array
    this.distance = distance; // Distance in km
    this.duration = duration; // Duration in min
  }

  // Generates a description for the workout (e.g., "Running on June 22")
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  // Increments the click counter
  click() {
    this.clicks++;
  }
}

/////////////////////
// Running Subclass
class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence; // Steps per minute
    this.calcPace(); // Calculate pace immediately
    this._setDescription(); // Set description immediately
  }

  // Calculates pace (min/km)
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

/////////////////////
// Cycling Subclass
class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain; // Elevation gain in meters
    this.calcSpeed(); // Calculate speed immediately
    this._setDescription(); // Set description immediately
  }

  // Calculates speed (km/h)
  calcSpeed() {
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

/////////////////////////////////////////////////////////////////
// Application architecture

// DOM element selectors
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

/////////////////////
// Main App Class
class App {
  #map;
  #mapZoomLevel = 17;
  #mapEvent;
  #workouts = [];

  constructor() {
    // Get user's position and load map
    this._getPosition();

    // Load workouts from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
  }

  // Gets user's current position using Geolocation API
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
    }
  }

  // Loads the map centered at user's position
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    // Initialize Leaflet map
    this.#map = L.map("map").setView(coords, this.#mapZoomLevel);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handle map clicks to show workout form
    this.#map.on("click", this._showForm.bind(this));

    // Render markers for all workouts loaded from local storage
    this.#workouts.forEach((work) => {
      this._renderWorkoutMarker(work);
    });
  }

  // Displays the workout form at the clicked map location
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  // Hides the workout form and clears input fields
  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  // Toggles between cadence and elevation fields based on workout type
  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  // Handles creation of a new workout from form input
  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every((input) => Number.isFinite(input));
    const allPositive = (...inputs) => inputs.every((input) => input > 0);

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // Create Running workout
    if (type === "running") {
      const cadence = +inputCadence.value;

      // Validate input
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Inputs have to be positive numbers!");

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // Create Cycling workout
    if (type === "cycling") {
      const elevation = +inputElevation.value;

      // Validate input
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("Inputs have to be positive numbers!");
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new workout to workouts array
    this.#workouts.push(workout);

    // Render workout marker on map
    this._renderWorkoutMarker(workout);

    // Render workout in the list
    this._renderWorkout(workout);

    // Hide form and clear input fields
    this._hideForm();

    // Save all workouts to local storage
    this._setLocalStorage();
  }

  // Renders a workout marker on the map
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴"} ${workout.description}`
      )
      .openPopup();
  }

  // Renders a workout in the sidebar list
  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === "running" ? "🏃‍♂️" : "🚴"
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏰</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    // Add running-specific fields
    if (workout.type === "running")
      html += `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;

    // Add cycling-specific fields
    if (workout.type === "cycling")
      html += `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🗻</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;

    form.insertAdjacentHTML("afterend", html);
  }

  // Moves the map to the workout marker when a workout in the list is clicked
  _moveToPopup(e) {
    if (!this.#map) return;

    const workoutEl = e.target.closest(".workout");
    if (!workoutEl) return;

    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  // Saves all workouts to local storage
  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  // Loads workouts from local storage and restores class instances
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (!data) return;

    // Restore correct class instances for each workout
    this.#workouts = data.map((obj) => {
      if (obj.type === "running") {
        const run = new Running(
          obj.coords,
          obj.distance,
          obj.duration,
          obj.cadence
        );
        run.id = obj.id;
        run.date = new Date(obj.date);
        return run;
      }
      if (obj.type === "cycling") {
        const cyc = new Cycling(
          obj.coords,
          obj.distance,
          obj.duration,
          obj.elevationGain
        );
        cyc.id = obj.id;
        cyc.date = new Date(obj.date);
        return cyc;
      }
      return obj;
    });

    // Render all workouts in the sidebar
    this.#workouts.forEach((work) => {
      this._renderWorkout(work);
    });
  }

  // Removes all workouts from local storage and reloads the page
  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

// Instantiate the main App
const app = new App();
