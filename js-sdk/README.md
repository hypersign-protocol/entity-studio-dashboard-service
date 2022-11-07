# Entity Studio Javascript Frontend SDK

## Step1: Create a DOM with id `studio-btn` or `studio-qr` or both

You can eiter render a button or QR code or both.

```html
<div id="studio-btn"></div>
```

```html
<canvas id="studio-qr"></canvas>
```

## Step2: Add appropriate script

```js
<script
  type="module"
  src="https://cdn.jsdelivr.net/gh/hypersign-protocol/studio@implement-org/js-sdk/build/index.js"
  data-button-text="Present Presentation" // Inner text of the button
  data-hs-wallet-base-url="https://wallet-stage.hypersign.id" // Identity Wallet URL
  data-presentation-request-endpoint="https://stage.hypermine.in/studioserver/api/v1/presentation/request/" // Presentation request endpoint; See Entity Studio API documentation
  data-presentation-template-id="631ad7e31a837bfc1cba2338" // Presentation template Id, generated on Entity Studio dashboard
></script>
```

## Step3: Listen to Events

We expose three events for clients to listen; `studio-success`, `studio-wait`, `studio-error`

### Step3.1: studio-success

```js
// Once the user present his credential and the credential is verified at the studio server.
document.addEventListener('studio-success', function (e) {
  const { status, accessToken }= e.detail
});
//Here you have got status and accessToken. You can use this accessToken to call our api to get the data.
```
see the API Documentation [here](https://github.com/hypersign-protocol/studio/issues/135)

### Step3.2: studio-wait

```js
// Meanwhile waiting for user to present his credential
document.addEventListener('studio-wait', function (e) {
  console.log(e.detail);
});
```

### Step3.3: studio-error

```js
// Incase of any error
document.addEventListener('studio-error', function (e) {
  console.error(e.detail);
});
```

See the [demo](../js-sdk/demo/public/index.html) implmentation for more details.

## Installation

```sh
npm i
```

## Build the project

```sh
npm run build
```

Add build file in your public folder as done [here](../js-sdk/demo/public)

Note: Make sure you have used `http://localhost:1234` in domain name while creating organisation.
