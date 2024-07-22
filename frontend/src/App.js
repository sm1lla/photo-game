import './App.css'; // Ensure this line is present
import React from "react";
import Game from "./Game";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleLogin from './components/GoogleLogin';


function App() {
	return (
		<div className="App">
			<header className="App-header">
			<Router>
					<Routes>
					<Route path="/game" element={<Game></Game>} />
					<Route path="/" element={<GoogleLogin></GoogleLogin>} />
					</Routes>
			</Router>
			</header>
		</div>
	);
}

export default App;
