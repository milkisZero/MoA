const URL = 'http://localhost:8080/api/';

async function userRegister(info) {
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
    }
}

export { userRegister };
