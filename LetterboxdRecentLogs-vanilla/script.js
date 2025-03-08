const maxMovies = 4;
const fullStarPath = "assets/full-star.png";
const halfStarPath = "assets/half-star.png";

async function fetchLetterboxdMovies(username) {
    try {
        let response = await fetch(`https://letterboxd.com/${username}/rss/`);
        let text = await response.text();

        let data = new window.DOMParser().parseFromString(text, "text/xml");
        let moviesHtml = "";
        let items = data.querySelectorAll("item");

        for (let i = 0; i < maxMovies; i++) {
            // Extract necessary data from the RSS feed item
            let item = items[i];
            let titleText = item.querySelector("title").textContent;
            let link = item.querySelector("link").textContent;
            let description = item.querySelector("description").textContent;

            // Extract movie title without rating
            let title = titleText.replace(/, \d{4} - ★+½?/g, "").trim();
            console.log("Clean Title:", title);

            // Extract movie poster from description
            let posterMatch = description.match(/<img src="(.*?)"/);
            let posterUrl = posterMatch ? posterMatch[1] : "";

            // Extract rating from title
            let ratingMatch = titleText.match(/★+/);
            let halfStarMatch = titleText.includes("½");
            let fullStars = ratingMatch ? ratingMatch[0].length : 0;
            let hasHalfStar = halfStarMatch;

            // Generate star images
            let ratingHtml = "";
            for (let j = 0; j < fullStars; j++) {
                ratingHtml += `<img src="${fullStarPath}" alt="Full Star">`;
            }
            if (hasHalfStar) {
                ratingHtml += `<img src="${halfStarPath}" alt="Half Star">`;
            }

            // Append movie card
            moviesHtml += `
                <div class="movie-card">
                    <a href="${link}" target="_blank">
                        <img class="movie-card__image" src="${posterUrl}" alt="${title}">
                        <div class="movie-card__rating">${ratingHtml}</div>
                    </a>
                </div>
            `;
        }

        document.getElementById("movie-list").innerHTML = moviesHtml;
    } catch (error) {
        console.error("Error loading Letterboxd:", error);
    }
}

// Get username from data attribute and fetch movies on page load
document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector(".recently-watched");
    const username = container.dataset.username;
    fetchLetterboxdMovies(username);
});
