# InteractionAPI-v2
This is the new version of my Interaction API designed for automating Discord slash commands in JavaScript, rebuilt from the ground up. This version is made to be less confusing and more reliable than the previous version, completely abandoning all library dependencies and webserver hosting. As always, use this tool at your own risk. Discord does not tolerate self-bots, and getting caught will likely result in your Discord account being banned.

If you wish to check out the original version, [click here](https://github.com/KaliyaAlkaline/InteractionAPI). However, I strongly recommend using this version.

## Changes
This is a complete rebuild of the original API, so this version shares none of the same source code as the original. However, the functionality is essentially the same. Here is a list of changes that make this version differ from the old one:
- There are no longer any external dependencies.
- All XMLHttp requests are updated to fetch requests.
- The API is now an npm package instead of a server, so the API itself can only be used in NodeJS. However, creating your own server that uses the API is still an option.
- Optimized compression was added for caching, offering even better compression than GZip.
- Both a remove and clear function were added for cache management, allowing the ability to clear individual entries or wipe the cache entirely.
- Keys are now represented using a cryptographically secure UUID.

## System Requirements
- NodeJS installed on your machine (npm included).

## Setup Instructions
1. If you do not yet have a project folder set up, create one and navigate to it using your machine's command line tool.
2. To install the API to your current project folder, run this command: `npm i interaction-api`
3. To include the package in your code, add this line at the beginning: `const API = require("interaction-api")`

## Commands
#### API.cache(data)
```js
const API = require("interaction-api")

API.cache({"type":2,"application_id":"1157319244829167667","guild_id":"1157315096872235139","channel_id":"1157315096872235142","session_id":"e835fdb99370bab56ff3f4dda56e286e","data":{"version":"1157322861548159058","id":"1157322861548159057","name":"test","type":1,"options":[],"application_command":{"id":"1157322861548159057","application_id":"1157319244829167667","version":"1157322861548159058","default_member_permissions":null,"type":1,"nsfw":false,"name":"test","description":"A slash command for testing.","dm_permission":true,"contexts":null,"integration_types":[0]},"attachments":[]},"nonce":"1157332087028580352"})
//Returns: "713fc855-f83d-46a9-8035-4205fd38f9a9"
```

Stores slash command data in your cache for future usage. This function will return a unique key upon execution that can be used with functions `API.remove()` and `API.post()`. If the data given already exists in the cache, the returned value will be the same as the original key for that data. To obtain slash command data, follow these steps:

1. Open Discord in your web browser and [sign into your account](https://discord.com/login).
2. Open DevTools (ctrl+shift+i on Windows) and navigate to the Network tab, then type "interactions" into the filter bar.

<img src="https://private-user-images.githubusercontent.com/68124391/271638920-89bd390b-de6f-4bd8-9333-8a7a23e6d90d.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE2OTYwMDA4MjAsIm5iZiI6MTY5NjAwMDUyMCwicGF0aCI6Ii82ODEyNDM5MS8yNzE2Mzg5MjAtODliZDM5MGItZGU2Zi00YmQ4LTkzMzMtOGE3YTIzZTZkOTBkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzA5MjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMwOTI5VDE1MTUyMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTIyMzg2OWM2NjlhMDVhYTM3MGQxNjMwODkxNTcxZjNhNGQxZjkxNWE1ZGUyZjIyNTk2MjQzMTA0NDMxYjZiZGYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.G3YW9z0yIGvIOm2m-j0Rx0FymmrUihbSuAn2kCHJEJ4" style="width:75%">

3. Execute the slash command you wish to automate, then select the newly created item in the network panel and navigate to the payload section.

<img src="https://private-user-images.githubusercontent.com/68124391/271641951-258fffb3-a1fc-4cf9-9ea8-f993fb635221.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE2OTYwMDEwNzgsIm5iZiI6MTY5NjAwMDc3OCwicGF0aCI6Ii82ODEyNDM5MS8yNzE2NDE5NTEtMjU4ZmZmYjMtYTFmYy00Y2Y5LTllYTgtZjk5M2ZiNjM1MjIxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzA5MjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMwOTI5VDE1MTkzOFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWVlNmUyZjVkODYyM2YzMmM4MGVmZjE0MzM1Nzc5OWI5YWI3OTkxZjJlM2IyM2QyODIwZTFlZjU2NmFiNTZhYzImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.NMDVoNGEZJCTg58wJckgusMt1QKOtQCJL1_XHu10N0I" style="width:75%">

4. As you can see in the screenshot above, there is a JSON array in this window that is labeled as `payload_json`. Simply copy this JSON array and you will have your slash command data.


#### API.remove(key)
```js
const API = require("interaction-api")

API.remove("713fc855-f83d-46a9-8035-4205fd38f9a9")
//Returns: "Interaction removed from cache."
```

Removes slash command data from the cache via its key. This function will always return "Interaction removed from cache.", even when the key provided is invalid.


#### API.post(user_token, channel_id, key)
```js
const API = require("interaction-api")

await API.post("MTE1NzMxNDY1Mjg3MTU5ODEyMQ.GAwFsd.4goE630DTEY2t_sgS5FNK5eJwAFiaXl9kacaGA", "1157315096872235142", "1cc661c2-93de-4e81-b0d8-1527b6b9beba")
//Returns a promise.
```

Automates a cached slash command via its key. This function is asynchronous, so make sure to use *await* inside of an asynchronous scope. Upon execution, this function will return a promise containing details about the response given from Discord's API. Most of the time, you won't need this information.


#### API.clear()
```js
const API = require("interaction-api")

API.clear()
//Returns: "Cache cleared."
```

Completely wipes the cache, removing all slash command data. This function will always return "Cache cleared.", even when the cache is already empty.