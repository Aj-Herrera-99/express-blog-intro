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
    const target = queryId(req, posts.cibi);
    if(target){
        res.json(target);
        return;
    } 
    res.json([{ quantità: posts.cibi.length }].concat(posts.cibi));
});

function queryId(req, list){
    
    const id = req.query.id;
    let objTarget = null;
    if (id) {
        objTarget = list.find((obj) => {
            return obj.id == id;
        });
        if (objTarget) {
            return objTarget;
        }
    }
    return null;
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
