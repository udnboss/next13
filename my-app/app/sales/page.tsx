
'use client';

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button, ButtonGroup, Col, FormControl, ListGroup, ListGroupItem, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { ISale } from "../classes"
import { useSalesContext } from "./context";
import ViewSale from "./[id]/view";
import SaleItemsPage from "./[id]/saleitems";
import SalePartialPage from "./[id]/partial";
import { useSearchParams } from "next/navigation";


export default function SalesPage() {
    const searchParams = useSearchParams();
    const context = useSalesContext();
    const [search, setSearch] = useState<string>('');
    const [viewMode, setViewMode] = useState<string>('preview');
    // const [selected, setSelected] = useState<ISale>();

    const viewModes = [
        { name: 'Table', value: 'table' },
        { name: 'List', value: 'list' },
        { name: 'Preview', value: 'preview' },
    ];

    useEffect(()=>{
        const sale = context.sales[context.sales.findIndex(x => x.id == searchParams?.get('id'))];
        context.selectSale(sale);
        // setSelected(sale);       
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    const handleViewModeChange = async (mode) => {
        setViewMode(mode);
    }

    const handleSelect = async (sale:ISale) => {   
        const freshSale = await context.refreshSale(sale.id);    
        context.selectSale(freshSale); 
        // setSelected(freshSale);
    }

    const handleDelete = async (sale:ISale) => {
        await context.getSales();        
    }

    const handleDuplicate = async(sale:ISale) => {
        const newSale = await context.duplicateSale(sale);
        // setSelected(newSale);
        context.selectSale(newSale);
    }

    const handleSearch = async (e) => {
        const search = e.target.value;
        setSearch(search);
        context.searchSales(search);
        context.selectSale(context.sales[0] || null);
              
    }

    const handleRefresh = async () => {
        await context.getSales();
    }

    // const handleSaleItemsChange = async () => {
    //     if(context.selectedSale) {
    //         await context.refreshSale(context.selectedSale?.id);
    //     }
    // }



    return (
        <div>
            <>
                <h2>Sales Page</h2>
                <div className="text-end mb-3">
                    <Row>
                        <Col sm="6">
                            <ButtonGroup>
                                {viewModes.map((mode, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                                    name="radio"
                                    value={mode.value}
                                    checked={viewMode === mode.value}
                                    onChange={(e) => handleViewModeChange(mode.value)}
                                >
                                    {mode.name}
                                </ToggleButton>
                                ))}
                            </ButtonGroup>
                            <FormControl type="text" placeholder="search" value={search} onChange={handleSearch}></FormControl>
                        </Col>
                        <Col>
                            <Link href={`/sales/create`} className="btn btn-success me-2">
                                <i className="bi-plus-circle"></i> Add New Sale
                            </Link> 
                            <Button onClick={handleRefresh}>
                            <i className="bi-arrow-repeat"></i> Refresh
                            </Button>
                        </Col>
                    </Row>
                </div>
                <div style={{height: "calc(100vh - 250px)"}}>
                    <div style={{margin:"0px", height: "100%"}}>
                    {viewMode == 'preview' && 
                    <Row style={{height:"100%"}}>
                        <Col sm={3} style={{height: "100%", overflowY: "scroll"}}>
                            <ListGroup>
                                {context.sales?.map(sale => (
                                    sale &&
                                    <ListGroupItem key={sale.id} active={context.selectedSale == sale} onClick={() => handleSelect(sale)}>
                                        <div className="fw-bold">{sale.customer?.name}</div>
                                        <Row>
                                            <Col>{sale.number} </Col>
                                            <Col className="text-end">{sale.date}</Col>
                                        </Row>
                                        <Row>
                                            <Col>{sale.reference}</Col>
                                            <Col className="text-end" dangerouslySetInnerHTML={{ __html: sale.currency?.symbol + ' ' + sale.total?.toLocaleString()}}></Col>
                                        </Row>
                                    </ListGroupItem>                        
                                ))} 
                                
                            </ListGroup>
                        </Col>
                        <Col className="border rounded p-3" style={{height: "100%", overflowY: "scroll"}}>
                            {context.selectedSale && 
                                <SalePartialPage onDelete={handleDelete} onDuplicate={handleDuplicate} sale={context.selectedSale as ISale}></SalePartialPage>                        
                            }
                        </Col>
                    </Row>
                        
                    }

                    {viewMode == 'table' && 
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{width:'60px'}}><Link href={{
                                            pathname: '/sales',
                                            query: { sortby: 'number', search:search, sortdir: context.query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                        }}>No.</Link>
                                    </th>
                                    <th style={{width:'120px'}}><Link href={{
                                            pathname: '/sales',
                                            query: { sortby: 'date', search:search, sortdir: context.query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                        }}>Issue Date</Link>
                                    </th>
                                    <th><Link href={{
                                            pathname: '/sales',
                                            query: { sortby: 'customer_id', search:search, sortdir: context.query?.sortdir == 'desc' ? 'asc' : 'desc' },
                                        }}>Customer</Link>
                                    </th>
                                    <th style={{width:'60px'}}>Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {context.sales?.map(sale => (
                                    sale &&
                                    <tr key={sale.id}>
                                        <td className="align-middle">
                                            {sale.number}
                                        </td>
                                        <td className="align-middle">
                                            <Link href={`/sales/${sale.id}`} className="text-decoration-none">{sale.date}</Link>
                                        </td>
                                        <td className="align-middle">
                                            {sale.customer?.name}  
                                        </td>
                                        <td className="text-end">
                                            {sale.total?.toLocaleString()}
                                        </td>
                                    </tr>
                                    
                                ))}    
                            </tbody>
                        </table>
                    }
                    </div>
                </div>
            </>
        </div>
    )
}

