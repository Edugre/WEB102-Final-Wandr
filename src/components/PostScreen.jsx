import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useParams } from "react-router-dom"
import { supabase, getCurrentUser } from "../utils/supabase"
import { Link } from "react-router-dom"
import { FcLike } from "react-icons/fc";
import { ThreeDot } from "react-loading-indicators"

const PostScreen = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const params = useParams()
    const [postData, setPostData] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [editingComment, setEditingComment] = useState(null)
    const [postLikes, setPostLikes] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true)
                const user = await getCurrentUser()
                setCurrentUser(user)
                
                const supabase = createClient(supabaseUrl, supabaseAnonKey)

                const { data, error } = await supabase
                .from('post')
                .select(`
                    user(username, user_id),
                    post_id,
                    title,
                    description,
                    likes,
                    created_at,
                    updated_at,
                    image(image_url),
                    post_tag(tag),
                    comment(
                        user(username, user_id),
                        description,
                        created_at,
                        comment_id    
                    )
                `).eq('post_id', params.id)

                if (error) {
                    console.error('Error fetching post:', error)
                    setError(error.message)
                } else if (data && data.length > 0) {
                    console.log(data[0])
                    setPostData(data[0])
                    setPostLikes(data[0].likes)
                } 

            } catch (error) {
                console.error('Error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
        
    }, [])

    const postComment = async (e) => {
        try {
            e.preventDefault()
            const formdata = new FormData(e.target)
            const comment_description = formdata.get('comment')
            
            const { data, error } = await supabase
            .from('comment')
            .insert({
                post_id: params.id,
                user_id: currentUser.id,
                description: comment_description
            })

            if (error) {
                throw error
            } else {
                alert("Comment posted successfully!")
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const openEditMode = (e, comment_id) => {
        if (editingComment === null) {
            setEditingComment(comment_id)
        } else {
            setEditingComment(null)
        }
    }

    const updateComment = async (e, comment_id) => {
        try {
            e.preventDefault()
            const formData = new FormData(e.target)
            const comment_description = formData.get('comment')

            const { error: updateCommentError } = await supabase
            .from('comment')
            .update({
                description: comment_description
            }).eq('comment_id', comment_id)

            if (updateCommentError) {
                throw updateCommentError
            }

            alert("Comment updated successfully")
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    const deleteComment = async (e, comment_id) => {
        try {
            e.preventDefault()
            const { error: deleteCommentError } = await supabase
            .from('comment')
            .delete()
            .eq('comment_id', comment_id)

            if (deleteCommentError) {
                throw deleteCommentError
            }

            alert("Comment deleted successfully!")
            window.location.reload()

        } catch (error) {
            console.log(error)
        }
    }

    const increaseLikes = async () => {
        setPostLikes(prev => prev + 1)

        const {error} = await supabase
        .from('post')
        .update({
            likes: postLikes
        }).eq('post_id', params.id)
    }

    return (
        <div className="post-container">
        { isLoading ? 
            <div className="animation-container">
                <ThreeDot variant="bob" color="var(--primary-color)" size="large" text="" textColor="" />
            </div> :      
            <div className="post-card">
                <div className="user-date">
                    <div className="user-info">
                        <p>{postData?.user?.username}</p>
                        <p>Created at: {new Date(postData?.created_at).toLocaleString()}</p>
                        <p>Updated at: {new Date(postData?.updated_at).toLocaleString()}</p>
                    </div>
                    { postData?.user?.user_id === currentUser?.id && 
                        <div className="edit-delete-buttons">
                            <Link to={`update`}><button className="form-button">Edit Post</button></Link>
                        </div>
                    }
                </div>
                <div className="tags-container">
                    {postData?.post_tag?.length > 0 && 
                        postData?.post_tag.map(tag => <p key={tag.tag}>#{tag.tag}</p>)
                    }
                </div>
                <div className="post-screen-content">
                    { postData?.image?.length > 0 && 
                    <div className="post-image"> 
                        <img src={postData?.image[0]?.image_url} alt={postData?.title} />
                    </div>
                    }
                    <div className="post-text">
                        <h2>{postData?.title}</h2>
                        <p>{postData?.description}</p>
                    </div>
                </div>
                <div className="likes-container">
                    <p onClick={increaseLikes}><FcLike />{postLikes}</p>
                </div>
                <div className="comment-container">
                    <form className="comment-form" onSubmit={postComment}>
                        <input type="text" name="comment" id="comment" placeholder="Join the conversation..." className="form-input" />
                    </form>
                    <div className="comment-section">
                        { postData?.comment.map(comment => {
                            return (
                                <div className="comment-card" key={comment.comment_id}>
                                    <div className="comment-user-buttons">
                                        <h3>{comment.user.username}:</h3>
                                        { comment.user.user_id === currentUser.id && 
                                        <div className="comment-buttons">
                                            <button className="form-button" onClick={(e) => openEditMode(e, comment.comment_id)}>{editingComment === comment.comment_id ? "Close" : "Edit Comment"}</button>
                                        </div>
                                        }
                                    </div>
                                    <div className="comment-text">
                                        { editingComment === comment.comment_id ? (
                                            <form className="update-comment-form" onSubmit={(e) => updateComment(e, comment.comment_id)}>
                                                <input type="text" name="comment" id="comment" defaultValue={comment.description} className="form-input" /> 
                                                <div className="comment-button-container">
                                                    <button className="form-button" onClick={(e) => deleteComment(e, comment.comment_id)}>Delete</button>
                                                    <button className="form-button" type="submit">Update</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <p>{comment.description}</p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default PostScreen