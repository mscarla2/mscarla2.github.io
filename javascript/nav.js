document.addEventListener("DOMContentLoaded", function () {
  fetch("nav.html")
      .then((response) => response.text())
      .then((html) => {
          // Insert the navbar into the page
          document.getElementById("navbar").innerHTML = html;

          // Highlight the active link
          const currentPage = window.location.pathname;
          const navLinks = document.querySelectorAll("#navbar li");
          navLinks.forEach((link) => {
            console.log(currentPage.split("/")[2], link.getAttribute("id"))
              if (link.getAttribute("id") + ".html" === currentPage.split("/")[2]) {
                console.log("Here");
                  link.classList.add("is-active");
              }
          });
      })
      .catch((error) => console.error("Error loading the navbar:", error));
});