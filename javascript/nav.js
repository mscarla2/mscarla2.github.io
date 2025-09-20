document.addEventListener("DOMContentLoaded", function () {
  // Fetch nav.html from the root directory.
  fetch("/nav.html")
    .then((response) => {
      if (!response.ok) throw new Error("Navbar not found");
      return response.text();
    })
    .then((html) => {
      document.getElementById("navbar").innerHTML = html;

      // Make the navbar burger functional on mobile
      const burger = document.querySelector(".navbar-burger");
      const menu = document.querySelector(".navbar-menu");
      burger.addEventListener("click", () => {
        burger.classList.toggle("is-active");
        menu.classList.toggle("is-active");
      });

      // Robust active link highlighting
      const currentPagePath = window.location.pathname;
      const navLinks = document.querySelectorAll(".navbar-menu a.navbar-item");

      navLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname;
        // Handle special case for root/index.html
        if (currentPagePath === '/' || currentPagePath === '/index.html') {
            if (linkPath === '/index.html') {
                link.classList.add("is-active");
            }
        } else {
            // Check if the link's path is a substring of the current page's path
            if (currentPagePath.includes(linkPath) && linkPath !== '/index.html') {
                link.classList.add("is-active");
            }
        }
      });
    })
    .catch((error) => console.error("Error loading the navbar:", error));
});