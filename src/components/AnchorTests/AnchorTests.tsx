/**
 * Test class for Anchor Browser Link.
 * Allows for testing of AnchorBrowserManager
 * Not for production.
 * 
 * Author: Anthony Brochu
 */

import { Box, styled } from "@mui/material";
import { AnchorBrowserManager } from '../../utils/AnchorBrowserManager';
import NFTicketTransactionService from '../../services/NFTicketTransactionService';
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
    let collName = 'nftikanthoth';
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
      },
        {
          account: 'atomicassets',
          name: 'mintasset',
          data: {
            authorized_minter: userName,
            collection_name: collName,
            schema_name: "ticket",
            template_id: 6,
            new_asset_owner: userName,
            immutable_data: [
                {"key": "name", "value": ["string", "ticket.name"]},
                {"key": "date", "value": ["string", "ticket.date"]},
                {"key": "hour", "value": ["string", "ticket.hour"]},
                {"key": "rowNo", "value": ["string", "ticket.rowNo"]},
                {"key": "seatNo", "value": ["string", "ticket.seatNo"]}
            ],
            mutable_data: [],
            tokens_to_back: []
          }
        }
    ]).catch((err) => {        
          alert(err)
      });

  } catch(err) {
    alert(err);
  }
}

async function connectToBackend(){
  let service = new NFTicketTransactionService('http://localhost:3000')
  await service.init()
  return service
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

      let serviceNFT: NFTicketTransactionService
      connectToBackend().then((service) => {
          // Try to restore the session at beginning.
          service.getManager().restoreSession().then((value) => {
            console.log("restored session?: " + value)
          })
          serviceNFT = service
          console.log(serviceNFT.getManager())
      });
  

    return (
        <CssBox className="home">
            <button onClick={() => connectToBackend()}>Connect to backend</button>

            <button onClick={() => serviceNFT.getManager().login()}>Login</button>
            <button onClick={() => performTransactionAddressBook(serviceNFT.getManager())}>perform trx addressbook (should work)</button>
            <button onClick={() => performTransactionAtomicAssets(serviceNFT.getManager())}>perform trx Atomic Assets (not working yet)</button>
            <button onClick={() => serviceNFT.getManager().logout()}>logout</button>
        </CssBox>
    );
  }
  
  export default AnchorTests;