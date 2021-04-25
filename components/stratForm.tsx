import { Card, Alert, Row, Col, Form, Button } from 'react-bootstrap'
import { Strat, Area, Room, Category } from '@prisma/client'
import { useState, FormEvent } from "react";
import { useRouter } from 'next/router'

interface StratFormData {
    areaId: string,
    roomId: string,
    categoryId: string,
    name: string,
    description: string,
    difficulty: string,
    link: string,
    roomName: string,
    roomLink: string
}

export default function StratForm({ strat, areas, rooms, categories }) {
    const router = useRouter();
    const [validated, setValidated] = useState(false);
    const [formError, setFormError] = useState<string>();
    const [formState, setFormState] = useState<StratFormData>(
        strat ? {
            areaId: strat.areaId,
            roomId: strat.roomId,
            categoryId: strat.categoryId,
            name: strat.name,
            description: strat.description,
            difficulty: strat.difficulty,
            link: strat.link,
            roomName: "",
            roomLink: ""
        } : {
            areaId: "1",
            roomId: "1",
            categoryId: "1",
            name: "",
            description: "",
            difficulty: "1",
            link: "",
            roomName: "",
            roomLink: ""
        }
    );

    const handleChange = (e: any) => {
        setFormState((prevState) => { return {...prevState, [e.target.id]: e.target.value}});
    }

    const submitStrat = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        const form = e.currentTarget;

        if(form.checkValidity() === false)
        {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            const response = await fetch("/api/strat/" + (strat ? strat.id : ""), {
                method: 'POST',
                body: JSON.stringify(formState)
            });
            
            const result = await response.json();
            console.log(result);
            if(result.status === "ok") {
                router.push("/");
            } else {
                setFormError(result.error);
            }
        } catch (e) {
            setFormError("Server error when posting strategy, please try again...");
        }        
    }

    return (
            <div className="w-50 mx-auto">
                {formError && <Alert variant="danger">{formError}</Alert>}
                <Form noValidate validated={validated} onSubmit={submitStrat}>
                    <Form.Control type="hidden" id="gameId" value="1" />
                    <Form.Group as={Row} controlId="areaId">
                        <Form.Label column sm={3}>Area</Form.Label>
                        <Col sm={9}>
                            <Form.Control as="select" value={formState.areaId} onChange={handleChange}>
                                {areas.map((a: Area) => <option value={a.id} key={a.id}>{a.name}</option>)}
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="roomId">
                        <Form.Label column sm={3}>Room</Form.Label>
                        <Col sm={9}>
                            <Form.Control as="select" value={formState.roomId} onChange={handleChange}>
                                <option value="0">Create new room...</option>
                                {rooms.map((r: Room) => <option value={r.id} key={r.id}>{r.name}</option>)}
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    {formState.roomId === "0" && 
                        <Card className="mb-4">
                            <Card.Body>
                                <Form.Group as={Row} controlId="roomName">
                                    <Form.Label column sm={3}>Room name</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control required type="input" value={formState.roomName} onChange={handleChange}/>
                                        <Form.Control.Feedback type="invalid">You need to enter a name.</Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="roomLink">
                                    <Form.Label column sm={3}>Room link</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control required type="input" value={formState.roomLink} onChange={handleChange}/>
                                        <Form.Control.Feedback type="invalid">You need to enter a name.</Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    }
                    <Form.Group as={Row} controlId="categoryId">
                        <Form.Label column sm={3}>Category</Form.Label>
                        <Col sm={9}>
                            <Form.Control as="select" value={formState.categoryId} onChange={handleChange}>
                                {categories.map((c: Category) => <option value={c.id} key={c.id}>{c.name}</option>)}
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="name">
                        <Form.Label column sm={3}>Name</Form.Label>
                        <Col sm={9}>
                            <Form.Control required type="input" value={formState.name} onChange={handleChange}/>
                            <Form.Control.Feedback type="invalid">You need to enter a name.</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="description">
                        <Form.Label column sm={3}>Description</Form.Label>
                        <Col sm={9}>
                            <Form.Control required as="textarea" rows={4} value={formState.description} onChange={handleChange}/>
                            <Form.Control.Feedback type="invalid">You need to enter a description.</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="difficulty">
                        <Form.Label column sm={3}>Difficulty</Form.Label>
                        <Col sm={9}>
                            <Form.Control as="select" value={formState.difficulty} onChange={handleChange}>
                                <option value={1}>Beginner</option>
                                <option value={2}>Intermediate</option>
                                <option value={3}>Advanced</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>                    
                    <Form.Group as={Row} controlId="link">
                        <Form.Label column sm={3}>Video</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="input" value={formState.link} onChange={handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 3 }}>
                            <Button type="submit">{strat ? "Update strategy" : "Add strategy"}</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
    )
}