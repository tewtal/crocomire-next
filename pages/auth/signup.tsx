import { useState } from 'react'
import useUser from '../../lib/useUser'
import Layout from '../../components/layout'
import fetchJson from '../../lib/fetchJson'
import { Alert, Form, Button, Col, Row } from 'react-bootstrap'

const Signup = () => {
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  })

  const [errorMsg, setErrorMsg] = useState<any[]>()
  const [formState, setFormState] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      security: ""
  });

  const handleChange = (e) => {
      setFormState(prevState => { return { ...prevState, [e.target.id]: e.target.value } });
  }

  async function handleSubmit(e: any) {
    e.preventDefault()
    let errorMessages = [];
    
    if(e.currentTarget.checkValidity() === false)
    {
        e.stopPropagation();
        return;
    }

    if(formState.password !== formState.confirmPassword) {
        errorMessages.push(<div key="passwordError">The password and password confirmation does not match.</div>);
    }

    if(!formState.security.toLowerCase().includes("samus")) {
        errorMessages.push(<div key="securityError">The security question answer is incorrect.</div>);
    }

    if(errorMessages.length > 0) {
        setErrorMsg(errorMessages);
        return;
    }

    try {
      await mutateUser(
        fetchJson('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
        })
      )
    } catch (error) {
      errorMessages.push(<div key="serverError">{error.data.error}</div>);
      setErrorMsg(errorMessages);
    }
  }

  return (
    <Layout onSearch={null} user={null}>
      <div className="signup">
        <Form method="post" onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="username">
              <Form.Label column sm={3}>Username</Form.Label>
              <Col sm={9}>
                  <Form.Control required type="input" value={formState.username} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Username is required</Form.Control.Feedback>
              </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="email">
              <Form.Label column sm={3}>E-mail</Form.Label>
              <Col sm={9}>
                  <Form.Control required type="input" value={formState.email} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">E-mail is required</Form.Control.Feedback>
              </Col>
          </Form.Group>           
          <Form.Group as={Row} controlId="password">
              <Form.Label column sm={3}>Password</Form.Label>
              <Col sm={9}>
                  <Form.Control required type="password" value={formState.password} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
              </Col>
          </Form.Group>   
          <Form.Group as={Row} controlId="confirmPassword">
              <Form.Label column sm={3}>Confirm password</Form.Label>
              <Col sm={9}>
                  <Form.Control required type="password" value={formState.confirmPassword} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Password confirmation is required</Form.Control.Feedback>
              </Col>
          </Form.Group>
          <Row>
              <Col sm={{ span: 10, offset: 3 }}>
                  What is the main protagonists name?
              </Col>
          </Row>
          <Form.Group as={Row} controlId="security">
              <Form.Label column sm={3}>Security question</Form.Label>
              <Col sm={9}>
                  <Form.Control required type="input" value={formState.security} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">An answer is required</Form.Control.Feedback>
              </Col>
          </Form.Group>                      
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 3 }}>
                <Button type="submit">Sign up</Button>
            </Col>
          </Form.Group>                         
        </Form>
        {errorMsg && errorMsg.length > 0 && <div className="mt-5"><Alert variant="danger">{errorMsg}</Alert></div>}
      </div>
      <style jsx>{`
        .signup {
          max-width: 40rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  )
}

export default Signup