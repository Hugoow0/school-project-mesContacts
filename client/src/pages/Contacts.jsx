import { useEffect, useState } from "react";
import { authenticatedFetch } from "../middlewares/middleware";

export default function ContactsPage() {
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdateForm, setUpdateForm] = useState(false);
    const [contactToUpdate, setContactToUpdate] = useState({});

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await authenticatedFetch(
                `${import.meta.env.VITE_API_URL}/api/contacts`
            );
            //console.log(response);

            if (response.ok) {
                const data = await response.json();
                //console.log(data);
                if (data.length !== 0) {
                    setContactList(data[0].contacts);
                }
            } else if (response.status === 403) {
                throw new Error("403 Forbidden");
            } else {
                throw new Error("Failed to fetch contacts");
            }
        } catch (error) {
            //console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    async function handleUpdateBtn(contactId) {
        try {
            setLoading(true);
            setUpdateForm(true);
            const response = await authenticatedFetch(
                `${import.meta.env.VITE_API_URL}/api/contacts/${contactId}`
            );
            //console.log(response);

            if (response.ok) {
                const data = await response.json();
                //console.log(data);
                if (data.length !== 0) {
                    setContactToUpdate(data);
                }
            } else if (response.status === 403) {
                throw new Error("403 Forbidden");
            } else {
                const data = await response.json();
                throw new Error(
                    `Failed to get contact details : ${data.error}`
                );
            }
        } catch (error) {
            //console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmitUpdateContactForm(event) {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = Object.fromEntries(formData);
        //console.log("All form data:", data);

        if (
            !String(data.firstName).trim().length ||
            !String(data.lastName).trim().length
        ) {
            alert("Required fields must contains valid values");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await authenticatedFetch(
                `${import.meta.env.VITE_API_URL}/api/contacts/${
                    contactToUpdate?._id
                }`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                    }),
                }
            );
            //console.log(response);

            if (response.ok) {
                await fetchContacts();
                setContactToUpdate({});
                setUpdateForm(false);
                alert("Contact details updated successfully");
            } else if (response.status === 403) {
                throw new Error("403 Forbidden");
            } else {
                const data = await response.json();
                throw new Error(
                    `Failed to update contact details : ${data.error}`
                );
            }
        } catch (error) {
            //console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    function handleCancelBtnClick() {
        setContactToUpdate({});
        setUpdateForm(false);
    }

    async function handleDeleteBtn(contactId) {
        try {
            setLoading(true);
            const response = await authenticatedFetch(
                `${import.meta.env.VITE_API_URL}/api/contacts/${contactId}`,
                {
                    method: "DELETE",
                }
            );
            //console.log(response);

            if (response.ok) {
                await fetchContacts();
            } else if (response.status === 403) {
                throw new Error("403 Forbidden");
            } else {
                const data = await response.json();
                throw new Error(`Failed to DELETE contact : ${data.error}`);
            }
        } catch (error) {
            //console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmitAddContactForm(event) {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = Object.fromEntries(formData);
        //console.log("All form data:", data);

        if (
            !String(data.firstName).trim().length ||
            !String(data.lastName).trim().length ||
            !String(data.phone).trim().length
        ) {
            alert("Required fields must contains valid values");
            setLoading(false);
            return;
        }

        try {
            const response = await authenticatedFetch(
                `${import.meta.env.VITE_API_URL}/api/contacts/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                    }),
                }
            );
            //console.log(response);

            if (response.ok) {
                await fetchContacts();
                alert("Contact added successfully");
            } else {
                const data = await response.json();
                throw new Error(`Failed to add contact : ${data.error}`);
            }
        } catch (error) {
            //console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Contacts Page</h1>
            <hr />
            <h3>Your contacts</h3>
            <div>
                {contactList.length !== 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>FirstName</th>
                                <th>LastName</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactList?.map((contact) => (
                                <tr key={contact._id}>
                                    <td>{contact.firstName}</td>
                                    <td>{contact.lastName}</td>
                                    <td>{contact.phone}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleUpdateBtn(contact._id)
                                            }
                                            disabled={loading}
                                        >
                                            Update
                                        </button>
                                        |
                                        <button
                                            onClick={() =>
                                                handleDeleteBtn(contact._id)
                                            }
                                            disabled={loading}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : loading ? (
                    <h4>Loading...</h4>
                ) : (
                    <h4>No contacts yet.</h4>
                )}

                {isUpdateForm ? (
                    <div>
                        <hr />
                        <h3>Update a contact</h3>
                        <form onSubmit={handleSubmitUpdateContactForm}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>FirstName</th>
                                        <th>LastName</th>
                                        <th>Phone</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contactToUpdate ? (
                                        <tr>
                                            <td>
                                                <input
                                                    name="firstName"
                                                    title="firstName"
                                                    type="text"
                                                    required
                                                    disabled={loading}
                                                    defaultValue={
                                                        contactToUpdate?.firstName
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    name="lastName"
                                                    title="lastName"
                                                    type="text"
                                                    required
                                                    disabled={loading}
                                                    defaultValue={
                                                        contactToUpdate?.lastName
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    name="phone"
                                                    title="phone"
                                                    type="text"
                                                    required
                                                    disabled={loading}
                                                    defaultValue={
                                                        contactToUpdate?.phone
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                >
                                                    Update
                                                </button>
                                                |
                                                <button
                                                    onClick={
                                                        handleCancelBtnClick
                                                    }
                                                    disabled={loading}
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ) : loading ? (
                                        <tr>
                                            <td>Loading...</td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td>No contact details</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </form>
                    </div>
                ) : (
                    ""
                )}

                <hr />

                <h3>Add a new contact</h3>
                <form onSubmit={handleSubmitAddContactForm}>
                    <table>
                        <thead>
                            <tr>
                                <th>FirstName</th>
                                <th>LastName</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        name="firstName"
                                        title="firstName"
                                        type="text"
                                        required
                                        disabled={loading}
                                    />
                                </td>
                                <td>
                                    <input
                                        name="lastName"
                                        title="lastName"
                                        type="text"
                                        required
                                        disabled={loading}
                                    />
                                </td>
                                <td>
                                    <input
                                        name="phone"
                                        title="phone"
                                        type="text"
                                        required
                                        disabled={loading}
                                    />
                                </td>
                                <td>
                                    <button type="submit" disabled={loading}>
                                        Add contact
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    );
}
