import React, {useEffect, useState} from "react";
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
        this.getStopsByLine = this.getStopsByLine.bind(this);
        this.getStopsByVillage = this.getStopsByVillage.bind(this);
        this.getStops = this.getStops.bind(this);
    }

    handleClick(stop) {
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

    getStopsByVillage(event) {
        event.preventDefault();
        const base = process.env.REACT_APP_API_URL;
        const village = event.target.village.value;

        axios.get(base + "/entities/stops/village/" + village)
            .then(res => {
                console.log("By village", res.data);
                this.updateRows(res.data);
            })
            .catch(err => console.error({err}));
    }

    getStopsByLine(event) {
        event.preventDefault();
        const base = process.env.REACT_APP_API_URL;
        const line = event.target.line.value;
        const region = event.target.region.value;
        console.log("Sanity check", region, line);
        axios.get(base + "/entities/stops/line/" + region + "/" + line)
            .then(res => {
                this.updateRows(res.data);
            })
            .catch(err => console.error({err}));
    }

    updateRows(data) {
        let rows = [];
        data.forEach((s) => {
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
    }

    getStops() {
        const base = process.env.REACT_APP_API_URL;
        axios.get(base + "/entities/stops")
            .then((res) => {
                const stops = res.data;
                this.updateRows(stops);
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
            <div className={"row"}>
                <div className={"col d-flex justify-content-center"}>
                    <SelectionForm type={"byVillage"} submit={this.getStopsByVillage}/>
                </div>
                <div className={"col d-flex justify-content-center"}>
                    <SelectionForm type={"byLine"} submit={this.getStopsByLine}/>
                </div>
            </div>
            <button onClick={this.getStops}>Show all</button>
            {loading ? "loading" : <MDBDataTable
                data={data}
                paging={data.rows.length > 1000}
                entries={50}
                displayEntries={false}
                noBottomColumns={true}
                hover={true}
            />}
        </React.Fragment>;

    }

}

const SelectionForm = (props) => {

    let [regions, setRegions] = useState(0);

    useEffect(() => {
        if (props.type === "byLine") {
            const base = process.env.REACT_APP_API_URL;
            axios.get(base + "/entities/regions/values")
                .then(res => {
                    setRegions(res.data);
                })
        }
    }, [props.type]);


    return <React.Fragment>
        <div className={"stop-forms"}>
            {props.type === "byVillage" ? <h3>Search by village</h3> : <h3>Search by line</h3>}
            <form onSubmit={(event => props.submit(event))}>
                {props.type === "byVillage"
                    ? <React.Fragment>
                        <div className={"form-group"}>
                            <label>Village
                                <input className={"form-control"} type={"text"}
                                       placeholder={"Enter village ex. Oppuurs"}
                                       id={"village"} name={"village"}/>
                            </label>
                        </div>
                    </React.Fragment>
                    : <React.Fragment>
                        <div className={"form-group"}>
                            <label>Region
                                <select className={"form-control"} id={"region"} name={"region"}>
                                    {Object.keys(regions).map((keyName, i) => (
                                        <option key={i} value={keyName}>{keyName}</option>
                                    ))}
                                </select>

                            </label>
                        </div>
                        <div className={"form-group"}>
                            <label>Line number
                                <input className={"form-control"} type={"number"} min={1} defaultValue={1} id={"line"}
                                       name={"line"}/>
                            </label>
                        </div>
                    </React.Fragment>
                }
                <input className={"btn btn-primary submit"} type={"submit"} value={"Search"}/>
            </form>
        </div>
    </React.Fragment>
};

export default withRouter(StopList);