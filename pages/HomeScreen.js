/*Home Screen With buttons to navigate to diffrent options*/
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Mybutton from './components/Mybutton';
import Mytext from './components/Mytext';
import Realm, {BSON} from 'realm';

const USER_SCHEMA = {
  name: 'user_details',
  properties: {
    _id: "objectId",
    user_id: {type: 'int', default: 0},
    user_name: 'string',
    user_contact: 'string',
    user_address: 'string',
    friend_list: 'array'
  },
  primaryKey: '_id'
};

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      userRealm: null,
      loading: false
    };

    (async () => {
      // login the user
      const {user, realmApp} = await this.doAnonymousLogin();

      // create the realm object to get any data for the user
      const {userData, userRealm} = await this.doSetUpSync(user, realmApp);

      this.setState({
        userData: userData,
        userRealm: userRealm,
        loading: false
      })

      console.log("constructor: ", this.state);
    })();
  }

  async doAnonymousLogin() {
    const appId = 'application-1-yzlvc'; // Set Realm app ID here.
    const appConfig = {
      id: appId,
      timeout: 10000,
    };

    try {
      const realmApp = new Realm.App(appConfig); // pass in the appConfig variable that you created earlier
      // const credentials = Realm.Credentials.anonymous(); // create an anonymous credential
      const credentials = Realm.Credentials.emailPassword('admin@elcateo.com', 'User@321');
      const user = await realmApp.logIn(credentials);
      console.log("After try login: ", user?.id, user?.isLoggedIn);
      return {realmApp, user};
    } catch (error) {
      throw `Error logging in anonymously: ${JSON.stringify(error, null, 2)}`;
    }
  }

  async doSetUpSync(currentUser, realmApp) {
    try {
      console.log(`Logged in with the user: ${currentUser?.id}`);
      const config = {
        schema: [USER_SCHEMA],
        sync: {
          user: currentUser,
          partitionValue: `${currentUser?.id}`
        }
      };

      // open live connection
      const userRealm = await Realm.open(config);
      console.log("userRealm: ", JSON.stringify(userRealm));

      const userData = userRealm.objects('user_details');
      console.log("userData: ", JSON.stringify(userData));

      return {userData, userRealm};
    } catch (error) {
      console.log("Message: ", error.message);
      throw `Error opening realm: ${JSON.stringify(error, null, 2)}`;
    }
  }

  syncData = () => {
    Alert.alert(
      "Sync With Data",
      "Do you want to start ??",
      [
        {
          text: "Yes",
          onPress: this.doSetUpSync
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ]
    );
  }

  startSync = () => {
    console.log("Start Sync");
  }

  render() {
    if(this.state.loading === true) {
      return (<>
        <Text>Loading...</Text>
      </>);
    }

    const {userRealm, userData} = this.state

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          flexDirection: 'column',
        }}>
        <Mytext text="RealM Example" />
        <Mybutton
          title="Register"
          customClick={() => this.props.navigation.navigate('Register', {userRealm, userData})}
        />
        <Mybutton
          title="Update"
          customClick={() => this.props.navigation.navigate('Update', {userRealm, userData})}
        />
        <Mybutton
          title="View"
          customClick={() => this.props.navigation.navigate('View', {userRealm, userData})}
        />
        <Mybutton
          title="View All"
          customClick={() => this.props.navigation.navigate('ViewAll', {userRealm, userData})}
        />
        <Mybutton
          title="Delete"
          customClick={() => this.props.navigation.navigate('Delete', {userRealm, userData})}
        />
        <Mybutton
          title="Sync"
          customClick={this.syncData}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  }
});