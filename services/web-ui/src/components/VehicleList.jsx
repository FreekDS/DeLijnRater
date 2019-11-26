import React from "react";
import {MDBDataTable} from 'mdbreact';
import axios from 'axios'
import * as routes from "./routing/routes";
import {withRouter} from "react-router-dom";

class VehicleList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: null,
            columns: null
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(vehicle) {
        this.props.history.push(routes.VehicleList + "/" + vehicle.type.toLowerCase() + "/" + vehicle.id);
    }

    componentDidMount() {
        this.initializeColumns();
        this.getStops();
    }

    initializeColumns() {
        const columns = [
            {
                label: "Type",
                sort: "asc",
                field: "type"
            },
            {
                label: "Number",
                sort: "asc",
                field: "number"
            },
            {
                label: "Name",
                sort: "asc",
                field: "name"
            }
        ];
        this.setState({columns});
    }

    getStops() {
        const base = process.env.REACT_APP_API_URL;
        axios.get(base + "/entities/vehicles")
            .then((res) => {
                const vehicles = res.data;
                let rows = [];
                vehicles.forEach((v) => {
                    let vehicle = {
                        'type': v.type,
                        'number': v.number,
                        'name': v.name,
                        clickEvent: () => this.handleClick(v)
                    };
                    rows.push(vehicle);
                });
                this.setState({rows})
            })
            .catch(err => {
                console.error({err})
            })
    }

    render() {
        const {rows, columns} = this.state;
        const loading = !rows || !columns;
        let data = {
            rows: rows,
            columns: columns
        };
        return <React.Fragment>
            <h1>List of all vehicles</h1>
            {loading ? "loading" : <MDBDataTable
                data={data}
                paging={false}
                noBottomColumns={true}
                hover={true}
            />}
        </React.Fragment>;

    }

}

export default withRouter(VehicleList);