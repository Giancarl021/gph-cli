# gph-cli
An graph-interface wrapper to cli, that make easy to communicate to your Microsoft Tenant. 

## Installation
Using npm:
```bash
npm install --global gph-cli
```
Using yarn:
```bash
yarn add global gph-cli
```

## Usage
After installation the ``gph`` command will be available in your console.<br/>
After that, you can use the help command to see all the options:
```bash
gph -?
```

## Commands

[//]: # (^)

### credentials 
Manage saved credentials on the local registry

**Operations:**

#### set ``<credentials-name>``
Register new credentials

**Flags:**
* ``-t | --tenant-id``: Tenant ID.  
*Value:* ``<tenant-id>``.
* ``-c | --client-id``: Client ID.  
*Value:* ``<client-id>``.
* ``-s | --client-secret``: Client Secret.  
*Value:* ``<client-secret>``.
* ``-f | --force``: Don't ask nothing, just do it


#### get ``<credentials-name>``
Print credentails value
#### list 
List all current saved credentials
#### remove ``<credentials-name>``
Delete credentials from registry

**Flags:**
* ``-f | --force``: Don't ask nothing, just do it


#### default 
Manage the default credentials used in requests

**Operations:**

##### get 
Print the key
##### set ``<credentials-key>``
Set the key
##### remove 
Delete the key

**Flags:**
* ``-f | --force``: Don't ask nothing, just do it


### token 
Get the access token to use the Graph API to the tenant

**Flags:**
* ``-c | --credentials``: The credentials used in the request
* ``--version``: The Graph API version
* ``--save``: The directory to save the response


### unit 
Returns unitary data (without pagination)

**Flags:**
* ``-c | --credentials``: The credentials used in the request
* ``--version``: The Graph API version
* ``--method``: HTTP Method.  
*Value:* ``GET | POST | PUT | DELETE``.
* ``--cache``: Time To Live of cache in this specific request.  
*Value:* ``<seconds>``.
* ``--save``: The directory to save the response
* ``--truncate``: Truncate the response to length of 2000 or specified value.  
*Value:* ``null | <length>``.
* ``--no-print``: Don't show the response on terminal
* ``--fields``: Filter what fields in the response will return.  
*Value:* ``<field[,field[,...]]>``.


### list ``<url>``
Returns paginated data

**Flags:**
* ``-c | --credentials``: The credentials used in the request
* ``--version``: The Graph API version
* ``--method``: HTTP Method.  
*Value:* ``GET | POST | PUT | DELETE``.
* ``--cache``: Time To Live of cache in this specific request.  
*Value:* ``<seconds>``.
* ``--save``: The directory to save the response
* ``--truncate``: Truncate the response to length of 2000 or specified value.  
*Value:* ``null | <length>``.
* ``--no-print``: Don't show the response on terminal
* ``--map``: Map the response array before return.  
*Value:* ``<JavaScript function>``.
* ``--filter``: Filter the response array before return.  
*Value:* ``<JavaScript function>``.
* ``--reduce``: Convert all the objects in the response into one accumulator.  
*Value:* ``<JavaScript function>``.
* ``--limit``: The maximum of pages retrieved.  
*Value:* ``<integer>``.
* ``--offset``: The first page number to start retrieving data.  
*Value:* ``<integer>``.


### massive ``<url pattern>`` ``<foo:value[,value[,...]];bar:value[,value[,...]>``
Returns batch data

**Flags:**
* ``-c | --credentials``: The credentials used in the request
* ``--version``: The Graph API version
* ``--method``: HTTP Method.  
*Value:* ``GET | POST | PUT | DELETE``.
* ``--cache``: Time To Live of cache in this specific request.  
*Value:* ``<seconds>``.
* ``--save``: The directory to save the response
* ``--truncate``: Truncate the response to length of 2000 or specified value.  
*Value:* ``null | <length>``.
* ``--no-print``: Don't show the response on terminal
* ``--binder`` **[REQUIRED]**: The key present in the values parameter to be the key pattern of the response.  
*Value:* ``<key>``.
* ``--type`` **[REQUIRED]**: The type of the requests of the batch.  
*Value:* ``unit | list``.
* ``--async``: If the batch requests will be made in async mode or in linear mode.  
*Value:* ``true | false``.
* ``--attempts``: The number of failed attempts before crash.  
*Value:* ``<maximum failed attemps>``.
* ``--requests``: The quantity of batch requests made at the same time in async mode.  
*Value:* ``<quantity>``.


### request 
Manages the stored requests

**Operations:**

#### get ``<request name>``
Print the request content
#### set ``<request name>``
Create an new request

**Flags:**
* ``-f | --force``: Don't ask nothing, just do it


#### list 
List all current stored requests
#### remove ``<request name>``
Delete an request

**Flags:**
* ``-f | --force``: Don't ask nothing, just do it


### import ``<path to file>``
Import an .gphr or .gphrc request file

**Flags:**
* ``-p | --password``: In-line import and decrypt an .gphrc file with the file password


### export ``<request name>`` ``<path to file>``
Export an .gphr or .gphrc request file

**Flags:**
* ``-c | --credentials``: Set an stored credentials to bind with the request. By default set the flag "lock" to true
* ``--lock``: Creates an password protection on the exported file
* ``--no-lock``: Creates the exported file without password protection


### exec ``<request name>``
Execute an stored request

**Flags:**
* All the flags of the request type will overwrite the request options

[//]: # ($)