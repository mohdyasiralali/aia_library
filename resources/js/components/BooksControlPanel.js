import React from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faImage,
    faFile,
    faEye,
    faSearch
} from "@fortawesome/free-solid-svg-icons";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import PulseLoader from "react-spinners/PulseLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = `
    display: block;
    margin: 0 auto;
    border-color: red;
`;

class BooksControlPanel extends React.Component {
    // =========================================================== Initials
    constructor(props) {
        super(props);

        this.state = {
            books: [],
            categories: [],
            publishers: [],
            authors: [],

            cover_page: "",

            file: null,
            src: null,
            crop: {
                unit: "%",
                width: 100,
                height: 100,
                aspect: 0.9 / 1.4
            },
            croppedImageUrl: null,

            isEdit: false,
            currentBook: [],

            loading: false
        };
        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.onCropChange = this.onCropChange.bind(this);
        this.onCropComplete = this.onCropComplete.bind(this);
    }

    componentDidMount() {
        this.getBooks();
        this.getCategories();
        this.getPublishers();
        this.getAuthors();
    }

    getBooks() {
        axios.get("/api/books/get").then(response => {
            this.setState({ books: response.data.books });
        });
    }

    getCategories() {
        axios.get("/api/category/get_all").then(response => {
            this.setState({ categories: response.data });
        });
    }

    getPublishers() {
        axios.get("/api/publisher/get_all").then(response => {
            this.setState({ publishers: response.data });
        });
    }

    getAuthors() {
        axios.get("/api/authors/get").then(response => {
            this.setState({ authors: response.data });
        });
    }
    // // ===========================================================  End of Initials

    /////////////////////////////////////////////////////////////////////// IMAGE CROP, CREATE & UPLOAD
    /////////////////////////////////////////////////////////////////////// IMAGE CROP, CREATE & UPLOAD
    /////////////////////////////////////////////////////////////////////// IMAGE CROP, CREATE & UPLOAD

    onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }

        $("#cropModal").modal("show");
    }

    onImageLoaded(image) {
        this.imageRef = image;
    }

    onCropComplete(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = this.getCroppedImg(this.imageRef, crop);
            this.setState({ croppedImageUrl });
        }
    }

    onCropChange(crop, percentCrop) {
        this.setState({ crop });
    }

    dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], filename, { type: mime });
        this.setState({ croppedImage: croppedImage });
    }

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const reader = new FileReader();
        canvas.toBlob(blob => {
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                this.dataURLtoFile(reader.result, "cropped.jpg");
            };
        });
    }

    createImage(file) {
        let reader = new FileReader();
        reader.onload = e => {
            this.setState({
                cover_page: e.target.result
            });
        };
        reader.readAsDataURL(file);
    }

    onClickSaveCroppedImage() {
        this.createImage(this.state.croppedImage);
        $("#cropModal").modal("hide");
    }
    /////////////////////////////////////////////////////////////////////// END IMAGE CROP, CREATE & UPLOAD
    // // ================================================================== ON CLICK CALLS
    onClickAddBook(e) {
        e.preventDefault();
        this.setState({ isEdit: false, cover_page: "", croppedImage: [] });
        $("#BooksModal").modal("show");
    }
    // // ================================================================== END OF ON CLICK CALLS
    // ======================================================= ON SUBMIT ADD BOOK
    onSubmitAddBook(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        data.set("cover_page", this.state.croppedImage);

        this.setState({ loading: true }, () => {
            axios.post("/api/book/store", data).then(response => {
                let books = this.state.books;
                books.unshift(response.data);
                this.setState({
                    books: books,
                    cover_page: "",
                    loading: false
                });

                $("#BooksModal").modal("hide");
                document.getElementById("BK-FORM").reset();

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "تمت العملية بنجاح",
                    showConfirmButton: false,
                    timer: 1000
                });
            });
        });
    }
    // ======================================================= END OF ON SUBMIT ADD BOOK
    // ======================================================================== RENDERS
    // ===================================== SELECCT OPTIONS
    renderAuthorOptions() {
        if (this.state.authors.length !== 0) {
            return this.state.authors.map(author => {
                return (
                    <option key={author.id} value={author.id}>
                        {author.name}
                    </option>
                );
            });
        }
    }
    renderCategoriesOptions() {
        if (this.state.categories.length !== 0) {
            return this.state.categories.map(category => {
                return (
                    <option key={category.id} value={category.id}>
                        {category.title}
                    </option>
                );
            });
        }
    }
    renderPublisherOptions() {
        if (this.state.publishers.length !== 0) {
            return this.state.publishers.map(publisher => {
                return (
                    <option key={publisher.id} value={publisher.id}>
                        {publisher.name}
                    </option>
                );
            });
        }
    }
    // ===================================== END OF SELECCT OPTIONS

    onClickBook(event, element) {
        event.preventDefault();
        this.setState({
            isEdit: true,
            currentBook: element,
            cover_page: element.book.cover_page
        });
        $("#BooksModal").modal("show");
    }

    onClickDeleteBook(event, element) {
        event.preventDefault();
        Swal.fire({
            title: "هل أنت واثق؟",
            text: "لن تتمكن من التراجع عن هذا!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم ، احذفه!"
        }).then(result => {
            if (result.value) {
                axios;
                axios
                    .delete("/api/book/destroy/" + element.book.id)
                    .then(response => {
                        if (response.data.deleted === 1) {
                            let books = this.state.books;
                            const index = books.indexOf(element);
                            if (index > -1) {
                                books.splice(index, 1);
                            }
                            this.setState({ books: books });
                        }
                    });
                $("#BooksModal").modal("hide");
                Swal.fire("تم الحذف!");
            }
        });
    }

    onSubmitEditBook(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        if (formData.getAll("category").length === 0) {
            formData.set("category", this.state.currentBook.category.id);
        }

        if (formData.getAll("publisher").length === 0) {
            formData.set("publisher", this.state.currentBook.publisher.id);
        }

        if (formData.getAll("language").length === 0) {
            formData.set("language", this.state.currentBook.book.language);
        }

        if (formData.getAll("authors[]").length === 0) {
            let arr = [];
            this.state.currentBook.authors.map(author => {
                arr.unshift(author.id);
            });
            formData.set("authors[]", arr);
        }

        if (formData.getAll("cover_page").length !== 0) {
            formData.set("cover_page", this.state.croppedImage);
        }

        axios
            .post(
                "/api/book/update/" + this.state.currentBook.book.id,
                formData
            )
            .then(response => {
                let books = this.state.books;
                const index = books.indexOf(this.state.currentBook);
                if (index > -1) {
                    // books.splice(index, 1);
                    books[index] = response.data;
                }
                this.setState({ books: books });

                $("#BooksModal").modal("hide");
                document.getElementById("BK-FORM").reset();

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "تمت العملية بنجاح",
                    showConfirmButton: false,
                    timer: 1000
                });
            });
    }
    onChagneSearchBook(event) {
        event.preventDefault();
        if (event.target.value) {
            axios
                .get("/api/books/cp/get/" + event.target.value)
                .then(response => {
                    this.setState({ books: response.data });
                });
        } else {
            this.getBooks();
        }
    }

    renderModalBody() {
        let name = "";
        let numberOfPages = null;
        let Lang = "";
        let Category = "";
        let publisher = "";
        let bookDesc = "";
        let pdf_file = "";
        let authors = [];

        if (this.state.isEdit) {
            name = this.state.currentBook.book.name;
            numberOfPages = this.state.currentBook.book.numberOfPages;
            if (this.state.currentBook.book.language === "arabic") {
                Lang = "العربية";
            } else {
                Lang = "الانجليزية";
            }
            Category = this.state.currentBook.category.title;
            publisher = this.state.currentBook.publisher.name;
            authors = this.state.currentBook.authors;
            bookDesc = this.state.currentBook.book.book_description;
            pdf_file = this.state.currentBook.book.pdf_file;
        }

        return (
            <div>
                <form
                    className="text-right"
                    onSubmit={
                        this.state.isEdit
                            ? this.onSubmitEditBook.bind(this)
                            : this.onSubmitAddBook.bind(this)
                    }
                    id="BK-FORM"
                    encType="multipart/form-data"
                >
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <img
                                className="w-100"
                                src={this.state.cover_page}
                                // alt="Image Preview"
                            />
                            {/* ============================================== COVER PAGE */}
                            <div className="form-group p-2">
                                اختر صورة
                                <span className="ml-2">
                                    <FontAwesomeIcon icon={faImage} />
                                </span>
                                <span className="btn btn-dark btn-sm">
                                    <input
                                        type="file"
                                        className="file-input-profile"
                                        // onChange={this.onChangeImageFile.bind(this)}
                                        onChange={this.onSelectFile.bind(this)}
                                        accept="image/*"
                                        name="cover_page"
                                    ></input>
                                </span>
                            </div>
                            {/* =====================================================  PDF BOOK  */}
                            <div className="form-group p-2">
                                اختر الملف
                                <span className="ml-2">
                                    <FontAwesomeIcon icon={faFile} />
                                </span>
                                <span className="btn btn-dark btn-sm">
                                    <input
                                        type="file"
                                        className="file-input-profile"
                                        accept="application/pdf"
                                        name="pdf_file"
                                        required={
                                            this.state.isEdit ? false : true
                                        }
                                    ></input>
                                </span>
                                <a
                                    className="btn btn-primary w-100"
                                    target="_blank"
                                    hidden={this.state.isEdit ? false : true}
                                    href={pdf_file}
                                >
                                    الكتاب المرفوع
                                    <span className="ml-2">
                                        <FontAwesomeIcon icon={faEye} />
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div className="col-md-8">
                            {/* ============================================== BOOK NAME  */}
                            <div className="form-group">
                                <label className="font-weight-bold">
                                    اسم الكتاب
                                </label>

                                <input
                                    className="form-control text-right"
                                    name="name"
                                    defaultValue={name}
                                    required
                                ></input>
                            </div>
                            {/* ================================================= NUMBER OF PAGES */}
                            <div className="form-group">
                                <label className="font-weight-bold">
                                    عدد الصفحات
                                </label>

                                <input
                                    className="form-control text-right"
                                    type="number"
                                    name="numberOfPages"
                                    defaultValue={numberOfPages}
                                    required
                                ></input>
                            </div>

                            <div
                                className="bg-light p-3 rounded "
                                hidden={this.state.isEdit ? false : true}
                            >
                                <p>
                                    <b>اللغة: </b> {Lang}
                                </p>
                                <p>
                                    <b>القسم: </b> {Category}
                                </p>
                                <p>
                                    <b>دار النشر: </b>
                                    {publisher}
                                </p>
                                <b>الكاتب</b>
                                <div className="mr-4">
                                    {authors.map(author => {
                                        return (
                                            <p key={author.id}>{author.name}</p>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* ==================================================== LANGUAGE */}
                            <div className="form-group">
                                <label className="font-weight-bold">
                                    اللغة
                                </label>
                                <select
                                    name="language"
                                    className="form-control"
                                    defaultValue="default"
                                    required={this.state.isEdit ? false : true}
                                >
                                    <option value="default" disabled>
                                        اختر اللغة
                                    </option>
                                    <option value="arabic">العربية</option>
                                    <option value="eng">الانجليزية</option>
                                </select>
                            </div>
                            {/* ============================================== AUTHOR */}
                            <div className="form-group">
                                <label className="font-weight-bold">
                                    الكاتب
                                </label>
                                <select
                                    name="authors[]"
                                    className="form-control"
                                    multiple={true}
                                    required={this.state.isEdit ? false : true}
                                >
                                    {this.renderAuthorOptions()}
                                </select>
                            </div>
                            {/* =========================================== CATEGORIES */}
                            <div className="form-group">
                                <label className="font-weight-bold">
                                    أقسام الكتب
                                </label>
                                <select
                                    name="category"
                                    className="form-control"
                                    defaultValue="default"
                                    required={this.state.isEdit ? false : true}
                                >
                                    <option value="default" disabled>
                                        اختر القسم
                                    </option>
                                    {this.renderCategoriesOptions()}
                                </select>
                            </div>
                            {/* =========================================== PUBLISHERS */}
                            <div className="form-group">
                                <label className="font-weight-bold">
                                    دار النشر
                                </label>
                                <select
                                    name="publisher"
                                    className="form-control"
                                    defaultValue="default"
                                    required={this.state.isEdit ? false : true}
                                >
                                    <option value="default" disabled>
                                        اختر دار النشر
                                    </option>
                                    {this.renderPublisherOptions()}
                                </select>
                            </div>
                            {/* ========================================== BOOK DESC  */}
                            <div className="form-group">
                                <label className="font-weight-bold">
                                    وصف الكتاب
                                </label>
                                <textarea
                                    className="form-control text-right"
                                    rows="5"
                                    name="book_description"
                                    defaultValue={bookDesc}
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    {/* ================================================= BTN ADD  */}
                    <div className="text-left">
                        <div className="sweet-loading">
                            <PulseLoader
                                css={override}
                                size={15}
                                color={"#F5A623"}
                                loading={this.state.loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-dark"
                            hidden={this.state.loading}
                        >
                            {this.state.isEdit ? "حفظ التغييرات" : "إضافة"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger ml-2"
                            hidden={this.state.isEdit ? false : true}
                            onClick={event =>
                                this.onClickDeleteBook(
                                    event,
                                    this.state.currentBook
                                )
                            }
                        >
                            حذف
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    renderBooks() {
        if (this.state.books.length === 0) {
            return (
                <div>
                    <h1>لا يوجد نتائج</h1>
                </div>
            );
        } else {
            return this.state.books.map(element => {
                return (
                    <div
                        className="col-sm-8 col-md-6 col-lg-4 col-xl-3"
                        key={element.book.id}
                    >
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
                                        onClick={event =>
                                            this.onClickBook(event, element)
                                        }
                                    >
                                        {element.book.name}
                                    </a>
                                </h4>
                            </div>
                        </div>
                    </div>
                );
            });
        }
    }

    render() {
        const { crop, src } = this.state;
        return (
            <div className="container mt-5">
                <div className="text-right">
                    <div className="bg-dark d-inline search-field py-2 px-3 ml-3">
                        <span className="text-white">
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input
                            type="text"
                            className="py-1 px-3 w-50 field-icon search-field mx-2 text-right"
                            placeholder="اسم الكاتب"
                            onChange={this.onChagneSearchBook.bind(this)}
                        ></input>
                    </div>
                    <button
                        className="btn btn-dark ml-2"
                        onClick={this.onClickAddBook.bind(this)}
                    >
                        إضافة كتاب
                        <span className="ml-2">
                            <FontAwesomeIcon icon={faPlus} />
                        </span>
                    </button>
                </div>
                <div className="row d-flex flex-row-reverse mt-5">
                    {this.renderBooks()}
                </div>

                {/* ======================================================= ADD AUTHOR MODAL   */}
                <div
                    className="modal fade"
                    id="BooksModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="BooksModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg" role="document">
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

                {/* <!-- CROP Modal --> */}
                <div
                    className="modal fade"
                    id="cropModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="cropModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                {src && (
                                    <ReactCrop
                                        src={src}
                                        crop={crop}
                                        ruleOfThirds
                                        onImageLoaded={this.onImageLoaded}
                                        onComplete={this.onCropComplete}
                                        onChange={this.onCropChange}
                                    />
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={this.onClickSaveCroppedImage.bind(
                                        this
                                    )}
                                >
                                    حفظ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BooksControlPanel;
