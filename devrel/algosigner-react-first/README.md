# Simple React Examples Using AlgoSigner

This example is forked from [fabrice102](https://github.com/fabrice102/algosigner-dapp-react-example). Thanks!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It shows some
simple React examples using AlgoSigner. For more examples using AlgoSigner,
see https://purestake.github.io/algosigner-dapp-example.

## Run the App

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

You need to have
the [AlgoSigner Chrome extension](https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm)
installed.

## Understanding the Code

1. The interesting part is in the file [src/App.js](src/App.js).
2. Note that contrary to https://purestake.github.io/algosigner-dapp-example, we use `async/await` to process the
   results of AlgoSigner. Using the `.then/.catch` would also be possible.
3. The ESLint in [package.json](package.json) configuration has been changed to include `no-undef`, hence the top
   comment in `App.js` (`/* global AlgoSigner */`) to tell ESLint that the `AlgoSigner` global element exists.
4. The project uses [Semantic UI React](https://react.semantic-ui.com/). It was installed
   using `yarn add semantic-ui-react semantic-ui-css` and adding `import 'semantic-ui-css/semantic.min.css';`
   to [src/index.js](src/index.js).
5. Use `bash` to switch between additional examples: `$ cp src/2-App.js src/App.js`

## Known Issues

You may see a warning about `findDOMNode` being deprecated in `StrictMode`, most likely because
of https://github.com/Semantic-Org/Semantic-UI-React/issues/3819.

## Learn More about Create React App

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
