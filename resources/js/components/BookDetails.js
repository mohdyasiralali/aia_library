import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye } from "@fortawesome/free-solid-svg-icons";

class BookDetails extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row d-flex flex-row-reverse">
                    <div className="col-md-8 text-right">
                        <div className="bg-light p-5 rounded">
                            <h2>
                                <b>{this.props.details.book.name}</b>
                                <hr></hr>
                            </h2>

                            <div className="mt-5">
                                <table className="table borderless ">
                                    <tbody>
                                        <tr>
                                            <td>
                                                {
                                                    this.props.details.category
                                                        .title
                                                }
                                            </td>
                                            <th scope="row"> :قسم</th>
                                        </tr>
                                        <tr>
                                            <td>
                                                {this.props.details.book
                                                    .language === "eng"
                                                    ? "الانجليزية"
                                                    : "العربية"}
                                            </td>
                                            <th scope="row"> :اللغة</th>
                                        </tr>
                                        <tr>
                                            <td>
                                                {
                                                    this.props.details.publisher
                                                        .name
                                                }
                                            </td>
                                            <th scope="row"> :دار النشر</th>
                                        </tr>
                                        <tr>
                                            <td>
                                                {
                                                    this.props.details.book
                                                        .numberOfPages
                                                }
                                            </td>
                                            <th scope="row"> :عدد الصفحات</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bg-light p-5 rounded my-3">
                            <h2>
                                <b>وصف الكتاب</b>
                            </h2>
                            <hr></hr>
                            <div className="mt-5">
                                {this.props.details.book.book_description}
                            </div>
                        </div>
                        <div className="mt-5">
                            {this.props.details.authors.map(author => {
                                return (
                                    <div
                                        key={author.id}
                                        className="bg-light rounded p-3 card-profile"
                                    >
                                        <div className="card-avatar">
                                            <img
                                                className="img img-fluid"
                                                src={
                                                    author.profile_picture
                                                }
                                            ></img>
                                        </div>
                                        <div className="table mt-2">
                                            <h4 className="mb-5">
                                                <b>{author.name}</b>
                                            </h4>

                                            {author.description}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <img
                            className="w-100"
                            src={this.props.details.book.cover_page}
                        ></img>
                        <div className="mt-2">
                            <a
                                className="btn btn-primary w-100"
                                href={this.props.details.book.pdf_file}
                                download
                            >
                                تحميل
                                <span className="ml-2">
                                    <FontAwesomeIcon icon={faDownload} />
                                </span>
                            </a>

                            <a
                                className="btn btn-primary w-100"
                                target="_blank"
                                href={this.props.details.book.pdf_file}
                            >
                                قراءة
                                <span className="ml-2">
                                    <FontAwesomeIcon icon={faEye} />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BookDetails;
