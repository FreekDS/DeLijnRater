import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import {AuthContext} from "./auth/authentication";
import * as routes from './routing/routes'
import {MDBDataTable} from 'mdbreact';
import '../style/rater.css'
import '../assets/location.png'


const Rating = (props) => {

    const rating_color = (rating) => {

        if (isNaN(rating) || rating < 0) {
            console.log("hier");
            return "";
        }

        if (rating < 4) {
            return "rating-worst";
        } else if (rating <= 6.5) {
            return "rating-medium";
        } else {
            return "rating-good";
        }
    };

    return (
        <React.Fragment>
            {
                <span className={"rating " + rating_color(props.rating)}>{props.rating}</span>
            }
        </React.Fragment>
    )
};


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

        let url = String();
        if (this.props.type === "stop")
            url = "/ratings/stops/rating";
        if (this.props.type === "vehicle")
            url = "/ratings/vehicles/rating";

        const rating = event.target.rating.value;
        const object_id = event.target.object.value;
        const user_id = event.target.user.value;

        const params = {
            "entity_id": object_id,
            "created_by": user_id,
            "rating": rating
        };

        const base = process.env.REACT_APP_API_URL;
        axios.post(base + url, params)
            .then(() => this.props.update(object_id))
            .catch(err => console.error({err}));

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
                            <div className={"rate-form"}>
                                <h6>Give rating: {current}</h6>
                                <form onSubmit={(event => this.handle_rate_submit(event))}>
                                    <input type={"hidden"} value={this.props.object.id} id={"object"} name={"object"}/>
                                    <input type={"hidden"} value={auth.user.id} id={"user"} name={"user"}/>
                                    <input type={"range"} min={0} max={10} className={"slider form-control"}
                                           id={"rating"} step={0.5}
                                           name={"rating"}
                                           onChange={this.handle_change} defaultValue={5}
                                    />
                                    <div className={"text-center"}>
                                        <input className={"btn btn-primary btn-sm"} type={"submit"}
                                               value={"Rate " + this.props.type}/>
                                    </div>
                                </form>
                            </div>
                        </React.Fragment>
                        : <small><a href={routes.Login}>Log in</a> to give a rating!</small>
                    }
                </AuthContext.Consumer>
            </React.Fragment>
        );
    }

}

class UserRatings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: null,
            rows: null
        }
    }

    componentDidMount() {
        this.initializeColumns();
        this.updateRows();
    }

    initializeColumns() {
        const columns = [
            {
                label: "User name",
                sort: "asc",
                field: "user"
            },
            {
                label: "Rating",
                sort: "asc",
                field: "rate"
            }
        ];
        this.setState({columns});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            if (this.props.update === true)
                this.updateRows()
        }
    }

    updateRows() {
        const base = process.env.REACT_APP_API_URL;
        const {id} = this.props.object;
        let url = String();
        if (this.props.type === "stop")
            url = "/ratings/stops/rating/";
        if (this.props.type === "vehicle")
            url = "/ratings/vehicles/rating/";

        axios.get(base + url + id)
            .then(
                res => {
                    this.addUserNames(res.data);
                }
            )
            .catch(err => console.error({err}));

    }

    addUserNames(array) {
        const base = process.env.REACT_APP_API_URL;
        let rows = [];
        let promises = [];
        array.forEach(obj => {
            promises.push(axios.get(base + "/users/get/" + obj.created_by)
                .then(res => {
                    rows.push(
                        {
                            'rate': <Rating rating={obj.rating.toFixed(1)}/>,
                            'user': res.data.name
                        }
                    )
                })
                .catch(err => console.error({err}))
            );
        });
        Promise.all(promises).then(() => {
            this.setState({rows})
        })
            .catch(err => console.error({err}));
    }


    render() {

        const {rows, columns} = this.state;
        const loading = !rows || !columns;

        const data = {
            rows,
            columns
        };

        let no_data = true;
        if (!loading && data.rows.length > 0) {
            no_data = false;
        }

        return (
            <React.Fragment>
                {loading
                    ? <p>Loading...</p>
                    : (no_data ? <small/>
                        : < MDBDataTable
                            data={data}
                            paging={false}
                            noBottomColumns={true}
                            hover={true}
                            searching={false}
                            sortable={false}
                        />)

                }
            </React.Fragment>);
    }
}


class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            object: null,
            avg_rating: -1,
            require_update: true
        };

        this.handle_back_btn = this.handle_back_btn.bind(this);
        this.getStop = this.getStop.bind(this);
        this.updateRating = this.updateRating.bind(this);
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
            this.getVehicle(params.id)
    }

    getStop(id) {
        const base = process.env.REACT_APP_API_URL;
        axios.get(base + "/entities/stops/id/" + id.toString())
            .then((res) => {
                this.setState({object: res.data});
            })
            .catch(err => console.error({err}));

        this.updateRating(id);
    }

    getVehicle(id) {
        //const base = process.env.REACT_APP_API_URL;
        const base = process.env.REACT_APP_API_URL;
        axios.get(base + "/entities/vehicles/id/" + id)
            .then(
                res => {
                    this.setState({object: res.data})
                }
            )
            .catch(res => console.error({res}));

        this.updateRating(id);
    }

    updateRating(id) {
        this.setState({require_update: true});
        const base = process.env.REACT_APP_API_URL;
        const {type} = this.props;
        let url = String();
        if (type === "stop")
            url = "/ratings/stops/average/";
        if (type === "vehicle")
            url = "/ratings/vehicles/average/";
        axios.get(base + url + id)
            .then((res) => {
                this.setState({avg_rating: res.data, require_update: false});
            })
            .catch(err => console.error({err}));
    }


    handle_back_btn() {
        this.props.history.goBack();
    }

    render() {

        const {object, type, require_update} = this.state;
        let {avg_rating} = this.state;

        if (typeof (avg_rating) !== typeof (10)) {
            avg_rating = null;
        }

        return (
            <div>
                <button className={"back-btn"} onClick={this.handle_back_btn}>&laquo; Back</button>
                {object ?
                    <React.Fragment>
                        <h1>{object.name}</h1>
                        {object.village && <h4 className={"object-subtitle"}>{object.village}</h4>}
                        {type === "vehicle" && <h4>{object.type}</h4>}
                        <hr className={"object-underline"}/>
                        {type === "vehicle" &&
                        <React.Fragment>
                            <h5>Description:</h5>
                            <p className={"vehicle-desc"}>{object.description}</p>
                            <hr />
                        </React.Fragment>}
                        <p>Rating: {avg_rating ? <Rating rating={avg_rating.toFixed(1)}/> : "not rated yet"}</p>
                        <Rater object={object} type={type} update={this.updateRating}/>
                        <UserRatings object={object} type={type} update={require_update}/>
                    </React.Fragment>

                    : <p>loading</p>
                }
            </div>)
    }
}


export default withRouter(Detail);