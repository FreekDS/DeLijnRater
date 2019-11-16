import React from 'react'

export const AuthContext =  React.createContext(null);

const withAuthentication = (Component) => {
  class auth extends React.Component {
     constructor(props) {
         super(props);

         this.state = {
             authenticated_user: null
         }
     }
  }
};

export default  withAuthentication;