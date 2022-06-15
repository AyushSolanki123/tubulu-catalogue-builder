import { notify } from "./notify";

export default async function getCurrenUser() {
    const userId = localStorage.getItem('currentUserId');
    const token = localStorage.getItem('authToken');
    const requestOptions = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  
        }
    }
    try {
        const data  = await fetch(`${process.env.API}/users/${userId}`, requestOptions)
        var user = await data.json();
        return user[0];
    } 
    catch (err) { 
        notify('Failed', 'No User Found');
    }
}