'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ICategory } from "../classes";

import { useRouter } from 'next/navigation';

export function EditCategory({data = {id: '', name: ''}, mode = 'create', allowDelete = false, disabled = false, onDelete = null, onSubmit}) {
    const router = useRouter();
    const [category, setCategory] = useState<ICategory>(data as ICategory);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setCategory({
            ...category,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(category);        
    }

    const handleCancel = async (e: React.FormEvent) => {
        router.push('/categories');      
    }

    const handleDelete = async (e: React.FormEvent) => {
        onDelete(category);
        router.push('/categories');      
    }

    return (!disabled && category &&
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">ID</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="id" placeholder="id" value={category.id || ''} onChange={handleForm} />
                        <Form.Text className="text-muted">Category Identifier</Form.Text>     
                    </Col>                       
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Name</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="name" placeholder="name" value={category.name || ''} onChange={handleForm} />
                        <Form.Text className="text-muted">Category Name</Form.Text>
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