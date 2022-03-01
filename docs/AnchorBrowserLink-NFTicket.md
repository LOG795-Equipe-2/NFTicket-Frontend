w# Anchor Browser Link and NFTicket usage

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

