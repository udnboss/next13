'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ICurrency, ICustomer } from "../../app/classes";
import FormInput from "../../components/form-input";

export default function EditCustomer({data = {id: '', name: '', address: ''} as ICustomer, mode = 'create', 
    allowDelete = false, onDelete = (customer) => {}, onCancel, onSubmit, currencies = []}) {

    const [customer, setCustomer] = useState<ICustomer>(data as ICustomer);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
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
                <FormInput name="id" label="ID" description="Customer Identifier" onChange={handleForm} value={customer.id}></FormInput>
                <FormInput name="name" label="Name" description="Customer Name" onChange={handleForm} value={customer.name}></FormInput>
                <FormInput name="address" label="Address" description="Customer Address" onChange={handleForm} value={customer.address}></FormInput>
                <FormInput name="contact" label="Contact" description="Customer Contact" onChange={handleForm} value={customer.contact}></FormInput>
                
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Currency</Form.Label>
                    <Col sm="10">
                        <Form.Select id="currency_id" value={customer.currency_id as string} onChange={handleForm}>
                            <option>-</option>
                            {currencies?.map((currency: ICurrency) => (
                                <option key={currency.id} value={currency.id}>{currency.name}</option>    
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">Sale Currency</Form.Text>
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