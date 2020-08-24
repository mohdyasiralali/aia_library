import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

class PublishersAndCategories extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allCategories: [],
            allPublishers: [],

            sliceCategories: 5,
            slicePublishers: 5,

            categories: 0,
            publishers: 0,
            edit: 0,

            newCategoryTitle: "",
            newPublisherName: "",

            currentEditObject: []
        };
    }

    componentDidMount() {
        this.getAllCategories();
        this.getAllPublishers();
    }

    getAllCategories() {
        axios.get("/api/category/get_all").then(response => {
            this.setState({ allCategories: response.data });
        });
    }

    getAllPublishers() {
        axios.get("/api/publisher/get_all").then(response => {
            this.setState({ allPublishers: response.data });
        });
    }

    // ======================================== ONCLICK READ MORE/LESS CATEGORIES/PUBLISHERS

    onClickCategoriesReadMore(e) {
        e.preventDefault();
        this.setState({ sliceCategories: this.state.allCategories.length });
    }

    onClickCategoriesReadLess(e) {
        e.preventDefault();
        this.setState({ sliceCategories: 5 });
    }

    onClickPublishersReadMore(e) {
        e.preventDefault();
        this.setState({ slicePublishers: this.state.slicePublishers.length });
    }

    onClickPublishersReadLess(e) {
        e.preventDefault();
        this.setState({ slicePublishers: 5 });
    }
    // ======================================== END OF ONCLICK READ MORE/LESS CATEGORIES/PUBLISHERS
    // ============================================== addEditCategoryPublisherModal TRIGGERS
    onClickAddCategory(e) {
        e.preventDefault();
        this.setState({ categories: 1, publishers: 0, edit: 0 });
        $("#addEditCategoryPublisherModal").modal("show");
    }

    onClickAddPublisher(e) {
        e.preventDefault();
        this.setState({ categories: 0, publishers: 1, edit: 0 });
        $("#addEditCategoryPublisherModal").modal("show");
    }

    onClickEditCategory(e, category) {
        e.preventDefault();
        this.setState({
            categories: 1,
            publishers: 0,
            edit: 1,
            currentEditObject: category
        });
        $("#addEditCategoryPublisherModal").modal("show");
    }

    onClickEditPublisher(e, publisher) {
        e.preventDefault();
        this.setState({
            categories: 0,
            publishers: 1,
            edit: 1,
            currentEditObject: publisher
        });
        $("#addEditCategoryPublisherModal").modal("show");
    }

    // ============================================== END OF addEditCategoryPublisherModal TRIGGERS
    // ============================================= ON SUBMIT ADD CATEGORY / PUBLISHER

    onSubmitAddCategory(e) {
        e.preventDefault();
        let data = { newCategoryTitle: this.state.newCategoryTitle };
        axios.post("/api/category/store", data).then(response => {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "تمت العملية بنجاح",
                showConfirmButton: false,
                timer: 1000
            });

            let categoriies_list = this.state.allCategories;
            categoriies_list.unshift(response.data);
            this.setState({
                allCategories: categoriies_list,
                newCategoryTitle: ""
            });
        });
        $("#addEditCategoryPublisherModal").modal("hide");
    }

    onSubmitAddPublisher(e) {
        e.preventDefault();
        let data = { newPublisherName: this.state.newPublisherName };
        axios.post("/api/publisher/store", data).then(response => {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "تمت العملية بنجاح",
                showConfirmButton: false,
                timer: 1000
            });
            let publishers_list = this.state.allPublishers;
            publishers_list.unshift(response.data);
            this.setState({
                allPublishers: publishers_list,
                newPublisherName: ""
            });
        });
        $("#addEditCategoryPublisherModal").modal("hide");
    }

    // ============================================= END ON SUBMIT ADD CATEGORY / PUBLISHER
    // ======================================================== ON CAHNGE / EDIT INPUT CALLS

    onChangenewCategoryTitle(e) {
        this.setState({ newCategoryTitle: e.target.value });
    }

    onChangeNewPublisherName(e) {
        this.setState({ newPublisherName: e.target.value });
    }

    onChangeEditCategoryTitle(e) {
        let categoryObject = this.state.currentEditObject;
        categoryObject.title = e.target.value;
        this.setState({ currentEditObject: categoryObject });
    }

    onChangeEditPublisherName(e) {
        let publisherObject = this.state.currentEditObject;
        publisherObject.name = e.target.value;
        this.setState({ currentEditObject: publisherObject });
    }

    // ======================================================== END OF ON CAHNGE INPUT CALLS
    // ============================================================ EDIT CATEGORY/PUNLISHER - SAVE CHANGES
    onSubmitEditCategory(e) {
        e.preventDefault();
        let data = {
            newTitle: this.state.currentEditObject.title
        };
        axios
            .put(
                "/api/category/update/" + this.state.currentEditObject.id,
                data
            )
            .then(response => {
                $("#addEditCategoryPublisherModal").modal("hide");
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "تم حفظ التغييرات",
                    showConfirmButton: false,
                    timer: 1000
                });
            });
    }

    onSubmitEditPublisher(e) {
        e.preventDefault();
        let data = {
            newName: this.state.currentEditObject.name
        };
        axios
            .put(
                "/api/publisher/update/" + this.state.currentEditObject.id,
                data
            )
            .then(response => {
                $("#addEditCategoryPublisherModal").modal("hide");
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "تم حفظ التغييرات",
                    showConfirmButton: false,
                    timer: 1000
                });
            });
    }
    // ============================================================ END OF EDIT CATEGORY/PUNLISHER -SAVE CHANGES
    // ======================================================== SEARCH

    onChangeCategoriesSearchKey(e) {
        e.preventDefault();
        if (e.target.value === "") {
            this.getAllCategories();
        } else {
            axios.get("/api/category/get/" + e.target.value).then(response => {
                this.setState({ allCategories: response.data });
            });
        }
    }

    onChangePublisherSearchKey(e) {
        e.preventDefault();
        if (e.target.value === "") {
            this.getAllPublishers();
        } else {
            axios.get("/api/publisher/get/" + e.target.value).then(response => {
                this.setState({ allPublishers: response.data });
            });
        }
    }

    // ======================================================== END OF SEARCH
    // ========================================================= DELETE CATEGORY/PUNLISHER

    onClickDeleteCategory(e, category) {
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
                    .delete("/api/category/destroy/" + category.id)
                    .then(response => {
                        if (response.data.deleted === 1) {
                            let categories = this.state.allCategories;
                            const index = categories.indexOf(category);
                            if (index > -1) {
                                categories.splice(index, 1);
                            }
                            this.setState({ allCategories: categories });
                        }
                    });
                Swal.fire("تم الحذف!");
            }
        });
    }

    onClickDeletePublisher(e, publisher) {
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
                    .delete("/api/publisher/destroy/" + publisher.id)
                    .then(response => {
                        if (response.data.deleted === 1) {
                            let publishers = this.state.allPublishers;
                            const index = publishers.indexOf(publisher);
                            if (index > -1) {
                                publishers.splice(index, 1);
                            }
                            this.setState({ allPublishers: publishers });
                        }
                    });
                Swal.fire("تم الحذف!");
            }
        });
    }

    // ========================================================= END OF DELETE CATEGORY/PUNLISHER
    //  ===================================================== RENDER ADD/EDIT MODAL BODIES

    renderAddEditModalBody() {
        if (this.state.categories) {
            if (!this.state.edit) {
                // ========================================== ADD CATEGORY BODY
                return (
                    <div className="p-3">
                        <form onSubmit={this.onSubmitAddCategory.bind(this)}>
                            <div className="form-group">
                                <label>اسم القسم</label>
                                <input
                                    className="form-control text-right"
                                    value={this.state.newCategoryTitle}
                                    onChange={this.onChangenewCategoryTitle.bind(
                                        this
                                    )}
                                ></input>
                            </div>

                            <div className="text-left">
                                <button className="btn btn-success">
                                    إضافة
                                </button>
                            </div>
                        </form>
                    </div>
                );
            } else {
                // ========================================== EDIT CATEGORY BODY
                return (
                    <div className="p-3">
                        <form onSubmit={this.onSubmitEditCategory.bind(this)}>
                            <div className="form-group">
                                <label>اسم القسم</label>
                                <input
                                    className="form-control text-right"
                                    value={this.state.currentEditObject.title}
                                    onChange={this.onChangeEditCategoryTitle.bind(
                                        this
                                    )}
                                ></input>
                            </div>

                            <div className="text-left">
                                <button className="btn btn-success">
                                    حفظ التغييرات
                                </button>
                            </div>
                        </form>
                    </div>
                );
            }
        } else if (this.state.publishers) {
            if (!this.state.edit) {
                // ========================================== ADD PUBLISHER BODY
                return (
                    <div className="p-3">
                        <form onSubmit={this.onSubmitAddPublisher.bind(this)}>
                            <div className="form-group">
                                <label>اسم دار النشر</label>
                                <input
                                    className="form-control text-right"
                                    value={this.state.newPublisherName}
                                    onChange={this.onChangeNewPublisherName.bind(
                                        this
                                    )}
                                ></input>
                            </div>

                            <div className="text-left">
                                <button className="btn btn-success">
                                    إضافة
                                </button>
                            </div>
                        </form>
                    </div>
                );
            } else {
                // ========================================== EDIT PUBLISHER BODY
                return (
                    <div className="p-3">
                        <form onSubmit={this.onSubmitEditPublisher.bind(this)}>
                            <div className="form-group">
                                <label>اسم دار النشر</label>
                                <input
                                    className="form-control text-right"
                                    value={this.state.currentEditObject.name}
                                    onChange={this.onChangeEditPublisherName.bind(
                                        this
                                    )}
                                ></input>
                            </div>

                            <div className="text-left">
                                <button className="btn btn-success">
                                    حفظ التغييرات
                                </button>
                            </div>
                        </form>
                    </div>
                );
            }
        }
    }

    //  ===================================================== END RENDER MODALS BODIES

    renderCategories() {
        if (this.state.allCategories.length === 0) {
            return (
                <div>
                    <h1>لا يوجد أقسام</h1>
                </div>
            );
        } else {
            return this.state.allCategories
                .slice(0, this.state.sliceCategories)
                .map(category => {
                    return (
                        <li key={category.id} className="row">
                            <div className="col-md-4">
                                <button
                                    className="btn btn-danger"
                                    onClick={e => {
                                        this.onClickDeleteCategory(e, category);
                                    }}
                                >
                                    حذف
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={e =>
                                        this.onClickEditCategory(e, category)
                                    }
                                >
                                    تعديل
                                </button>
                            </div>
                            <div className="col-md-8">
                                <h5>{category.title}</h5>
                            </div>
                        </li>
                    );
                });
        }
    }

    renderPunlishers() {
        if (this.state.allPublishers.length === 0) {
            return (
                <div>
                    <h1>لا يوجد دور نشر</h1>
                </div>
            );
        } else {
            return this.state.allPublishers
                .slice(0, this.state.slicePublishers)
                .map(publisher => {
                    return (
                        <li key={publisher.id} className="row">
                            <div className="col-md-4">
                                <button
                                    className="btn btn-danger"
                                    onClick={e => {
                                        this.onClickDeletePublisher(
                                            e,
                                            publisher
                                        );
                                    }}
                                >
                                    حذف
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={e =>
                                        this.onClickEditPublisher(e, publisher)
                                    }
                                >
                                    تعديل
                                </button>
                            </div>
                            <div className="col-md-8">
                                <h5>{publisher.name}</h5>
                            </div>
                        </li>
                    );
                });
        }
    }
    render() {
        return (
            <div className="container">
                <div className="row d-flex flex-row-reverse text-right">
                    {/* ====================================================== CATEGORIES */}
                    <div className="col-12 col-xl-6 p-3">
                        <div className="p-2 my-3" id="categoriesHeading">
                            <h2>الأقسام</h2>
                            <hr></hr>
                            <button
                                className="btn btn-dark"
                                onClick={this.onClickAddCategory.bind(this)}
                            >
                                إضافة قسم
                                <span className="text-white ml-2">
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </button>
                            <div className="bg-dark d-inline search-field py-2 px-3 ml-3">
                                <span className="text-white">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <input
                                    type="text"
                                    className="py-1 px-3 w-50 field-icon search-field mx-2 text-right"
                                    placeholder="الأقسام"
                                    onChange={this.onChangeCategoriesSearchKey.bind(
                                        this
                                    )}
                                ></input>
                            </div>
                        </div>

                        <div>
                            <ul className="list-unstyled">
                                {this.renderCategories()}
                            </ul>
                            <div>
                                <button
                                    className="btn btn-danger"
                                    onClick={
                                        this.state.sliceCategories === 5
                                            ? this.onClickCategoriesReadMore.bind(
                                                  this
                                              )
                                            : this.onClickCategoriesReadLess.bind(
                                                  this
                                              )
                                    }
                                    hidden={
                                        this.state.allCategories.length > 5
                                            ? false
                                            : true
                                    }
                                >
                                    {this.state.sliceCategories === 5
                                        ? "اظهار الكل"
                                        : "اخفاء"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ====================================================== END OF CATEGORIES */}
                    {/* ======================================================== PUBLISHERS */}
                    <div className="col-12 col-xl-6 p-3">
                        <div className="p-2 my-3" id="categoriesHeading">
                            <h2>دور النشر</h2>
                            <hr></hr>
                            <button
                                className="btn btn-dark"
                                onClick={this.onClickAddPublisher.bind(this)}
                            >
                                إضافة دار نشر
                                <span className="text-white ml-2">
                                    <FontAwesomeIcon icon={faPlus} />
                                </span>
                            </button>
                            <div className="bg-dark d-inline search-field py-2 px-3 ml-3">
                                <span className="text-white">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <input
                                    type="text"
                                    className="py-1 px-3 w-50 field-icon search-field mx-2 text-right"
                                    placeholder="دور النشر"
                                    onChange={this.onChangePublisherSearchKey.bind(
                                        this
                                    )}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <ul className="list-unstyled">
                                {this.renderPunlishers()}
                            </ul>
                            <div>
                                <button
                                    className="btn btn-danger"
                                    onClick={
                                        this.state.slicePublishers === 5
                                            ? this.onClickPublishersReadMore.bind(
                                                  this
                                              )
                                            : this.onClickPublishersReadLess.bind(
                                                  this
                                              )
                                    }
                                    hidden={
                                        this.state.allPublishers.length > 5
                                            ? false
                                            : true
                                    }
                                >
                                    {this.state.slicePublishers === 5
                                        ? "اظهار الكل"
                                        : "اخفاء"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======================================================== END OF PUBLISHERS */}
                {/* ================================================= ADD/EDIT CATEGORY / PUBLISHER MODAL */}
                <div
                    className="modal fade"
                    id="addEditCategoryPublisherModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="addEditCategoryPublisherModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content text-right">
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
                                {this.renderAddEditModalBody()}
                            </div>
                        </div>
                    </div>
                </div>
                {/* =================================================  END OF ADD/EDIT CATEGORY / PUBLISHER MODAL */}
            </div>
        );
    }
}

export default PublishersAndCategories;
