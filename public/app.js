// Cargar todos los panuchos al iniciar
document.addEventListener('DOMContentLoaded', cargarPanuchos);

// Agregar Panucho
document.getElementById('panuchoForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('panuchoNombre').value;
  const ingredientes = document.getElementById('panuchoIngredientes').value;

  await fetch('/api/panuchos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, ingredientes }),
  });

  cargarPanuchos();
});

// Buscar Panucho
document.getElementById('buscarPanuchoBtn').addEventListener('click', async () => {
  const nombre = document.getElementById('buscarPanucho').value;

  const res = await fetch(`/api/panuchos/buscar/${nombre}`);
  const panuchos = await res.json();

  mostrarLista(panuchos, 'panuchoList', 'panuchos');
});

// Cargar todos los panuchos
async function cargarPanuchos() {
  const res = await fetch('/api/panuchos');
  const panuchos = await res.json();
  mostrarLista(panuchos, 'panuchoList', 'panuchos');
}

// Mostrar lista con opciones de edición y eliminación
function mostrarLista(items, listaId, tipo) {
  const lista = document.getElementById(listaId);
  lista.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - ${item.ingredientes || item.correo || item.puesto}`;

    const editarBtn = document.createElement('button');
    editarBtn.textContent = 'Editar';
    editarBtn.addEventListener('click', () => editarItem(item.id, tipo));

    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.addEventListener('click', () => eliminarItem(item.id, tipo));

    li.appendChild(editarBtn);
    li.appendChild(eliminarBtn);
    lista.appendChild(li);
  });
}

// Editar un ítem
async function editarItem(id, tipo) {
  const nombre = prompt('Nuevo nombre:');
  let extra = '';

  if (tipo === 'panuchos') {
    extra = prompt('Nuevos ingredientes:');
  } else if (tipo === 'clientes') {
    extra = prompt('Nuevo correo:');
  } else if (tipo === 'empleados') {
    extra = prompt('Nuevo puesto:');
  }

  await fetch(`/api/${tipo}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      ...(tipo === 'panuchos' && { ingredientes: extra }),
      ...(tipo === 'clientes' && { correo: extra }),
      ...(tipo === 'empleados' && { puesto: extra }),
    }),
  });

  if (tipo === 'panuchos') cargarPanuchos();
  if (tipo === 'clientes') cargarClientes();
  if (tipo === 'empleados') cargarEmpleados();
}

// Eliminar un ítem
async function eliminarItem(id, tipo) {
  await fetch(`/api/${tipo}/${id}`, {
    method: 'DELETE',
  });

  if (tipo === 'panuchos') cargarPanuchos();
  if (tipo === 'clientes') cargarClientes();
  if (tipo === 'empleados') cargarEmpleados();
}

// Cargar todos los clientes al iniciar
document.addEventListener('DOMContentLoaded', cargarClientes);

// Agregar Cliente
document.getElementById('clienteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('clienteNombre').value;
  const correo = document.getElementById('clienteCorreo').value;

  await fetch('/api/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo }),
  });

  cargarClientes();
});

// Buscar Cliente
document.getElementById('buscarClienteBtn').addEventListener('click', async () => {
  const nombre = document.getElementById('buscarCliente').value;

  const res = await fetch(`/api/clientes/buscar/${nombre}`);
  const clientes = await res.json();

  mostrarLista(clientes, 'clienteList', 'clientes');
});

// Cargar todos los clientes
async function cargarClientes() {
  const res = await fetch('/api/clientes');
  const clientes = await res.json();
  mostrarLista(clientes, 'clienteList', 'clientes');
}


// Cargar todos los empleados al iniciar
document.addEventListener('DOMContentLoaded', cargarEmpleados);

// Agregar Empleado
document.getElementById('empleadoForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('empleadoNombre').value;
  const puesto = document.getElementById('empleadoPuesto').value;

  await fetch('/api/empleados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, puesto }),
  });

  cargarEmpleados();
});

// Buscar Empleado
document.getElementById('buscarEmpleadoBtn').addEventListener('click', async () => {
  const nombre = document.getElementById('buscarEmpleado').value;

  const res = await fetch(`/api/empleados/buscar/${nombre}`);
  const empleados = await res.json();

  mostrarLista(empleados, 'empleadoList', 'empleados');
});

// Cargar todos los empleados
async function cargarEmpleados() {
  const res = await fetch('/api/empleados');
  const empleados = await res.json();
  mostrarLista(empleados, 'empleadoList', 'empleados');
}

// Cargar pedidos
async function cargarPedidos() {
  const res = await fetch('/api/pedidos');
  const pedidos = await res.json();
  mostrarLista(pedidos, 'pedidoList', 'pedidos');
}

// Crear pedido
document.getElementById('pedidoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const cliente_id = document.getElementById('pedidoCliente').value;
  const panucho_id = document.getElementById('pedidoPanucho').value;
  const empleado_id = document.getElementById('pedidoEmpleado').value;
  const cantidad = document.getElementById('pedidoCantidad').value;

  await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente_id, panucho_id, empleado_id, cantidad }),
  });

  cargarPedidos();
});

// Cargar opciones dinámicas
async function cargarOpciones() {
  const clientes = await fetch('/api/clientes').then((res) => res.json());
  const panuchos = await fetch('/api/panuchos').then((res) => res.json());
  const empleados = await fetch('/api/empleados').then((res) => res.json());

  llenarSelector(clientes, 'pedidoCliente', 'id', 'nombre');
  llenarSelector(panuchos, 'pedidoPanucho', 'id', 'nombre');
  llenarSelector(empleados, 'pedidoEmpleado', 'id', 'nombre');
}

function llenarSelector(items, selectorId, valueKey, textKey) {
  const selector = document.getElementById(selectorId);
  selector.innerHTML = `<option value="" disabled selected>Selecciona una opción</option>`;
  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item[valueKey];
    option.textContent = item[textKey];
    selector.appendChild(option);
  });
}

function mostrarLista(items, listaId, tipo) {
  const lista = document.getElementById(listaId);
  lista.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');

    if (tipo === 'pedidos') {
      li.textContent = `${item.cliente} pidió ${item.cantidad} de ${item.panucho}, atendido por ${item.empleado}. Estado: ${item.estado}`;
    } else {
      li.textContent = `${item.nombre} - ${item.ingredientes || item.correo || item.puesto}`;
    }

    lista.appendChild(li);
  });
}


// Cargar datos iniciales
document.addEventListener('DOMContentLoaded', () => {
  cargarPedidos();
  cargarOpciones();
});

  