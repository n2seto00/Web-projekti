document.addEventListener("DOMContentLoaded", function() {
    let pisteet = 0;
    const pisteetNaytto = document.getElementById("pisteet-naytto");
    const tehtavalista = document.getElementById("tehtavalista");

    const tehtavat = [
        { kysymys: "Mikä on muuttujan määrittely JavaScriptissä?", vastaus: "let x = 5;" },
        { kysymys: "Miten funktio määritellään JavaScriptissä?", vastaus: "function nimi() { }" }
    ];

    function lataaTehtavat() {
        tehtavalista.innerHTML = "";
        tehtavat.forEach((tehtava, index) => {
            let tehtavaElementti = document.createElement("div");
            tehtavaElementti.innerHTML = `
                <p><strong>${tehtava.kysymys}</strong></p>
                <input type="text" id="vastaus-${index}" placeholder="Kirjoita vastaus...">
                <button onclick="tarkistaVastaus(${index})">Tarkista</button>
                <p id="tulos-${index}"></p>
            `;
            tehtavalista.appendChild(tehtavaElementti);
        });
    }

    window.tarkistaVastaus = function(index) {
        const vastausKentta = document.getElementById(`vastaus-${index}`);
        const tulosKentta = document.getElementById(`tulos-${index}`);

        if (vastausKentta.value.trim() === tehtavat[index].vastaus) {
            tulosKentta.innerHTML = "✅ Oikein!";
            tulosKentta.style.color = "green";
            pisteet += 10;
        } else {
            tulosKentta.innerHTML = "❌ Väärin! Kokeile uudelleen.";
            tulosKentta.style.color = "red";
        }
        pisteetNaytto.textContent = pisteet;
    };

    window.aloitaTehtava = function() {
        lataaTehtavat();
    };
});
