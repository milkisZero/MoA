// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import Main from './pages/Main';
import TotalClubs from './pages/TotalClubs';
import Login from './pages/Login';
import Register from './pages/Register';
import { useLocation } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Message from './pages/Message';
import MakeClub from './pages/MakeClub';
import MyPage from './pages/MyPage';
import Pictures from './pages/Pictures';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="App">
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Main />}></Route>
                        <Route path="/TotalClubs" element={<TotalClubs />}></Route>
                        <Route path="/Login" element={<Login />}></Route>
                        <Route path="/Register" element={<Register />}></Route>
                        <Route path="/Message" element={<Message />}></Route>
                        <Route path="/MakeClub" element={<MakeClub />}></Route>
                        <Route path="/MyPage" element={<MyPage />}></Route>
                        <Route path="/Pictures" element={<Pictures />}></Route>
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default App;
