import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const PostUpdate = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const [postData, setPostData] = useState(null)
    const params = useParams()

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase
                .from('post')
                .select(`
                    title,
                    description,
                    post_tag(tag),
                    image(image_url)
                `)
                .eq('post_id', params.id)

                if (error) {
                    throw error
                } 
                else if (data) {
                    setPostData(data[0])
                    console.log(data)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchPost()
    }, [])

    const updatePost = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData(e.target)
            const title = formData.get('title')
            const description = formData.get('description')
            const imageUrl = formData.get('imageUrl')
            const tagsString = formData.get('tags')
            const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [] 
            

            const { error: postUpdateError } = await supabase 
            .from('post')
            .update({
                title: title,
                description: description
            }).eq('post_id', params.id)

            if (postUpdateError) {
                throw postUpdateError
            } 

            const { error: imageDeleteError } = await supabase
            .from('image')
            .delete()
            .eq('post_id', params.id)

            if (imageDeleteError) {
                throw imageDeleteError
            }

            if (imageUrl && imageUrl.trim() !== '') {
                const { error: imageInsertError } = await supabase
                .from('image')
                .insert({
                    image_url: imageUrl,
                    post_id: params.id
                }).eq('post_id', params.id)

                if (imageInsertError) {
                    throw imageInsertError
                } 
            }

            const { error: tagDeleteError } = await supabase
            .from('post_tag')
            .delete()
            .eq('post_id', params.id)

            if (tagDeleteError) {
                throw tagDeleteError
            }

            if (tags.length > 0) {

                const tagRecords = tags.map(tag => ({
                    post_id: params.id,
                    tag: tag
                }))

                const { error: tagInsertError } = await supabase
                .from('post_tag')
                .insert(tagRecords)

                if (tagInsertError) {
                    throw tagInsertError
                }
            }

            alert("Post updated successfully!")
            navigate(`/app/post/${params.id}`)
        } catch (error) {
            console.log(error)
        }
    }

    const deletePost = async (e) => {
        e.preventDefault()

        try {
            const { error: postDeleteError } = await supabase
            .from('post')
            .delete()
            .eq('post_id', params.id)

            if (postDeleteError) {
                throw postDeleteError
            }

            alert("Post deleted successfully!")
            navigate('/app/dashboard')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="update-container">
            <div className="update-post-card">
                <form className="update-post-form" onSubmit={updatePost} >
                    <input type="text" name="title" id="title" placeholder="Enter post title..." className="form-input" defaultValue={postData?.title || ''} required />
                    <textarea placeholder="Enter description... (Optional)" name="description" id="description" className="form-input form-textarea" defaultValue={postData?.description}/>
                    <input type="url" name="imageUrl" id="imageUrl" placeholder="Enter image URL... (Optional)" className="form-input" defaultValue={postData?.image?.[0]?.image_url || ''} />
                    <input type="text" name="tags" id="tags" placeholder="Enter tags (comma-separated): travel, adventure, nature..." className="form-input" defaultValue={postData?.post_tag?.map(tag => tag.tag).join(', ') || ''} />
                    <div className="button-container">
                        <button type="submit" className="form-button">Update Post</button>
                        <button className="form-button" onClick={deletePost}>Delete Post</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostUpdate