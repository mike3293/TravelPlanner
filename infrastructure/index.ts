import * as pulumi from '@pulumi/pulumi';
import * as azure from '@pulumi/azure-native';

const dockerUsername = process.env.DOCKER_USERNAME;
const dockerPassword = process.env.DOCKER_PASSWORD;

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
        ],
        alwaysOn: false,
        linuxFxVersion: 'DOCKER|mikhailgorodilov/travel-planner-api:latest',
    },
    httpsOnly: true,
}, { dependsOn: [appServicePlan] });

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
        ],
        alwaysOn: false,
        linuxFxVersion: 'DOCKER|mikhailgorodilov/travel-planner-webapp:latest',
    },
    httpsOnly: true,
}, { dependsOn: [apiApp] });

// Export the URLs of the web apps
export const webappUrl = pulumi.interpolate`https://${webApp.defaultHostName}`;
export const apiUrl = pulumi.interpolate`https://${apiApp.defaultHostName}`;