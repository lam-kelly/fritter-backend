function viewWordMasks(fields) {
    fetch('/api/word-mask')
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createWordMask(fields) {
    fetch('/api/word-mask', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function editWordMask(fields) {
    fetch(`/api/word-mask/${fields.wordMaskId}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteWordMask(fields) {
    fetch(`/api/word-mask/${fields.wordMaskId}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  