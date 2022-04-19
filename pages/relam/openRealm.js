import Realm from 'realm';
async function openRealm() {
  let user;
  let realm;
  try {
    // ...
    console.log(`Logged in with the user: ${user.identity}`);
    const config = {
      schema: [Task.schema],
      sync: {
        user: user,
        partitionValue: "myPartition",
      },
    };

    realm = await Realm.open(config);
  } catch (error) {
      throw `Error opening realm: ${JSON.stringify(error,null,2)}`;
  }
}