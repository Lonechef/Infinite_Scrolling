import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import '../App.css';

const InfiniteScrollComp = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    //Loader to set the Loading 
    const [loading, setLoading] = useState(false);
    //State to look for more pages
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            //Axios to fetch data from the API
            const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=20`);
            if (response.data.length > 0) {
                //Spread operator to fetch prev data
                setPosts(prevPosts => [...prevPosts, ...response.data]);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (hasMore) {
            fetchPosts();
        }
    }, [page, hasMore]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    }, [loading, hasMore]);

    useEffect(() => {
        const handleScrollEvent = () => {
            requestAnimationFrame(handleScroll);
        };
        
        window.addEventListener('scroll', handleScrollEvent);
        return () => window.removeEventListener('scroll', handleScrollEvent);
    }, [handleScroll]);

    return (
        <div className="infinite-scroll-container">
            {posts.map(post => (
                <div key={post.id} className="post">
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            ))}
            {loading && <div className="loader"></div>}
        </div>
    );
};

export default InfiniteScrollComp;
