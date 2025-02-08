import './App.css';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import AIComponent from './Components/IAComponent.jsx';
import HomeScreen from './Screens/HomeScreen.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomeScreen />} />
        <Route path="/:userId" exact element={<AIComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
