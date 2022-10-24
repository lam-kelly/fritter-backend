function endorseFreet(fields) {
    fetch(`/api/endorse`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}

function viewEndorsementByUser(fields) {
    fetch(`/api/endorse?endorser=${fields.endorser}`)
        .then(showResponse)
        .catch(showResponse);
}

function viewEndorsementsOfFreet(fields) {
    fetch(`/api/endorse?freetId=${fields.freetId}`)
        .then(showResponse)
        .catch(showResponse);
}

function removeEndorsement(fields) {
    fetch(`/api/endorse/${fields.freetId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}