'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ISaleItem } from "../../classes";

export function EditSaleItem({data = {id: ''}, mode = 'create', allowDelete = false, disabled = false, onCancel = () => {}, onDelete = (saleItem) => {}, onSubmit}) {

    const [saleItem, setSaleItem] = useState<ISaleItem>(data as ISaleItem);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setSaleItem({
            ...saleItem,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(saleItem);        
    }

    const handleCancel = async (e: React.FormEvent) => {
        onCancel();        
    }

    const handleDelete = async (e: React.FormEvent) => {
        onDelete(saleItem);        
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Item</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="item_id" placeholder="item_id" value={saleItem.item_id as string} onChange={handleForm} />
                        <Form.Text className="text-muted">Item</Form.Text>     
                    </Col>                       
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Description</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="description" placeholder="description" value={saleItem.description} onChange={handleForm} />
                        <Form.Text className="text-muted">Description</Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Quantity</Form.Label>
                    <Col sm="10">
                        <Form.Control type="number" id="quantity" placeholder="quantity" value={saleItem.quantity} onChange={handleForm} />
                        <Form.Text className="text-muted">Quantity</Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Price</Form.Label>
                    <Col sm="10">
                        <Form.Control type="number" id="price" placeholder="price" value={saleItem.price} onChange={handleForm} />
                        <Form.Text className="text-muted">Price</Form.Text>
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