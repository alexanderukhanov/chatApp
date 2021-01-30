import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isAutorizedUser, setIsAutorizedUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('id');
    if (token) {
      setIsAutorizedUser(true);
    }
  }, []);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-warning">
      <a className="navbar-brand" href="/">
        Chat-app
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className="nav-item nav-link" href="/">
            Authorization
          </a>
          <Link
            className="nav-item nav-link"
            to={isAutorizedUser ? '/chat' : ''}
          >
            Chat
          </Link>
        </div>
      </div>
    </nav>
  );
}
