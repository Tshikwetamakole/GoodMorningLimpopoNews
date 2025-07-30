(() => {
  // Encapsulate all code to avoid global scope pollution
  document.addEventListener("DOMContentLoaded", () => {
    // --- Slider functionality with fade animation and accessibility ---
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        slide.setAttribute("aria-hidden", i !== index);
      });
    }

    function startSlideShow() {
      slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }, 5000);
    }

    function stopSlideShow() {
      clearInterval(slideInterval);
    }

    prevBtn.addEventListener("click", () => {
      stopSlideShow();
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
      startSlideShow();
    });

    nextBtn.addEventListener("click", () => {
      stopSlideShow();
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
      startSlideShow();
    });

    showSlide(currentSlide);
    startSlideShow();

    // --- Poll functionality with animation and ARIA live ---
    const pollForm = document.getElementById("pollForm");
    const pollResult = document.getElementById("pollResult");
    pollResult.setAttribute("role", "status");
    pollResult.setAttribute("aria-live", "polite");
    let pollVotes = { inform: 0, educate: 0, entertain: 0 };

    pollForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedOption = pollForm.pollOption.value;
      if (!selectedOption) {
        pollResult.textContent = "Please select an option before voting.";
        pollResult.classList.add("visible");
        setTimeout(() => pollResult.classList.remove("visible"), 2000);
        return;
      }
      pollVotes[selectedOption]++;
      const totalVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);
      const percentages = {
        inform: ((pollVotes.inform / totalVotes) * 100).toFixed(1),
        educate: ((pollVotes.educate / totalVotes) * 100).toFixed(1),
        entertain: ((pollVotes.entertain / totalVotes) * 100).toFixed(1),
      };
      pollResult.innerHTML = `
        <p>Results:</p>
        <ul>
          <li>Inform: ${percentages.inform}% (${pollVotes.inform} votes)</li>
          <li>Educate: ${percentages.educate}% (${pollVotes.educate} votes)</li>
          <li>Entertain: ${percentages.entertain}% (${pollVotes.entertain} votes)</li>
        </ul>
      `;
      pollResult.classList.add("visible");
      setTimeout(() => pollResult.classList.remove("visible"), 2000);
      pollForm.reset();
    });

    // --- Debounced Search functionality for Inform articles ---
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const informArticles = Array.from(
      document.querySelectorAll("#inform .news-article")
    );

    function debounce(fn, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    }

    function handleSearch() {
      const query = searchInput.value.toLowerCase().trim();
      if (!query) {
        searchResults.textContent = "";
        searchResults.style.opacity = 0;
        informArticles.forEach((article) => (article.style.display = ""));
        return;
      }
      let matches = 0;
      informArticles.forEach((article) => {
        const text = article.textContent.toLowerCase();
        if (text.includes(query)) {
          article.style.display = "";
          matches++;
        } else {
          article.style.display = "none";
        }
      });
      searchResults.textContent = matches
        ? `${matches} article(s) found.`
        : "No articles found.";
      searchResults.style.opacity = 1;
      searchResults.classList.add("visible");
      setTimeout(() => searchResults.classList.remove("visible"), 1200);
    }

    searchInput.addEventListener("input", debounce(handleSearch, 200));

    // --- Social share buttons ---
    const shareFacebook = document.getElementById("shareFacebook");
    const shareTwitter = document.getElementById("shareTwitter");
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    shareFacebook.addEventListener("click", () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
      window.open(url, "_blank", "width=600,height=400");
    });

    shareTwitter.addEventListener("click", () => {
      const url = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
      window.open(url, "_blank", "width=600,height=400");
    });
  });
})();
