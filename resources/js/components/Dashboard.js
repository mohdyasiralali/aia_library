import React from "react";
import ReactDOM from "react-dom";
import Authors from "./Authors";
import BooksControlPanel from "./BooksControlPanel";
import PublishersAndCategories from "./PublishersAndCategories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faBookOpen,
    faFeatherAlt,
    faPrint
} from "@fortawesome/free-solid-svg-icons";

class Dashboard extends React.Component {
    componentDidMount() {
        if (document.getElementById("content")) {
            ReactDOM.render(
                <BooksControlPanel />,
                document.getElementById("content")
            );
        }
    }

    onClickLibrary(e) {
        e.preventDefault();
        if (document.getElementById("content")) {
            ReactDOM.render(
                <BooksControlPanel />,
                document.getElementById("content")
            );
        }
    }

    onClickAuthors(e) {
        e.preventDefault();
        if (document.getElementById("content")) {
            ReactDOM.render(<Authors />, document.getElementById("content"));
        }
    }

    onClickPublishersAndCategories(e) {
        e.preventDefault();
        if (document.getElementById("content")) {
            ReactDOM.render(
                <PublishersAndCategories />,
                document.getElementById("content")
            );
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row d-flex flex-row-reverse">
                    {/* ========================================================= DASHBOARD NAV */}
                    <nav className="col-12 col-md-3 col-xl-2 sidebar">
                        <div className="text-right">
                            <ul className="nav flex-column">
                                <li className="nav-item bg-light rounded my-2">
                                    <a
                                        className="nav-link content-link"
                                        onClick={this.onClickLibrary}
                                        href="#"
                                    >
                                        المكتبة
                                        <span className="ml-2">
                                            <FontAwesomeIcon
                                                icon={faBookOpen}
                                            />
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item bg-light rounded my-2">
                                    <a
                                        className="nav-link content-link"
                                        onClick={this.onClickAuthors}
                                        href="/authors"
                                    >
                                        مؤلفي الكتب
                                        <span className="ml-2">
                                            <FontAwesomeIcon
                                                icon={faFeatherAlt}
                                            />
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item bg-light rounded my-2">
                                    <a
                                        className="nav-link content-link"
                                        onClick={
                                            this.onClickPublishersAndCategories
                                        }
                                        href="/authors"
                                    >
                                        الأقسام و دور النشر
                                        <span className="ml-2">
                                            <FontAwesomeIcon icon={faPrint} />
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* ============================================================== DASHBOARD CONTENT */}
                    <main
                        role="main"
                        className="col-sm-9 ml-sm-auto col-md-9 col-xl-10 pt-3 main"
                        id="content"
                    ></main>
                </div>
            </div>
        );
    }
}

export default Dashboard;
