// Debounce utility function moved outside to reduce nesting
function debounce(fn, delay) {
  let timeout;
  function callFn(args) {
    fn(...args);
  }
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callFn(args), delay);
  };
}

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
    const pollChart = document.getElementById("pollChart");
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
      pollChart.style.display = "block";
      drawPollChart(pollVotes);
      setTimeout(() => pollResult.classList.remove("visible"), 2000);
      pollForm.reset();
    });

    // Draw poll chart using canvas
    function drawPollChart(votes) {
      const ctx = pollChart.getContext("2d");
      const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
      const data = [
        { label: "Inform", value: votes.inform, color: "#ff6f00" },
        { label: "Educate", value: votes.educate, color: "#ffca28" },
        { label: "Entertain", value: votes.entertain, color: "#7bb661" },
      ];
      const width = pollChart.width;
      const height = pollChart.height;
      const radius = Math.min(width, height) / 2 - 20;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      let startAngle = 0;
      data.forEach((slice) => {
        const sliceAngle = (slice.value / totalVotes) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.fill();

        // Draw labels
        const midAngle = startAngle + sliceAngle / 2;
        const labelX = centerX + (radius / 1.5) * Math.cos(midAngle);
        const labelY = centerY + (radius / 1.5) * Math.sin(midAngle);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(slice.label, labelX, labelY);

        startAngle += sliceAngle;
      });
    }

    // --- Debounced Search functionality for Inform articles ---
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const informArticles = Array.from(
      document.querySelectorAll("#inform .news-article")
    );

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

    // --- Burger menu toggle ---
    const burger = document.querySelector(".burger");
    const navMenu = document.getElementById("navMenu");

    burger.addEventListener("click", () => {
      const expanded = burger.getAttribute("aria-expanded") === "true" || false;
      burger.setAttribute("aria-expanded", !expanded);
      burger.classList.toggle("open");
      navMenu.classList.toggle("open");
    });

    // --- Hide/show header on scroll ---
    const header = document.querySelector("header");
    let lastScrollY = window.scrollY;

    window.addEventListener(
      "scroll",
      debounce(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past 100px, hide header
          header.classList.add("hidden");
        } else {
          // Scrolling up, show header
          header.classList.remove("hidden");
        }
        lastScrollY = currentScrollY;
      }, 100)
    );

    // --- Event countdown timers ---
    const countdownElements = document.querySelectorAll(".countdown");

    function updateCountdowns() {
      const now = new Date();
      countdownElements.forEach((el) => {
        const eventDate = new Date(el.getAttribute("data-date"));
        const diff = eventDate - now;
        if (diff <= 0) {
          el.textContent = "Event is happening now or has passed";
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          el.textContent = `${days}d ${hours}h ${minutes}m left`;
        }
      });
    }

    updateCountdowns();
    setInterval(updateCountdowns, 60000);
  });
})();
