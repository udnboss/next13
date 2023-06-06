'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ICompany } from "../classes";

import { useRouter } from 'next/navigation';
import FormInput from "../../components/form-input";

export function EditCompany({data = {id: '', name: ''}, mode = 'create', allowDelete = false, disabled = false, onDelete = (company) => {}, onSubmit}) {
    const router = useRouter();
    const [company, setCompany] = useState<ICompany>(data as ICompany);

    const handleForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setCompany({
            ...company,
            [e.currentTarget.id]: e.currentTarget.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(company);        
    }

    const handleCancel = async (e: React.FormEvent) => {
        router.push('/companies');      
    }

    const handleDelete = async (e: React.FormEvent) => {
        onDelete(company);
        router.push('/companies');      
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">ID</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="id" placeholder="id" value={company.id} onChange={handleForm} />
                        <Form.Text className="text-muted">Company Identifier</Form.Text>     
                    </Col>                       
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="text-end">Name</Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" id="name" placeholder="name" value={company.name} onChange={handleForm} />
                        <Form.Text className="text-muted">Company Name</Form.Text>
                    </Col>
                </Form.Group>
                <FormInput name="address" label="Address" description="" value={company.address} onChange={handleForm}></FormInput>
                <FormInput name="crn" label="CRN" description="Commercial Registration Number" value={company.crn} onChange={handleForm}></FormInput>
                <FormInput name="trn" label="TRN" description="Tax Registration Number" value={company.trn} onChange={handleForm}></FormInput>
                <FormInput name="contact" label="Contact Name" description="Contact Person Name" value={company.contact} onChange={handleForm}></FormInput>
                <FormInput name="mobile" label="Contact Mobile" description="Contact Mobile Number" value={company.mobile} onChange={handleForm}></FormInput>
                <FormInput name="email" label="Contact Email" description="Contact Email" value={company.email} onChange={handleForm}></FormInput>
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