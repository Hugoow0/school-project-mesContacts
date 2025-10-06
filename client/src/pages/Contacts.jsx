import { useEffect, useState } from "react";
import { authenticatedFetch } from "../middlewares/middleware";
import { useNavigate } from "react-router";

export default function ContactsPage() {
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate();

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            //TODO: replace url by .env variable
            const response = await authenticatedFetch(
                "https://school-project-mes-contacts-backend.vercel.app/api/contacts"
            );
            console.log(response);

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.length !== 0) {
                    setContactList(data[0].contacts);
                }
            } else if (response.status === 403) {
                throw new Error("403 Forbidden");
            } else {
                throw new Error("Failed to fetch contacts");
            }
        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    /*
        TODO: create a route for update and create contact ??
        Should also re fetech contacts after any action (upt / del / new)
    */
    function handleUpdateBtn(contactId) {
        navigate(`/contacts/${contactId}`);
    }

    async function handleDeleteBtn(contactId) {
        try {
            setLoading(true);
            //TODO: replace url by .env variable
            const response = await authenticatedFetch(
                `https://school-project-mes-contacts-backend.vercel.app/api/contacts/${contactId}`,
                {
                    method: "DELETE",
                }
            );
            console.log(response);

            if (response.ok) {
                await fetchContacts();
            } else if (response.status === 403) {
                throw new Error("403 Forbidden");
            } else {
                const data = await response.json();
                throw new Error(`Failed to DELETE contact : ${data.error}`);
            }
        } catch (error) {
            console.error(error);
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
        console.log("All form data:", data);

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
            //TODO: replace url by .env variable
            const response = await authenticatedFetch(
                "https://school-project-mes-contacts-backend.vercel.app/api/contacts/",
                {
                    method: "POST",
                    body: JSON.stringify({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                    }),
                }
            );
            console.log(response);

            if (response.ok) {
                await fetchContacts();
                alert("Contact added successfully");
            } else {
                const data = await response.json();
                throw new Error(`Failed to add contact : ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Contacts Page</h1>
            <p>Your contacts will be displayed here</p>
            <div>
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
                        {contactList.length !== 0 ? (
                            contactList?.map((contact) => (
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
                            ))
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
