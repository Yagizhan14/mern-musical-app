import React, {useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { registerAction } from '../redux'
import { clearErrorsAction } from '../redux'

const SignUp = (props) => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [buttonLoading,setButtonLoading] = useState(null)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const [errorMessage,setErrorMessage] = useState(null);
    const errorState = useSelector(state => state.error)
    const dispatch = useDispatch()
    const register = (user) => dispatch(registerAction(user))
    const clearErrors = () => dispatch(clearErrorsAction())

    if(isAuthenticated) props.history.push('/')

    const errorDiv = (
        <div className="login-error"><p className="login-error-message">{errorMessage}</p></div>
    )

    const submitHandler = e => {
        e.preventDefault()
        setButtonLoading(true)
        document.querySelector('.sign-up-form button').setAttribute('disabled',true)
        const newUser = {
            name:name.trim(),
            email:email.trim(),
            password:password.trim()
        }
        register(newUser)
        setTimeout(() => {
            setName('')
            setEmail('')
            setPassword('')
            setButtonLoading(false)
            document.querySelector('.sign-up-form button') && document.querySelector('.sign-up-form button').removeAttribute('disabled')
            if(isAuthenticated) {
                window.alert('Successfully signed up')
                clearErrors()
                props.history.push('/')
            }
        },1000)
        
    }

    useEffect(() => {
        if(errorState.id === 'REGISTER_FAIL') {
            setErrorMessage(errorState.msg.message)
            setTimeout(() => {
                clearErrors()
                setErrorMessage(null)
            }, 4000)
        }
    }, [errorState.id])

    return (
        <div className="sign-up">
            <h1 className="sign-up-header">Sign Up</h1>
            <form className="sign-up-form" onSubmit={submitHandler}>
                {errorMessage ? errorDiv : null}
                <label htmlFor="name">Name : </label>
                <input name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: John Doe" required/>
                <label htmlFor="email">E-mail : </label>
                <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Example: johndoe@example.com" required/>
                <label htmlFor="password" >Password : </label>
                <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button type="submit" style={buttonLoading ? {backgroundColor:'grey',cursor:'not-allowed'} : {backgroundColor:'#fd79a8',cursor:'pointer'}}><span style={buttonLoading ? {display:'block'} : null}></span>{buttonLoading ? null : "Sign Up"}</button>
            </form>
        </div>
    )
}

export default SignUp
