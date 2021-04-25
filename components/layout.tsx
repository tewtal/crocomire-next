import Head from 'next/head'
import Link from 'next/link'
import { ChangeEventHandler } from 'react'
import { Container, Form, FormControl, Nav, Navbar } from 'react-bootstrap'
import { LoggedInUser } from '../lib/useUser'
import { AuthBar } from './authbar'

interface LayoutProps {
    children: any;
    onSearch: ChangeEventHandler<HTMLInputElement>;
    user: LoggedInUser;
}

export default function Layout({ children, onSearch, user }: LayoutProps) {
    return (<>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Crocomi.re - Super Metroid Strategy Database</title>
        </Head>
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Link href="/"><Navbar.Brand href="/">Super Metroid Strategy Database</Navbar.Brand></Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {onSearch && <Form inline className="ml-sm-auto mr-sm-4 w-50">
                        <FormControl type="text" placeholder="Search for a strategy..." size="sm" className="mr-sm-2 w-100" onChange={onSearch} />
                    </Form>}
                    <div className={onSearch ? "" : "ml-sm-auto"}>
                        <AuthBar user={user}/>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Container>{ children }</Container>
    </>)
}