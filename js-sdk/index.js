var QRCode = require('qrcode');
const HS_EVENTS_ENUM = {
  ERROR: 'studio-error',
  SUCCESS: 'studio-success',
  WAITING: 'studio-wait',
  
};

/**
 * Checks if browser support WebSocket
 * @returns Boolean
 */
function checkForEventSourceSupport() {
  if (!window.EventSource) {
    return false;
  }
  return true;
}

function dispatchEvent(eventType, message) {
  document.dispatchEvent(
    new CustomEvent(eventType, {
      detail: message,
      bubbles: true,
    })
  );
}

 function initiateEventSource({ hsWalletBaseURL, eventSourceURL, hsLoginBtnDOM, hsLoginQRDOM, hsloginBtnText }) {
  const source = new EventSource(eventSourceURL);
  source.onopen = () => {
    console.log('Connections to the server established');
  };

  source.onmessage = async (e) => {
    if (e.data) {
      try {
        const dataParsed = JSON.parse(e.data);
        if (dataParsed) {
          if (dataParsed.op === 'init') {
            formQRAndButtonHTML({
              hsWalletBaseURL,
              hsLoginBtnDOM,
              hsLoginQRDOM,
              qrDataStr: JSON.stringify(dataParsed.data),
              hsloginBtnText,
            });
          } else if (dataParsed.op === 'end') {
            dispatchEvent(HS_EVENTS_ENUM.SUCCESS, dataParsed.message);        
            source.close();
          } else if (dataParsed.op === 'processing') {
            dispatchEvent(HS_EVENTS_ENUM.WAITING, dataParsed.message);
          } else {
            dispatchEvent(HS_EVENTS_ENUM.ERROR, 'Invalid operation from studio server');
          }
        }
      } catch (e) {
        dispatchEvent(HS_EVENTS_ENUM.ERROR, e.message);
      }
    }
  };

  source.onerror = (e) => {
    dispatchEvent(HS_EVENTS_ENUM.ERROR, e.message);
  };
}

/**
 * Displays QRCode and Login Button
 * @param {*} param0
 */
function formQRAndButtonHTML({ hsWalletBaseURL, hsLoginBtnDOM, hsLoginQRDOM, qrDataStr, hsloginBtnText }) {
  // Display the Login Button
  if (hsLoginBtnDOM) {
    const weblink = encodeURI(hsWalletBaseURL + 'deeplink?url=' + qrDataStr);
    hsLoginBtnDOM.innerHTML = `<button onclick="window.open('${weblink}', 'popUpWindow','height=800,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');">${hsloginBtnText}</button>`;
  }

  // TODO: Display the QR code to use with mobile app
  if (hsLoginQRDOM) {
    // display QR cod
    QRCode.toCanvas(hsLoginQRDOM, qrDataStr, function (error) {
      if (error) throw new Error(error);
    });
  }
}

function sanitizeURL(url) {
  if (url) {
    if (url.endsWith('/')) {
      return url;
    } else {
      return url + '/';
    }
  }
}


// }
/**
 * Starts the program
 * @returns void
 */
function start() {
  try {
    if (!checkForEventSourceSupport()) {
      throw new Error(
        'Your browser does not support EventSource (https://developer.mozilla.org/en-US/docs/Web/API/EventSource). Try different browser'
      );
    }

    let options = {
      LOGIN_BUTTON_TEXT: document.currentScript.getAttribute('data-button-text')
        ? document.currentScript.getAttribute('data-button-text')
        : 'Credential',
      HS_WALLET_BASEURL: document.currentScript.getAttribute('data-hs-wallet-base-url'),
      PRESENTATION_REQUEST_EP: document.currentScript.getAttribute('data-presentation-request-endpoint'),
      PRESENTATION_TEMPLATE_ID: document.currentScript.getAttribute('data-presentation-template-id'),
    };

    const hsLoginBtnDOM = document.getElementById('studio-btn');
    const hsLoginQRDOM = document.getElementById('studio-qr');

    if (!hsLoginBtnDOM && !hsLoginQRDOM) {
      throw new Error("No DOM Element Found With Id 'hs-auth-btn' or 'hs-auth-qr'");
    }

    if (!options.PRESENTATION_REQUEST_EP) {
      throw new Error("Presentation Request resource must be passed in attribtue 'data-presentation-request-endpoint'");
    }

    if (!options.PRESENTATION_TEMPLATE_ID) {
      throw new Error("Presentation template ID must be passed in attribtue 'data-presentation-template-id'");
    }

    const sanitizedPRuRL = sanitizeURL(options.PRESENTATION_REQUEST_EP);
    const eventSourceURL = sanitizedPRuRL + options.PRESENTATION_TEMPLATE_ID;
    const sanitizedWalletURL = sanitizeURL(options.HS_WALLET_BASEURL);
    initiateEventSource({
      hsWalletBaseURL: sanitizedWalletURL,
      eventSourceURL,
      hsLoginBtnDOM,
      hsLoginQRDOM,
      hsloginBtnText: options.LOGIN_BUTTON_TEXT,
    });
  } catch (e) {
    console.error(e.message);
  }
}

start();
