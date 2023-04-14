

// import { ClientUtil } from "../../util";
import { ICustomer, ICustomerQuery, IQueryResult } from "../../app/classes";
import CustomersListPage from "./list";
import { get } from "../../app/api/customers/route"
import { NextRequest } from "next/server";
import CustomersLayout from "./layout";
import RootLayout from "../layout";

export async function getServerSideProps(context) {

    // console.log('getServerSideProps');
    context.res.setHeader('Cache-Control', 'public, s-maxage=1');
    const searchParams = new URLSearchParams(context.query);
    const results = await get(searchParams) as unknown as IQueryResult<ICustomerQuery, ICustomer>; 
    // console.dir(results.result);
    const customers = results.result;

    return {
        props: { customers }
    }
}

export default function CustomersPage({ customers }) {
    
    
    return (
        
        <CustomersLayout>
            <h2>Customers Page</h2>
            <CustomersListPage customers={customers}></CustomersListPage>                
        </CustomersLayout>
    )
}

