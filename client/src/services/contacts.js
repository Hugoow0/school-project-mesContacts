import { getAuthToken } from "./auth";

const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Request failed");
    }

    return response.json();
};

export const getAllContacts = () => {
    return apiRequest("/api/contacts");
};

export const getContactById = (id) => {
    return apiRequest(`/api/contacts/${id}`);
};

export const createContact = (contactData) => {
    return apiRequest("/api/contacts", {
        method: "POST",
        body: JSON.stringify(contactData),
    });
};

export const updateContact = (id, contactData) => {
    return apiRequest(`/api/contacts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(contactData),
    });
};

export const deleteContact = (id) => {
    return apiRequest(`/api/contacts/${id}`, {
        method: "DELETE",
    });
};
