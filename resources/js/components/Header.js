import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faGraduationCap,
    faGlobeAsia,
    faUniversalAccess,
    faPhoneAlt,
    faCaretDown
} from "@fortawesome/free-solid-svg-icons";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
    }
    componentDidMount() {
        this.getCategories();
    }

    getCategories() {
        axios.get("/api/category/get_all").then(response => {
            this.setState({ categories: response.data });
        });
    }

    onChangeSearch(event) {
        this.props.onChangeSearch(event);
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


    onChangeSelectCat(event){
        event.preventDefault();
        this.props.onChangeSelectCat(event.target.value);        
    }

    render() {
        return (
            <section>
                <div className="toolbar">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <a
                                    href="https://aiacademy.info/"
                                    className="text-white"
                                >
                                    الصفحة الرئيسية
                                </a>

                                <div className="d-inline">
                                    <select
                                        name="category"
                                        className="toolbar-select text-white ml-2"
                                        defaultValue="default"
                                        onChange={this.onChangeSelectCat.bind(this)}
                                    >
                                        <option value="default">
                                            جميع الأقسام
                                        </option>
                                        {this.renderCategoriesOptions()}
                                    </select>
                                    <span>
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </span>
                                </div>
                            </div>
                            <div className="col-6 text-right">
                                تواصل معنا
                                <span className="mx-2">
                                    <FontAwesomeIcon icon={faPhoneAlt} />
                                </span>
                                00201221481731
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="overlay h-100">
                        <div className="container p-3 h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <div className="w-100 text-center">
                                    <div className="mb-5">
                                        <h1 className="mb-4 title">
                                            <b>
                                                الأكاديمية العربية الدولية
                                                <i className="fas fa-heart"></i>
                                            </b>
                                        </h1>
                                        <h2 className="mb-4">
                                            المكتبة الالكترونية
                                        </h2>
                                    </div>

                                    <div className="bg-light d-inline search-field py-2 px-3">
                                        <FontAwesomeIcon icon={faSearch} />
                                        <input
                                            type="text"
                                            className="py-1 px-3 w-50 field-icon search-field mx-2 text-right"
                                            placeholder=" ابحث عن اسم الكتاب, الكاتب, المؤلف, دار النشر"
                                            onChange={this.onChangeSearch.bind(
                                                this
                                            )}
                                        ></input>
                                    </div>
                                    <div className="row text-center mx-auto mt-5 w-75 font-weight-bold">
                                        <div className="col-md-4">
                                            أدرس من أي مكان وفي أي وقت{" "}
                                            <span className="ml-1">
                                                <FontAwesomeIcon
                                                    icon={faGlobeAsia}
                                                />{" "}
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            أكثر من 60 تخصص جامعي{" "}
                                            <span className="ml-1">
                                                <FontAwesomeIcon
                                                    icon={faUniversalAccess}
                                                />{" "}
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            أكثر من 20 ألف طالب
                                            <span className="ml-1">
                                                <FontAwesomeIcon
                                                    icon={faGraduationCap}
                                                />{" "}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Header;
