import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const WRONG_PASS = 'Wrong pass or login';
const USER_LOGGED_IN = 'User logged in';
const USER_CREATED = 'New user is created';
const INVALID_LOGIN = 'invalid login';
const USER_BANNED = 'You are banned';

export default function Authorization() {
  const [isAutorized, setIsAutorized] = useState(false);
  const [isWrongData, setIsWrongData] = useState(false);
  const [isInvalidLogin, setIsInvalidLogin] = useState(false);
  const [isUserBanned, setIsUserBanned] = useState(false);
  const history = useHistory();

  async function request(login, pass) {
    const body = JSON.stringify({
      login,
      pass,
    });
    const response = await fetch(process.env.REACT_APP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    return await response.json();
  }

  const userLogin = async e => {
    e.preventDefault();
    const myForm = document.forms.form;
    const status = await request(myForm.login.value, myForm.password.value);
    status === WRONG_PASS && setIsWrongData(true);
    status.info === USER_LOGGED_IN && setIsAutorized(true);
    status === INVALID_LOGIN && setIsInvalidLogin(true);
    status === USER_BANNED && setIsUserBanned(true);
    if (status.info === USER_CREATED || status.info === USER_LOGGED_IN) {
      setIsAutorized(true);
      localStorage.setItem('id', status.token);
    }

    myForm.login.value = '';
    myForm.password.value = '';
  };

  useEffect(() => {
    if (isAutorized) {
      history.push('/chat');
    }
  }, [isAutorized, history]);

  return (
    <div className="container pt-4">
      <form className="container" onSubmit={userLogin} name="form">
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Login</label>
          <input
            required
            name="login"
            type="text"
            className="form-control mb-3"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter login"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            required
            name="password"
            type="password"
            className="form-control mb-3"
            id="exampleInputPassword1"
            placeholder="Password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        {isWrongData ? (
          <div className="alert alert-info mt-3" role="alert">
            Wrong password or login!
          </div>
        ) : null}
        {isInvalidLogin ? (
          <div className="alert alert-secondary mt-3" role="alert">
            Incorrect login!
          </div>
        ) : null}
        {isUserBanned ? (
          <div className="alert alert-danger mt-3" role="alert">
            You are banned
          </div>
        ) : null}
      </form>
    </div>
  );
}
