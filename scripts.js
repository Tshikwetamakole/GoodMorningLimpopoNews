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

  showSlide(currentSlide);

  // Poll functionality
  const pollForm = document.getElementById("pollForm");
  const pollResult = document.getElementById("pollResult");
  let pollVotes = { inform: 0, educate: 0, entertain: 0 };

  pollForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedOption = pollForm.pollOption.value;
    if (!selectedOption) {
      pollResult.textContent = "Please select an option before voting.";
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
    pollForm.reset();
  });

  // Search functionality for Inform articles
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const informArticles = Array.from(
    document.querySelectorAll("#inform .news-article")
  );

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      searchResults.textContent = "";
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
  });

  // Social share buttons
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
