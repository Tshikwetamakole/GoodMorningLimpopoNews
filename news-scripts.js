(() => {
  // Encapsulate all code to avoid global scope pollution
  document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("newsContainer");
    const commentsList = document.getElementById("commentsList");
    const commentForm = document.getElementById("commentForm");
    const commentInput = document.getElementById("commentInput");
    const quizContainer = document.getElementById("quizContainer");

    // Fetch South African news from a public API (mocked here with sample data)
    async function fetchNews() {
      try {
        // Example API: https://newsapi.org/ (requires API key)
        // For demo, using mock data
        const newsData = [
          {
            title: "South Africa's Economy Shows Signs of Recovery",
            description:
              "The latest reports indicate a positive trend in economic growth...",
            url: "#",
            source: "SA News",
            publishedAt: "2024-04-10",
          },
          {
            title: "Limpopo Province Launches New Health Initiative",
            description:
              "A new health program aimed at rural communities has been launched...",
            url: "#",
            source: "Limpopo Times",
            publishedAt: "2024-04-12",
          },
          {
            title: "Youth Arts Festival to Take Place in Polokwane",
            description:
              "The annual festival celebrating youth creativity will be held next month...",
            url: "#",
            source: "Creative SA",
            publishedAt: "2024-04-15",
          },
        ];

        displayNews(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
        newsContainer.innerHTML = `<p>Failed to load news. Please try again later.</p>`;
      }
    }

    function displayNews(newsItems) {
      if (!newsItems.length) {
        newsContainer.innerHTML = `<p>No news available at the moment.</p>`;
        return;
      }
      newsContainer.innerHTML = "";
      newsItems.forEach((item) => {
        const article = document.createElement("article");
        article.classList.add("news-article");
        article.innerHTML = `
          <h3><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h3>
          <p>${item.description}</p>
          <p><small>Source: ${item.source} | Published: ${item.publishedAt}</small></p>
        `;
        newsContainer.appendChild(article);
      });
    }

    // Comments functionality
    let comments = [];

    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const commentText = commentInput.value.trim();
      if (!commentText) return;
      const comment = {
        text: commentText,
        date: new Date().toLocaleString(),
      };
      comments.push(comment);
      renderComments();
      commentInput.value = "";
    });

    function renderComments() {
      commentsList.innerHTML = "";
      comments.forEach((c) => {
        const div = document.createElement("div");
        div.classList.add("comment");
        div.innerHTML = `<p>${c.text}</p><small>${c.date}</small>`;
        commentsList.appendChild(div);
      });
    }

    // Quiz functionality
    const quizQuestions = [
      {
        question: "What is the capital city of Limpopo Province?",
        options: ["Polokwane", "Tzaneen", "Mokopane", "Thohoyandou"],
        answer: "Polokwane",
      },
      {
        question: "Which sector is a major contributor to Limpopo's economy?",
        options: ["Mining", "Technology", "Tourism", "Manufacturing"],
        answer: "Mining",
      },
      {
        question: "When is the annual Youth Arts Festival in Polokwane?",
        options: ["April", "June", "August", "December"],
        answer: "April",
      },
    ];

    function renderQuizOptions(options, questionIndex) {
      return options
        .map(
          (opt) => `
            <label>
              <input type="radio" name="q${questionIndex}" value="${opt}" />
              ${opt}
            </label>
          `
        )
        .join("");
    }

    function loadQuiz() {
      quizContainer.innerHTML = "";
      quizQuestions.forEach((q, i) => {
        const div = document.createElement("div");
        div.classList.add("quiz-question");
        div.innerHTML = `
          <p><strong>Q${i + 1}:</strong> ${q.question}</p>
          ${renderQuizOptions(q.options, i)}
        `;
        quizContainer.appendChild(div);
      });
      const submitBtn = document.createElement("button");
      submitBtn.textContent = "Submit Quiz";
      submitBtn.addEventListener("click", gradeQuiz);
      quizContainer.appendChild(submitBtn);
    }

    function gradeQuiz() {
      let score = 0;
      quizQuestions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === q.answer) {
          score++;
        }
      });
      quizContainer.innerHTML += `<p>Your score: ${score} / ${quizQuestions.length}</p>`;
    }

    fetchNews();
    loadQuiz();
  });
})();
