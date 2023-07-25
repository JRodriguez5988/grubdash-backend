# grubdash-backend

## This repo contains the server for the Grubdash application located at "https://github.com/Thinkful-Ed/starter-grub-dash-front-end".

### This project demonstrates the ability to:
- Run tests from the command line.
- Use common middleware packages.
- Receive requests through routes.
- Access relevant information through route parameters.
- Build an API following RESTful design principles.
- Write custom middleware functions.

### These are the files you will find in this repo:
- src/app.js - This file contains the express application
- src/server.js - This file contains the server code
- src/data/dishes-data.js - This file contains the shape and data for each dish object
- src/data/orders-data.js - This file contains the shape and data for each order object
- src/dishes/dishes.controller.js - This file contains the handlers and validators for the "/dishes" routes
- src/dishes/dishes.router.js - This file contains the routes and attached handlers for "/dishes"
- src/orders/orders.controller.js - This file contains the handlers and validators for the "/orders" routes
- src/orders/orders.router.js - This file contains the routes and attached handlers for "/orders"
- src/errors/errorHandler.js - This file contains the error handler for any errors passed by the handlers, which is accessed by the express application
- src/errors/methodNotAllowed.js - This file contains the code that runs for all methods that are not allowed for certain routes and returns a message so developers may understand why the error is thrown.
- src/errors/notFound.js - This file contains the code that runs for all routes that do not exist and passes this error with a message to the error handler.
- src/utils/nextId.js - This file contains the nextId function which creates a new id to be assigned for any post requests
- test/ - This folder contains the test code for each route to ensure all requests provide the appropriate response
