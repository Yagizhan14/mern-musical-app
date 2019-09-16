import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../redux';
import { clearErrorsAction } from '../redux';

const SignIn = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const errorState = useSelector(state => state.error);
  const dispatch = useDispatch();
  const clearErrors = () => dispatch(clearErrorsAction());
  const login = credentials => dispatch(loginAction(credentials));

  const errorDiv = (
    <div className='login-error'>
      <p className='login-error-message'>{errorMessage}</p>
    </div>
  );

  const submitHandler = e => {
    e.preventDefault();
    setButtonLoading(true);
    document
      .querySelector('.sign-in-form button')
      .setAttribute('disabled', true);
    const credentials = {
      email: email.trim(),
      password: password.trim(),
    };
    login(credentials);
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setButtonLoading(false);
      document.querySelector('.sign-in-form button') &&
        document
          .querySelector('.sign-in-form button')
          .removeAttribute('disabled');
      if (isAuthenticated) {
        window.alert('Successfully logged in!');
        clearErrors();
        props.history.push('/');
      }
    }, 1000);
  };

  useEffect(() => {
    if (errorState.id === 'LOGIN_FAIL') {
      setErrorMessage(errorState.msg.message);
      setTimeout(() => {
        clearErrors();
        setErrorMessage(null);
      }, 4000);
    }
  }, [errorState.id]);

  return (
    <div className='sign-in'>
      <h1 className='sign-in-header'>Sign In</h1>
      <form className='sign-in-form' onSubmit={submitHandler}>
        {errorMessage ? errorDiv : null}
        <label htmlFor='email'>E-mail : </label>
        <input
          name='email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Example: johndoe@example.com'
          required
        />
        <label htmlFor='password'>Password : </label>
        <input
          name='password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type='submit'
          style={
            buttonLoading
              ? { backgroundColor: 'grey', cursor: 'not-allowed' }
              : { backgroundColor: 'rgb(25,111,61)', cursor: 'pointer' }
          }
        >
          <span style={buttonLoading ? { display: 'block' } : null}></span>
          {buttonLoading ? null : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
