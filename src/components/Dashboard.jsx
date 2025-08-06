import { createClient } from "@supabase/supabase-js"
import { Link, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { FcLike } from "react-icons/fc";

const Dashboard = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const [posts, setPosts] = useState([])
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search')

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let query = supabase
                .from('post')
                .select(`
                    post_id, 
                    title, 
                    description, 
                    likes, 
                    image(image_url), 
                    post_tag(tag),
                    user(username),
                    created_at,
                    updated_at
                `)

                if (searchQuery && searchQuery.trim() !== '') {
                    query = query.ilike('title', `%${searchQuery}%`)
                }

                const { data, error } = await query
                
                if (error) {
                    throw error
                }

                else if (data) {
                    console.log(data)
                    setPosts(data)
                } 
            } catch (error) {
                console.log(error)
            }
        }

        fetchPosts()
    }, [searchQuery])

    const sortByDate = async () => {
        try {
            let query = supabase
            .from('post')
            .select(`
                post_id, 
                title, 
                description, 
                likes, 
                image(image_url), 
                post_tag(tag),
                user(username),
                created_at,
                updated_at
            `)
            .order('created_at', { ascending: false })

            if (searchQuery && searchQuery.trim() !== '') {
                query = query.ilike('title', `%${searchQuery}%`)
            }

            const { data, error } = await query

            if (error) {
                throw error
            }

            setPosts(data)

        } catch (error) {
            console.log(error)
        }
    }

        const sortByLikes = async () => {
        try {
            let query = supabase
            .from('post')
            .select(`
                post_id, 
                title, 
                description, 
                likes, 
                image(image_url), 
                post_tag(tag),
                user(username),
                created_at,
                updated_at
            `)
            .order('likes', { ascending: false })

            if (searchQuery && searchQuery.trim() !== '') {
                query = query.ilike('title', `%${searchQuery}%`)
            }

            const { data, error } = await query

            if (error) {
                throw error
            }

            setPosts(data)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="dashboard-container">
            <div className="sort-buttons">
                <button className="form-button" onClick={sortByDate}>Newest</button>
                <button className="form-button" onClick={sortByLikes}>Hottest</button>
            </div>
            {posts?.map(post => {
                return (
                    <Link to={`/app/post/${post.post_id}`} key={post.post_id}>
                        <div className="post-card">
                            { post.image?.length > 0 &&
                            <div className="image-section">
                                <img src={post.image[0].image_url} />
                            </div> }
                            <div className="post-content">
                                <div className="user-date">
                                    <p>{post.user.username}</p>
                                    <p>Posted: {new Date(post.created_at).toLocaleString()}</p>
                                </div>
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-description">{post.description}</p>
                                <div className="likes-container">
                                    <p><FcLike />{post.likes}</p>
                                </div>
                                
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Dashboard