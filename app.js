let lista = JSON.parse(localStorage.getItem("lista")) || [];

const presupuestoInput = document.getElementById("presupuesto");
const totalSpan = document.getElementById("total");
const nombreInput = document.getElementById("nombre");
const cantidadInput = document.getElementById("cantidad");
const precioInput = document.getElementById("precio");
const subtotalP = document.getElementById("subtotal");
const listaUl = document.getElementById("lista");
const agregarBtn = document.getElementById("agregar");
const limpiarBtn = document.getElementById("limpiar");

function renderLista() {
  listaUl.innerHTML = "";
  let total = 0;
  const presupuesto = parseFloat(presupuestoInput.value) || 0;

  lista.forEach((item, index) => {
    const subtotal = item.cantidad * item.precio;
    total += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${item.nombre}</strong><br>
        <small>Cant: ${item.cantidad} | Precio: $${item.precio.toFixed(2)}</small>
      </div>
      <span>$${subtotal.toFixed(2)}</span>
    `;
    li.onclick = () => eliminar(index);
    listaUl.appendChild(li);
  });

  const diferencia = presupuesto - total;
  let color = "#fff";
  if (diferencia <= 0 && total > 0) color = "red";
  else if (diferencia <= presupuesto * 0.4 && total > 0) color = "orange";

  totalSpan.style.color = color;
  totalSpan.textContent = `Total: $${total.toFixed(2)}`;

  localStorage.setItem("lista", JSON.stringify(lista));
}

function agregar() {
  const nombre = nombreInput.value.trim();
  const cantidad = parseInt(cantidadInput.value);
  const precio = parseFloat(precioInput.value);

  if (!nombre || isNaN(cantidad) || isNaN(precio)) return;

  lista.push({ nombre, cantidad, precio });
  nombreInput.value = cantidadInput.value = precioInput.value = "";
  subtotalP.textContent = "Subtotal: $0.00";
  renderLista();
}

function eliminar(index) {
  lista.splice(index, 1);
  renderLista();
}

function limpiar() {
  lista = [];
  renderLista();
}

// 🧮 Mostrar subtotal en tiempo real
function calcularSubtotal() {
  const cantidad = parseInt(cantidadInput.value) || 0;
  const precio = parseFloat(precioInput.value) || 0;
  const subtotal = cantidad * precio;
  subtotalP.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
}

cantidadInput.addEventListener("input", calcularSubtotal);
precioInput.addEventListener("input", calcularSubtotal);

agregarBtn.onclick = agregar;
limpiarBtn.onclick = limpiar;
presupuestoInput.oninput = renderLista;

renderLista();

// PWA Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
