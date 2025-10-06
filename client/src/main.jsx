import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import ContactsPage from "./pages/Contacts.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route index path="/" element={<App />} />
            <Route path="/*" element={<NotFound />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route
                path="/contacts"
                element={
                    <ProtectedRoute>
                        <ContactsPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </BrowserRouter>
);
