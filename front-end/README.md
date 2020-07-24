# Synthetic Stock App on Binance Smart Chain

## Play with live demo

You can access the demo at [https://band-bsc-stock-cdp.surge.sh/](https://band-bsc-stock-cdp.surge.sh/)

### Metamask

This application requires that you have Metamask installed on your browser. Please install Metamask to your browser before using the application. See [their website](https://metamask.io/) for more details and instructions on how to install.

### Running the application

Make sure you're running Node version >= 10

```bash
$ node --version
v13.13.0
```

Install the required dependencies

```bash
yarn install
```

Start the local web server

```bash
yarn start
```

## Interaction guide

You'll need some testnet BNB and BUSD to interact with the example. If you don't have any, please navigate to the Binance Smart Chain [faucet]((https://testnet.binance.org/faucet-smart)) to request some.


After running `yarn start`, go to `http://localhost:3000/`. You should see something like the image below

![](https://i.imgur.com/bZ8qceg.png)

Enter your testnet private key or click `Create Account` if you don't have one. Then click on `Login`.

![](https://i.imgur.com/MNUxjOt.png)


Please wait until it finishes loading. If this is the first time you use this app, you will find it takes a while since the app has to send an `approve` transaction to the BUSD contract to allow it to transfer tokens on our behalf.

Once the above process is complete loading is complete, you'll arrive at the main CDP dashboard where you can start interacting with the application.

![](https://i.imgur.com/024AB6i.png)

Let start by locking some BUSD into the StockCDP contract as collatoral.

Click `lock` button and enter the amount of cUSD to be locked

![](https://i.imgur.com/um86OVl.png)


Wait until you see the enterede amount added under the **Collatoral** section.

![](https://i.imgur.com/XE87PJn.png)


Next is to try to create synthetic SPX(S&P500) into the system.

Click `borow` button and enter the amount of SPX to be locked

![](https://i.imgur.com/JYW9rdo.png)

Again, until your Macy token balance has been updated.

![](https://i.imgur.com/JjlpyR9.png)

From here, you can try playing around with other actions in the system and then see what it will happen. Have fun!
