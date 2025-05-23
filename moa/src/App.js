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
import Detail_club from './pages/DetailClubs/DetailClubs';
import MakePost from './pages/MakePost';
import DetailPost from './pages/DetailPost';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="App">
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Main />}></Route>
                        <Route path="/TotalClubs/:page" element={<TotalClubs />}></Route>
                        <Route path="/Login" element={<Login />}></Route>
                        <Route path="/Register" element={<Register />}></Route>
                        <Route path="/MyPage" element={<MyPage />}></Route>
                        {/* <Route path="/Pictures" element={<Pictures />}></Route> */}
                        <Route path="/Detail_club/:clubId" element={<Detail_club />} />
                        <Route path="/Message/:roomId" element={<Message />}></Route>
                        <Route path="/MakeClub" element={<MakeClub />}></Route>
                        <Route path="/MakePost" element={<MakePost />}></Route>
                        <Route path="/DetailPost/:postId" element={<DetailPost />}></Route>
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
