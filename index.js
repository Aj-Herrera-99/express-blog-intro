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
            <li>ciambella</li>
            <li>cracker</li>
            <li>pane</li>
            <li>pasta</li>
            <li>torta</li>
        </ul>`);
});

app.get("/bacheca", (req, res) => {
    const target = queryString(req, posts.cibi);
    // se target è un elemento non nullo
    // il server risponde mandando un json degli elementi 
    // che corrispondono alla query string
    if (target) {
        res.json(target);
        return;
    }
    console.log("test");
    // se target è null, il server risponde mandando l'intero json
    res.json([{ quantità: posts.cibi.length }].concat(posts.cibi));
});

function queryString(req, list) {
    // prendo l'intero oggetto della query
    const query = req.query;
    console.log(query);
    // se l'oggetto è vuoto ritorna null
    if(!Object.keys(query).length) return null;
    // prendo solo la prima key dell'oggetto query
    const keyTarget = Object.keys(query)[0];
    // converto in un array ordinato la value della key target di query
    const valueTargetQuery = convertToSortedArr(query[keyTarget]);
    // creo un array filtrando gli elementi la cui key/value combacia con la prima key/value della query
    const objTargets = list.filter((obj) => {
        // converto in un array ordinato la value della key target per ogni elemento di list
        let valueTargetList = convertToSortedArr(obj[keyTarget]);
        // confronto dei due array convertiti in stringa
        // se sono uguali, l'elemento fara parte degli elementi di objTargets
        if (valueTargetList.join().toLowerCase() === valueTargetQuery.join().toLowerCase()) {
            return obj;
        }
    });
    console.log(objTargets);
    return objTargets.length ? objTargets : null;
}

function convertToSortedArr(element) {
    // converto in un array ordinato il parametro passato
    // NB: che sia primitivo o un array, il ritorno è cmq un array ordinato
    return [].concat(element).sort();
}



app.get("/ciambella", (req, res) => {
    res.send(`<img src="images/ciambellone.jpeg">`);
});
app.get("/cracker", (req, res) => {
    res.send(`<img src="images/cracker_barbabietola.jpeg">`);
});
app.get("/pane", (req, res) => {
    res.send(`<img src="images/pane_fritto_dolce.jpeg">`);
});
app.get("/pasta", (req, res) => {
    res.send(`<img src="images/pasta_barbabietola.jpeg">`);
});
app.get("/torta", (req, res) => {
    res.send(`<img src="images/torta_paesana.jpeg">`);
});

app.listen(PORT, () => {
    console.log("Server aperto");
});
