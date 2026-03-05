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
    // 1. Obtener la lista del almacenamiento local
    let list = JSON.parse(localStorage.getItem('my_codes')) || [];
    
    // 2. Actualizar texto de estado y red
    let net = navigator.onLine ? 
        '<span style="color:green">● Conectado</span>' : 
        '<span style="color:orange">○ Offline (Guardando en móvil)</span>';
    
    document.getElementById('status').innerHTML = `Red: ${net}<br>Pendientes: <b>${list.length}</b>`;

    // 3. Limpiar y rellenar la lista visual
    const listaHTML = document.getElementById('lista-codigos');
    listaHTML.innerHTML = ""; // Borramos lo que hubiera antes

    if (list.length === 0) {
        listaHTML.innerHTML = "<li>(Vacío)</li>";
    } else {
        // Por cada código en el móvil, creamos un puntito en la lista
        list.forEach((item) => {
            let li = document.createElement('li');
            li.textContent = item.code;
            listaHTML.appendChild(li);
        });
    }
}

// Escuchar cuando vuelve el internet
window.addEventListener('online', syncData);
window.addEventListener('offline', updateUI);
updateUI();
