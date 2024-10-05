import * as pulumi from '@pulumi/pulumi';
import * as azure from '@pulumi/azure-native';

const dockerUsername = process.env.DOCKER_USERNAME!;
const dockerPassword = process.env.DOCKER_PASSWORD!;
const jwtSecretKey = process.env.API_JWT_SECRET_KEY!;
const accessTokenExpiration = process.env.API_ACCESS_TOKEN_EXPIRATION!;
const refreshTokenExpiration = process.env.API_REFRESH_TOKEN_EXPIRATION!;

// Create Resource Group
const resourceGroup = new azure.resources.ResourceGroup('travel-planner-resource-group');

// Create Cosmos DB account (Mongo API)
const cosmosAccount = new azure.documentdb.DatabaseAccount('travel-planner-db-account', {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    databaseAccountOfferType: 'Standard',
    locations: [{
        locationName: resourceGroup.location,
    }],
    kind: 'MongoDB',
    capabilities: [{
        name: 'EnableMongo',
    }],
    enableFreeTier: true,
});

// Create Cosmos DB Mongo database
const cosmosDb = new azure.documentdb.MongoDBResourceMongoDBDatabase('travel-planner-db', {
    resourceGroupName: resourceGroup.name,
    accountName: cosmosAccount.name,
    databaseName: 'travel-planner-db',
    resource: {
        id: 'travel-planner-db',
    },
}, { dependsOn: [cosmosAccount] });

// Get Cosmos DB connection string
const cosmosConnectionStrings = pulumi.all([resourceGroup.name, cosmosAccount.name]).apply(([resourceGroupName, accountName]) =>
    azure.documentdb.listDatabaseAccountConnectionStrings({ resourceGroupName, accountName }));
const cosmosConnectionString = cosmosConnectionStrings.apply(cs => cs.connectionStrings![0].connectionString);

// Create App Service Plan for web apps
const appServicePlan = new azure.web.AppServicePlan('travel-planner-service-plan', {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    sku: {
        name: 'F1',
        tier: 'Free',
    },
    kind: 'Linux',
    reserved: true,
});

// Define the API app
const apiApp = new azure.web.WebApp('travel-planner-api', {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    serverFarmId: appServicePlan.id,
    siteConfig: {
        appSettings: [
            {
                name: 'DOCKER_REGISTRY_SERVER_URL',
                value: 'https://index.docker.io',
            },
            {
                name: 'DOCKER_REGISTRY_SERVER_USERNAME',
                value: dockerUsername,
            },
            {
                name: 'DOCKER_REGISTRY_SERVER_PASSWORD',
                value: dockerPassword,
            },
            {
                name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE',
                value: 'false',
            },
            {
                name: 'DB_CONNECTION_STRING',
                value: cosmosConnectionString,
            },
        ],
        alwaysOn: false,
        linuxFxVersion: 'DOCKER|mikhailgorodilov/travel-planner-api:latest',
    },
    httpsOnly: true,
}, { dependsOn: [appServicePlan] });

export const apiUrl = pulumi.interpolate`https://${apiApp.defaultHostName}`;

// Define the webapp
const webApp = new azure.web.WebApp('travel-planner-webapp', {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    serverFarmId: appServicePlan.id,
    siteConfig: {
        appSettings: [
            {
                name: 'DOCKER_REGISTRY_SERVER_URL',
                value: 'https://index.docker.io',
            },
            {
                name: 'DOCKER_REGISTRY_SERVER_USERNAME',
                value: dockerUsername,
            },
            {
                name: 'DOCKER_REGISTRY_SERVER_PASSWORD',
                value: dockerPassword,
            },
            {
                name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE',
                value: 'false',
            },
            {
                name: 'REACT_APP_API_URL',
                value: apiUrl,
            }
        ],
        alwaysOn: false,
        linuxFxVersion: 'DOCKER|mikhailgorodilov/travel-planner-webapp:latest',
    },
    httpsOnly: true,
}, { dependsOn: [apiApp] });

// Export the URLs of the web apps
export const webappUrl = pulumi.interpolate`https://${webApp.defaultHostName}`;

const apiAppSettings = new azure.web.WebAppApplicationSettings('travel-planner-api-settings', {
    name: apiApp.name,
    resourceGroupName: resourceGroup.name,
    properties: {
        'DOCKER_REGISTRY_SERVER_URL': 'https://index.docker.io',
        'DOCKER_REGISTRY_SERVER_USERNAME': dockerUsername,
        'DOCKER_REGISTRY_SERVER_PASSWORD': dockerPassword,
        'WEBSITES_ENABLE_APP_SERVICE_STORAGE': 'false',
        'AllowedOrigins__0': webappUrl,
        'ConnectionStrings__MongoDb': cosmosConnectionString,
        'AuthSettings__ValidIssuer': apiUrl,
        'AuthSettings__ValidAudience': webappUrl,
        'AuthSettings__SecretKey': jwtSecretKey,
        'AuthSettings__AccessTokenExpiration': accessTokenExpiration,
        'AuthSettings__RefreshTokenExpiration': refreshTokenExpiration,
    },
}, { dependsOn: [apiApp, webApp] });
