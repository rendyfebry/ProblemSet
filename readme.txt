// ========== Install

npm install / yarn

optional : ./app/config.js

run mongod
run node server.js

//============ Routes

"/" GET
>> Homepage & Login Page

"/signup" GET
>> Sign up Page

"/api/login" POST
>> Login API POST Route
>> Return JWT token if login success

"/api/signup" POST
>> Signup API POST Route
>> Return JWT token if signup success

// ====== JWT Protected
// === for all routes below, token is necessary in url 

"/api/phonebooks" GET
>> GET all phonebooks in json format

"/api/phonebooks" POST
>> Save new phonebook data

"/api/phonebooks/:id" GET
>> GET single phonebook data based on ID

"/api/phonebooks/:id" PUT
>> SAVE/PUT edited phonebook data based on ID

"/api/phonebooks/:id" DELETE
>> DELETE single phonebook data based on ID

"/api/phonebooks-search/:key" GET
>> Search phonebooks data based on name or email or phone or company or address
>> return in json