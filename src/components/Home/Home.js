import React from 'react';
import { } from "@material-tailwind/react";
import { useQuery } from 'react-query'
import PostCard from '../PostCard/PostCard';

const Home = () => {
    const {data: posts = [], refetch} = useQuery({
        queryKey: ['posts'],
        queryFn: ()=>fetch('https://dumsoc-server.vercel.app/posts')
        .then(response => response.json())
    }) 

    const refresh = () => refetch()
    return (
        <div>
            {
                posts.map((post, index) => <PostCard key={index} post={post} refresh={refresh}/>)
            }
        </div>  
    );
};

export default Home;