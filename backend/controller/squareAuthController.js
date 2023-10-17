
const express = require('express')
const md5 = require('md5');
const { ApiError, Client, Environment } = require('square');
const messages = require('../messages');
const dotenv = require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const { PORT, SQ_ENVIRONMENT, SQ_APPLICATION_ID, SQ_APPLICATION_SECRET,PARENT_DOMAIN } = process.env;
let basePath;
let environment;
if (SQ_ENVIRONMENT.toLowerCase() === "production") {
    basePath = `https://connect.squareup.com`;
    environment = Environment.Production;
} else if (SQ_ENVIRONMENT.toLowerCase() === "sandbox") {
    basePath = `https://connect.squareupsandbox.com`;
    environment = Environment.Sandbox;
} else {
    console.warn('Unsupported value for SQ_ENVIRONMENT in .env file.');
    process.exit(1);
}

const squareClient = new Client({
    environment: environment,
    userAgentDetail: "sample_app_oauth_node" // Remove or replace this detail when building your own app
});

const oauthInstance = squareClient.oAuthApi;



router.get("/request_token", (req, res) => {
    var state = md5(Date.now())

    // INCLUDE PERMISSIONS YOU WANT YOUR SELLER TO GRANT YOUR APPLICATION
    const scopes = [
        "ITEMS_READ",
        "ITEMS_WRITE",
        "MERCHANT_PROFILE_READ",
    ];

    var url = basePath + `/oauth2/authorize?client_id=${process.env.SQ_APPLICATION_ID}&` + `response_type=code&` + `scope=${scopes.join('+')}` + `&state=` + state
    const response = {
        "status": "ok",
        "url": url
    }
    res.cookie("Auth_State", state, { expire: Date.now() + 300000,domain:PARENT_DOMAIN })
    res.json({ response });
});


router.get('/callback', async (req, res) => {
    console.log(req.query);
    // Verify the state to protect against cross-site request forgery.
    if (req.cookies["Auth_State"] !== req.query['state']) {
        content = messages.displayStateError();
        const response = {
            "status": "error",
            "data": content
        }
        res.json({ response });
        return
    }

    else if (req.query['error']) {
        // Check to see if the seller clicked the Deny button and handle it as a special case.
        if (("access_denied" === req.query['error']) && ("user_denied" === req.query["error_description"])) {
            const response = {
                "status": "error",
                "data": "You chose to deny access to the app."
            }
            res.json({ response });

            return
        }
        // Display the error and description for all other errors.
        else {
            content = messages.displayError(req.query["error"], req.query["error_description"])
            const response = {
                "status": "error",
                "data": content
            }
            res.json({ response });
            return
        }
    }
    // When the response_type is "code", the seller clicked Allow
    // and the authorization page returned the auth tokens.
    else if ("code" === req.query["response_type"]) {
        // Extract the returned authorization code from the URL
        var { code } = req.query;

        try {
            let { result } = await oauthInstance.obtainToken({
                // Provide the code in a request to the Obtain Token endpoint
                code,
                clientId: process.env.SQ_APPLICATION_ID,
                clientSecret: process.env.SQ_APPLICATION_SECRET,
                grantType: 'authorization_code'
            });

            let {
                // Extract the returned access token from the ObtainTokenResponse object
                accessToken,
                refreshToken,
                expiresAt,
                merchantId
            } = result;

            // Because we want to keep things simple and we're using Sandbox,
            // we call a function that writes the tokens to the page so we can easily copy and use them directly.
            // In production, you should never write tokens to the page. You should encrypt the tokens and handle them securely.
            content = messages.writeTokensOnSuccess(accessToken, refreshToken, expiresAt, merchantId)
            res.clearCookie('Auth_State', {domain:PARENT_DOMAIN});
            res.cookie("accessToken", accessToken, { expire: expiresAt, domain:PARENT_DOMAIN })

            res.redirect(process.env.UI_REDIRECT_URL)
            //            res.json({ response });
            return


        } catch (error) {
            // The response from the Obtain Token endpoint did not include an access token. Something went wrong.
            if (error instanceof ApiError) {
                content = messages.displayError('Exception', JSON.stringify(error.result))
                const response = {
                    "status": "error",
                    "data": content
                }
                res.json({ response });
                return
            } else {
                content = messages.displayError('Exception', JSON.stringify(error))
                const response = {
                    "status": "error",
                    "data": content
                }
                res.json({ response });
                return
            }
        }
    }
    else {
        // No recognizable parameters were returned.
        content = messages.displayError("Unknown parameters", "Expected parameters were not returned")
        res.render('base', {
            content: content
        });
    }
});


router.get("/logout", (req, res) => {
    const response={status:"ok"}
    res.clearCookie('accessToken', {domain:PARENT_DOMAIN});
    res.json({ response });
});

module.exports = router;