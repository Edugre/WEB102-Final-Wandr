import { useNavigate } from 'react-router-dom'
import { supabase, getCurrentUser } from '../utils/supabase'

const PostCreate = () => {
    const navigate = useNavigate()

    const createPost = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const title = formData.get('title')
        const description = formData.get('description')
        const imageUrl = formData.get('imageUrl') || null
        const tagsString = formData.get('tags')
        
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : []

        try {
            const user = await getCurrentUser()
            if (!user) {
                alert('You must be logged in to create a post')
                navigate('/')
                return
            }

            const { data: postData, error: postError } = await supabase
                .from('post')
                .insert({
                    title: title,
                    description: description,
                    user_id: user.id
                })
                .select('post_id')

            if (postError) {
                console.error('Error creating post:', postError)
                alert('Failed to create post: ' + postError.message)
                return
            }

            if (postData && tags.length > 0) {
                const postId = postData[0].post_id
                
                const tagRecords = tags.map(tag => ({
                    post_id: postId,
                    tag: tag
                }))
                
                const { error: tagsError } = await supabase
                    .from('post_tag')
                    .insert(tagRecords)
                
                if (tagsError) {
                    console.error('Error inserting tags:', tagsError)
                    alert('Post created but failed to add tags: ' + tagsError.message)
                    return
                }
            }

            if (postData && imageUrl !== null) {
                const postId = postData[0].post_id

                const { error: imageError } = await supabase
                .from('image')
                .insert({
                    image_url: imageUrl,
                    post_id: postId
                })

                if (imageError) {
                    console.log('Error inserting image:', imageError)
                    alert('Post created but failed to add image: ' + tagsError.message)
                    return
                }
            }

            alert('Post created successfully!')
            e.target.reset()
            navigate('/app/dashboard')
        } catch (error) {
            console.error('Error:', error)
            alert('An error occurred while creating the post')
        }
    }

    return ( 
        <div className="create-container">
            <div className="create-post-card">
                <form className="create-post-form" onSubmit={createPost}>
                    <input type="text" name="title" id="title" placeholder="Enter post title..." className="form-input" required />
                    <textarea placeholder="Enter description... (Optional)" name="description" id="description" className="form-input form-textarea" />
                    <input type="url" name="imageUrl" id="imageUrl" placeholder="Enter image URL... (Optional)" className="form-input" />
                    <input type="text" name="tags" id="tags" placeholder="Enter tags (comma-separated): travel, adventure, nature..." className="form-input" />
                    <div className="button-container">
                        <button type="submit" className="form-button">Create Post</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostCreate