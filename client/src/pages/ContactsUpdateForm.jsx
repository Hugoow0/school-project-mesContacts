import { useEffect, useState } from "react";
import { authenticatedFetch } from "../middlewares/middleware";
import { useParams } from "react-router";

export default function ContactsUpdatePage() {
    const [contactData, setContactData] = useState({});
    const [loading, setLoading] = useState(true);
    let { id } = useParams();

    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        try {
            setLoading(true);
            //TODO: replace url by .env variable
            const response = await authenticatedFetch(
                `${import.meta.env.VITE_API_URL}/api/contacts/${id}`
            );
            //console.log(response);

            if (response.ok) {
                const data = await response.json();
                //console.log(data);
                if (data.length !== 0) {
                    setContactData(data);
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
            console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    async function handleSubmit(event) {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = Object.fromEntries(formData);
        console.log("All form data:", data);

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
            //TODO: replace url by .env variable
            const response = await authenticatedFetch(
                `${import.meta.env.VITE_API_URL}/api/contacts/${id}`,
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
                await fetchContact();
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
            console.error(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Contacts Update Page</h1>
            <hr />
            <div>
                <h3>Your contact details will be displayed here</h3>
                <form onSubmit={handleSubmit}>
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
                            {contactData ? (
                                <tr>
                                    <td>
                                        <input
                                            name="firstName"
                                            title="firstName"
                                            type="text"
                                            required
                                            disabled={loading}
                                            defaultValue={
                                                contactData?.firstName
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
                                            defaultValue={contactData?.lastName}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            name="phone"
                                            title="phone"
                                            type="text"
                                            required
                                            disabled={loading}
                                            defaultValue={contactData?.phone}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                        >
                                            Update
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
        </div>
    );
}
