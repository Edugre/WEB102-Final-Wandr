import { createClient } from "@supabase/supabase-js"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    const register_user = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const first_name = formData.get('first_name')
        const last_name = formData.get('last_name')
        const email = formData.get('email')
        const username = formData.get('username')
        const password = formData.get('password')
        const country = formData.get('country')

        try {
            const supabase = createClient(supabaseUrl, supabaseAnonKey)
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password
            })

            if (error) {
                throw error 
            } else if ( data.user ) {
                const { error } = await supabase
                .from('user')
                .insert({
                    user_id: data.user.id,
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                    country: country,
                })

                if (error) {
                    throw error
                } else {
                    console.log('User registered successfully!')
                    alert('Registration successful! Please check your email and click the verification link to activate your account.')
                    navigate('/')
                }
            }
 
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="register-container">
            <h1>Create your account and start sharing your journeys</h1>
            <div className="register-card">
                <form className="register-form" onSubmit={register_user}>
                    <input type="text" name="first_name" id="first_name" placeholder="First name..." className="form-input" />
                    <input type="text" name="last_name" id="last_name" placeholder="Last name..." className="form-input" />
                    <input type="email" name="email" id="email" placeholder="Email..." className="form-input" />
                    <input type="text" name="username" id="username" placeholder="Username..." className="form-input" />
                    <input type="password" name="password" id="password" placeholder="Password..." className="form-input" />
                    <input type="text" name="country" id="country" placeholder="Country..." className="form-input" />
                    <button type="submit" className="form-button">Create Account</button>
                </form>
            </div>
        </div>
    )
}

export default Register