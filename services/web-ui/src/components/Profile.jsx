import React from "react";


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
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
                        possible numbers to remove
                    </div>
                    <div className={"col"}>
                        remove field
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default Profile;