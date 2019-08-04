import React, {useEffect,useContext} from 'react';
import { Route,Switch,__RouterContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTransition,animated } from 'react-spring';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PageNotFound from './components/PageNotFound';
import { loadUserAction } from './redux';
import Playlist from './components/Playlist';
import Search from './components/Search';
import ProtectedRoute from './components/ProtectedRıoute';
import Loader from './components/Loader';
import './App.css';

const App = () => {
  const dispatch = useDispatch()
  const loadUser = () => dispatch(loadUserAction())

  useEffect(() => {
    loadUser()
    setTimeout(() => {
      document.querySelector('.preloader').classList.toggle('complete')
    }, 2000);
  },[])

  const { location } = useContext(__RouterContext);
  const transitions = useTransition(location, location => location.pathname,{
    from:{opacity:0,display:"none",transition:"all 0.3s linear"},
    enter:{opacity:1,display:"block"},
    leave:{opacity:0,display:"none"}
  })

  return (
    <div className="app">
      <Loader />
      <Navbar />
      <main>
        {transitions.map(({item,props,key}) => {
          return(
            <animated.div key={key} style={props}>
              <Switch location={item}>
                <Route exact path="/" component={Home} />
                <ProtectedRoute exact path="/sign-up" component={SignUp}/>
                <ProtectedRoute exact path="/sign-in" component={SignIn}/>
                <ProtectedRoute exact path="/playlist" component={Playlist}/>
                <ProtectedRoute exact path="/search" component={Search}/> 
                <Route path="*" component={PageNotFound} />
              </Switch>
            </animated.div>
          )
        })}
      </main>
      <footer>
        <p>Copyright<sup>&copy;</sup>  2019 MUSICAL</p> 
      </footer> 
    </div>
  );
}

export default App;
