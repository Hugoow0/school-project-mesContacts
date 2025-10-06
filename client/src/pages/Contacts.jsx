import { useEffect, useState } from "react";
import {
    getAllContacts,
    createContact,
    updateContact,
    deleteContact,
} from "../services/contacts";

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
            const data = await getAllContacts();
            if (data.length !== 0) {
                setContactList(data[0].contacts);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    async function handleUpdateBtn(contactId) {
        try {
            setUpdateForm(true);
            const contact = contactList.find(
                (contact) => contact._id === contactId
            );
            if (contact) {
                setContactToUpdate(contact);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleDeleteBtn(contactId) {
        try {
            setLoading(true);
            await deleteContact(contactId);
            await fetchContacts();
            alert("Contact deleted successfully");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmitAddContactForm(event) {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if (
            !String(data.firstName).trim().length ||
            !String(data.lastName).trim().length ||
            !String(data.phone).trim().length
        ) {
            alert("Required fields must contain valid values");
            setLoading(false);
            return;
        }

        try {
            await createContact({
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            });
            await fetchContacts();
            alert("Contact created successfully");
            event.target.reset();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmitUpdateContactForm(event) {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if (
            !String(data.firstName).trim().length ||
            !String(data.lastName).trim().length ||
            !String(data.phone).trim().length
        ) {
            alert("Required fields must contain valid values");
            setLoading(false);
            return;
        }

        try {
            await updateContact(contactToUpdate._id, {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            });
            await fetchContacts();
            alert("Contact updated successfully");
            setUpdateForm(false);
            setContactToUpdate({});
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    function handleCancelBtnClick() {
        setUpdateForm(false);
        setContactToUpdate({});
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
