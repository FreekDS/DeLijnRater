import React from "react";
import axios from 'axios'
import {withRouter} from 'react-router-dom'

export const VehicleCreate = withRouter((props) => {

        const submit = (event) => {
            event.preventDefault();
            const id = event.target.id.value;
            const type = event.target.type.value;
            const number = event.target.number.value;
            const name = event.target.name.value;
            const description = event.target.description.value;
            const user_id = props.authenticated_user.id;
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
                    console.log("Created vehicle", res.data)
                })
                .catch(err => console.error({err}));
        };


        return <React.Fragment>
            <form onSubmit={event => submit(event)}>
                <label>Unique identifier
                    <input type={"number"} min={0} id={"id"} name={"id"}/>
                </label>
                <label>Type
                    <select name={"type"} id={"type"}>
                        <option value={"Bus"}/>
                        <option value={"Tram"}/>
                    </select>
                </label>
                <label>Number
                    <input type={"number"} min={0} id={"number"} name={"number"}/>
                </label>
                <label>Name
                    <input type={"text"} name={"name"} id={"name"}/>
                </label>
                <label>Description
                    <textarea name={"description"} id={"description"} placeholder={"Enter description here (optional)"}/>
                </label>
                <input type={"submit"} value={"Create vehicle"}/>
            </form>
        </React.Fragment>
    }
);