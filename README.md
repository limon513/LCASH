#setup the project
clone the repo and open in any of your code editor.
go to terminal and do a quick
`npm install`

in the root folder create a `.env` file and add the following

`PORT` = //give a port number
`SALT_ROUND` = //bcrype salt round ex:8
`JWT_SECRET` = //jwt secret key for token decode
`JWT_EXPIRY` = //jwt expiry time
`JWT_APIKEY_EXPIRY` = //marchent api key expiry time
`JWT_PAYMENT_EXPIRY` = //temp token expiry while payment gateway window
`ACCEPT_LOGIN_ATTEMPT` = //how may attempt is accepted before account block
`SUSPICION_LOGIN_MESSAGE` = 'We detected unusual LogIn attempt in your account! We have sent a verification code to your sim. Please verify with the code.'
`SUCCESSFULL_VERIFICATION_MESSAGE` = 'Verification Complete'
`FAILED_VERIFICATION_MESSAGE` = 'PIN does not match'
`ACCEPT_ACTIVE_REQUEST` = 'Account Activated SuccessFully'
`REJECT_ACTIVE_REQUEST` = 'Account Activation Request Rejected'
`SUSPICION_PIN_MESSAGE` = 'Too Many Incorrect attempt. So your account is blocked. Please call Help Care!'
`AFTERCODESENT` = 'A six digit code is sent to you sim, Please verify with the code with in 5 minuites'
`GMAIL_EMAIL` = //gmail of your service from which all mails will be sent
`GMAIL_PASS`  = //the app pass for the mail, search for how to add a app pass to google account

in the config folder in the `.config` add your database name and password

go inside the src folder and in the terminal do `npx sequelize init`

create a database with appropiate name that you given to the `.config` file.

do a quick `npx sequelize db:migrate`

do a quick `npx sequelize db:seed:all`

then you are good to go, do a `npm run dev` and play with the apis.