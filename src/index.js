const dogBar = document.getElementById("dog-bar");
const dogInfo = document.getElementById("dog-info");
const filterButton = document.getElementById("good-dog-filter");

let allDogs = []; // Store all dogs fetched from the API
let filterGoodDogs = false; // State to track filter status

// Fetch all dogs and populate the Dog Bar
function fetchDogs() {
  fetch("http://localhost:3000/pups")
    .then((response) => response.json())
    .then((dogs) => {
      allDogs = dogs; // Store fetched dogs in allDogs
      renderDogBar(dogs); // Populate the Dog Bar
    })
    .catch((error) => console.error("Error fetching dogs:", error));
}

// Render the Dog Bar with dog spans
function renderDogBar(dogs) {
  dogBar.innerHTML = ""; // Clear the Dog Bar
  dogs.forEach((dog) => {
    const span = document.createElement("span");
    span.textContent = dog.name;
    span.dataset.id = dog.id;
    span.addEventListener("click", () => showDogInfo(dog));
    dogBar.appendChild(span);
  });
}

// Display selected dog info in the Dog Info section
function showDogInfo(dog) {
  dogInfo.innerHTML = `
    <img src="${dog.image}" alt="${dog.name}" />
    <h2>${dog.name}</h2>
    <button>${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
  `;

  const button = dogInfo.querySelector("button");
  button.addEventListener("click", () => toggleGoodDog(dog, button));
}

// Toggle the dog's Good/Bad status
function toggleGoodDog(dog, button) {
  const updatedDog = { ...dog, isGoodDog: !dog.isGoodDog };

  fetch(`http://localhost:3000/pups/${dog.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isGoodDog: updatedDog.isGoodDog }),
  })
    .then((response) => response.json())
    .then((updatedDogFromServer) => {
      // Update button text
      button.textContent = updatedDogFromServer.isGoodDog
        ? "Good Dog!"
        : "Bad Dog!";
      // Update local dog list
      allDogs = allDogs.map((d) =>
        d.id === updatedDogFromServer.id ? updatedDogFromServer : d
      );
    })
    .catch((error) => console.error("Error updating dog:", error));
}

// Handle Good Dog filter toggle
filterButton.addEventListener("click", () => {
  filterGoodDogs = !filterGoodDogs;
  filterButton.textContent = `Filter good dogs: ${
    filterGoodDogs ? "ON" : "OFF"
  }`;

  const filteredDogs = filterGoodDogs
    ? allDogs.filter((dog) => dog.isGoodDog)
    : allDogs;

  renderDogBar(filteredDogs);
});

// Initialize the app
fetchDogs();
