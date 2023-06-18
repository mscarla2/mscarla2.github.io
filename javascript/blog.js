// Sample blog post data
const blogPosts = [
  {
    title: "First Blog Post",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    author: "John Smith",
    date: "June 18, 2023",
  },
  {
    title: "Second Blog Post",
    content:
      "Phasellus nec iaculis mauris. Duis at justo sed lorem sodales interdum.",
    author: "Jane Doe",
    date: "June 20, 2023",
  },
];

// Function to generate HTML for a single blog post (collapsed view)
function createCollapsedBlogPostHTML(post) {
    return `
      <div class="card" data-id="${post.title}">
        <header class="card-header">
          <p class="card-header-title">${post.title}</p>
        </header>
        <div class="card-content is-hidden">
          <div class="content">${post.content}</div>
          <p class="subtitle">By ${post.author} on ${post.date}</p>
        </div>
      </div>
    `;
  }
  

// Function to render the blog posts (collapsed view)
function renderCollapsedBlogPosts() {
  const blogPostsContainer = document.getElementById("blog-posts");
  blogPostsContainer.innerHTML = "";

  for (const post of blogPosts) {
    const postHTML = createCollapsedBlogPostHTML(post);
    blogPostsContainer.innerHTML += postHTML;
  }
}

// Function to toggle the visibility of the expanded blog post
function toggleExpandedPost(postTitle) {
  const postElement = document.querySelector(
    `.card[data-id="${postTitle}"] .card-content`
  );
  postElement.classList.toggle("is-hidden");
}

// Add click event listeners to toggle the expanded blog post
function addClickListeners() {
  const cards = document.querySelectorAll(".card");
  for (const card of cards) {
    card.addEventListener("click", (event) => {
      const postId = card.getAttribute("data-id");
      toggleExpandedPost(postId);
    });
  }
}

// Call the renderCollapsedBlogPosts and addClickListeners functions to display the collapsed blog posts and enable expand/collapse functionality
renderCollapsedBlogPosts();
addClickListeners();
