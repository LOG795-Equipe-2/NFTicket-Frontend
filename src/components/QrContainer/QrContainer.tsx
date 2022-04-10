import { MenuItem, Select } from '@mui/material';
import React, { Component } from 'react';
import { ViewFinder } from './ViewFinder';
import { QrReader } from 'react-qr-reader';

type QrContainerProps = {
    handleScanResult: Function
}

type QrContainerState = {}


class QrContainer extends Component<QrContainerProps, QrContainerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            result: 'Veuillez scanner le code QR',
            devices: []
        }
        this.handleScan = this.handleScan.bind(this);
    }
    handleScan(result: any) {
        this.setState({ result: result });
    }
    render() {
        return (
            <React.Fragment>
                <div>
                    <QrReader
                        ViewFinder={ViewFinder}
                        videoId='videoId'
                        constraints={{ facingMode: 'environment' }}
                        onResult={(result, error) => {
                            if (!!result) {
                                this.props.handleScanResult(result);
                            }
                        }}
                        containerStyle={{ width: '300px' }}
                        videoStyle={{ innerWidth: '300px' }}
                        scanDelay={100}
                    />
                </div>
            </React.Fragment>
        )
    }
}

export default QrContainer;