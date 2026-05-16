document.addEventListener("DOMContentLoaded", () => {
  // 1. Оголошення основних змінних
  const decadeSlider = document.getElementById("decadeSlider");
  const itemsContainer = document.getElementById("itemsContainer");
  const decadeTitle = document.getElementById("decadeTitle");
  const nameInput = document.getElementById("user-name");
  const welcomeMsg = document.getElementById("welcome-msg");

  // Змінні для Книги рецептів
  const recipeSearch = document.getElementById("recipeSearch");
  const countryFilter = document.getElementById("countryFilter");
  const recipeGrid = document.getElementById("recipeGrid");

  let allData = []; // Дані для головного каталогу (data.json)
  let allRecipes = []; // Дані для книги рецептів (recipedata.json)

  // 2. Завантаження головного каталогу (data.json)
  async function loadData() {
    try {
      const response = await fetch("data.json");
      if (!response.ok) throw new Error("Помилка завантаження даних");
      const data = await response.json();
      allData = data.countries;

      renderContent(decadeSlider.value);
    } catch (error) {
      console.error("Помилка:", error);
      itemsContainer.innerHTML =
        '<p class="text-center">Не вдалося завантажити меню.</p>';
    }
  }

  // 3. Відображення карток на головній сторінці
  function renderContent(year) {
    itemsContainer.innerHTML = "";
    decadeTitle.textContent = `Смаки ${year}-х років`;

    allData.forEach((country) => {
      const dishes = country.decades[year];
      if (dishes) {
        dishes.forEach((dish) => {
          const cardHtml = `
                        <div class="col">
                            <div class="card card-retro h-100">
                                <img src="${dish.image}" class="card-img-top" alt="${dish.name}" 
                                     onerror="this.src='https://via.placeholder.com/400x250?text=Смачна+Історія'">
                                <div class="card-body">
                                    <h5 class="card-title logo-text">${dish.name}</h5>
                                    <h6 class="text-muted">${country.flag} ${country.name}</h6>
                                    <p class="card-text">${dish.description}</p>
                                </div>
                            </div>
                        </div>`;
          itemsContainer.insertAdjacentHTML("beforeend", cardHtml);
        });
      }
    });
  }

  // 4. Логіка Книги рецептів (recipedata.json)
  async function initRecipeBook() {
    try {
      const response = await fetch("recipedata.json");
      const data = await response.json();

      allRecipes = [];
      // Перетворюємо об'єкт у плаский масив для зручного пошуку
      Object.entries(data.recipes).forEach(([countryId, decades]) => {
        Object.entries(decades).forEach(([decade, recipes]) => {
          recipes.forEach((r) => {
            allRecipes.push({ ...r, countryId, decade });
          });
        });
      });

      filterRecipes(); // Викликаємо фільтрацію (вона ж зробить перший рендер)
    } catch (error) {
      console.error("Помилка завантаження рецептів:", error);
    }
  }

  function renderRecipeGrid(recipes) {
    if (!recipeGrid) return;

    if (recipes.length === 0) {
      recipeGrid.innerHTML =
        '<div class="col-12 text-center py-5"><p>Рецептів не знайдено...</p></div>';
      return;
    }

    recipeGrid.innerHTML = recipes
      .map(
        (recipe) => `
            <div class="col">
                <div class="recipe-card">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="recipe-badge">${recipe.countryId} | ${recipe.decade}-ті</span>
                    </div>
                    <h4 class="fw-bold mb-2" style="font-family: 'Playfair Display';">${recipe.name}</h4>
                    <div class="ingredients-list">
                        <strong>Інгредієнти:</strong><br>
                        ${recipe.ingredients.join(", ")}
                    </div>
                    <p class="small mb-0"><strong>Приготування:</strong> ${recipe.instructions}</p>
                </div>
            </div>
        `,
      )
      .join("");
  }

  function filterRecipes() {
    const searchTerm = recipeSearch.value.toLowerCase();
    const countryTerm = countryFilter.value;

    const filtered = allRecipes.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm) ||
        r.ingredients.some((i) => i.toLowerCase().includes(searchTerm));
      const matchesCountry =
        countryTerm === "all" || r.countryId === countryTerm;

      return matchesSearch && matchesCountry;
    });

    renderRecipeGrid(filtered);
  }

  // 5. Слухачі подій
  decadeSlider.addEventListener("input", (e) => renderContent(e.target.value));

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const name = nameInput.value.trim();
      if (name.length > 0) {
        welcomeMsg.textContent = `Вітаємо, ${name}!`;
        welcomeMsg.style.display = "inline-block";
        nameInput.style.display = "none";
      }
    }
  });

  // Події для книги рецептів
  if (recipeSearch) recipeSearch.addEventListener("input", filterRecipes);
  if (countryFilter) countryFilter.addEventListener("change", filterRecipes);

  // Виклик завантаження книги при відкритті модалки
  const recipeModal = document.getElementById("recipeModal");
  if (recipeModal) {
    recipeModal.addEventListener("show.bs.modal", initRecipeBook);
  }

  // Початкове завантаження головних даних
  loadData();
});

function startMiniGame() {
  console.log("Гра запускається...");
  // Тут буде логіка гри
}

// Підсвічування активного десятиліття на повзунку.
// Значення input range порівнюється з data-year у підписах років.
const decadeSlider = document.getElementById("decadeSlider");
const decadeLabels = document.querySelectorAll(".slider-segments span");

function updateActiveDecadeLabel() {
  const selectedYear = decadeSlider.value;

  decadeLabels.forEach((label) => {
    label.classList.toggle("active-year", label.dataset.year === selectedYear);
  });
}

if (decadeSlider) {
  updateActiveDecadeLabel();

  decadeSlider.addEventListener("input", updateActiveDecadeLabel);
}
