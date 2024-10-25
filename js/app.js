// Selección de elementos del DOM
const carrito = document.querySelector('#carrito');
const listaCarrito = document.querySelector('#lista-carrito tbody');
const cursos = document.querySelector('#lista-cursos');
const vaciar = document.querySelector('#vaciar-carrito');
let articulosEnCarrito = []; // Array donde se almacenarán los objetos con los datos de los cursos en el carrito

// Inicializar los eventos al cargar la página
cargareventos(); // Llamada a la función que configura los eventos

function cargareventos() {
    // Evento para agregar un curso al carrito al hacer clic en el botón "Agregar al Carrito"
    cursos.addEventListener('click', agregarcurso); // Al hacer clic, se ejecutará la función "agregarcurso"

    carrito.addEventListener('click', eliminarArticulos);

     //llamar a los datos del localStorage
     document.addEventListener('DOMContentLoaded',()=>{
        articulosEnCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHtml()
    })
    
    vaciar.addEventListener('click', ()=>{
        articulosEnCarrito = [];
        limpiarHtml()
    })
   
}

// Función para manejar la adición de un curso al carrito
function agregarcurso(e) {
    e.preventDefault(); // Prevenir la acción por defecto del botón (evitar que recargue la página)
    
    // Verificar si el elemento clicado tiene la clase "agregar-carrito"
    if (e.target.classList.contains('agregar-carrito')) {

        // Obtener el elemento del curso seleccionado (navegar dos niveles arriba en el DOM)

        const cursoSeleccionado = e.target.parentElement.parentElement;
        
        // Leer y procesar los datos del curso seleccionado
        leerDatosCurso(cursoSeleccionado);
    }
}
// Función para eliminar artículos del carrito
function eliminarArticulos(e) {
    
    // Verifica si el elemento clicado tiene la clase 'borrar-curso'
    if (e.target.classList.contains('borrar-curso')) {
        
        // Obtiene el ID del curso del atributo 'data-id' del elemento clicado
        const cursoId = e.target.getAttribute('data-id');
        
        // Filtra los artículos en el carrito, eliminando el curso con el ID correspondiente
        //Si curso.id es igual a cursoId, la función devuelve false, lo que significa que este curso será excluido del nuevo arreglo.
        articulosEnCarrito = articulosEnCarrito.filter(curso => curso.id !== cursoId);

        // Actualiza el HTML del carrito para reflejar los cambios
        //reemplazando el arreglo original con uno actualizado que ya no incluye el curso eliminado.
        carritoHtml();
    }
}
    


// Función para leer los datos del curso desde el HTML y crear un objeto con esos datos
function leerDatosCurso(curso) {
    console.log(curso)//primero verifica los datos del curso en el html

    // Crear un objeto con la información del curso seleccionado
    const infoCurso = { 
        imagen: curso.querySelector('img').src, // Obtener la URL de la imagen del curso
        titulo: curso.querySelector('h4').textContent, // Obtener el título del curso
        precio: curso.querySelector('.precio span').textContent, // Obtener el precio del curso
        id: curso.querySelector('a').getAttribute('data-id'), // Obtener el ID del curso
        cantidad: 1 // Establecer la cantidad inicial del curso a 1
    }

    //Revisar si un objeto existe en el
    //Este código básicamente verifica si un curso ya está en el carrito. Si está, incrementa la cantidad del curso. Si no está, lo añade al carrito sin afectar los cursos ya presentes.
    //es un método de arrays que comprueba si al menos un elemento en el array cumple con una condición especificada, de esta forma vemos si ya esta un articulo.
    const existe = articulosEnCarrito.some(curso => curso.id === infoCurso.id);//Decimos si el curso es igual a la misma info(Repeticion de cursos)
    if(existe){
        const cursos = articulosEnCarrito.map(curso => {//map nos crea un nuevo array pero con el cambio osea la cantidad
            if (curso.id === infoCurso.id){
                curso.cantidad++;
                return curso;
            }else{
                return curso;
            }
           
        })
        articulosEnCarrito = [...cursos];
    }else{
         // Agregar el curso al array de artículos en el carrito
        // Hacemos una copia del array existente y añadimos el nuevo curso, para que no se pierdan los anteriormentes agregados
        articulosEnCarrito = [...articulosEnCarrito, infoCurso];
    }

    
    // Mostrar en la consola el contenido actualizado del carrito
    console.log(articulosEnCarrito);
    carritoHtml()
}

//Funciones para leer el objeto y crearlo en un html
function carritoHtml(){
    //limpiar html repetitivo, recordemos que hacemos una copia nueva del array cada que agregamos, por lo tanto se va borrando lo anterior
        limpiarHtml();

    //Recorre el carrito y genera el html
    articulosEnCarrito.forEach(curso=> {//recordemos que el foreach nos sirve para recorrer un array y asi no esta llamando una x una
        const row = document.createElement('tr');
        // Esta propiedad permite establecer o obtener el contenido HTML de un elemento. En este caso, se está asignando un bloque de HTML a la fila (<tr>).
        row.innerHTML= `
            <td>
                <img src=${curso.imagen} width=100>
                
            </td>
            <td>
                ${curso.titulo}
            </td>
            <td>
                ${curso.precio}
            </td>
            <td>
                ${curso.cantidad}
            </td>
            <td>
                <a href=# class='borrar-curso' data-id=${curso.id}> X </a>
            </td>
        `;
        //agregar carrito html al tbody
        listaCarrito.appendChild(row)//Aqui estamos colocando el html creado en el hijo de la clase listaCarrito - tbody

        sincrinizarStorage()
    });
}

function sincrinizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosEnCarrito))
}

function limpiarHtml(){
    //Este bucle while continúa ejecutándose mientras listaCarrito tenga al menos un hijo (es decir, mientras no esté vacío)
    //En cada iteración del bucle, se elimina el primer hijo de listaCarrito, limpiando así todo el contenido de este elemento.
    while(listaCarrito.firstChild){
        listaCarrito.removeChild(listaCarrito.firstChild);
    }
}

//Cantidades: