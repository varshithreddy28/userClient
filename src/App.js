import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NavBar from './components/navbar'
import Home from './components/home'
import Edit from './components/edit'

function App() {
  return (
    <Router>
      <NavBar></NavBar>
      <Switch>
        <Route exact path='/'>
          <Home></Home>
        </Route>
        <Route exact path='/user/edit/:id' children={<Edit></Edit>}>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
