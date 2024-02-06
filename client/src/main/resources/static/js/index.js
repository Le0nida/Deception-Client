document.addEventListener('DOMContentLoaded', function () {

    // Recupera il token dal modello
    var token = document.getElementById('token').getAttribute('data-securityToken');

    // Memorizza il token nel sessionStorage
    sessionStorage.setItem('accessToken', token);
});


function creaNuovaSpecifica() {
    // Recupera il token memorizzato
    var token = sessionStorage.getItem('accessToken');

    // Creare un oggetto con i dati da inviare
    var data = {
        step: 'general'
    };

    // Eseguire la richiesta POST con Ajax
    $.ajax({
        type: 'POST',
        url: 'creazioneSpecifica',
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: {
            'Authorization': 'Bearer ' + token // Aggiungi il token nell'header Authorization
        },
        success: function (response) {
            // Gestire la risposta dal server, se necessario
            window.location.href = 'specificationInfos';
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}



function importaSpecificaEsistente() {
    // Aggiungi la logica desiderata per l'importazione di una specifica esistente
    alert("Azione: Importa specifica esistente");


}

function visualizzaStorico() {
    // Aggiungi la logica desiderata per la visualizzazione dello storico
    alert("Azione: Visualizza Storico");

}