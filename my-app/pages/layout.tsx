
// These styles apply to every route in the application
import './global.css';
import SideBar from "../components/sidebar";
import Head from 'next/head'
import Script from 'next/script';

export default function RootLayout({ children }) {
    return (

        <>
            <div className="container-fluid overflow-hidden">
                    <div className="row vh-100 overflow-auto">
                        <div className="col-12 col-sm-4 col-md-3 col-xl-2 px-sm-2 px-0 bg-dark d-flex sticky-top">
                            <SideBar></SideBar>
                        </div>
                        <div className="col d-flex flex-column h-sm-100" style={{minHeight: 'calc(100% - 62px)'}}>
                            <main className="overflow-auto pt-3 px-3">
                                {children}
                            </main>
                            <footer className="bg-light py-4 mt-auto">
                                Footer content here...
                            </footer>
                        </div>
                    </div>
                </div>

        </>
    )
}
