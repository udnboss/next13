'use client';

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { IAccount } from "../classes";

import { useRouter } from 'next/navigation';
import FormInput from "../../components/form-input";

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
                <FormInput name="id" label="ID" description="Identifier" onChange={handleForm} value={account.id}></FormInput>
                <FormInput name="label" label="Label" description="Account Display Label" onChange={handleForm} value={account.label}></FormInput>
                <FormInput name="account_name" label="Account Name" description="Account Holder Name" onChange={handleForm} value={account.account_name}></FormInput>
                <FormInput name="account_iban" label="IBAN" description="Account IBAN" onChange={handleForm} value={account.account_iban}></FormInput>
                <FormInput name="account_address" label="Account Address" description="Account Holder Address" onChange={handleForm} value={account.account_address}></FormInput>
                <FormInput name="bank_name" label="Bank Name" description="Bank Name" onChange={handleForm} value={account.bank_name}></FormInput>
                <FormInput name="bank_address" label="Bank Address" description="Bank Address" onChange={handleForm} value={account.bank_address}></FormInput>
                <FormInput name="bank_swift" label="Swift Code" description="Bank Swift Code" onChange={handleForm} value={account.bank_swift}></FormInput>
                
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