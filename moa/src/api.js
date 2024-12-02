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

async function getPage({ roomId, msgId }) {
    try {
        msgId = !msgId ? '' : msgId;
        const response = await fetch(URL + `msgRoom/${roomId}` + `?msgId=${msgId}`);
        if (response.ok) {
            const data = await response.json();
            return data.messages;
        }
    } catch (error) {
        alert(error.message);
    }
}

async function getClubInfo({ page, limit }) {
    try {
        const response = await fetch(URL + 'club/total_club' + `?page=${page}` + `&limit=${limit}`);
        if (response.ok) {
            const data = await response.json();
            return data.club;
        }
    } catch (error) {
        alert(error.message);
    }
}

async function addClub(formData) {
    try {
        const response = await fetch(URL + 'club/', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            return data.newClub;
        }
    } catch (error) {
        alert(error.message);
    }
}

export { userRegister, getPage, getClubInfo, addClub };
