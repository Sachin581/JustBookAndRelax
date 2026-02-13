import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/auth.service';

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const name = searchParams.get('name');
        const role = searchParams.get('role');
        const email = searchParams.get('email');

        if (token) {
            const user = {
                name: name,
                email: email,
                role: role,
                token: token
            };
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
            window.location.reload();
        } else {
            console.error("No token found in OAuth2 redirect");
            navigate('/login?error=oauth2_failure');
        }
    }, [navigate, searchParams]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-xl font-bold text-gray-600 animate-pulse">Logging you in...</div>
        </div>
    );
};

export default OAuth2RedirectHandler;
