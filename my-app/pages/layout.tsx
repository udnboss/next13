
// These styles apply to every route in the application
import './global.css';
import SideBar from "../components/sidebar";
import Head from 'next/head'
import Script from 'next/script';

export default function RootLayout({ children }) {
    return (

        <>
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                        <SideBar></SideBar>
                    </div>
                    <div className="col py-3">
                        {children}
                    </div>
                </div>
            </div>

        </>
    )
}
