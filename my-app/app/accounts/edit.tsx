'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { IAccount } from "../classes";

import { useRouter } from 'next/navigation';

export function EditAccount({data = {id: '', label: ''}, mode = 'create', allowDelete = false, disabled = false, onDelete = (account) => {}, onSubmit}) {
    const router = useRouter();
    const [account, setAccount] = useState<IAccount>(data as IAccount);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setAccount({
            ...account,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(account);        
    }

    const handleCancel = async (e: React.FormEvent) => {
        router.push('/accounts');      
    }

    const handleDelete = async (e: React.FormEvent) => {
        onDelete(account);
        router.push('/accounts');      
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">ID</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="id" placeholder="id" value={account.id} onChange={handleForm} />
                        <Form.Text className="text-muted">Account Identifier</Form.Text>     
                    </Col>                       
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Name</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="label" placeholder="label" value={account.label} onChange={handleForm} />
                        <Form.Text className="text-muted">Account Name</Form.Text>
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