document.addEventListener("DOMContentLoaded", function () {
    let aloitusAika = parseInt(localStorage.getItem("aloitusAika")) || 0;
    let liveAjastin = null;
    const tehtavalista = document.getElementById("tehtavalista");
    const aikaNaytto = document.getElementById("aika-naytto");
    const pisteetNaytto = document.getElementById("pisteet-naytto");
    const liveAika = document.getElementById("live-aika");

    const tasot = [
        [
            { kysymys: "Mikä on muuttujan määrittely JavaScriptissä?", vastaus: "let x = 5;", tulos: 0, vinkki: "Käytä 'let' ja anna muuttujalle arvo." },
            { kysymys: "Miten funktio määritellään JavaScriptissä?", vastaus: "function nimi() { }", tulos: 0, vinkki: "Muista 'function'-avainsana ja aaltosulkeet." }
        ],
        [
            { kysymys: "Mikä on silmukka JavaScriptissä?", vastaus: "for (let i = 0; i < 5; i++) {}", tulos: 0, vinkki: "Muista for-silmukan rakenne: kolme osaa ja aaltosulkeet." },
            { kysymys: "Miten kirjoitat if-ehdon?", vastaus: "if (x > 0) {}", tulos: 0, vinkki: "Muista ehto sulkeissa ja lohko aaltosulkeissa." }
        ],
        [
            { kysymys: "Miten lisäät elementin listaan?", vastaus: "lista.push(x);", tulos: 0, vinkki: "Käytä .push()-metodia listan lisäykseen." },
            { kysymys: "Miten luet HTML-elementin sisällön JavaScriptissä?", vastaus: "document.getElementById('id').innerHTML", tulos: 0, vinkki: "Käytä getElementById ja innerHTML yhdessä." }
        ]
    ];

    let nykyinenTaso = 0;
    let seuraavaBtn;
    let lopetaBtn;

    function laskeOsumaprosentti(vastaus, oikea) {
        let pituus = Math.max(vastaus.length, oikea.length);
        let oikein = 0;
        for (let i = 0; i < pituus; i++) {
            if (vastaus[i] === oikea[i]) {
                oikein++;
            }
        }
        return (oikein / pituus) * 100;
    }

    function laskePisteet() {
        const data = JSON.parse(localStorage.getItem("tehtavatPisteet")) || [];
        return data.flat().reduce((summa, tehtava) => summa + tehtava.tulos, 0);
    }

    function naytaTehtavat() {
        tehtavalista.innerHTML = "";

        if (nykyinenTaso >= tasot.length) {
            const otsikko = document.querySelector("main section h2");
            const teksti = document.querySelector("main section p");
            if (otsikko) otsikko.textContent = "Tehtävät";
            if (teksti) teksti.innerHTML = "🎉 Kaikki tasot suoritettu! Voit siirtyä pisteisiin.";

            const aikaP = document.createElement("p");
            aikaP.innerHTML = `⏱️ Kulunut aika: <span id="live-aika">0</span> sekuntia`;
            tehtavalista.appendChild(aikaP);

            const lopetaNappi = document.createElement("button");
            lopetaNappi.textContent = "Lopeta";
            lopetaNappi.onclick = lopetaAjastin;
            tehtavalista.appendChild(lopetaNappi);

            const alku = parseInt(localStorage.getItem("aloitusAika"));
            if (alku) {
                clearInterval(liveAjastin);
                liveAjastin = setInterval(() => {
                    const sek = Math.floor((Date.now() - alku) / 1000);
                    document.getElementById("live-aika").textContent = sek;
                }, 1000);
            }
            return;
        }

        tasot[nykyinenTaso].forEach((tehtava, index) => {
            const tehtavaElementti = document.createElement("div");
            tehtavaElementti.innerHTML = `
                <p><strong>${tehtava.kysymys}</strong></p>
                <input type="text" id="vastaus-${index}" placeholder="Kirjoita vastaus...">
                <button onclick="tarkistaVastaus(${index})">Tarkista</button>
                <p id="tulos-${index}"></p>
                <p id="vinkki-${index}" class="vinkki"></p>
            `;
            tehtavalista.appendChild(tehtavaElementti);
        });

        seuraavaBtn = document.createElement("button");
        seuraavaBtn.textContent = "Seuraava taso";
        seuraavaBtn.id = "seuraavaBtn";
        seuraavaBtn.disabled = true;
        seuraavaBtn.onclick = () => {
            nykyinenTaso++;
            naytaTehtavat();
        };
        tehtavalista.appendChild(seuraavaBtn);

        lopetaBtn = document.createElement("button");
        lopetaBtn.textContent = "Lopeta";
        lopetaBtn.onclick = lopetaAjastin;
        tehtavalista.appendChild(lopetaBtn);
    }

    window.tarkistaVastaus = function (index) {
        const vastaus = document.getElementById(`vastaus-${index}`).value.trim();
        const tulosKentta = document.getElementById(`tulos-${index}`);
        const vinkkiKentta = document.getElementById(`vinkki-${index}`);
        const tehtava = tasot[nykyinenTaso][index];
        const osuma = laskeOsumaprosentti(vastaus, tehtava.vastaus);

        if (osuma === 100) {
            tehtava.tulos = 10;
            tulosKentta.textContent = "✅ Täysin oikein!";
            vinkkiKentta.textContent = "";
        } else if (osuma >= 50) {
            tehtava.tulos = 5;
            tulosKentta.textContent = `⚠️ Osittain oikein (${Math.round(osuma)}%)`;
            vinkkiKentta.textContent = `💡 Vinkki: ${tehtava.vinkki}`;
        } else {
            tehtava.tulos = 0;
            tulosKentta.textContent = `❌ Väärin (${Math.round(osuma)}%)`;
            vinkkiKentta.textContent = `💡 Vinkki: ${tehtava.vinkki}`;
        }

        localStorage.setItem("tehtavatPisteet", JSON.stringify(tasot));
        if (pisteetNaytto) pisteetNaytto.textContent = laskePisteet();

        if (seuraavaBtn) {
            seuraavaBtn.disabled = !tasot[nykyinenTaso].every(t => t.tulos >= 5);
        }
    };

    window.aloitaAjastin = function () {
        const aikaNyt = Date.now();
        localStorage.setItem("aloitusAika", aikaNyt);
        if (liveAika) {
            clearInterval(liveAjastin);
            liveAjastin = setInterval(() => {
                const sek = Math.floor((Date.now() - aikaNyt) / 1000);
                liveAika.textContent = sek;
            }, 1000);
        }
    };

    window.lopetaAjastin = function () {
        const alku = parseInt(localStorage.getItem("aloitusAika"));
        if (alku) {
            const sek = Math.floor((Date.now() - alku) / 1000);
            localStorage.setItem("aika", sek);
            alert("⏱️ Aika pysäytetty: " + sek + " sekuntia.");
            localStorage.removeItem("aloitusAika");
        }
        clearInterval(liveAjastin);
        window.location.href = "pisteet.html";
    };

    const darkModeToggle = document.createElement("button");
    darkModeToggle.textContent = "🌓 Dark Mode";
    darkModeToggle.style.position = "fixed";
    darkModeToggle.style.bottom = "10px";
    darkModeToggle.style.right = "10px";
    darkModeToggle.onclick = () => {
        document.body.classList.toggle("dark-mode");
    };
    document.body.appendChild(darkModeToggle);

    if (tehtavalista) naytaTehtavat();
    if (aikaNaytto) aikaNaytto.textContent = (localStorage.getItem("aika") || 0) + " sekuntia";
    if (pisteetNaytto) pisteetNaytto.textContent = laskePisteet();

    const pisteetData = JSON.parse(localStorage.getItem("tehtavatPisteet"));
    const pisteetTarkka = document.getElementById("tarkat-pisteet");
    if (pisteetData && pisteetTarkka) {
        let html = "<h3>Tehtäväpisteet</h3><ul>";
        pisteetData.forEach((taso, t) => {
            taso.forEach((teht, q) => {
                html += `<li>Taso ${t + 1}, Tehtävä ${q + 1}: ${teht.tulos}/10 pistettä</li>`;
            });
        });
        html += "</ul>";
        pisteetTarkka.innerHTML = html;
    }

    if (liveAika && localStorage.getItem("aloitusAika")) {
        const alku = parseInt(localStorage.getItem("aloitusAika"));
        clearInterval(liveAjastin);
        liveAjastin = setInterval(() => {
            const sek = Math.floor((Date.now() - alku) / 1000);
            liveAika.textContent = sek;
        }, 1000);
    }
});









