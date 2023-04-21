'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ICurrency } from "../classes";

import { useRouter } from 'next/navigation';

export function EditCurrency({data = {id: '', name: ''}, mode = 'create', allowDelete = false, disabled = false, onDelete = (currency) => {}, onSubmit}) {
    const router = useRouter();
    const [currency, setCurrency] = useState<ICurrency>(data as ICurrency);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setCurrency({
            ...currency,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(currency);        
    }

    const handleCancel = async (e: React.FormEvent) => {
        router.push('/currencies');      
    }

    const handleDelete = async (e: React.FormEvent) => {
        onDelete(currency);
        router.push('/currencies');      
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">ID</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="id" placeholder="id" value={currency.id} onChange={handleForm} />
                        <Form.Text className="text-muted">Currency Identifier</Form.Text>     
                    </Col>                       
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Name</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="name" placeholder="name" value={currency.name} onChange={handleForm} />
                        <Form.Text className="text-muted">Currency Name</Form.Text>
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