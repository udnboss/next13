'use client';

import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { IItem, IItemQuery, IQueryResult, ISaleItem } from "../../classes";
import { ClientUtil } from "../../../util";

export function EditSaleItem({data = {id: ''}, mode = 'create', allowDelete = false, disabled = false, onCancel = () => {}, onDelete = (saleItem) => {}, onSubmit}) {

    const [saleItem, setSaleItem] = useState<ISaleItem>(data as ISaleItem);

    const [items, setItems] = useState<IItem[]>();

    useEffect(() => {
        const fetchData = async () => {
            const itemsResult = await ClientUtil.get(`/api/items`) as unknown as IQueryResult<IItemQuery, IItem>;
            setItems(itemsResult.result);
        }
        fetchData();
    }, []);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        setSaleItem({
            ...saleItem,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(saleItem);        
    }

    const handleCancel = async () => {
        onCancel();        
    }

    const handleDelete = async () => {
        onDelete(saleItem);        
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Item</Form.Label>
                    <Col sm="10">
                        <Form.Select id="item_id" value={saleItem.item_id as string} onChange={handleForm}>
                            <option value="">-</option>
                            {items?.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </Form.Select>
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