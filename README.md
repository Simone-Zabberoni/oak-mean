# Oak-node-mean

## Description

MEAN interface to [particle.io](https://www.particle.io/) services and [Oak devices](http://digistump.com/oak/)
Based on [MEAN Machine](https://github.com/scotch-io/mean-machine-code) code samples

Log in with you particle.io account and you will be able to:

- list your registered devices and current status
- list per-device variables
- list per device functions and call them in realtime

![devices](http://www.facciocose.eu/wp-content/uploads/2017/02/oak-mean.jpg)
![variables](http://www.facciocose.eu/wp-content/uploads/2017/02/oak-mean-details.jpg)


## TODO - lots of them!

There are lots improvements I want to work on:
- mongodb: the "M" of Mean is still unimplemented: save tokens on local mongo, save devices, history of variables etc...
- token : verify expiration and avoid re-auth
- particle api: include more API integration (add/claim/remove device, event streams)
- generic code cleanup


## Install & run

Clone the repo, install the npm dependencies and run server.js:

```
[simone@zabsrv ~]$ cd oak-node-mean
[simone@zabsrv oak-node-mean]$ npm install
[...]
[simone@zabsrv oak-node-mean]$ node server.js
Oak Mean Manager listen on : http://localhost:8081
```

Or you can build and run it with docker:
```
[simone@zabsrv oak-node-mean]$ docker build -t oak-node-mean . && docker run -p 8081:8081 -it --rm --name oak-node-mean-1 oak-node-mean                   
Sending build context to Docker daemon 209.9 kB
Step 1 : FROM node:4-onbuild
[...]
Step 1 : COPY . /usr/src/app
 ---> Using cache
 ---> fc904dfc7cb8
Successfully built fc904dfc7cb8
npm info it worked if it ends with ok
npm info using npm@2.15.11
npm info using node@v4.8.2
npm info prestart node-api@
npm info start node-api@

> node-api@ start /usr/src/app
> node server.js

Oak Mean Manager listen on : http://0.0.0.0:8081
```
