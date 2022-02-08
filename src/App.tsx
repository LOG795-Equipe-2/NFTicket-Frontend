import React from 'react';
import './App.css';
import AnchorBrowserManager from './utils/AnchorBrowserManager';

function performTransaction(manager: AnchorBrowserManager){
  try{
    manager.performTransactions([{
      account: 'addressbook',
          name: 'upsert',
          data:{
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
}

function App() {
  const manager = new AnchorBrowserManager('184ba45492aeb666274a46d82d7b212c5a79d888b4e4b6da31449765770410bf', 'http://localhost:8888', 'NFTicket');
  
  // Try to restore the session at beginning.
  manager.restoreSession().then((value) => {
    console.log("restored: " + value)
  });
  

  return (
    <div title="NFTicket App" className="App">
      Landing page
      <button onClick={() => manager.login()}>Login</button>
      <button onClick={() => performTransaction(manager)}>Execute Trx test</button>
      <button onClick={() => manager.logout()}>Logout</button>
    </div>
  );
} export default App;
