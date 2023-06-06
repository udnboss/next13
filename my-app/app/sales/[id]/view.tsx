import { Button, Col, Row } from "react-bootstrap";
import { ISale } from "../../classes";

export default function ViewSale({sale}: {sale:ISale}) {
    return (  
        <>
        <Row><Col>{sale.customer?.name}</Col><Col className="text-end">{sale.date}</Col></Row>                           
        <Row><Col>{sale.company?.name}</Col><Col className="text-end">Reference: {sale.reference}</Col> </Row>                          
        <Row><Col>{sale.account?.label}</Col><Col className="text-end">Invoice Number: {sale.number}</Col></Row>     
        </>      
                                              
    );
}