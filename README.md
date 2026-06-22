# LookBook – Swap MVP

API JSON RESTful per **LookBook**, marketplace di abbigliamento second-hand. Il progetto implementa l'MVP della funzione **Swap**, che permette a due utenti di proporre e accettare lo scambio di prodotti.

Realizzato come progetto del modulo Node.js del Master AI e agenti AI per il business(start2impact). Non è richiesto un frontend: il progetto esporta solo API.

## Stack tecnologico

- Node.js + Express 5 (ES Modules)
- MongoDB Atlas + Mongoose
- Multer (upload foto prodotto)
- dotenv

## Struttura del progetto

```
LookBook-swap-MVP/
├── config/
│   └── db.js              # connessione MongoDB + sanitizeFilter
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   └── swapOrderController.js
├── middleware/
│   └── upload.js           # configurazione Multer
├── models/
│   ├── User.js
│   ├── Product.js
│   └── SwapOrder.js
├── routes/
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── swapOrderRoutes.js
├── uploads/                 # foto prodotto salvate da Multer
├── postman/
│   └── swap-MVP-tests.postman_collection.json
├── .env.example
└── server.js
```

## Setup

### Prerequisiti

- Node.js 18+
- Un cluster MongoDB Atlas (o istanza MongoDB locale)

### Installazione

```bash
git clone <url-del-repo>
cd LookBook-swap-MVP
npm install
```

### Configurazione MongoDB Atlas

Se non hai già un cluster Atlas pronto:

1. Crea un account gratuito su [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) e crea un nuovo cluster con il piano gratuito (M0).
2. In **Database Access**, crea un utente del database (username + password): ti serviranno per la connection string.
3. In **Network Access**, aggiungi il tuo IP oppure, solo per test/sviluppo, `0.0.0.0/0` (consente l'accesso da qualsiasi indirizzo IP — da non usare in produzione).
4. Dalla pagina del cluster clicca su **Connect → Drivers** e copia la connection string, nel formato:
   `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/`
5. Sostituisci `<username>` e `<password>` con le credenziali create al punto 2, e aggiungi il nome del database dopo l'host, es. `.../lookbook?retryWrites=true&w=majority`.

### Variabili d'ambiente

Copia `.env.example` in `.env` e inserisci la connection string ottenuta sopra:

```dotenv
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<dbname>
PORT=3000
```

`.env` non va mai committato (è già escluso da `.gitignore`): contiene credenziali reali del database.

### Avvio

```bash
npm run dev     # con nodemon
# oppure
node server.js
```

Il server parte su `http://localhost:3000` (o sulla porta indicata in `PORT`).

## Modelli dati

**User**: `name`, `surname`, `email` (univoca)

**Product**: `name`, `photos` (array di file), `owner` (rif. User), `swapCount` (default 0)

**SwapOrder**: `products` (array di rif. Product), `proposer` (rif. User), `receiver` (rif. User), `status` (`pending` | `accepted` | `rejected`, default `pending`), `createdAt`/`updatedAt`

## Endpoint API

### Users — `/users`

| Metodo | Path | Descrizione |
|---|---|---|
| POST | `/users` | Crea un utente |
| GET | `/users` | Lista tutti gli utenti |
| GET | `/users/:id` | Dettaglio utente |
| PUT | `/users/:id` | Modifica utente |
| DELETE | `/users/:id` | Elimina utente |

### Products — `/products`

| Metodo | Path | Descrizione |
|---|---|---|
| POST | `/products` | Crea un prodotto (`multipart/form-data`, campo file `photos`, max 5) |
| GET | `/products` | Lista tutti i prodotti |
| GET | `/products/:id` | Dettaglio prodotto |
| PUT | `/products/:id` | Modifica prodotto |
| DELETE | `/products/:id` | Elimina prodotto |

### Swap Orders — `/swaporders`

| Metodo | Path | Descrizione |
|---|---|---|
| POST | `/swaporders` | Crea una proposta di scambio (valida che tutti i `products` appartengano al `proposer`) |
| GET | `/swaporders` | Lista ordini, con filtri opzionali (vedi sotto) |
| GET | `/swaporders/:id` | Dettaglio ordine |
| PUT | `/swaporders/:id` | Modifica ordine / cambia stato |
| DELETE | `/swaporders/:id` | Elimina ordine |

**Filtri su `GET /swaporders`** (combinabili):

- `?productId=<id>` — ordini che contengono quel prodotto
- `?from=YYYY-MM-DD&to=YYYY-MM-DD` — ordini creati nell'intervallo di date indicato (estremi inclusi)

**Logica di business**: quando lo `status` di un ordine viene impostato su `accepted`, la proprietà di tutti i prodotti dell'ordine passa al `receiver` e il loro `swapCount` viene incrementato di 1.

### Status code

| Codice | Quando |
|---|---|
| 200 | GET o PUT andati a buon fine |
| 201 | Risorsa creata (POST) |
| 204 | Risorsa eliminata (DELETE), nessun contenuto in risposta |
| 400 | Dati non validi, errore di validazione Mongoose, o regola di business non rispettata (es. prodotto non appartenente al proposer) |
| 404 | Risorsa non trovata (id inesistente) |

## Esempi di richiesta/risposta

### Creare un utente

`POST /users`

```json
{
  "name": "Marco",
  "surname": "Rossi",
  "email": "marco@test.com"
}
```

Risposta `201`:

```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0d",
  "name": "Marco",
  "surname": "Rossi",
  "email": "marco@test.com",
  "__v": 0
}
```

### Creare un prodotto

`POST /products` (`multipart/form-data`)

| Campo | Tipo | Valore di esempio |
|---|---|---|
| name | text | Maglione blu |
| owner | text | 665f1a2b3c4d5e6f7a8b9c0d |
| photos | file | maglione.png |

Risposta `201`:

```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0e",
  "name": "Maglione blu",
  "owner": "665f1a2b3c4d5e6f7a8b9c0d",
  "photos": ["photos-1718980000000-123456789.png"],
  "swapCount": 0,
  "__v": 0
}
```

### Creare una proposta di scambio

`POST /swaporders`

```json
{
  "products": ["665f1a2b3c4d5e6f7a8b9c0e"],
  "proposer": "665f1a2b3c4d5e6f7a8b9c0d",
  "receiver": "665f1a2b3c4d5e6f7a8b9c10"
}
```

Risposta `201`:

```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c11",
  "products": ["665f1a2b3c4d5e6f7a8b9c0e"],
  "proposer": "665f1a2b3c4d5e6f7a8b9c0d",
  "receiver": "665f1a2b3c4d5e6f7a8b9c10",
  "status": "pending",
  "createdAt": "2026-06-21T10:15:00.000Z",
  "updatedAt": "2026-06-21T10:15:00.000Z",
  "__v": 0
}
```

Se uno dei `products` non appartiene al `proposer`, risposta `400`:

```json
{
  "message": "All products must belong to the proposer"
}
```

### Accettare una proposta di scambio

`PUT /swaporders/665f1a2b3c4d5e6f7a8b9c11`

```json
{
  "status": "accepted"
}
```

Risposta `200` (l'ordine torna con `status: "accepted"`). Come effetto collaterale, ogni prodotto elencato nell'ordine passa di proprietà al `receiver` e il suo `swapCount` viene incrementato di 1.

## Sicurezza – NoSQL Injection

`mongoose.set("sanitizeFilter", true)` è impostato globalmente in `config/db.js`: rimuove qualsiasi operatore Mongo (`$gt`, `$in`, ecc.) iniettato nei filtri delle query, prevenendo attacchi di tipo NoSQL injection.

## Testing

La collection Postman si trova in `postman/swap-MVP-tests.postman_collection.json`.

**Importazione**: in Postman, vai su **File → Import** e seleziona il file della collection.

Contiene placeholder generici (`<USER_ID>`, `<PRODUCT_ID>`, `<PROPOSER_ID>`, `<RECEIVER_ID>`, `<SWAP_ORDER_ID>`, `<FROM_DATE>`, `<TO_DATE>`, `/path/to/your/image.png`) da sostituire con i tuoi id reali (es. recuperati dalle risposte di `Create User` / `Create Product`) e con il percorso locale di un'immagine, prima di eseguire le richieste.

## Autore

Francesco Benassi — Master AI e agenti AI per il business, start2impact
