let blogPosts = [];

// Function to fetch blog filenames from the Blogs directory
async function fetchBlogFiles() {
  try {
    const response = await fetch('../blogs/list.json');
    if (!response.ok) throw new Error(`Failed to fetch blog index file`);
    const filenames = await response.json();
    return filenames;
  } catch (error) {
    console.error('Error fetching blog files:', error);
    return []; // Return an empty array on error
  }
}

// Function to fetch and load blog posts
async function loadBlogPosts() {
  const filenames = await fetchBlogFiles();

  if (filenames.length === 0) {
    console.error("No blog files found or failed to load.");
    hideLoader(); // Ensure the loader disappears even on error
    return;
  }

  for (const filename of filenames) {
    try {
      const response = await fetch(`../blogs/${filename}`);
      if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
      const post = await response.json();

      // Fetch the contentFile (Markdown content)
      if (post.contentFile) {
        const contentResponse = await fetch(post.contentFile);
        if (!contentResponse.ok) throw new Error(`Failed to fetch ${post.contentFile}`);
        const markdownContent = await contentResponse.text();
        post.metadata.content = markdownContent; // Replace content in metadata with the Markdown
      }

      blogPosts.push(post);
    } catch (error) {
      console.error(`Error loading blog post ${filename}:`, error);
    }
  }

  renderCollapsedBlogPosts();
  addClickListeners();
  hideLoader();
}

// Function to hide the loader and show the blog posts
function hideLoader() {
  const loader = document.getElementById("loader");
  const blogPostsContainer = document.getElementById("blog-posts");

  if (loader && blogPostsContainer) {
    setTimeout(() => {
      loader.style.display = "none"; // Hide the loader
      blogPostsContainer.style.display = "block"; // Show the blog posts
    }, 400); // 400ms delay
  }
}

// Function to generate HTML for a single blog post (collapsed view)
function createCollapsedBlogPostHTML(post) {
  const content = marked.parse(post.metadata.content);
  return `
    <div class="card" data-id="${post.metadata.title}">
      <header class="card-header">
        <p class="card-header-title">${post.metadata.title}</p>
      </header>
      <div class="card-content is-hidden">
        <div class="content is-medium">${content}</div>
        <p class="subtitle">Posted on: ${post.metadata.date}</p>
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
    card.addEventListener("click", () => {
      const postId = card.getAttribute("data-id");
      toggleExpandedPost(postId);
    });
  }
}

// Load and render blog posts on page load
loadBlogPosts();
