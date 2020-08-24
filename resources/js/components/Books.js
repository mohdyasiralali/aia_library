import React from "react";
import BookDetails from "./BookDetails";

class Books extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            current_book: []
        };
    }
    onClickBook(event, element) {
        event.preventDefault();
        this.setState({ current_book: element });
        $("#bookDetailsModal").modal("show");
    }

    renderModalBody() {
        if (this.state.current_book.length !== 0) {
            return <BookDetails details={this.state.current_book} />;
        }
    }

    renderBooks() {
        if (this.props.books.length !== 0) {
            return this.props.books.map(element => {
                return (
                    <div key={element.book.id} className="col-md-4 col-lg-3">
                        <div className="card card-product">
                            <div className="card-image">
                                <a href="#">
                                    <img
                                        className="img"
                                        src={element.book.cover_page}
                                    ></img>
                                </a>
                            </div>
                            <div className="table">
                                <h6 className="category text-rose">
                                    {element.category.title}
                                </h6>
                                <h4 className="card-caption">
                                    <a
                                        href="#"
                                        onClick={event => {
                                            this.onClickBook(event, element);
                                        }}
                                    >
                                        {element.book.name}
                                    </a>
                                </h4>
                            </div>
                        </div>
                    </div>
                );
            });
        } else {
            return (
                <div className="text-center w-100">
                    <h3>لا يوجد كتب نتيجة البحث </h3>
                    <h6>
                        اذا لم تجد ما تبحث عنه يمكنك استخدام كلمات أكثر دقة.
                    </h6>
                    <img
                        className="img"
                        src="/storage/application/nobooks.png"
                    ></img>
                </div>
            );
        }
    }
    render() {
        return (
            <section id="books" className="py-5">
                <div className="container">
                    <div className="row flex-row-reverse mt-5">
                        {this.renderBooks()}
                    </div>
                </div>

                {/* ================================ BOOK DETAILS MODAL */}
                <div
                    className="modal fade"
                    id="bookDetailsModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="bookDetailsModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="bg-light d-flex flex-row p-3 mb-3">
                                <button
                                    type="button"
                                    className="close justify-content-center"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {this.renderModalBody()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
export default Books;
