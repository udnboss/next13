'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { IAccount, ICompany, ICurrency, ICustomer, ISale } from "../classes";

import { useRouter } from 'next/navigation';


export function EditSale({data = {id: ''}, mode = 'create', customers = [], currencies = [], companies = [], accounts = [], allowDelete = false, disabled = false, onCancel = () => {}, onDelete = (sale) => {}, onSubmit}) {
    const router = useRouter();
    const [sale, setSale] = useState<ISale>(data as ISale);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        setSale({
            ...sale,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleConfirmed = (e) => {
        setSale({
            ...sale,
            [e.currentTarget.id]: e.currentTarget.checked,
        });
    }

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
                        <Form.Control disabled={true} type="text" id="id" placeholder="id" value={sale.id} onChange={handleForm} />
                        {/* <Form.Text className="text-muted">Sale Identifier</Form.Text>      */}
                    </Col>                       
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Number</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="number" placeholder="number" value={sale.number} onChange={handleForm} />
                        {/* <Form.Text className="text-muted">Invoice Number</Form.Text> */}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Reference Date</Form.Label>
                    <Col sm="10">
                        <Form.Control type="date" id="reference_date" placeholder="reference_date" value={sale.reference_date as string} onChange={handleForm} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Invoice Date</Form.Label>
                    <Col sm="10">
                        <Form.Control type="date" id="date" placeholder="date" value={sale.date} onChange={handleForm} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Due Date</Form.Label>
                    <Col sm="10">
                        <Form.Control type="date" id="due_date" placeholder="due_date" value={sale.due_date as string} onChange={handleForm} />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Reference</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="reference" placeholder="reference" value={sale.reference as string} onChange={handleForm} />
                        {/* <Form.Text className="text-muted">Sale Reference</Form.Text> */}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Place of Supply</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="place" placeholder="place" value={sale.place as string} onChange={handleForm} />
                        {/* <Form.Text className="text-muted">Sale Place of Supply</Form.Text> */}
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
                        {/* <Form.Text className="text-muted">Sale Customer</Form.Text> */}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Currency</Form.Label>
                    <Col sm="10">
                        <Form.Select id="currency_id" value={sale.currency_id as string} onChange={handleForm}>
                            <option>-</option>
                            {currencies?.map((currency: ICurrency) => (
                                <option key={currency.id} value={currency.id}>{currency.name}</option>    
                            ))}
                        </Form.Select>
                        {/* <Form.Text className="text-muted">Sale Currency</Form.Text> */}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Company</Form.Label>
                    <Col sm="10">
                        <Form.Select id="company_id" value={sale.company_id as string} onChange={handleForm}>
                            <option>-</option>
                            {companies?.map((company: ICompany) => (
                                <option key={company.id} value={company.id}>{company.name} - {company.contact} - {company.email}</option>    
                            ))}
                        </Form.Select>
                        {/* <Form.Text className="text-muted">Sale Company</Form.Text> */}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Account</Form.Label>
                    <Col sm="10">
                        <Form.Select id="account_id" value={sale.account_id as string} onChange={handleForm}>
                            <option>-</option>
                            {accounts?.map((account: IAccount) => (
                                <option key={account.id} value={account.id}>{account.label}</option>    
                            ))}
                        </Form.Select>
                        {/* <Form.Text className="text-muted">Sale Account</Form.Text> */}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Confirmed</Form.Label>
                    <Col sm="10">
                        <Form.Check type="switch" label="Confirmed" id="confirmed" checked={sale.confirmed} onChange={handleConfirmed} />
                        {/* <Form.Text className="text-muted">Confirmed</Form.Text> */}
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