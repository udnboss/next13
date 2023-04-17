import { Button, Col, Row } from "react-bootstrap";
import { ISale } from "../../classes";

export default function ViewSale({sale}: {sale:ISale}) {
    return (
        <>
            <div>Issue Date: {sale.date}</div>
            <div>Number: {sale.number}</div>
            <div>Customer: {sale.customer?.name}</div>
        </>        
    );
}