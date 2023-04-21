import Link from "next/link";
import Image from "next/image";

// These styles apply to every route in the application
import './global.css';
import SideBar from "../components/sidebar";

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossOrigin="anonymous" />
                <script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossOrigin="anonymous"></script>
            </head>
            <body>
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

            </body>
        </html>
    )
}
