import { Form, Row, Col } from "react-bootstrap";

export default function FormInput({name, label, description, value, onChange}){
    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2" className="text-end">{label}</Form.Label>
            <Col sm="10">
                <Form.Control type="text" id={name} placeholder={label} value={value} onChange={onChange} />
                <Form.Text className="text-muted">{description}</Form.Text>
            </Col>
        </Form.Group>
    )
}