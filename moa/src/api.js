const URL = 'http://localhost:8080/api/';

// 회원가입
async function userRegister(info) {
    try {
        const response = await fetch(URL + 'user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: info.name,
                email: info.email,
                password: info.password,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            alert(response.status);
        }
    } catch (error) {
        alert(error.message);
    }
}

async function getPage({ roomId, page, pageLimit, msgId }) {
    try {
        const response = await fetch(URL + `msgRoom/${roomId}` + `?page=${page}&limit=${pageLimit}&msgId=${msgId}`);
        if (response.ok) {
            const data = await response.json();
            return data.messages;
        }
    } catch (error) {
        alert(error.message);
    }
}

export { userRegister, getPage };
