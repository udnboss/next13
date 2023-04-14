'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ICustomer } from "../../app/classes";

export function EditCustomer({data = {id: '', name: '', address: ''}, mode = 'create', 
    allowDelete = false, onDelete, onCancel, onSubmit}: {data:ICustomer, mode:string, allowDelete:boolean, onDelete?:(customer:ICustomer)=>any, onCancel:()=>any, onSubmit:(customer:ICustomer) => any}) {

    const [customer, setCustomer] = useState<ICustomer>(data as ICustomer);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setCustomer({
            ...customer,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(customer);        
    }

    const handleCancel = async (e: React.FormEvent) => {
        onCancel();
    }

    const handleDelete = async (e: React.FormEvent) => {
        if (onDelete) {
            onDelete(customer);  
        }              
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">ID</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="id" placeholder="id" value={customer.id || ''} onChange={handleForm} />
                        <Form.Text className="text-muted">Customer Identifier</Form.Text>     
                    </Col>                       
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Name</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="name" placeholder="name" value={customer.name || ''} onChange={handleForm} />
                        <Form.Text className="text-muted">Customer Name</Form.Text>
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