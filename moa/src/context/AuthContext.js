import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

const URL = 'http://localhost:8080/api/';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [userAuth, setUserAuth] = useState(null);

    const checkSession = async () => {
        try {
            const response = await fetch(URL + 'session', {
                method: 'GET',
                credentials: 'include', // 쿠키를 포함하여 요청
            });

            if (response.ok) {
                const data = await response.json();
                setUserAuth(data.user);
            } else {
                console.log('세션 해제');
                setUserAuth(null);
            }
        } catch (error) {
            console.error('세션 확인 중 오류:', error);
            setUserAuth(null);
        }
    };

    const { pathname } = useLocation();
    useEffect(() => {
        console.log('세션 체크');
        checkSession();
    }, [pathname]);

    // 로그인
    const userLogin = async (info) => {
        try {
            const response = await fetch(URL + 'user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: info.email,
                    password: info.password,
                }),
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUserAuth(data.user);
                return data;
            } else {
                alert(response.status);
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert(error.message);
        }
    };

    // 로그아웃
    const userLogout = async () => {
        try {
            await fetch(URL + 'user/logout', {
                method: 'POST',
                credentials: 'include',
            });
            setUserAuth(null);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        console.log(userAuth);

        if (userAuth) {
            console.log('로그인 되었습니다:', userAuth);
        } else {
            console.log('로그아웃 되었습니다');
        }
    }, [userAuth]);

    return <AuthContext.Provider value={{ userAuth, userLogin, userLogout }}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
