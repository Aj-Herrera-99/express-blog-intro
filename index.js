/** 
    - Creiamo il nostro blog personale e giorno dopo giorno lo potremo arricchire con nuove funzionalità sulla base di quello che impareremo.
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
const HOST = `http://localhost:${PORT}`;

const posts = require("./assets/db/posts");

app.get("/", (req, res) => {
    res.send(`<h1>Server del mio blog</h1>
        <h2>endpoints:</h2>
        <ul>
            <li>bacheca</li>
        </ul>`);
});

app.get("/bacheca", (req, res) => {
    let response = {
        totalCount: posts.cibi.length,
        status: "ok",
        data: [...posts.cibi], //clone di posts.cibi
    };
    response = filterData(req, response, posts.cibi);
    res.json(response);
});

app.all("*", (req, res) => {
    res.send(`<h1>404 - Not Found</h1>`);
});

app.listen(PORT, () => {
    console.log(
        "Server aperto.\n",
        `Porta: ${PORT} \n Indirizzi: 
            ${HOST}
            ${HOST + "/bacheca"}`
    );
});

// * FUNCTIONS
function filterData(req, response, list) {
    // prendo l'intero oggetto generato dalla query string
    const query = req.query;
    // se l'oggetto è vuoto ritorna null
    if (!Object.keys(query).length) {
        return response;
    }
    // prendo solo la prima key dell'oggetto query
    const keyTarget = Object.keys(query)[0];
    // se la keyTarget non è una prop di qualsiasi oggetto di list ritorna array vuoto
    if (!Object.keys(list[0]).includes(keyTarget)) {
        response = {
            404: "Not Found",
        };
        return response;
    }
    // se il filtro è tramite id, uso una logica piu efficiente per gestire la ricerca
    if (keyTarget === "id") {
        response.data = list.find((obj) => {
            return obj[keyTarget] == query[keyTarget];
        });
        response.data = [response.data];
        response.totalCount = response.data.length;
        console.log(response);
        return response.data
            ? response
            : (response = {
                  404: "Not Found",
              });
    }
    // se il filtro non è tramite id, uso una logica diversa per gestire la ricerca
    // converto in un array ordinato la value della key target di query
    let queryValuesArr = convertToSortedArr(query[keyTarget]);
    // converto gli elementi target della query in stringhe lowercase
    queryValuesArr = convertElementsToStrLCase(queryValuesArr);
    // inizializzo l'array dei dati filtrati
    let arrFiltered = [];
    // filtraggio "rigoroso" --> ultim param di querystring "filter:strict"
    if (query["filter"] === "strict") {
        arrFiltered = list.filter((obj) => {
            // converto in un array ordinato il value della key target per ogni oggetto di list
            let dataTargetArr = convertToSortedArr(obj[keyTarget]);
            // converto gli elementi dell'array target in stringhe lowercase
            dataTargetArr = convertElementsToStrLCase(dataTargetArr);
            // se TUTTI i valori della dataTargetArr sono presenti nella queryValuesArr
            // allora aggiungo l'oggetto nell'arrFiltered
            let isIncludedAll = dataTargetArr.every((val) => {
                return queryValuesArr.includes(val);
            });
            return isIncludedAll;
        });
    }
    // filtraggio "leggero"
    else {
        arrFiltered = list.filter((obj) => {
            // converto in un array ordinato il value della key target per ogni oggetto di list
            let dataTargetArr = convertToSortedArr(obj[keyTarget]);
            // converto gli elementi dell'array target in stringhe lowercase
            dataTargetArr = convertElementsToStrLCase(dataTargetArr);
            // se anche SOLO UNO dei valori della queryValuesArr rientra tra i valori
            // di dataTargetArr allora aggiungo l'oggetto nell'arrFiltered
            let isIncludedSome = queryValuesArr.some((val) => {
                return dataTargetArr.includes(val);
            });
            return isIncludedSome;
        });
    }
    response.totalCount = arrFiltered.length;
    response.data = arrFiltered;
    return response.totalCount
        ? response
        : (response = {
              404: "Not Found",
          });
}

function convertElementsToStrLCase(arr) {
    return arr.map((el) => el.toString().toLowerCase());
}

function convertToSortedArr(element) {
    // converto in un array ordinato il parametro passato
    // NB: che sia primitivo o un array, il ritorno è cmq un array ordinato
    return [].concat(element).sort();
}
