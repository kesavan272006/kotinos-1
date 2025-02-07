import Loading from "../components/Loading";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";

const Rightbar = () => {
  const [news, setNews] = useState([]);

  const getNews = () => {
    fetch("https://newsapi.org/v2/top-headlines?category=sports&apiKey=087f14f412fb45c98779389f7adcbfab")
      .then((res) => res.json())
      .then((json) => setNews(json.articles))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    getNews();
    const interval = setInterval(() => getNews(), 300000); 
    return () => clearInterval(interval);
  }, []);

  const newsList = news.slice(0, 15);

  return (
    <div style={{ width: '20vw', height: '500px', backgroundColor: 'white', borderWidth: '1px', borderColor: 'black', borderStyle: 'solid', marginTop: '50px' }}>
      <h3>Sports News</h3>
      {newsList && newsList.length > 0 ? ( 
        <ul>
          {newsList.map((article, index) => (
            <li key={index}>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.urlToImage && <img src={article.urlToImage} alt={article.title} style={{ width: '100%', height: 'auto' }} />}
                <p>{article.title}</p>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Rightbar;
