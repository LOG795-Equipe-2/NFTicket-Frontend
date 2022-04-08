import { Html5QrcodeScanner } from "html5-qrcode";
import React from "react";

const qrcodeRegionId = "html5qr-code-full-region";

type Html5QrCodePluginProps = {
    qrCodeSuccessCallback: Function
};
type Html5QrCodePluginState = {
};

class Html5QrcodePlugin extends React.Component<
  Html5QrCodePluginProps,
  Html5QrCodePluginState
> {
  html5QrcodeScanner: any = {};
  render() {
    return <div id={qrcodeRegionId} />;
  }

  componentWillUnmount() {
    this.html5QrcodeScanner.clear();
  }

  componentDidMount() {
    // Creates the configuration object for Html5QrcodeScanner.
    const props: any = this.props;
    function createConfig(props: any) {
      var config: any = {};
      if (props.fps) {
        config.fps = props.fps;
      }
      if (props.qrbox) {
        config.qrbox = props.qrbox;
      }
      if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
      }
      if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
      }
      return config;
    }

    var config = createConfig(this.props);
    var verbose = props.verbose === true;

    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }

    this.html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    this.html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );
  }
}

export default Html5QrcodePlugin;
