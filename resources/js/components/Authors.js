import React from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faImage,
    faTrash,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

class Authors extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authors: [],

            author_profile_picture: "",

            edit: false,
            currentEditAuthor: [],

            file: null,
            src: null,
            crop: {
                unit: "%",
                width: 100,
                height: 100,
                aspect: 1.6 / 1.6
            },
            croppedImageUrl: null
        };

        this.onImageLoaded = this.onImageLoaded.bind(this);
        this.onCropChange = this.onCropChange.bind(this);
        this.onCropComplete = this.onCropComplete.bind(this);
    }

    componentDidMount() {
        this.getAuthors();
    }

    getAuthors() {
        axios.get("/api/authors/get").then(response => {
            this.setState({ authors: response.data });
        });
    }

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
                profile_picture: e.target.result
            });
        };
        reader.readAsDataURL(file);
    }

    onClickSaveCroppedImage() {
        this.createImage(this.state.croppedImage);
        $("#cropModal").modal("hide");
    }
    /////////////////////////////////////////////////////////////////////// END IMAGE CROP, CREATE & UPLOAD
    // ============================================================= ADD MODAL SUBMIT
    onSubmitAddAuthor(event) {
        event.preventDefault();

        const data = new FormData(event.target);
        data.set("profile_picture", this.state.croppedImage);

        axios.post("/api/author/store", data).then(response => {
            let authors = this.state.authors;
            authors.unshift(response.data);
            this.setState({
                authors: authors
            });
            $("#AuthorModal").modal("hide");
            document.getElementById("addAuthorForm").reset();

            Swal.fire({
                position: "center",
                icon: "success",
                title: "تمت العملية بنجاح",
                showConfirmButton: false,
                timer: 1000
            });
        });
    }
    // =================================================================== MODAL BODY TRIGGERS
    onClickAddAuthorBtn(e) {
        e.preventDefault();
        this.setState({
            edit: false,
            profile_picture: "",
            currentEditAuthor: []
        });
        $("#AuthorModal").modal("show");
    }

    onClickEditAuthor(e, author) {
        e.preventDefault();
        this.setState({
            currentEditAuthor: author,
            profile_picture: author.profile_picture,
            edit: true
        });
        $("#AuthorModal").modal("show");
    }
    // =================================================================== END OF MODAL BODY TRIGGERS
    // =================================================================== DELETE AUTHOR
    onClickDeleteAuthor(e, author) {
        e.preventDefault();
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
                axios
                    .delete("/api/author/destroy/" + author.id)
                    .then(response => {
                        if (response.data.deleted === 1) {
                            let authors = this.state.authors;
                            const index = authors.indexOf(author);
                            if (index > -1) {
                                authors.splice(index, 1);
                            }
                            this.setState({ authors: authors });
                            Swal.fire("تم الحذف!");
                        } else {
                            Swal.fire({
                                title: "لم يتم الحذف!",
                                text: "تأكد من حذف جميع الكتب التابعة لهذا الكاتب!",
                                icon: "error"
                            });
                        }
                    });
                $("#AuthorModal").modal("hide");
            }
        });
    }
    // ===================================================================END OF DELETE AUTHOR
    // ===================================================================UPDATE AUTHOR
    onSubmitEditAuthor(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        if (formData.getAll("name").length === 0) {
            formData.set("name", this.state.currentEditAuthor.name);
        }
        if (formData.getAll("description").length === 0) {
            formData.set(
                "description",
                this.state.currentEditAuthor.description
            );
        }

        if (formData.getAll("profile_picture").length !== 0) {
            formData.set("profile_picture", this.state.croppedImage);
        }

        axios
            .post(
                "/api/author/update/" + this.state.currentEditAuthor.id,
                formData
            )
            .then(response => {
                let authors = this.state.authors;
                const index = authors.indexOf(this.state.currentEditAuthor);
                if (index > -1) {
                    // authors.splice(index, 1);
                    authors[index] = response.data;
                }
                this.setState({ authors: authors });
                $("#AuthorModal").modal("hide");

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "تم حفظ التغييرات",
                    showConfirmButton: false,
                    timer: 1000
                });
            });
    }
    // ===================================================================END OF UPDATE AUTHOR
    // =================================================================== RENDER MODAL BODY

    onChagneSearchAuthor(event) {
        event.preventDefault();
        axios.get("/api/authors/get/" + event.target.value).then(response => {
            this.setState({ authors: response.data });
        });
    }

    renderModalBody() {
        // =================================================== ADD NEW AUTHOR
        return (
            <form
                id="addAuthorForm"
                className="text-right"
                onSubmit={
                    this.state.edit
                        ? this.onSubmitEditAuthor.bind(this)
                        : this.onSubmitAddAuthor.bind(this)
                }
            >
                <div className="row">
                    <div className="col-md-4 text-center">
                        <img
                            className="w-100 rounded-circle"
                            src={this.state.profile_picture}
                            alt="Image Preview"
                        />
                        <div className="form-group p-2">
                            اختر صورة
                            <span className="ml-2">
                                <FontAwesomeIcon icon={faImage} />
                            </span>
                            <span className="btn btn-dark btn-sm">
                                <input
                                    type="file"
                                    className="file-input-profile"
                                    name="profile_picture"
                                    onChange={this.onSelectFile.bind(this)}
                                ></input>
                            </span>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="form-group">
                            <label className="font-weight-bold">اﻹسم</label>
                            <input
                                className="form-control text-right"
                                name="name"
                                defaultValue={
                                    this.state.edit
                                        ? this.state.currentEditAuthor.name
                                        : ""
                                }
                                required
                            ></input>
                        </div>

                        <div className="form-group">
                            <label className="font-weight-bold">
                                عن الكاتب
                            </label>
                            <textarea
                                className="form-control text-right"
                                rows="15"
                                name="description"
                                defaultValue={
                                    this.state.edit
                                        ? this.state.currentEditAuthor
                                              .description
                                        : ""
                                }
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="text-left">
                    <button type="submit" className="btn btn-dark">
                        {this.state.edit ? "حقظ التغييرات" : "إضافة"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger ml-2"
                        hidden={this.state.edit ? false : true}
                        onClick={e =>
                            this.onClickDeleteAuthor(
                                e,
                                this.state.currentEditAuthor
                            )
                        }
                    >
                        حذف
                        <span className="ml-2">
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                    </button>
                </div>
            </form>
        );
    }
    // =================================================================== END OF RENDER MODAL BODY

    renderAuthors() {
        if (this.state.authors.length === 0) {
            return (
                <div>
                    <h1>لا يوجد نتائج</h1>
                </div>
            );
        }
        return this.state.authors.map(author => {
            return (
                <div className="col-sm-6 col-lg-4" key={author.id}>
                    <div className="card card-profile">
                        <div className="card-avatar">
                            <a
                                href="#"
                                onClick={e => this.onClickEditAuthor(e, author)}
                            >
                                <img
                                    className="img"
                                    src={author.profile_picture}
                                ></img>
                            </a>
                        </div>
                        <div className="table author-description">
                            <h4>
                                <b>{author.name}</b>
                            </h4>
                        </div>
                    </div>
                </div>
            );
        });
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
                            onChange={this.onChagneSearchAuthor.bind(this)}
                        ></input>
                    </div>
                    <button
                        className="btn btn-dark ml-2"
                        onClick={this.onClickAddAuthorBtn.bind(this)}
                    >
                        إضافة كاتب
                        <span className="ml-2">
                            <FontAwesomeIcon icon={faPlus} />
                        </span>
                    </button>

                    <div className="row d-flex flex-row-reverse mt-5">
                        {this.renderAuthors()}
                    </div>
                </div>

                {/* ======================================================= ADD AUTHOR MODAL   */}
                <div
                    className="modal fade"
                    id="AuthorModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="AuthorModalLabel"
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

export default Authors;
