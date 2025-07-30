// scripts.js

document.addEventListener("DOMContentLoaded", () => {
  // Slider functionality
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });

  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  // Search functionality for Inform articles
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const articles = Array.from(
    document.querySelectorAll("#inform .news-article")
  );

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    searchResults.innerHTML = "";
    if (!query) return;

    const matched = articles.filter((article) => {
      return article.textContent.toLowerCase().includes(query);
    });

    if (matched.length === 0) {
      searchResults.textContent = "No articles found.";
      return;
    }

    matched.forEach((article) => {
      const clone = article.cloneNode(true);
      searchResults.appendChild(clone);
    });
  });

  // Poll functionality
  const pollForm = document.getElementById("pollForm");
  const pollResult = document.getElementById("pollResult");

  pollForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = pollForm.pollOption.value;
    if (!selected) {
      pollResult.textContent = "Please select an option before voting.";
      return;
    }
    pollResult.textContent = `Thank you for voting for "${
      selected.charAt(0).toUpperCase() + selected.slice(1)
    }".`;
  });

  // Social share buttons
  document.getElementById("shareFacebook").addEventListener("click", () => {
    alert("Share on Facebook feature coming soon!");
  });

  document.getElementById("shareTwitter").addEventListener("click", () => {
    alert("Share on Twitter feature coming soon!");
  });
});
