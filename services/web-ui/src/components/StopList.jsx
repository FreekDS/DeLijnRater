import React from "react";
import {MDBDataTable} from 'mdbreact';
import axios from 'axios'
import {withRouter} from "react-router-dom";
import * as routes from './routing/routes'

class StopList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: null,
            columns: null
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(stop) {
        console.log("Event", stop);
        this.props.history.push(routes.StopList + "/" + stop.id);
    }

    componentDidMount() {
        this.initializeColumns();
        this.getStops();
    }

    initializeColumns() {
        const columns = [
            {
                label: "Region",
                sort: "asc",
                field: "region"
            },
            {
                label: "Name",
                sort: "asc",
                field: "name"
            },
            {
                label: "Number",
                sort: "asc",
                field: "number"
            },
            {
                label: "Village",
                sort: "asc",
                field: "village"
            }
        ];
        this.setState({columns});
    }

    getStops() {
        const base = process.env.REACT_APP_API_URL;
        axios.get(base + "/entities/stops")
            .then((res) => {
                const stops = res.data;
                let rows = [];
                stops.forEach((s) => {
                    let stop = {
                        'region': s.region,
                        'name': s.name,
                        'number': s.stop_number,
                        'village': s.village,
                        clickEvent: () => this.handleClick(s)
                    };
                    rows.push(stop);
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
            {loading ? "loading" : <MDBDataTable
                data={data}
                paging={false}
                noBottomColumns={true}
                hover={true}
            />}
        </React.Fragment>;

    }

}

export default withRouter(StopList);