import { Nav } from 'react-bootstrap'
import Link from 'next/link'

  export function AuthBar({user}) {
    return (
        <Nav className="ml-sm-auto">
            {(user && user.isLoggedIn)
            ? <><Link href="/strats/add" passHref><Nav.Link>Add new strategy</Nav.Link></Link><Link href="/auth/logout" passHref><Nav.Link>Log out</Nav.Link></Link></>
            : <><Link href="/auth/login" passHref><Nav.Link>Log In</Nav.Link></Link><Link href="/auth/signup" passHref><Nav.Link>Sign up</Nav.Link></Link></>
            }
        </Nav>
    )
}