"use strict";

/*
  
  - Usamos un arreglo para guardar los nombres (listaAmigos).
  - Función agregarAmigo(): valida, agrega y actualiza la UI.
  - Función sortearAmigo(): elige uno al azar, lo quita de la lista y lo pasa a historial.
  - Manipulación del DOM para mostrar lista, resultado y estado de botones.
*/

(() => {
  // --- Estado ---
  const listaAmigos = [];     // participantes disponibles para sortear
  const historial = [];       // nombres ya sorteados (sin repetirse)

  // --- Elementos del DOM ---
  const $input       = document.querySelector("#nombreInput");
  const $btnAgregar  = document.querySelector("#btnAgregar");
  const $btnSortear  = document.querySelector("#btnSortear");
  const $btnReiniciar= document.querySelector("#btnReiniciar");
  const $listaUI     = document.querySelector("#listaAmigos");
  const $contador    = document.querySelector("#contador");
  const $resultado   = document.querySelector("#resultado");
  const $historialUI = document.querySelector("#historialSorteos");
  const $mensaje     = document.querySelector("#mensaje");

  // --- Utilidades ---
  const normalizar = (s) => s.trim().replace(/\s+/g, " ");
  const mostrarMensaje = (texto, tipo="ok") => {
    $mensaje.textContent = texto;
    $mensaje.className = `mensaje ${tipo}`;
    if (texto) setTimeout(() => { $mensaje.textContent = ""; $mensaje.className = "mensaje"; }, 2500);
  };

  const actualizarBotones = () => {
    $btnSortear.disabled   = listaAmigos.length === 0;
    $btnReiniciar.disabled = listaAmigos.length === 0 && historial.length === 0;
  };

  const renderLista = () => {
    $listaUI.innerHTML = "";
    listaAmigos.forEach((nombre, idx) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = nombre;
      span.className = "nombre";

      const btnDel = document.createElement("button");
      btnDel.title = `Eliminar a ${nombre}`;
      btnDel.textContent = "✕";
      btnDel.addEventListener("click", () => {
        eliminarAmigo(idx);
      });

      li.appendChild(span);
      li.appendChild(btnDel);
      $listaUI.appendChild(li);
    });
    $contador.textContent = String(listaAmigos.length);
  };

  const renderHistorial = () => {
    $historialUI.innerHTML = "";
    historial.forEach((nombre, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${nombre}`;
      $historialUI.appendChild(li);
    });
  };

  const renderTodo = () => {
    renderLista();
    renderHistorial();
    actualizarBotones();
  };

  // --- Acciones principales ---
  function agregarAmigo() {
    let nombre = normalizar($input.value);

    if (!nombre) {
      mostrarMensaje("Escribe un nombre válido.", "error");
      return;
    }
    // evita duplicados (insensible a mayúsculas)
    const existe = listaAmigos.some(n => n.toLowerCase() === nombre.toLowerCase());
    if (existe) {
      mostrarMensaje(`"${nombre}" ya está en la lista.`, "error");
      return;
    }

    listaAmigos.push(nombre);
    mostrarMensaje(`Agregado: ${nombre}`, "ok");
    $input.value = "";
    $input.focus();
    renderTodo();
  }

  function eliminarAmigo(index) {
    const eliminado = listaAmigos.splice(index, 1)[0];
    mostrarMensaje(`Eliminado: ${eliminado}`, "ok");
    renderTodo();
  }

  function sortearAmigo() {
    if (listaAmigos.length === 0) {
      mostrarMensaje("No hay participantes para sortear.", "error");
      return;
    }
    const indiceAleatorio = Math.floor(Math.random() * listaAmigos.length);
    const elegido = listaAmigos.splice(indiceAleatorio, 1)[0]; // quita de la bolsa
    historial.push(elegido);

    // Muestra el resultado con un pequeño efecto
    $resultado.textContent = `🎉 ${elegido}`;
    renderTodo();
  }

  function reiniciar() {
    listaAmigos.length = 0;
    historial.length = 0;
    $resultado.textContent = "";
    mostrarMensaje("Todo limpio. ¡Comienza de nuevo!");
    renderTodo();
    $input.focus();
  }

  // --- Eventos ---
  $btnAgregar.addEventListener("click", agregarAmigo);
  $input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") agregarAmigo();
  });
  $btnSortear.addEventListener("click", sortearAmigo);
  $btnReiniciar.addEventListener("click", reiniciar);

  // Render inicial
  renderTodo();
})();
