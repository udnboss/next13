import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { IItem } from "../classes";

import { useRouter } from 'next/navigation';

export function EditItem({data = {id: '', name: ''}, mode = 'create', allowDelete = false, disabled = false, onDelete = null, onSubmit}) {
    const router = useRouter();
    const [item, setItem] = useState<IItem>(data as IItem);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setItem({
            ...item,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(item);        
    }

    const handleCancel = async (e: React.FormEvent) => {
        router.push('/items');      
    }

    const handleDelete = async (e: React.FormEvent) => {
        onDelete(item);
        router.push('/items');      
    }

    return (!disabled &&
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">ID</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="id" placeholder="id" value={item.id} onChange={handleForm} />
                        <Form.Text className="text-muted">Item Identifier</Form.Text>     
                    </Col>                       
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Name</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="name" placeholder="name" value={item.name} onChange={handleForm} />
                        <Form.Text className="text-muted">Item Name</Form.Text>
                    </Col>
                </Form.Group>
                <Row>
                    <Col sm="2"></Col>
                    <Col sm="10">
                        <Button type="submit" variant="success" className="me-2">{mode}</Button>   
                        {allowDelete && <Button variant="danger" className="me-2" onClick={handleDelete}>Delete</Button>}
                        <Button onClick={handleCancel} variant="secondary">Cancel</Button>       
                    </Col>
                </Row>                          
            </Form>
            
        </>
        
    );
}