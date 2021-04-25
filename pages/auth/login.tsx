import { useState } from 'react'
import useUser from '../../lib/useUser'
import Layout from '../../components/layout'
import fetchJson from '../../lib/fetchJson'
import { Alert, Form, Button, Col, Row } from 'react-bootstrap'

const Login = () => {
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  })

  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: any) {
    e.preventDefault()

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    }

    try {
      await mutateUser(
        fetchJson('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
    } catch (error) {
      setErrorMsg(error.data.message)
    }
  }

  return (
    <Layout onSearch={null} user={null}>
      <div className="login">
        <Form method="post" onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="username">
              <Form.Label column sm={3}>Username</Form.Label>
              <Col sm={9}>
                  <Form.Control required type="input" />
              </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="password">
              <Form.Label column sm={3}>Password</Form.Label>
              <Col sm={9}>
                  <Form.Control required type="password" />
              </Col>
          </Form.Group>    
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 3 }}>
                <Button type="submit">Log in</Button>
            </Col>
          </Form.Group>                         
        </Form>
        {errorMsg && <div className="mt-5"><Alert variant="danger">{errorMsg}</Alert></div>}
      </div>
      <style jsx>{`
        .login {
          max-width: 30rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  )
}

export default Login