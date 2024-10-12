let processedElements = new Set();

// Fonction pour envoyer le contenu à l'API avec débogage amélioré
async function sendToAPI(content) {
  // Formatage des données selon le format attendu par l'API
  const payload = {
    message: content,  // ou utilisez la structure exacte attendue par votre API
  };

  try {
    // Log des données avant envoi
    console.log('Données à envoyer:', payload);
    console.log('Payload stringify:', JSON.stringify(payload));

    const response = await fetch('https://yourapi.com/enpoint/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez ici d'autres headers si nécessaire
        // 'Authorization': 'Bearer votre-token',
      },
      body: JSON.stringify(payload)
    });
    
    // Log de la réponse complète
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text(); // On récupère d'abord le texte brut
    console.log('Response raw text:', responseText);

    try {
      const jsonResponse = JSON.parse(responseText); // On essaie de parser en JSON
      console.log('Response parsed JSON:', jsonResponse);
    } catch (e) {
      console.log('La réponse n\'est pas du JSON valide');
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${responseText}`);
    }
    
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi des données:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}

// Fonction pour traiter les nouveaux éléments
function processNewElements() {
  const elements = document.querySelectorAll('span.description-_YHAw05g');
  
  elements.forEach(element => {
    if (!processedElements.has(element)) {
      processedElements.add(element);
      const content = element.textContent.trim(); // On nettoie le contenu
      console.log('Élément traité:', {
        content: content,
        htmlContent: element.innerHTML,
        className: element.className,
        completeElement: element.outerHTML
      });
      sendToAPI(content);
    }
  });
}

// Observer pour détecter les changements dans le DOM
const observer = new MutationObserver((mutations) => {
  // Log des mutations pour le débogage
  mutations.forEach(mutation => {
 /*   console.log('Mutation détectée:', {
      type: mutation.type,
      target: mutation.target,
      addedNodes: mutation.addedNodes
    });*/
  });
  processNewElements();
});

// Configuration de l'observer
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Traitement initial des éléments existants
processNewElements();

