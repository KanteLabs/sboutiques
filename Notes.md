# Cloud Functions:

- Set Environment Variables
``` firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID" ```

- Access variables in a function
``` functions.config().someservice.id ```

- Get environment variables
``` firebase functions:config:get ```

- Local Runtime variables
``` firebase functions:config:get > .runtimeconfig.json ```