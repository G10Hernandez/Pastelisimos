let productos = [];
let carrito = [];
const telefonoPasteleria = "525512345678"; // <-- cambia al número real

// Cargar productos desde productos.json
fetch("productos.json")
  .then(response => response.json())
  .then(data => {
    productos = data;
    renderizarProductos(productos);
    generarCategorias();
  })
  .catch(error => console.error("Error al cargar productos:", error));

// Renderizar productos
function renderizarProductos(lista) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  lista.forEach(prod => {
    const item = document.createElement("div");
    item.classList.add("producto");

    item.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" />
      <h3>${prod.nombre}</h3>
      <p class="categoria">${prod.categoria}</p>
      <p class="precio">$${prod.precio} MXN</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedor.appendChild(item);
  });
}

// Generar categorías dinámicas
function generarCategorias() {
  const contenedor = document.getElementById("categorias");
  contenedor.innerHTML = "";

  const categorias = ["Todos", ...new Set(productos.map(p => p.categoria))];

  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat;
    btn.onclick = () => filtrarCategoria(cat);
    contenedor.appendChild(btn);
  });
}

// Agregar al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const existente = carrito.find(item => item.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  renderizarCarrito();
}

// Renderizar carrito
function renderizarCarrito() {
  const contenedor = document.getElementById("carrito-items");
  const totalEl = document.getElementById("total");
  contenedor.innerHTML = "";

  let total = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    const div = document.createElement("div");
    div.classList.add("carrito-item");

    div.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${item.precio * item.cantidad}</span>
      <button onclick="eliminarDelCarrito(${item.id})">❌</button>
    `;
    contenedor.appendChild(div);
  });

  totalEl.innerText = `Total: $${total} MXN`;
}

// Eliminar un producto del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  renderizarCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
  carrito = [];
  renderizarCarrito();
}

// Enviar pedido por WhatsApp
function enviarPedido() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = "¡Hola! Me gustaría hacer un pedido:%0A";
  carrito.forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad} = $${item.precio * item.cantidad}%0A`;
  });

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  mensaje += `%0ATotal: $${total} MXN`;

  const url = `https://wa.me/${telefonoPasteleria}?text=${mensaje}`;
  window.open(url, "_blank");
}

// Filtrar por categoría
function filtrarCategoria(cat) {
  if (cat === "Todos") {
    renderizarProductos(productos);
  } else {
    const filtrados = productos.filter(p => p.categoria === cat);
    renderizarProductos(filtrados);
  }
}

// Buscar productos
function buscarProductos() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
  renderizarProductos(filtrados);
}
