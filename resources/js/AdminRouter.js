import React from "react";
import ReactDOM from "react-dom";
import Dashboard from './components/Dashboard';

class AdminRouter extends React.Component {
    render() {
        return (
            <div>
                <Dashboard></Dashboard>
            </div>
        );
    }
}
export default AdminRouter;

if (document.getElementById("admin-root")) {
    ReactDOM.render(<AdminRouter />, document.getElementById("admin-root"));
}