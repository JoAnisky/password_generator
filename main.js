// Récupération de la longueur du password (input range)
const characterAmountRange = document.getElementById('characterAmountRange');
const characterAmountNumber = document.getElementById('characterAmountNumber');

// Récuperation des checkbox
const includeUppercaseElement = document.getElementById('includeUppercase');
const includeLowercaseElement = document.getElementById('includeLowercase')
const includeNumbersElement = document.getElementById('includeNumbers');
const includeSymbolsElement = document.getElementById('includeSymbols');

// Recupération formulaire/password display et copie du mot de passe
const form = document.getElementById('passwordGeneratorForm');
const passwordDisplay = document.getElementById('passwordDisplay');
const copyBtn = document.getElementById('copy');

// Générer les éléments qui constitueront le password (ASCII)
const UPPERCASE_CHAR_CODES = arrayFromLowtoHigh(65, 90);
const LOWERCASE_CHAR_CODES = arrayFromLowtoHigh(97, 122);
const NUMBER_CHAR_CODES = arrayFromLowtoHigh(48, 57);
// Pour les symboles, sauter certains chiffres du tableau ASCII qui ne correspondent pas a des caractères
const SYMBOL_CHAR_CODES = arrayFromLowtoHigh(33, 47).concat(
    arrayFromLowtoHigh(58, 64)
).concat(
    arrayFromLowtoHigh(123, 126)
)

//** Input Range **/

// Récuperation de l'input range et du nombre affiché
characterAmountNumber.addEventListener('input', syncCharacterAmount);
characterAmountRange.addEventListener('input', syncCharacterAmount);

// Fonction pour synchroniser l'input range et le nombre affiché
function syncCharacterAmount(e){
    const value = e.target.value;
    characterAmountNumber.value = value;
    characterAmountRange.value = value;
}

// Pour styliser la barre de recherche 
const rangeInputs = document.querySelectorAll('input[type="range"]');
const numberInput = document.querySelector('.pass-length-output');
// Fonction pour coloriser le fond de l'input range
function handleInputChange(e) {
  let target = e.target;
  if (e.target.type !== 'range') {
    target = document.getElementById('characterAmountRange');
  } 
  const min = target.min;
  const max = target.max;
  const val = target.value;

  // Applique le background en fonction de la position du curseur
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
}

rangeInputs.forEach(input => {
  input.addEventListener('input', handleInputChange);
})
numberInput.addEventListener('input', handleInputChange);
// ** Fin input range ** //

// soumission du formulaire 
form.addEventListener('submit', e =>{
    e.preventDefault();
    // Valeurs choisies par l'utilisateur
    const characterAmount = characterAmountNumber.value;

    // Variables qui n'existent que si checked 
    const includeUppercase = includeUppercaseElement.checked;
    const includeLowercase = includeLowercaseElement.checked;
    const includeNumbers = includeNumbersElement.checked;
    const includeSymbols = includeSymbolsElement.checked;
    const checkBoxs = document.querySelectorAll('.checkbox-input');

    // Au moins une checkbox doit etre checked pour lancer la fonction
    checkBoxs.forEach(box => {
        if(!box.checked == false){
            const password = generatePassword(characterAmount, includeUppercase,includeLowercase, includeNumbers, includeSymbols);
            passwordDisplay.innerText = password;
        }
        
    })

})

// ** Function pour generer le mot de passe ** //

function generatePassword(characterAmount, includeUppercase, includeLowercase, includeNumbers, includeSymbols){
    let charCodes = [];
    // Si Uppercase est check
    if (includeUppercase)charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
    // Si LowerCase est check
    if (includeLowercase) charCodes = charCodes.concat(LOWERCASE_CHAR_CODES)
    // Si symbole est check
    if (includeSymbols) charCodes = charCodes.concat(SYMBOL_CHAR_CODES);
    // Si number est check
    if (includeNumbers) charCodes = charCodes.concat(NUMBER_CHAR_CODES);

    const passwordCharacters = [];
    for (let i = 0; i < characterAmount; i++){
        const characterCode = charCodes[Math.floor(Math.random() * charCodes.length)];
        passwordCharacters.push(String.fromCharCode(characterCode));
    }
    return passwordCharacters.join('');
}

function arrayFromLowtoHigh(low, high){
    const array = [];
    for (let i = low; i <= high; i++){
        array.push(i);
    }
    return array;
}

// ** Fonction Copy password ** // 

// Event listener sur le copy btn
copyBtn.addEventListener("click",() => {
    // Lancer la fonction copy au click
    copyToClickBoard();
})
// Fonction copy lancée au click sur copy btn
function copyToClickBoard(){
    // Si aucun password n'a été généré on ne copie pas la valeur du champs
    if (passwordDisplay.innerText != "new password here"){
        // Span qui va afficher le message dans la div snackbar
        let copyStatusText = document.getElementById('copyStatusText');
        // Utilisation de l'API clipboard pour stocker la valeur dans le presse papier
        navigator.clipboard.writeText(passwordDisplay.value)
            .then(() => {
                // Si tout est ok, message :
                copyStatusText.innerText = "Successfully copied !";
                
            toast();
        })
            .catch(err => {
                // Si ça n'a pas marché :
                copyStatusText.innerText = "Copy Error";
            toast();
        })
    }
}
/** Fin fonction copie **/

// Notification quand le mot de passe a bien été copié
function toast(){
    // Récupérer la DIV snackbar qui va servir à afficher le message 
    const snackbar = document.getElementById("snackbar");
    // Ajout de la classe pour ajouter la DIV snackbar
    snackbar.className = "show";
    setTimeout(
      function(){
        // Enlève la classe "show" au bout de 3 secondes pour faire disparaitre la DIV
        snackbar.className = snackbar.className.replace("show", ""); 
      }, 
    3000);
};