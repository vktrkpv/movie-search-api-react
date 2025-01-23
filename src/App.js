import './App.css';
import { useEffect, useState } from 'react';

// http://www.omdbapi.com/?i=tt3896198&apikey=473d6faa



function App() {

  const MY_KEY = "1af5d18e750b842d52254dc1ba20c287";

  const [mySerch, setMySearch] = useState("");
  const [myMovies, setMyMovies] = useState([]);
  const [wordSumbitted, setWordSumbitted] = useState("");
  const [showMoreState, setShowMoreState] = useState({});


  useEffect(() => {
    const getMovies = async () => {
      if (!wordSumbitted) return;
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${MY_KEY}&query=${wordSumbitted}`);
      const data = await response.json();
      setMyMovies(data.results || []) 
      console.log(data.results)   
      }
    getMovies();
   },[wordSumbitted]);

   const myMovieSerch = (e) => {
    setMySearch(e.target.value);
    console.log(e.target.value)
   }

   const finalSearch = (e) => {
    e.preventDefault();
    setWordSumbitted(mySerch);
   }

   const clearAll = () => {
    setMyMovies([]);
    setMySearch('');
    setShowMoreState({})
   }

   const toggleShowMore = (id) => {
    setShowMoreState(prevState => ({...prevState, [id]: !prevState[id]}))

   }

   const fetchTrailer = async (id) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${MY_KEY}`);
    const data = await response.json();
    
    const trailer = data.results.find((video) => video.type === "Trailer" && video.site === "YouTube");

    if(trailer) {
      const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
      window.open(trailerUrl, "_blank");
    } else {
      alert('Trailer is not available')
    }

    console.log(data)

   }
 
  return(
    <div className='container'>

        <form className='form-box' onSubmit={finalSearch}>
          <h1> What movie are you looking for? </h1>
        <input onChange={myMovieSerch} value={mySerch} placeholder='Write here'/>
        <button className='btn'>Find</button>
        <button className='btn red-btn' onClick={clearAll}>Reset</button>
        
      </form>

      <div className='movie'>

          {myMovies.map((movie) => (

            <div key={movie.id} className='movie-box' >
                  <h3>{movie.title}</h3>
                  <p>Vote average: {movie.vote_average}</p>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} width="200px"/>
                  <p>
                    {showMoreState[movie.id] 
                    ? movie.overview 
                    : movie.overview.substring(0,117) + "..."}
                    <button className='btn-showmore' onClick={() => toggleShowMore(movie.id)}>
                      {showMoreState[movie.id] ? "Show less" : "Show more"}</button>
                  </p>
                  <button className='btn-trailer'
                    onClick={() => fetchTrailer(movie.id)}>Watch Trailer</button>
            </div>
          ))}
      </div>
   

    

      
      

    </div>
  )
  
  
}

export default App;
