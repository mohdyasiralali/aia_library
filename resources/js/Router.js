import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header";
import Books from "./components/Books";

class Router extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            books: []
        };
    }

    componentDidMount() {
        this.getBooks();
    }

    getBooks() {
        axios.get("/api/books/get").then(response => {
            this.setState({
                books: response.data.books
            });
        });
    }

    serachBooks(searchKey) {
        if (searchKey === "") {
            this.getBooks();
        } else {
            axios.get("/api/books/get/" + searchKey).then(response => {
                this.setState({ books: response.data });
            });
        }
    }

    onChangeSearch(event) {
        this.serachBooks(event.target.value);
    }

    onChangeSelectCat(catId) {
        if (catId === "default") {
            this.getBooks();
        } else {
            axios.get("/api/books/get/catgs/" + catId).then(response => {
                console.log(response.data)
                this.setState({ books: response.data.books });
            });
        }
    }

    render() {
        return (
            <div>
                <Header
                    onChangeSearch={this.onChangeSearch.bind(this)}
                    onChangeSelectCat={this.onChangeSelectCat.bind(this)}
                ></Header>
                <Books books={this.state.books}></Books>
            </div>
        );
    }
}
export default Router;

if (document.getElementById("root")) {
    ReactDOM.render(<Router />, document.getElementById("root"));
}
