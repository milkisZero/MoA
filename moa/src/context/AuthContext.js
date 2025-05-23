import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const URL = 'http://localhost:8080/api/';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
    const [userAuth, setUserAuth] = useState(null);
    const navigate = useNavigate();

    const checkSession = async () => {
        try {
            const response = await fetch(URL + 'session', {
                method: 'GET',
                credentials: 'include', // 쿠키를 포함하여 요청
            });

            if (response.ok) {
                const data = await response.json();

                // 값이 다를 경우에만 상태 업데이트
                if (JSON.stringify(userAuth) !== JSON.stringify(data.user)) {
                    setUserAuth(data.user);
                }
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
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if (userAuth) {
            console.log('로그인 되었습니다');
        } else {
            console.log('로그아웃 되었습니다');
        }
    }, [userAuth]);

    return <AuthContext.Provider value={{ userAuth, userLogin, userLogout }}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
