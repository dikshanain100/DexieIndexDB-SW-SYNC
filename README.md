# DexieIndexDB-SW-SYNC

This is a project downloaded from 
Frontend :: https://github.com/AldoHub/Offline-Online-Sync-Client/blob/f8ed457cd199137f5e206aee66a3cf22f326c061/src/app/todo.service.ts#L145
Backend :: https://github.com/AldoHub/Offline-Online-Sync-API

Video Link :: https://www.youtube.com/watch?v=lrzRGyBeWpQ&t=1033s

It uses Dexie Lib for pushing data in IndexDB when application goes offline.
Mongo DB is used for backend which gets updated as soon as application gets internet connection again.
Once data is updated to MongoDb from IndexDB, it is deleted from indexdb from browser.
The project also uses SW for offline functionality.
Structure of project has been modifies as per Axis project i.e using Internal Http Client for centralized http call.

SW - For serving application offline
Index DB - For storing data offline on browser
Dexie DB - Library to store data in Index DB


Dexie - version upgrade , adding data to it giving error :
https://stackoverflow.com/questions/54728942/cant-update-index-dynamically-with-dexie-sample-code


Server side session : express-session
https://github.com/bersling/express-session-angular-ngx 


Docker command for running backend image :
            Not detach mode, when you want to check errors :::
			docker run --add-host host.docker.internal:host-gateway -it -d -p 8080:8080 your_image_id    
			Detach mode :::
			docker run --add-host host.docker.internal:host-gateway -it -d -p 8080:8080 your_image_id    
  
Also, do check connection string in connection.js


Docker command for running frontend image :
           Not detach mode :
		   docker run -p 4200:4200 image_id
		   Detach mode :
		   docker run -it -d -p 4200:4200 image_id