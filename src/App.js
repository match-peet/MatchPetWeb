import './App.css';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import AIComponent from './Components/IAComponent.jsx';
import HomeScreen from './Screens/HomeScreen.jsx';
import AdoptionDetails from './Components/SendMail.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomeScreen />} />
        {/* Usa la ruta con :userId para capturar el parámetro correctamente */}
        <Route path="/:userId" exact element={<AIComponent />} />
        <Route path="/hello" exact element={<AdoptionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
