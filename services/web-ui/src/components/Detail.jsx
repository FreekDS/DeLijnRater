import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import {AuthContext} from "./auth/authentication";
import * as routes from './routing/routes'


class Rater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 5
        };

        this.handle_change = this.handle_change.bind(this);
        this.handle_rate_submit = this.handle_rate_submit.bind(this);
    }

    handle_rate_submit(event) {
        event.preventDefault();

        if(this.props.type === "stop") {
            const rating = event.target.rating.value;
            const object_id = event.target.object.value;
            const user_id = event.target.user.value;

            const params = {
                "stop_id": object_id,
                "created_by": user_id,
                "rating": rating
            };
            const base = process.env.REACT_APP_API_URL;
            axios.post(base + "/ratings/stops/rating", params)
                .catch(err => console.error({err}));

            this.props.update(object_id);
        }
    }

    handle_change(event) {
        this.setState({current: event.target.value});
    }

    render() {
        const {current} = this.state;
        return (
            <React.Fragment>
                <AuthContext.Consumer>
                    {auth => auth.user
                        ? <React.Fragment>
                            <div>Rate {current}</div>
                            <form onSubmit={(event => this.handle_rate_submit(event))}>
                                <input type={"hidden"} value={this.props.object.id} id={"object"} name={"object"}/>
                                <input type={"hidden"} value={auth.user.id} id={"user"} name={"user"}/>
                                <input type={"range"} min={0} max={10} className={"slider"} id={"rating"} step={0.5} name={"rating"}
                                       onChange={this.handle_change} defaultValue={5}
                                />
                                <input type={"submit"} value={"Rate " + this.props.type}/>
                            </form>
                        </React.Fragment>
                        : <small><a href={routes.Login}>Log in</a> to give a rating!</small>
                    }
                </AuthContext.Consumer>
            </React.Fragment>
        );
    }

}


class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            object: null,
            avg_rating: -1
        };

        this.handle_back_btn = this.handle_back_btn.bind(this);
        this.getStop = this.getStop.bind(this);
    }

    componentDidMount() {
        const {type} = this.props;
        const {params} = this.props.match;
        this.setState({type});
        this.getObject(type, params);
    }

    getObject(type, params) {
        if (type === "stop") {
            this.getStop(params.id);
        }
        if (type === "vehicle")
            this.getVehicle(params.id, params.type)
    }

    getVehicle(id, type) {
        //const base = process.env.REACT_APP_API_URL;
        // TODO
    }

    getStop(id) {
        const base = process.env.REACT_APP_API_URL;
        axios.get(base + "/entities/stops/id/" + id.toString())
            .then((res) => {
                this.setState({object: res.data});
            })
            .catch(err => console.error({err}));

        axios.get(base + "/ratings/stops/average/" + id)
            .then((res) => {
                this.setState({avg_rating: res.data});
            })
            .catch(err => console.error({err}));
    }


    handle_back_btn() {
        this.props.history.goBack();
    }

    render() {

        const {object, avg_rating, type} = this.state;

        return (
            <div>
                <button onClick={this.handle_back_btn}>Go back</button>
                {object ?
                    <React.Fragment>
                        <h1>{object.name}</h1>
                        {object.village && <h4>{object.village}</h4>}
                        <p>Rating: {avg_rating ? avg_rating : "NaN"}</p>
                        <Rater object={object} type={type} update={this.getStop}/>
                    </React.Fragment>

                    : <p>loading</p>
                }
            </div>)
    }
}


export default withRouter(Detail);