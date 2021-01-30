import './App.css';
import Header from '../Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Authorization from '../Authorization/Authorization';
import Chat from '../Chat/Chat';
import { BrowserRouter, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={Header} />
      <Route exact path="/" component={Authorization} />
      <Route path="/chat" component={Chat} />
    </BrowserRouter>
  );
}

export default App;
