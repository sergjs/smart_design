import 'materialize-css';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './routes';
import { Header } from './components/Header';

function App() {
  const routes = useRoutes(true)
  return <Router>
    <Header/>
    <div className='wrapper'>
      {routes}
    </div>
  </Router>
}

export default App;
