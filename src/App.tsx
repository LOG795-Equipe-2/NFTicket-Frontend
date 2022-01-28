import React from 'react';
import './App.css';
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'

function App() {
  const transport = new AnchorLinkBrowserTransport()
  const link = new AnchorLink({transport, chains: [
    {
        chainId: '184ba45492aeb666274a46d82d7b212c5a79d888b4e4b6da31449765770410bf',
        nodeUrl: 'http://localhost:8888',
    }
  ]})

  console.log(link);

  return (
    <div title="NFTicket App" className="App">
      Landing page
    </div>
  );
}

export default App;
