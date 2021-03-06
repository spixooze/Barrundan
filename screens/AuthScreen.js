import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import {
  facebookLogin,
  barrundanCreateUser,
  removeToken,
  registerForPushNotificationsAsync
} from '../actions/auth_actions'

class AuthScreen extends Component {
  async componentDidMount() {
    await this.props.facebookLogin()
    this.onAuthComplete(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.onAuthComplete(nextProps)
  }
  async onAuthComplete(props) {
    // finns både facebook token och jwt så är vi välkomna in
    // annars måste vi skapa användaren i barrundan API
    // så vi kollar först om ett JWT token finns

    if (props.token && !props.jwt) {
      console.log('Calling barrundanCreateUser')
      await this.props.barrundanCreateUser()
    } else if (props.token && props.jwt) {
      await this.props.registerForPushNotificationsAsync(props.user._id)
      this.props.navigation.navigate('main')
    } else if (!props.token) {
      await this.props.facebookLogin()
      this.onAuthComplete(props)
    }
  }
  render() {
    return <View />
  }
}

function mapStateToProps({ auth }) {
  return { token: auth.token, jwt: auth.jwt, user: auth.user }
}
export default connect(mapStateToProps, {
  facebookLogin,
  barrundanCreateUser,
  removeToken,
  registerForPushNotificationsAsync
})(AuthScreen)
