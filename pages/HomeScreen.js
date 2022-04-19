/*Home Screen With buttons to navigate to diffrent options*/
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Mybutton from './components/Mybutton';
import Mytext from './components/Mytext';
import Realm from 'realm';
let realm;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    realm = new Realm({
      path: 'UserDatabase.realm',
      schema: [{
        name: 'user_details',
        properties: {
          user_id: { type: 'int', default: 0 },
          user_name: 'string',
          user_contact: 'string',
          user_address: 'string',
        }
      }],
    });
  }

  syncData = () => {
    console.log("syncData Click");
    Alert.alert(
      "Sync With Data",
      "Do you want to start ??",
      [
        {
          text: "Yes",
          onPress: this.startSync
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
    this.anonymousLogin().then((res) => {
      console.log("Login Res >> ", res);
      this.syncTry(res).then((newRes) => {
        console.log("syncTry Res >> ", newRes);
      });
    });
  }

  async anonymousLogin() {
    let user;
    const appId = 'application-4-scwcu'; // Set Realm app ID here.
    const appConfig = {
      id: appId,
      timeout: 10000,
    };

    try {
      const app = new Realm.App(appConfig); // pass in the appConfig variable that you created earlier
      const credentials = Realm.Credentials.anonymous(); // create an anonymous credential
      // const credentials = Realm.Credentials.emailPassword('admin@elcateo.com', 'User@321'); // create an anonymous credential
      return await app.logIn(credentials);
    } catch (error) {
      throw `Error logging in anonymously: ${JSON.stringify(error, null, 2)}`;
    }
  }

  async syncTry(userRec) {
    var user = userRec;
    var realm;
    try {
      console.log(`Logged in with the user: ${user.identity}`);
      const config = {
        schema: [{
          name: 'user_details',
          properties: {
            _id: 'objectId',
            user_id: 'string',
            user_name: 'string',
            user_contact: 'string',
            user_address: 'string',
          },
          primaryKey: '_id',
        }],
        sync: {
          user: user,
          partitionValue: "user_id",
        },
      };

      // open live connection
      realm = await Realm.open(config);
      // fetch data from live
      let data = realm.objects("user_details");

      // start local connection
      // let realm2 = new Realm({ path: 'UserDatabase.realm' });
      // fetch local data
      // var user_details = realm2.objects('user_details');
      // console.log("Local: ", user_details);

      return data;
    } catch (error) {
      throw `Error opening realm: ${JSON.stringify(error, null, 2)}`;
    }
  }

  render() {
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
          customClick={() => this.props.navigation.navigate('Register')}
        />
        <Mybutton
          title="Update"
          customClick={() => this.props.navigation.navigate('Update')}
        />
        <Mybutton
          title="View"
          customClick={() => this.props.navigation.navigate('View')}
        />
        <Mybutton
          title="View All"
          customClick={() => this.props.navigation.navigate('ViewAll')}
        />
        <Mybutton
          title="Delete"
          customClick={() => this.props.navigation.navigate('Delete')}
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