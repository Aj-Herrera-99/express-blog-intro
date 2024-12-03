/**
    Creiamo il nostro blog personale e giorno dopo giorno lo potremo arricchire con nuove funzionalità sulla base di quello che impareremo.
    - Creiamo il progetto base con una rotta / che ritorna un testo semplice con scritto ”Server del mio blog”
    - Creiamo un array dove inserire una lista di almeno 5 post, per ognuno indicare titolo, contenuto, immagine e tags (tags è un array di stringhe)
    - Creiamo poi una rotta /bacheca che restituisca un oggetto json con la lista dei post e il conteggio, partendo da un array.
    - Configuriamo gli asset statici sull’applicazione in modo che si possano visualizzare le immagini associate ad ogni post.
    - Testare su postman

    Bonus:
    - filtrare i dati sulla base di parametri in query string
*/
const express = require("express");
const app = express();
app.use(express.static("public"));
const PORT = 3000;

const posts = require("./assets/db/posts");

app.get("/", (req, res) => {
    res.send(`<h1>Server del mio blog</h1>
        <h2>endpoints:</h2>
        <ul>
            <li>bacheca</li>
        </ul>`);
});

app.get("/bacheca", (req, res) => {
    // se la query string ha un ultimo parametro "filter=strict" verra fatto un filtraggio rigoroso
    // vedere funzione filterData
    const dataFiltered = filterData(req, posts.cibi);
    // se dataFiltered non è null
    if (dataFiltered) {
        // se dataFiltered ha elementi
        if (dataFiltered.length) {
            return res.json(dataFiltered);
        }
        // se dataFiltered è vuoto (nessun oggetto che matcha con i param della query)
        // il server risponde mandando un json che indica not found
        else {
            return res.json({ 404: "not found" });
        }
    }
    // se dataFiltered è null -> no query string
    else {
        return res.json([{ quantità: posts.cibi.length }].concat(posts.cibi));
    }
});

function filterData(req, list) {
    // prendo l'intero oggetto generato dalla query string
    const query = req.query;
    // se l'oggetto è vuoto ritorna null
    if (!Object.keys(query).length) return null;
    // prendo solo la prima key dell'oggetto query
    const keyTarget = Object.keys(query)[0];
    // se la keyTarget non è una prop di qualsiasi oggetto di list ritorna array vuoto
    if (!Object.keys(list[0]).includes(keyTarget)) return [];
    // converto in un array ordinato la value della key target di query
    let queryValuesArr = convertToSortedArr(query[keyTarget]);
    // converto gli elementi target della query in stringhe lowercase
    queryValuesArr = convertElementsToStrLCase(queryValuesArr);

    let arrFiltered = [];
    // filtraggio "leggero"
    if (!(query["filter"] === "strict")) {
        arrFiltered = list.filter((obj) => {
            // converto in un array ordinato il value della key target per ogni oggetto di list
            let dataTargetArr = convertToSortedArr(obj[keyTarget]);
            // converto gli elementi dell'array target in stringhe lowercase
            dataTargetArr = convertElementsToStrLCase(dataTargetArr);
            // se anche SOLO UNO dei valori della valueTargetQuery rientra tra i valori di un oggetto
            // di valueTargetList allora aggiungo l'oggetto nell'arrFiltered
            let isIncludedSome = queryValuesArr.some((val) => {
                return dataTargetArr.includes(val);
            });
            return isIncludedSome;
        });
    }
    // filtraggio "rigoroso"
    else {
        arrFiltered = list.filter((obj) => {
            // converto in un array ordinato il value della key target per ogni oggetto di list
            let dataTargetArr = convertToSortedArr(obj[keyTarget]);
            // converto gli elementi dell'array target in stringhe lowercase
            dataTargetArr = convertElementsToStrLCase(dataTargetArr);
            // se TUTTI i valori della valueTargetList sono presenti nella valueTargetQuery
            // allora aggiungo l'oggetto nell'arrFiltered
            let isIncludedAll = dataTargetArr.every((val) => {
                return queryValuesArr.includes(val);
            });
            return isIncludedAll;
        });
    }
    return arrFiltered;
}

app.listen(PORT, () => {
    console.log("Server aperto.", `Porta:${PORT}`);
});

// * FUNCTIONS
function convertElementsToStrLCase(arr) {
    return arr.map((el) => el.toString().toLowerCase());
}

function convertToSortedArr(element) {
    // converto in un array ordinato il parametro passato
    // NB: che sia primitivo o un array, il ritorno è cmq un array ordinato
    return [].concat(element).sort();
}
