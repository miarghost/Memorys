// Simulando datos de usuarios y memorias
const usuarios = [
    { id: 1, nombre: "Martin Tincho", fotoPerfil: "perfil.jpg" },
    { id: 2, nombre: "Barbery", fotoPerfil: "perfil2.jpg" }
];

const memorias = [
    { id: 1, usuarioId: 1, tipo: "foto", contenido: "image.jpg", nota: "ACA EN EL PARQUE PROGRAMANDO" },
    { id: 2, usuarioId: 2, tipo: "video", contenido: "image2.jpg", nota: "En la playa tirándome de clavado (MIENTRAS PROGRAMO)" }
];

// Función para crear y agregar una memoria al feed
function agregarMemoriaAlFeed(memoria) {
    const usuario = usuarios.find(u => u.id === memoria.usuarioId);
    const memoriaElement = document.createElement("div");
    memoriaElement.classList.add("memoria", "flip-container");
    memoriaElement.innerHTML = `
        <div class="flipper">
            <div class="back">
                <img src="${usuario.fotoPerfil}" alt="${usuario.nombre}" class="profile-pic">
                <p>${usuario.nombre}</p>
                <p>${memoria.nota}</p>
            </div>
            <div class="front">
                <img src="${memoria.contenido}" alt="${memoria.nota}" class="front-img">
            </div>
        </div>
    `;
    const feed = document.getElementById("feed");
    feed.appendChild(memoriaElement);
}

// Cargar memorias en el feed inicialmente
const feed = document.getElementById("feed");
memorias.forEach(memoria => {
    agregarMemoriaAlFeed(memoria);
});

// Función para buscar un usuario por ID
function findUserById(userId) {
    return usuarios.find(user => user.id === parseInt(userId));
}

// Obtener elementos del formulario
const uploadForm = document.getElementById("uploadForm");
const closeFormButton = document.getElementById("closeForm");
const usuarioIdInput = document.getElementById("usuarioId"); // Campo de ID de usuario
const tipoInput = document.getElementById("tipo");
const capturePhotoButton = document.getElementById("capturePhoto");
const photoCanvas = document.getElementById("photoCanvas");
const capturedImage = document.getElementById("capturedImage");
const notaInput = document.getElementById("nota");

// Manejar clic en el botón "Subir Memoria"
const uploadButton = document.getElementById("uploadButton");
uploadButton.addEventListener("click", () => {
    // Mostrar el formulario
    uploadForm.classList.remove("hidden");
    // Restaurar elementos ocultos
    capturedImage.style.display = "none";
    photoCanvas.style.display = "none";
});

// Manejar clic en el botón "Tomar Foto"
capturePhotoButton.addEventListener("click", () => {
    // Mostrar la cámara y ocultar otros elementos
    photoCanvas.style.display = "block";
    capturedImage.style.display = "none";

    // Capturar una foto desde la cámara y mostrarla en el canvas
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            const video = document.createElement('video');
            document.body.appendChild(video);
            video.srcObject = stream;
            video.onloadedmetadata = function (e) {
                video.play();
                photoCanvas.width = video.videoWidth;
                photoCanvas.height = video.videoHeight;
                const context = photoCanvas.getContext('2d');
                context.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);
                video.srcObject.getVideoTracks()[0].stop();
                video.remove();
                capturedImage.src = photoCanvas.toDataURL('image/png');
                capturedImage.style.display = "block";
                photoCanvas.style.display = "none";
            };
        })
        .catch(function (err) {
            console.error('Error al acceder a la cámara:', err);
        });
});

// Manejar clic en el botón "Cerrar"
closeFormButton.addEventListener("click", () => {
    // Ocultar el formulario y restaurar elementos ocultos
    uploadForm.classList.add("hidden");
    capturedImage.style.display = "none";
    photoCanvas.style.display = "none";
});

// Manejar envío del formulario
uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const usuarioId = usuarioIdInput.value;
    const tipo = tipoInput.value;
    const contenido = capturedImage.src; // Usar la imagen capturada como contenido
    const nota = notaInput.value;

    // Verificar si el usuario existe
    const usuario = findUserById(usuarioId);

    if (!usuario) {
        // Si el usuario no existe, mostrar una alerta
        alert("El usuario no existe. Verifica el ID de usuario.");
        return; // No subir la memoria si el usuario no existe
    }

    // Crear un objeto memoria con los datos del formulario
    const nuevaMemoria = {
        id: memorias.length + 1,
        usuarioId: usuario.id, // Asociar el ID del usuario
        tipo: tipo,
        contenido: contenido,
        nota: nota
    };

    // Agregar la nueva memoria al feed
    agregarMemoriaAlFeed(nuevaMemoria);

    // Después de procesar la subida, puedes ocultar el formulario nuevamente
    uploadForm.classList.add("hidden");

    // También puedes enviar los datos al servidor o realizar otras acciones según tus necesidades
});
