# Kloniranje projekta i neophodne postavke

Klonirajte repozitorijum koristeći komandu git clone https://github.com/elab-development/internet-tehnologije-projekat-fudbalskiturniri_2020_0224 na željenu lokaciju na vašem računaru.
Preuzmite i instalirajte npm sa zvaničnog sajta: https://nodejs.org/en/download.
Pokrenite Mongo i Apache servere putem XAMPP-a.
Otvorite klonirani projekat u željenom tekstualnom editoru (preporuka: VSCode).

# Pokretanje Laravel API-ja

Pređite u back folder koristeći komandu cd back.
Instalirajte sve zavisnosti pomoću komande composer install.
Kreirajte .env fajl u root direktorijumu back projekta i postavite podatke za povezivanje sa bazom: DB_PORT, DB_USERNAME, DB_PASSWORD, DB_HOST.
Popunite bazu podacima koristeći komandu php artisan db:seed.
Pokrenite aplikaciju komandom php artisan serve.

# Pokretanje React aplikacije

Pređite u front folder pomoću komande cd front (potrebno je prvo pozicionirati se u root direktorijum komandom cd ..).
Instalirajte neophodne pakete za pokretanje aplikacije komandom npm install (ili npm i).
Pokrenite aplikaciju komandom npm start.