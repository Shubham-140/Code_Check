const base_url = "https://code-check-backend-dynw.onrender.com/api/v1";

async function request(method, endpoint, body) {
    try {
        const token = localStorage.getItem("jwt_token") || null;

        const response = await fetch(`${base_url}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
            },
            method: method,
            body: body ? JSON.stringify(body) : null
        })

        const data = await response.json();

        return {
            ok: response.ok,
            status: response.status,
            data
        }
    } catch (error) {
        return {
            ok:false,
            status:0,
            error:"Network connection error or Server unreachable."
        }        
    }
}

const ApiService = {

    get: (endpoint, headers) => {
        return request("GET", endpoint, null, headers)
    },

    post: (endpoint, body, headers) => {
        return request("POST", endpoint, body, headers)
    },

    put: (endpoint, body, headers) => {
        return request("PUT", endpoint, body, headers)
    },

    del: (endpoint, body, headers) => {
        return request("DELETE", endpoint, body, headers)
    }

}

export {ApiService};