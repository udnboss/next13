'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ICustomer, ISale } from "../classes";

import { useRouter } from 'next/navigation';


export function EditSale({data = {id: ''}, mode = 'create', customers = [], allowDelete = false, disabled = false, onCancel = () => {}, onDelete = (sale) => {}, onSubmit}) {
    const router = useRouter();
    const [sale, setSale] = useState<ISale>(data as ISale);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        setSale({
            ...sale,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(sale);        
    }

    const handleCancel = async (e: React.FormEvent) => {
        if(onCancel) onCancel();
        if(mode == 'create')
            router.push('/sales');      
    }

    const handleDelete = async (e: React.FormEvent) => {
        onDelete(sale);
        router.push('/sales');      
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">ID</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="id" placeholder="id" value={sale.id} onChange={handleForm} />
                        <Form.Text className="text-muted">Sale Identifier</Form.Text>     
                    </Col>                       
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Number</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="number" placeholder="number" value={sale.number} onChange={handleForm} />
                        <Form.Text className="text-muted">Invoice Number</Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Date</Form.Label>
                    <Col sm="10">
                        <Form.Control type="date" id="date" placeholder="date" value={sale.date} onChange={handleForm} />
                        <Form.Text className="text-muted">Issue Date</Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Reference</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="reference" placeholder="reference" value={sale.reference as string} onChange={handleForm} />
                        <Form.Text className="text-muted">Sale Reference</Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Customer</Form.Label>
                    <Col sm="10">
                        <Form.Select id="customer_id" value={sale.customer_id as string} onChange={handleForm}>
                            <option>-</option>
                            {customers?.map((customer: ICustomer) => (
                                <option key={customer.id} value={customer.id}>{customer.name}</option>    
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">Sale Customer</Form.Text>
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