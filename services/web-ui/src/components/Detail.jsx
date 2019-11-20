import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import {AuthContext} from "./auth/authentication";


class Rater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <AuthContext.Consumer>
                    {auth => auth.user
                        ? <button>jeps</button>
                        : <small>Log in to give a rating!</small>
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
    }

    componentDidMount() {
        const {type} = this.props;
        const {params} = this.props.match;
        console.log(this.props);
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
        const base = process.env.REACT_APP_API_URL;
        // TODO
    }

    getStop(id) {
        const base = process.env.REACT_APP_API_URL;
        axios.get(base + "/entities/stops/id/" + id.toString())
            .then((res) => {
                console.log("Fetched object", res.data);
                this.setState({object: res.data});
            })
            .catch(err => console.error({err}));

        axios.get(base + "/ratings/stops/average/" + id)
            .then((res) => {
                console.log("Fetched rating", res.data);
                this.setState({avg_rating: res.data});
            })
            .catch(err => console.error({err}));
    }

    handle_back_btn() {
        this.props.history.goBack();
    }

    render() {

        const {object, avg_rating} = this.state;

        return (
            <div>
                <button onClick={this.handle_back_btn}>Go back</button>
                {object ?
                    <React.Fragment>
                        <h1>{object.name}</h1>
                        {object.village && <h4>{object.village}</h4>}
                        <p>Rating: {avg_rating ? avg_rating : "NaN"}</p>
                        <Rater object={object}/>
                    </React.Fragment>

                    : <p>loading</p>
                }
            </div>)
    }
}


export default withRouter(Detail);