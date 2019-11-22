import React from "react";
import axios from 'axios'
import {withRouter, Redirect} from 'react-router-dom'
import * as routes from './routing/routes'


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
        if(this.props.location.state)
            user = this.props.location.state.user;

        return (
            <React.Fragment >
                {user ?
                    <form  onSubmit={event => this.submit(event)}>
                        <input type={"hidden"} value={user} name={"user"} id={"user"}/>
                        <label>Unique identifier
                            <input type={"number"} min={0} id={"id"} name={"id"}/>
                        </label>
                        <label>Type
                            <select name={"type"} id={"type"}>
                                <option value={"Bus"} name={"Bus"}>Bus</option>
                                <option value={"Tram"} name={"Tram"}>Tram</option>
                            </select>
                        </label>
                        <label>Number
                            <input type={"number"} min={0} id={"number"} name={"number"}/>
                        </label>
                        <label>Name
                            <input type={"text"} name={"name"} id={"name"}/>
                        </label>
                        <label>Description
                            <textarea name={"description"} id={"description"}
                                      placeholder={"Enter description here (optional)"}/>
                        </label>
                        <input type={"submit"} value={"Create vehicle"}/>
                    </form>
                    :
                    <Redirect to={routes.Login}/>}
            </React.Fragment>
        );
    }


}

export default withRouter(VehicleCreate)