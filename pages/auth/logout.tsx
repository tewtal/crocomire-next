import { useEffect } from 'react'
import { useRouter } from 'next/router'
import fetchJson from '../../lib/fetchJson'

const Logout = () => {
    const router = useRouter();
    useEffect(() => {
        const logOut = async () => {
            let response = await fetchJson('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            router.push("/")
        }

        logOut();
    }, []);

    return <p>Logging out...</p>
}

export default Logout;