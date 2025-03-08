import { useState, useEffect } from 'react';
import './LetterboxdRecentLogs.css';
import fullStarIcon from './assets/full-star.png';
import halfStarIcon from './assets/half-star.png';
import letterboxdLogo from './assets/letterboxd-logo.png';

interface LetterboxdRecentLogsProps {
  username: string;
  maxFilms?: number;
}

interface Film {
  title: string;
  link: string;
  posterUrl: string;
  fullStars: number;
  hasHalfStar: boolean;
}

/**
 * LetterboxdRecentLogs - A React component that displays recently logged films from a Letterboxd profile
 * 
 * @param {string} username - The Letterboxd username to fetch films from
 * @param {number} [maxFilms=4] - Maximum number of films to display
 * 
 * @returns {JSX.Element} - The rendered component
 */
export const LetterboxdRecentLogs = ({ 
  username, 
  maxFilms = 4 
}: LetterboxdRecentLogsProps) => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetterboxdFilms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://letterboxd.com/${username}/rss/`);
        const text = await response.text();

        const parser = new window.DOMParser();
        const data = parser.parseFromString(text, "text/xml");
        const items = data.querySelectorAll("item");
        
        const fetchedFilms: Film[] = [];

        for (let i = 0; i < Math.min(maxFilms, items.length); i++) {
          const item = items[i];
          const titleText = item.querySelector("title")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const description = item.querySelector("description")?.textContent || "";

          // Extract film title without rating
          const title = titleText.replace(/, \d{4} - ★+½?/g, "").trim();

          // Extract film poster from description
          const posterMatch = description.match(/<img src="(.*?)"/);
          const posterUrl = posterMatch ? posterMatch[1] : "";

          // Extract rating from title
          const ratingMatch = titleText.match(/★+/);
          const halfStarMatch = titleText.includes("½");
          const fullStars = ratingMatch ? ratingMatch[0].length : 0;

          fetchedFilms.push({
            title,
            link,
            posterUrl,
            fullStars,
            hasHalfStar: halfStarMatch
          });
        }

        setFilms(fetchedFilms);
        setError(null);
      } catch (error) {
        console.error("Error loading Letterboxd:", error);
        setError("Failed to load recently logged films");
      } finally {
        setLoading(false);
      }
    };

    fetchLetterboxdFilms();
  }, [username, maxFilms]);

  if (loading) {
    return (
      <div className="recently-logged">
        <div className="recently-logged__loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recently-logged">
        <div className="recently-logged__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="recently-logged">
      <div className="recently-logged__header">
        <h2 className="recently-logged__title">Recently Watched</h2>
        <img src={letterboxdLogo} alt="Letterboxd" className="letterboxd-logo" />
      </div>
      <div className="recently-logged__row">
        {films.map((film, index) => (
          <div key={index} className="film-card">
            <a href={film.link} target="_blank" rel="noopener noreferrer">
              <img 
                className="film-card__image" 
                src={film.posterUrl} 
                alt={film.title} 
              />
              <div className="film-card__rating">
                {[...Array(film.fullStars)].map((_, i) => (
                  <img key={`full-${i}`} src={fullStarIcon} alt="Full Star" />
                ))}
                {film.hasHalfStar && 
                  <img src={halfStarIcon} alt="Half Star" />
                }
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LetterboxdRecentLogs;