URL - http://lckd-password-manager-frontend-2024.s3-website.eu-north-1.amazonaws.com/

Individuell examination - LCKD password generator

Du ska bygga en enkel lösenordshanterare där man som användare kan lägga till och ta bort sina lösenord. Du ska bygga både en frontend i React (annat ramverk är godkänt med) och ett serverless API i AWS. Din frontend ska vara "hostad" i en S3 - bucket på AWS och du ska använda dig av ditt API i dina API-anrop.

Funktionella krav
Krav:

Det går att lägga till ett lösenord som också ska sparas med en webbadress samt användarnamn.
Det går att ändra ett valfritt lösenord eller webbadress och det ska inte gå att kunna ändra ett lösenord som inte finns. Denna kontroll av att ett lösenord finns ska ske i backend.
Det går att se alla sina sparade lösenord och tillhörande webbadresser.
Tekniska krav
Frontend

Byggt med ett ramverk (förslagvis React)
Driftsatt på AWS i en S3 bucket och nåbar via URL
Gör fetch-anrop mot ditt serverless api och använder dig av alla endpoints som du har byggt
Backend

Serverless framework
API Gateway
Lambda
DynamoDB
Figmaskiss
Er inlämning behöver inte se ut exakt som skissen nedan utan kan användas mer som en referens på hur det ska fungera.

https://www.figma.com/file/QKiz47a00tMsrPBIHsznR6/Shui---React?type=design&node-id=0-1&t=QBELxGIdjEESvy3Q-0

Betygskriterier
För Godkänt:

Uppfyller alla funktionella och tekniska krav
Hela webbplatsen ska fungera utan några fel i utvecklarkonsolen i webbläsaren (ex. CORS)
För Väl Godkänt:

Det går att sortera alla lösenord på datum
Det går att uppdatera både lösenord, webbadress men inte användarnamn. Du ska enbart uppdatera det som användaren skickar in alltså om jag enbart vill uppdatera lösenord och inte webbadress så ska detta gå gentemot databasen.
Inlämning
Inlämning sker på Azomo med en länk till ditt Github repo med din kod senast 31/10 kl 23:59. Glöm inte att skicka med URL:en till din webbapplikation som en kommentar till inlämningen i Azomo.

