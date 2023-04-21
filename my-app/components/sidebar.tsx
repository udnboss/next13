import Link from "next/link";
import Image from "next/image";

export default function SideBar() {
    return (
        <div className="d-flex flex-sm-column flex-row flex-grow-1 align-items-center align-items-sm-start px-3 pt-3 text-white">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-5 d-none d-sm-inline fw-bold">Invoice<strong style={{color:"gold"}}>Manager</strong></span>
            </a>
            <ul className="nav nav-pills flex-sm-column flex-row flex-nowrap flex-shrink-1 flex-sm-grow-0 flex-grow-1 mb-sm-auto mb-0 justify-content-center align-items-center align-items-sm-start" id="menu">
                <li className="nav-item">
                    <Link className="nav-link text-white text-decoration-none" href="/">
                        <i className="fs-4 bi-house me-1"></i> <span className="ms-1 d-none d-sm-inline">Home</span>
                    </Link>
                </li>
                <li>
                    <Link className="nav-link text-white text-decoration-none" href="/sales">
                        <i className="fs-4 bi-receipt me-1"></i> <span className="ms-1 d-none d-sm-inline">Sales</span>
                    </Link>
                </li>
                <li className="nav-link text-white text-decoration-none dropdown">
                    <a href="#" className="text-white text-decoration-none dropdown-toggle" id="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fs-4 bi-gear me-1"></i> <span className="ms-1 d-none d-sm-inline me-2">Manage</span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdown">
                        <li>
                            <Link className="dropdown-item text-white text-decoration-none" href="/categories">
                                <i className="fs-4 bi-bookmark me-1"></i> <span className="ms-1">Categories</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item text-white text-decoration-none" href="/items">
                                <i className="fs-4 bi-box me-1"></i> <span className="ms-1">Items</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item text-white text-decoration-none" href="/customers">
                                <i className="fs-4 bi-person me-1"></i> <span className="ms-1">Customers</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item text-white text-decoration-none" href="/notes">
                                <i className="fs-4 bi-card-text me-1"></i> <span className="ms-1">Notes</span>
                            </Link>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
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