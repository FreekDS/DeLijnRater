import React, {useEffect, useState} from "react";
import axios from 'axios'
import {MDBDataTable} from "mdbreact";


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicles: []
        }
    }

    componentDidMount() {
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
                            if(res.data.length === 0) {
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

    render() {

        const {vehicles} = this.state;
        console.log("vehicles", vehicles);

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className={"col"}>
                        <h1>Profile of {this.props.authenticated_user.name} </h1>
                    </div>
                    <div className={"col float-right align-right"}>
                        Add vehicle button
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        <h4>Your vehicles</h4>
                        <NumberList data={vehicles}/>
                    </div>
                    <div className={"col"}>
                        remove field
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

export default Profile;