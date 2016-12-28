# Oak-node-manager

## Description

MEAN interface verso i servizi particle.io

In base al login di particle visualizza:
- device registrati
- variabili per device
- funzioni per device, con invio valori e refresh in realtime


## TODO
Ci sono vari miglioramenti/espansioni possibili:
- mongo: al momento inutilizzato. Storico valori ? Storico login ?
- cookies: usare il token per evitare ri-autentica
- token : verificare durata/expiration
- modellizzare il codice
- includere spin icon per le variabili in lettura
- Configuration: includere ip binding



## Install & run

```
[root@ip-172-31-20-90] cd oak-node-mean
[root@ip-172-31-20-90 oak-node-mean]# npm install
[...]
[root@ip-172-31-20-90 oak-node-mean]# node server.js
Magic happens on port 8080
```
