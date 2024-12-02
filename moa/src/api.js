const URL = 'http://localhost:8080/api/';

// 회원가입
export async function userRegister(info) {
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
            return data.newUser;
        } else {
            console.log(response.status);
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function getPage({ roomId, msgId }) {
    try {
        msgId = !msgId ? '' : msgId;
        const response = await fetch(URL + `msgRoom/${roomId}` + `?msgId=${msgId}`);
        if (response.ok) {
            const data = await response.json();
            return data.messages;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function getClubPage({ page, limit }) {
    try {
        const response = await fetch(URL + 'club/total_club' + `?page=${page}` + `&limit=${limit}`);
        if (response.ok) {
            const data = await response.json();
            return data.club;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function addClub(formData) {
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
        console.log(error.message);
    }
}

export async function getClubDetail({ clubId }) {
    try {
        const response = await fetch(URL + `club/${clubId}`);
        if (response.ok) {
            const data = await response.json();
            return data.foundClub;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function updateClubInfo({ formData, clubId }) {
    try {
        const response = await fetch(URL + `club/${clubId}`, {
            method: 'PUT',
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function getTotalPost({ clubId, page, limit }) {
    try {
        const response = await fetch(URL + `post/${clubId}/total_post` + `?page=${page}` + `&limit=${limit}`);
        if (response.ok) {
            const data = await response.json();
            return data.posts;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function getPost({ postId }) {
    try {
        const response = await fetch(URL + `post/${postId}/`);
        if (response.ok) {
            const data = await response.json();
            return data.foundPost;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function addPost({ formData, clubId }) {
    try {
        const response = await fetch(URL + `post/${clubId}`, {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function deletePost({ postId }) {
    try {
        const response = await fetch(URL + `post/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function updatedPost({ formData, postId }) {
    try {
        const response = await fetch(URL + `post/${postId}`, {
            method: 'PUT',
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function getMonthEvent({ clubId, year, month }) {
    try {
        const response = await fetch(URL + `event/${clubId}/` + `?year=${year}` + `&month=${month}`);
        if (response.ok) {
            const data = await response.json();
            return data.foundEvents;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function addEvent({ clubId, userId, title, description, date, location }) {
    try {
        const response = await fetch(URL + `event/${clubId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                title,
                description,
                date,
                location,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return data.newEvent;
        } else {
            console.log(response);
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function updateEvent({ clubId, eventId, userId, title, description, date, location }) {
    try {
        console.log(eventId);
        const response = await fetch(URL + `event/${clubId}/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                title,
                description,
                date,
                location,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        console.log(response);
    } catch (error) {
        console.log(error.message);
    }
}

export async function deleteEvent({ clubId, eventId, userId }) {
    try {
        const response = await fetch(URL + `event/${clubId}/${eventId}`, {
            method: 'DELETE',
            body: JSON.stringify({
                userId,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        console.log(response);
    } catch (error) {
        console.log(error.message);
    }
}

export async function getMyClubs({ userId }) {
    try {
        const response = await fetch(URL + `user/club/${userId}/`);
        if (response.ok) {
            const data = await response.json();
            return data.clubs;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function getMyEvents({ userId }) {
    try {
        const response = await fetch(URL + `user/event/${userId}/`);
        if (response.ok) {
            const data = await response.json();
            return data.foundEvents;
        }
    } catch (error) {
        console.log(error.message);
    }
}

export async function proposeClub({ clubId, userId }) {
    try {
        const response = await fetch(URL + `club/proposer/${clubId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error.message);
    }
}

// userId는 참가대상
export async function approveClub({ clubId, userId, approve }) {
    try {
        const response = await fetch(URL + `club/approve/${clubId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                approve,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error.message);
    }
}

// 클럽자체를 삭제
export async function deleteClub({ clubId }) {
    try {
        const response = await fetch(URL + `club/${clubId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error.message);
    }
}

// 관리자 추가 삭제
