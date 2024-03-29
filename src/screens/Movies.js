import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';
import cinemaTecApi from '../api/cinemaTecApi';
import youtube from '../api/youtube';
import LoadingSpinner from '../components/LoadingSpinner';
import { setMovieDetails } from '../store/slices/movieDetailsSlice';
import { setUser } from '../store/slices/userSlice';
import store from '../store/store';

import './Movies.css';

const Movies = () => {
    const movies = useSelector(state => state.movies);
    const { likedMovies, unlikedMovies } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);

    const likeMovie = async (id, like) => {
        setLoading(true);
        try {
            let response;
            if (like) {
                await cinemaTecApi.delete('/user/movie/unlike', { data: { id } });
                response = await cinemaTecApi.post('/user/movie/like', { id });
            } else {
                response = await cinemaTecApi.delete('/user/movie/like', { data: { id } });
            }
            store.dispatch(setUser(response.data));
        } catch (err) {
            console.error(err);
            alert(err.response.data.error);
        }
        setLoading(false);
    };

    const getVideo = async (title, overview, id) => {
        setLoading(true);
        const res = await youtube.get('/search', {
            params: {
                q: `${title} trailer`
            }
        })
        store.dispatch(setMovieDetails({ videoId: res.data.items[0].id.videoId, description: overview, id: id }))
        setLoading(false);
    }

    const unlikeMovie = async (id, unlike) => {
        setLoading(true);
        try {
            let response;
            if (unlike) {
                await cinemaTecApi.delete('/user/movie/like', { data: { id } });
                response = await cinemaTecApi.post('/user/movie/unlike', { id });
            } else {
                response = await cinemaTecApi.delete('/user/movie/unlike', { data: { id } });
            }
            store.dispatch(setUser(response.data));
        } catch (err) {
            console.error(err);
            alert(err.response.data.error);
        }
        setLoading(false);
    };

    const renderMovies = () => {
        return movies.map((movie) => {
            const { _id, title, genre, overview, release_date, vote_average, poster_path } = movie;
            const liked = likedMovies?.includes(_id);
            const unliked = unlikedMovies?.includes(_id);
            return (
                <div className="movie-display" key={_id}>
                    <div className="movie-image">
                        <img src={poster_path} alt={title} />
                        <label>{genre}</label>
                    </div>
                    <div className="info-container">
                        <div className="movie-info">
                            <div className="movie-top">
                                <h2>{title}</h2>
                                <div className="average"><i className='bx bx-star' /> {vote_average}</div>
                            </div>
                            <label>{release_date.substring(0, 4)}</label>
                            <p>{overview}</p>
                        </div>
                        <div className="options-container">
                            <button disabled={loading} onClick={() => unlikeMovie(_id, !unliked)}>{!loading ? <i className={`bx bx${unliked ? 's' : ''}-dislike`} /> : <LoadingSpinner small colored />}</button>
                            <button disabled={loading} onClick={() => likeMovie(_id, !liked)}>{!loading ? <i className={`bx bx${liked ? 's' : ''}-like`} /> : <LoadingSpinner small />}</button>
                            <Link to={`/movie/${_id}`}> <button onClick={() => getVideo(title, overview, _id)}><i class='bx bx-info-circle' /></button></Link>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="movies-screen">
            <div className="safe-area">
                <h1>Featured <span>Movies</span></h1>
                <div className="movies-container">
                    {renderMovies()}
                </div>
            </div>
        </div>
    );
};

export default Movies;