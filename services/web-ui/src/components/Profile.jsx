import React, {useEffect, useState} from "react";
import axios from 'axios'
import {MDBDataTable} from "mdbreact";
import {withRouter} from 'react-router-dom'


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicles: []
        };

        this.removeVehicle = this.removeVehicle.bind(this);
    }

    componentDidMount() {
        this.update();
    }

    update() {
        const {authenticated_user} = this.props;
        const base = process.env.REACT_APP_API_URL;
        axios.get(base + "/entities/vehicles/creator/" + authenticated_user.id)
            .then(res => {

                const data = res.data;
                console.log(data);

                let promises = [];
                let vehicles = [];

                data.forEach(v => {
                    promises.push(axios.get(base + "/ratings/vehicles/rating/" + v.id)
                        .then(res => {
                            if (res.data.length === 0) {
                                vehicles.push(v);
                            }
                        })
                        .catch(err => console.error({err}))
                    )
                });

                Promise.all(promises)
                    .then(() => {
                            this.setState({vehicles})
                        }
                    )
                    .catch(err => console.error({err}))

            })
            .catch(err => console.error({err}))
    }

    removeVehicle(event) {
        event.preventDefault();
        const id = parseInt(event.target.id.value, 10);
        const {vehicles} = this.state;
        const base = process.env.REACT_APP_API_URL;
        let ids = vehicles.map(obj => obj.id);


        console.log([2].includes(2));

        console.log("hallo", id);
        if (ids.includes(id) === true) {
            console.log("hallo");
            axios.delete(base + "/entities/vehicles/id/" + id).then(
                res => {
                    console.log("res", res);
                    this.update();
                }
            )
                .catch(err => console.error("Cannot delete", {err}))
        }


        console.log("Sanity check", ids);
    }

    handleCreateBtn(id) {
        this.props.history.push({
            pathname: "/create",
            state: {
                user: id
            }
        })
    }

    render() {

        const {vehicles} = this.state;
        console.log("vehicles", vehicles);

        return (
            <React.Fragment>
                <div className={"row justify-content-center"}>
                    <div className={"col"}>
                        <h1>Profile of {this.props.authenticated_user.name} </h1>
                    </div>
                    <div className={"col float-right vehicle-create"}>
                        <button className={"vehicle-create btn btn-success"}
                                onClick={() => this.handleCreateBtn(this.props.authenticated_user.id)}>Create vehicle
                        </button>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-5"}>
                        <h4>Your vehicles</h4>
                        <NumberList data={vehicles}/>
                    </div>
                    <div className={"col-2-offset-2 center-block"}>
                        <RemoveForm className={"login-container"} submit={this.removeVehicle}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

const NumberList = (props) => {
    const [data, setData] = useState({
        columns: [
            {
                label: "Unique identifier",
                field: "id"
            },
            {
                label: "type",
                field: "type"
            },
            {
                label: "Number",
                field: "number"
            },
            {
                label: "Name",
                field: "name"
            }
        ],
        rows: []
    });

    useEffect(() => {
        let rows = [];
        const list = props.data;
        if (!list)
            return;
        list.forEach(vehicle => {
            rows.push({
                'id': vehicle.id,
                'type': vehicle.type,
                'number': vehicle.number,
                'name': vehicle.name
            })
        });
        setData({
            columns: data.columns,
            rows: rows
        });
    }, [props, data.columns]);

    return <React.Fragment>
        <MDBDataTable
            data={data}
            paging={false}
            noBottomColumns={true}
            hover={false}
            searching={true}
        />
    </React.Fragment>
};


const RemoveForm = (props) => {

    return (
        <div className={"remover"}>
            <h5>Remove a vehicle</h5>
            <div className={"form-container"}>
                <form className={"remove-form"} onSubmit={(event) => props.submit(event)}>
                    <div className={"form-group"}>
                        <label>Unique identifier
                            <input type={"number"} min={1} name={"id"} id={"id"}/>
                        </label>
                    </div>
                    <input className={"remove-btn btn btn-danger"} type={"submit"} value={"remove vehicle"}/>
                </form>
            </div>
        </div>);
};

export default withRouter(Profile);