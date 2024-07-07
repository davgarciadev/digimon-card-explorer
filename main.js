// Referenciamos los elementos del DOM 
const cardContainerElement = document.querySelector(".digimon-card-container");
const btnsElement = document.querySelectorAll(".btn");
const logoElement = document.querySelector(".logo");
const inputElement = document.getElementById("search")

// URLs de la API de Digimon
const URL_DIGIAPI = "https://digi-api.com/api/v1/digimon/"
const URL_PAGE = "https://digi-api.com/api/v1/digimon?page=4&pageSize=24"


// Añadimos los diferentes eventos a los elementos

// Evento al hacer clic en un botón de filtro de atributo, cargamos/filtramos aquellos que tengan dicho atributo
btnsElement.forEach( (btn) => {
    btn.addEventListener("click", (e)=>{
        getDigimonByAttribute(btn.id)
    })
})

// Evento al hacer clic en el logo cargamos todos los digimons en orden ascendente (id)
logoElement.addEventListener("click", (e) => {
    getDigimonPage() 
})

// Evento al presionar Enter en el input de búsqueda para buscar un Digimon por nombre
inputElement.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        getDigimonByName(e.target.value)
    }
    
})





let nextPage = "";

// 
/* Función asincróna para obtener y mostrar todos los Digimons en orden ascendente segun api(por id)
   @param {} void 
   ------------------------------------------------------------------- */
const getDigimonPage = async () => {
    // Resetear el contenido del contenedor de tarjetas
    cardContainerElement.innerHTML = "";

    // Realizar la solicitud a la API para obtener la página de Digimon
    const res = await fetch(URL_PAGE);
    const pageObj = await res.json();
    const digiList = pageObj.content;

    // Iterar sobre cada Digimon y crear una tarjeta para cada uno
    digiList.forEach((digi) => {
        fetch(digi.href)
            .then((res) => res.json())
            .then((digimon) => createDigimonCard(digimon)); // Llamar a la función para crear tarjetas de Digimon
    });


}


// 
/* Función asincróna para obtener y mostrar todos los Digimons que cumplan un atributo
   @param {string} attribute - Atributo deseado de los digimon 
   ------------------------------------------------------------------- */
const getDigimonByAttribute = async (attribute) => {
    // Resetear el contenido del contenedor de tarjetas
    cardContainerElement.innerHTML = "";

    // Iterar sobre los índices para obtener los Digimon correspondientes (excluyendo algunos específicos por motivos de la api)
    for (let i = 1; i < 25; i++) {
        if (i === 7 || i === 8 || i === 9 || i === 10 || i === 11 || i === 12 || i === 13 || i === 23) {
            // Saltar iteración si el índice está en la lista de exclusiones
            continue;
        } else {
            // Realizar la solicitud a la API para obtener el Digimon específico
            const response = await fetch(`${URL_DIGIAPI}${i}`);
            const digimon = await response.json();

            // Obtener el primer atributo del Digimon (si existe)
            const digimon_attribute = digimon.attributes.length > 0 ? digimon.attributes[0].attribute : "";

            // Solo creamos la tarjeta si el atributo coincide o es "all"
            if (digimon_attribute.toLowerCase() === attribute || attribute === "all") {
                createDigimonCard(digimon); // Llamar a la función para crear tarjetas de Digimon
            }
        }
    }
}





//
/* Función asíncrona para obtener un Digimon por su nombre
   @param {string} name - Nombre del digimon que se desea buscar
   ------------------------------------------------------------------- */
   const getDigimonByName = async (name) => {
    try {
         // Realizar la petición GET al API con el nombre del Digimon
        const response = await fetch(`${URL_DIGIAPI}${name}`);

        if (!response.ok) {
            throw new Error(`Error`); // Lanzar un error si la respuesta no es satisfactoria
        }

        cardContainerElement.innerHTML = ""; // Limpiar el contenido actual del contenedor de tarjetas
        const digimon = await response.json(); 
        createDigimonCard(digimon); // Llamar a la función para crear la tarjeta del Digimon con los datos obtenidos

    } catch (err) {
        console.error("Error al obtener el Digimon:", name); // Mostrar un mensaje de error en la consola si ocurre un problema durante la obtención del Digimon
    }
}



/* Función asíncrona para crear una tarjeta pasada el objeto de Digimon
   @param {obj} digimon - Objeto devuelto por la api que representa un digimon.
   ------------------------------------------------------------------- */
const createDigimonCard = (digimon) => {
    // Crear un nuevo elemento div para la tarjeta de Digimon
    const card = document.createElement("div");
    card.classList.add("digimon-card"); 

    // Generar el HTML para los atributos del Digimon (si existen)
    const attributeHtml = digimon.attributes.length > 0
        ? digimon.attributes.map(obj => `<p class="attribute ${obj.attribute.toLowerCase()}">${obj.attribute}</p>`).join("")
        : `<p class="attribute other">???</p>`; // Si no hay atributos, mostrar "???"

    // Generar el HTML para los tipos del Digimon (si existen)
    const typeHtml = digimon.types.length > 0
        ? digimon.types.map(obj => `<p class="type">${obj.type}</p>`).join("")
        : `<p class="type">???</p>`; // Si no hay tipos, mostrar "???"

    // Determinar el nivel del Digimon y establecer el número de estrellas y color correspondiente
    const level = digimon.levels.length > 0 ? digimon.levels[0].level : "Other"; 
    let starNumber = 0;
    let color = "white"; 

    switch (level) {
        case "Baby I":
            starNumber = 1;
            color = "lightpink";
            break;
        case "Baby II":
            starNumber = 2;
            color = "lightgreen";
            break;
        case "Child":
            starNumber = 3;
            color = "greenyellow";
            break;
        case "Adult":
            starNumber = 4;
            color = "yellow";
            break;
        case "Perfect":
            starNumber = 5;
            color = "orange";
            break;
        case "Ultimate":
            starNumber = 6;
            color = "red";
            break;
        case "Hybrid":
        case "Armor":
            starNumber = 4;
            color = level === "Hybrid" ? "gray" : "brown"; 
            break;
        default:
            starNumber = 1; // Si el nivel no coincide con ninguno, mostrar una estrella
    }

    // Generar el HTML para las estrellas según el número y color determinados
    let htmlStars = "";
    for (let i = 0; i < starNumber; i++) {
        htmlStars += `<i class="fa-solid fa-star star-icon" style="color: ${color}"></i>`;
    }

    // Generar el contenido html completo de la tarjeta de Digimon anexando la info anterior
    const content = `
        <div class="digimon-level">
            <p class="level-title" style="color: ${color}">${digimon.levels.length > 0 ? digimon.levels[0].level : "¿?" }</p>
            <div class="level-star-container">
                ${htmlStars}
            </div>
        </div>

        <div class="digimon-title">
            <p class="title-id">#${digimon.id}</p>
            <h2 class="digimon-name">${digimon.name}</h2>
        </div>

        <div class="digimon-img-container">
            <img src="${digimon.images[0].href}" alt="" class="digimon-img">
        </div>

        <div class="digimon-attribute">
            ${attributeHtml}
        </div>

        <div class="digimon-type">
            ${typeHtml}
        </div>
    `;

    card.innerHTML = content; // Insertar el contenido HTML generado dentro del elemento div de la tarjeta
    cardContainerElement.appendChild(card); // Añadir la tarjeta de Digimon al contenedor de tarjetas
}



// Al comienzar nuestra app mostramos todos los digimons
getDigimonByAttribute("all")

