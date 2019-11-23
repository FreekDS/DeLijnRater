import React from "react";
import axios from 'axios'
import {withRouter, Redirect} from 'react-router-dom'
import * as routes from './routing/routes'
import '../style/create.css'


class VehicleCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    submit(event) {
        event.preventDefault();
        const id = event.target.id.value;
        const type = event.target.type.value;
        const number = event.target.number.value;
        const name = event.target.name.value;
        const description = event.target.description.value;
        const user_id = event.target.user.value;
        const base = process.env.REACT_APP_API_URL;

        // console.log("sanity check", id, type, number, name, description);

        const params = {
            id: id,
            type: type,
            number: number,
            name: name,
            description: description,
            created_by: user_id
        };

        axios.post(base + "/entities/vehicles", params)
            .then(res => {
                console.log("Created vehicle", res.data);
                this.props.history.push(routes.Profile);
            })
            .catch(err => console.error({err}));
    }

    render() {

        let user = null;
        if (this.props.location.state)
            user = this.props.location.state.user;

        return (
            <React.Fragment>
                {user ?
                    <div className={"create-form-container"}>
                        <div className={"create-form"}>
                            <div className={"form-title"}>
                                <h3>Create a vehicle</h3>
                                <hr/>
                            </div>
                            <form className={""} onSubmit={event => this.submit(event)}>
                                <input type={"hidden"} value={user} name={"user"} id={"user"}/>
                                <div>
                                    <label>Unique identifier
                                        <input placeholder={"unique number"} className={"form-control"} type={"number"}
                                               min={0} id={"id"}
                                               name={"id"}/>
                                    </label>
                                </div>
                                <div>
                                    <label>Type
                                        <select className={"form-control"} name={"type"} id={"type"}>
                                            <option value={"Bus"} name={"Bus"}>Bus</option>
                                            <option value={"Tram"} name={"Tram"}>Tram</option>
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label>Number
                                        <input placeholder={"number of bus or tram"} className={"form-control"}
                                               type={"number"} min={0} id={"number"}
                                               name={"number"}/>
                                    </label>
                                </div>
                                <div>
                                    <label>Name
                                        <input placeholder={"name of the vehicle"} className={"form-control"}
                                               type={"text"} name={"name"} id={"name"}/>
                                    </label>
                                </div>
                                <div>
                                    <label>Description
                                        <textarea className={"form-control"} name={"description"} id={"description"}
                                                  placeholder={"Enter description here (optional)"}/>
                                    </label>
                                </div>
                                <div>
                                    <input className={"btn btn-success"} type={"submit"} value={"Create vehicle"}/>
                                </div>
                            </form>
                        </div>
                    </div>
                    :
                    <Redirect to={routes.Login}/>}
            </React.Fragment>
        );
    }


}

export default withRouter(VehicleCreate)