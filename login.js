async function verificarLogin() {
  const correoInput = document.getElementById("correo").value.trim();
  const passwordInput = document.getElementById("password").value.trim();
  const mensaje = document.getElementById("mensaje");

  try {
    const response = await fetch("login.json");
    const usuarios = await response.json();

    const existe = usuarios.some(
      usuario => usuario.correo === correoInput && usuario.password === passwordInput
    );

    if (existe) {
      window.location.href = "actas.html"; // ✅ Redirige a actas.html
    } else {
      mensaje.textContent = "❌ Usuario no registrado. Acceso denegado.";
      mensaje.style.color = "red";
    }
  } catch (error) {
    console.error("Error al cargar login.json:", error);
    mensaje.textContent = "Error de conexión con el servidor.";
    mensaje.style.color = "orange";
  }
}
