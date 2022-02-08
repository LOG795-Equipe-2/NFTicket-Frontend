
# NFTicket-Frontend

Front-end repository for NFTicket

## Using the AnchorBrowserManager class

The AnchorBrowserManager class is a utility class that has many helper function for connecting with Anchor. Here is a little examples on how to use it.

**The manager instance should be stored in the state of the app**

### Create the manager

```tsx
const manager = new AnchorBrowserManager('a chain id', 'http://localhost:8888', 'NFTicket');
```

### Restore a session

You should try to restore a session before allowing a user to log in.

```tsx
  // Try to restore the session at beginning.
  manager.restoreSession().then((value) => {
    console.log("restored: " + value)
  });
```

### Login

```tsx
  manager.login()
```

To know if the user is logged or not:

```tsx
    manager.isUserLogged()
```

### Logout

```tsx
  manager.logout()
```

### Performing multiple transactions

The transaction is automatically signed by the manager.

```tsx
  try{
    manager.performTransactions([{
      account: 'addressbook', //Name of the contract
          name: 'upsert', //Name of the action
          data:{ //Data as JSON to pass
            user: 'alice',
            first_name: 'alice',
            last_name: 'liddell',
            age: 24,
            street: '123 drink me way',
            city: 'wonderland',
            state: 'amsterdam'
        }
      }, {
        account: 'addressbook',
        name: 'upsert',
        data:{
          user: 'alice',
          first_name: 'alice',
          last_name: 'liddell',
          age: 25,
          street: '123 drink me way',
          city: 'wonderland',
          state: 'amsterdam'
        }
      }]);

  } catch(err) {
    alert(err);
  }
```


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
