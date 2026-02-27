const statusDiv = document.getElementById('status');
const inputCod = document.getElementById('codigo');

// Función para guardar
function saveData() {
    const val = inputCod.value;
    if(!val) return;

    let list = JSON.parse(localStorage.getItem('my_codes')) || [];
    list.push({ id: Date.now(), code: val });
    localStorage.setItem('my_codes', JSON.stringify(list));
    
    inputCod.value = '';
    updateUI();
    syncData(); // Intentar enviar si hay red
}

// Función para enviar al servidor
async function syncData() {
    if (!navigator.onLine) {
        updateUI();
        return;
    }

    let list = JSON.parse(localStorage.getItem('my_codes')) || [];
    if (list.length === 0) return;

    statusDiv.innerText = "Enviando datos al servidor...";

    try {
        // AQUÍ pones la URL de tu servidor
        const response = await fetch('https://tu-servidor.com/api', {
            method: 'POST',
            body: JSON.stringify(list),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok) {
            localStorage.removeItem('my_codes'); // Limpiar si se envió bien
            updateUI();
        }
    } catch (e) {
        updateUI();
    }
}

function updateUI() {
    let list = JSON.parse(localStorage.getItem('my_codes')) || [];
    let net = navigator.onLine ? '<span class="online">ONLINE</span>' : '<span class="offline">OFFLINE</span>';
    statusDiv.innerHTML = `Estado: ${net}<br>Pendientes de enviar: ${list.length}`;
}

// Escuchar cuando vuelve el internet
window.addEventListener('online', syncData);
window.addEventListener('offline', updateUI);
updateUI();
