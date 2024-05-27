# GreenCo Project
![GreenCo project logo](./public/assets/icon/logo1.png)    ![European Union logo](./public/assets/icon/logoEU.png)

## Installation

### Node.js

To install Node.js we will have to access the [official website](https://nodejs.org/en/)
where we will download the version compatible with our operating system.

Along with Node.js we will install the package manager [npm](https://www.npmjs.com/). To check
that they have been installed correctly, from a terminal, we will use the following commands:
        - apt install nodejs
        - node --version
        - npm --version
        
### MariaDB

First we will have to install the database manager [MariaDB](https://mariadb.org/download/?t=mariadb&p=mariadb&r=10.11.2&os=windows&cpu=x86_64&pkg=msi&m=fe_up_pt), selecting the version corresponding to our operating system. During the installation you will be asked to configure some aspects or leave them by default.
If you choose the default configuration, you can modify it later in the database configuration file if necessary.
        - sudo apt update
        - sudo apt install mariadb-server
        - sudo mysql_secure_installation
        - sudo systemctl start mariadb.service

#### Privileged user configuration and sql file import
        - sudo mariadb
        - GRANT ALL ON *.* TO '***user***'@'127.0.0.1' IDENTIFIED BY '***password***' WITH GRANT OPTION;
        - GRANT ALL ON *.* TO '***user***'@'%' IDENTIFIED BY '***password***' WITH GRANT OPTION;
        - FLUSH PRIVILEGES;
        - source GreenCoDatabase.sql;
        - exit;

In order to access the MariaDB database from the backend of the application it will be necessary to edit the configuration in the
the .json file located in the path ~/server/db/auth.json. The following parameters must be specified:

        - host (127.0.0.1/localhost default).
        - user (name of the user we are going to connect with).
        - password (password of the user we are going to connect with).
        - port (port on which the database process is hosted, 3306 by default).
        - db (name of the database to be accessed).

### yarn

Making use of the npm package manager we will install another package manager, [yarn](https://yarnpkg.com/) 
using the following command:

        - npm install --global yarn

To check that yarn has been installed correctly we will use this command:

        - yarn --version

        
## Usage

These commands are configured in the package.json file of the project, in the "scripts" section. They can be modified or new ones can be added. 

To modify the port used by the server, you must access the .env file and modify the environment variable
"PORT" replacing its value with the value of the port you want to use. In addition, in the same file, the environment variable "REACT_APP_BACK" must also be modified.
"REACT_APP_BACKEND_URL" changing the value of the port in this url by the value of the new port established in the "PORT" variable.

Once the desired configuration for running our web site has been specified, we must type the following commands:

### Compile and build the application.
        - yarn build

### Start the server in production mode.
        - yarn start
        
### Command that combines the two previous ones.
        - yarn restart
