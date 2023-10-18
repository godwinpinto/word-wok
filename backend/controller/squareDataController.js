const express = require('express')
const router = express.Router();
const { ApiError, Client, Environment } = require('square');
const { v4: uuidv4 } = require('uuid');

const { PORT, SQ_ENVIRONMENT, SQ_APPLICATION_ID, SQ_APPLICATION_SECRET } = process.env;
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



router.get('/dashboard', async (req, res) => {
    const accessToken = req.cookies.accessToken;

    const responseData = {
        "status": "ok"
    }

    try {

        const config = {
            accessToken,
            environment: environment,
            userAgentDetail: "sample_app_node_bookings" // Remove or replace this detail when building your own app
        };

        const {
            catalogApi,
        } = new Client(config);
        const response = await catalogApi.listCatalog(undefined, 'ITEM');
        responseData.data = response.result
    } catch (error) {
        console.log(error);
    }

    res.json({ responseData });
})



router.post('/update-item', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const responseData = {
        "status": "ok"
    }

    const content=req.body;

    if(!content){
        responseData.status = "error"
        responseData.error = "content cannot be empty"
        res.json({ responseData });
        return
    }

    try {

        const config = {
            accessToken,
            environment: environment,
            userAgentDetail: "sample_app_node_bookings" // Remove or replace this detail when building your own app
        };

        const {
            catalogApi,
        } = new Client(config);
        
        const randomUuid = uuidv4();

        const responseUpdate = await catalogApi.upsertCatalogObject({
            idempotencyKey: randomUuid,
            object: {
                type: 'ITEM',
                version: content.version,
                id: content.id,
                itemData: content.itemData
            }
        });

        responseData.data = responseUpdate
    } catch (error) {

        responseData.status = "error"
        responseData.error = error.message
        console.log(error);
    }

    res.json({ responseData });
})






router.get('/merchant-details', async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const responseData = {
        "status": "ok"
    }

    try {

        const config = {
            accessToken,
            environment: environment,
            userAgentDetail: "sample_app_node_bookings" // Remove or replace this detail when building your own app
        };
        const {
            merchantsApi,
        } = new Client(config);
        const response = await merchantsApi.retrieveMerchant('me');
        responseData.data = response.result
    } catch (error) {
        console.log(error);
    }

    res.json({ responseData });
})

module.exports = router;