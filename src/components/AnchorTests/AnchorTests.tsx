/**
 * Test class for Anchor Browser Link.
 * Allows for testing of AnchorBrowserManager
 * Not for production.
 * 
 * Author: Anthony Brochu
 */

import { Box, styled } from "@mui/material";
import AnchorBrowserManager from '../../utils/AnchorBrowserManager';
const { symbol, nameToUint64 } = require('eosjs-account-name');

function performTransactionAddressBook(manager: AnchorBrowserManager){
    try{
      let userName = manager.getAccountName();

      manager.performTransactions([{
        account: 'addressbook',
            name: 'upsert',
            data:{
              user: userName,
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
            user: userName,
            first_name: 'alice',
            last_name: 'liddell',
            age: 25,
            street: '123 drink me way',
            city: 'wonderland',
            state: 'amsterdam'
          }
        }]).catch((err) => {
            alert(err)
        });
  
    } catch(err) {
      alert(err);
    }
}

function performTransactionAtomicAssets(manager: AnchorBrowserManager){
  try{
    let userName = manager.getAccountName();
    let collName = 'nftikanthon5';
    console.log(collName);
    manager.performTransactions([
      {
          account: 'atomicassets',
          name: 'createcol',
          data: {
            author: userName,
            collection_name: collName,
            allow_notify: true,
            authorized_accounts: [userName],
            notify_accounts: [],
            market_fee: 0,
            data: []
          }
      },
      {
        account: 'atomicassets',
        name: 'createschema',
        data: {
          authorized_creator: userName,
          collection_name: collName,
          schema_name: "ticket",
          schema_format: [
            {"name": "name", "type": "string" },
            {"name": "id", "type": "int32" },
            {"name": "date", "type": "string"},
            {"name": "hour", "type": "string"},
            {"name": "locationName", "type": "string"},
            {"name": "eventName", "type": "string"},
            {"name": "rowNo", "type": "string"},
            {"name": "seatNo", "type": "string"}
          ]
        }
      },
       {
        account: 'atomicassets',
        name: 'createtempl',
        data: {
          authorized_creator: userName,
          collection_name: collName,
          schema_name: "ticket",
          transferable: true,
          burnable: true,
          max_supply: 0,
          immutable_data: [
              {"key": "locationName", value: ["string", "Location test"]},
              {"key": "eventName", value: ["string", "Evenement test 93"]}
          ]
        }
      }]).catch((err) => {        
          alert(err)
      });

  } catch(err) {
    alert(err);
  }
}

function AnchorTests() {
    const CssBox = styled(Box)(({ theme }) => ({
        ".home": {
          "&__splashScreen": {
            background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            "&__title": {
              "&__main": {
                color: theme.palette.primary.light,
              },
            },
            "&__featuredEvents": {
              "&__title": {
                color: theme.palette.secondary.light,
              },
            },
          },
          "&__search": {
            "&__title": {
              color: theme.palette.primary.dark,
            },
          },
        },
      }));

    const manager = new AnchorBrowserManager('5d5bbe6bb403e5ca8b087d382946807246b4dee094c7f5961e2bebd88f8c9c51', 'http://eos1.anthonybrochu.com:8888', 'NFTicket');
  
    // Try to restore the session at beginning.
    manager.restoreSession().then((value) => {
      console.log("restored session?: " + value)
    });

    return (
        <CssBox className="home">
            <button onClick={() => manager.login()}>Login</button>
            <button onClick={() => performTransactionAddressBook(manager)}>perform trx addressbook (should work)</button>
            <button onClick={() => performTransactionAtomicAssets(manager)}>perform trx Atomic Assets (not working yet)</button>
            <button onClick={() => manager.logout()}>logout</button>
        </CssBox>
    );
  }
  
  export default AnchorTests;