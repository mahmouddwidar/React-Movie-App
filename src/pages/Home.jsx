import { useEffect, useState } from "react";
import "../css/Home.css";
import MovieCard from "../components/MovieCard";
import { getPopularMovies, SearchMovies } from "../services/api";

function Home() {
	const [searchQuery, setSearchQuery] = useState("");
	const [movies, setMovies] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadPopularMovies = async () => {
			try {
				const popularMovies = await getPopularMovies();
				setMovies(popularMovies);
			} catch (err) {
				console.log(err);
				setError("Failed to load movies....");
			} finally {
				setLoading(false);
			}
		};
		loadPopularMovies();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;
		if (loading) return;
		setLoading(true);
		try {
			const searchResults = await SearchMovies(searchQuery);
			setMovies(searchResults);
			setError(null);
		} catch (err) {
			console.log(err);
			setError("Failed to search movies...");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="home">
				<form onSubmit={handleSubmit} className="search-form">
					<input
						type="text"
						placeholder="Search movies here..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-input"
					/>
					<button type="submit" className="search-button">
						Search
					</button>
				</form>
			</div>
			{error && <div className="error-message">{error}</div>}
			{loading ? (
				<div className="loading">
					Loading<span>...</span>
				</div>
			) : (
				<div className="movies-grid">
					{movies.map((movie) => (
						<MovieCard movie={movie} key={movie.id} />
					))}
				</div>
			)}
		</>
	);
}

export default Home;
