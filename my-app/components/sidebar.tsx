import Link from "next/link";
import Image from "next/image";

export default function SideBar() {
    return (
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-5 d-none d-sm-inline">Menu</span>
            </a>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                <li className="nav-item">
                    <Link className="nav-link text-white text-decoration-none" href="/">
                        <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Home</span>
                    </Link>
                </li>                
                <li>
                    <Link className="nav-link text-white text-decoration-none" href="/categories">
                        <i className="fs-4 bi-bookmark"></i> <span className="ms-1 d-none d-sm-inline">Categories</span>
                    </Link>
                </li>
                <li>
                    <Link className="nav-link text-white text-decoration-none" href="/items">
                        <i className="fs-4 bi-box"></i> <span className="ms-1 d-none d-sm-inline">Items</span>
                    </Link>
                </li>
                <li>
                    <Link className="nav-link text-white text-decoration-none" href="/customers">
                        <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Customers</span>
                    </Link>
                </li>
                <li>
                    <Link className="nav-link text-white text-decoration-none" href="/sales">
                        <i className="fs-4 bi-receipt"></i> <span className="ms-1 d-none d-sm-inline">Sales</span>
                    </Link>
                </li>
                <li>
                    <Link className="nav-link text-white text-decoration-none" href="/notes">
                        <i className="fs-4 bi-card-text"></i> <span className="ms-1 d-none d-sm-inline">Notes</span>
                    </Link>
                </li>  
                <li>
                    <a href="#submenu1" data-bs-toggle="collapse" className="nav-link text-white text-decoration-none">
                        <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span> </a>
                    <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                        <li className="w-100">
                            <a href="#" className="nav-link text-white text-decoration-none"> <span className="d-none d-sm-inline">Item</span> 1 </a>
                        </li>
                        <li>
                            <a href="#" className="nav-link text-white text-decoration-none"> <span className="d-none d-sm-inline">Item</span> 2 </a>
                        </li>
                    </ul>
                </li>              
            </ul>
            <hr />
            <div className="dropdown pb-4">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <Image src="https://github.com/mdo.png" alt="hugenerd" width="30" height="30" className="rounded-circle" />
                    <span className="d-none d-sm-inline mx-1">loser</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                    <li><a className="dropdown-item" href="#">New project...</a></li>
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><a className="dropdown-item" href="#">Profile</a></li>
                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item" href="#">Sign out</a></li>
                </ul>
            </div>
        </div>
    )
}