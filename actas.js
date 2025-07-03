document.addEventListener("DOMContentLoaded", () => {
    const btnAgregarProducto = document.getElementById("btnAgregarProducto");
    const contenedorGeneral = document.getElementById("contenedorGeneral");
    const btnCrearActa = document.getElementById("btnCrearActa");
    const numeroActaElem = document.getElementById("numeroActa");

    let formularios = [];
    let numeroActa = null;

    btnAgregarProducto.addEventListener("click", () => {
        crearFormularioProducto();
    });

    btnCrearActa.addEventListener("click", async () => {
        const usuario = prompt("¿Qué usuario recibe los equipos?");
        if (!usuario) return;

        try {
            const response = await fetch("http://localhost:3000/api/acta");
            const data = await response.json();

            numeroActa = data.numeroActa;
            numeroActaElem.textContent = `ACTA N.- ${numeroActa}`;
            generarPDF(usuario, numeroActa);
        } catch (error) {
            console.error("Error al generar el número de acta:", error);
            alert("Error al generar el número de acta.");
        }
    });

    function crearFormularioProducto() {
        const formulario = document.createElement("div");
        formulario.classList.add("formulario-container");

        const filaDetalle = document.createElement("div");
        filaDetalle.classList.add("fila-horizontal");
        const inputDetalle = document.createElement("input");
        inputDetalle.classList.add("input-detalle");
        inputDetalle.type = "text";
        inputDetalle.placeholder = "Nombre del producto (Ej. LAPTOP DELL...)";
        filaDetalle.appendChild(inputDetalle);
        formulario.appendChild(filaDetalle);

        const btnAgregarItem = document.createElement("button");
        btnAgregarItem.textContent = "Agregar Ítem";
        btnAgregarItem.classList.add("boton-agregar");
        btnAgregarItem.style.margin = "20px auto";
        formulario.appendChild(btnAgregarItem);

        const contenedorItems = document.createElement("div");
        formulario.appendChild(contenedorItems);

        btnAgregarItem.addEventListener("click", () => {
            agregarFilaFormulario(contenedorItems);
        });

        contenedorGeneral.appendChild(formulario);
        formularios.push({ inputDetalle, contenedorItems });
    }

    function agregarFilaFormulario(contenedor) {
        const fila = document.createElement("div");
        fila.classList.add("fila");

        const campoID = document.createElement("div");
        campoID.classList.add("campo");
        const labelID = document.createElement("label");
        labelID.textContent = "ID";
        const inputID = document.createElement("input");
        inputID.type = "text";
        inputID.placeholder = "INGRESA ID";
        campoID.appendChild(labelID);
        campoID.appendChild(inputID);

        const campoAlmacen = document.createElement("div");
        campoAlmacen.classList.add("campo");
        const labelAlmacen = document.createElement("label");
        labelAlmacen.textContent = "ALMACÉN";
        const inputAlmacen = document.createElement("input");
        inputAlmacen.type = "text";
        inputAlmacen.placeholder = "OFICINA";
        campoAlmacen.appendChild(labelAlmacen);
        campoAlmacen.appendChild(inputAlmacen);

        fila.appendChild(campoID);
        fila.appendChild(campoAlmacen);
        contenedor.appendChild(fila);
    }

    function generarPDF(usuario, numeroActa) {
        const img = new Image();
        img.src = "img/encabezado.jpg";

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL("image/jpeg", 1.0);

            const doc = new window.jspdf.jsPDF();
            const fecha = new Date().toLocaleDateString();
            const pageHeight = doc.internal.pageSize.height;
            let y = 58;

            function insertarEncabezado() {
                doc.addImage(imgData, "JPEG", 30, 10, 150, 25);
                y = 10 + 25 + 10;

                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.text(`ACTA N.- ${numeroActa}`, 20, y);
                doc.setFont(undefined, 'normal');
                doc.text(`Fecha: ${fecha}`, 200, y, { align: "right" });

                y += 15;

                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text("Autorización de salida de equipo", 105, y, { align: "center" });

                y += 15;

                // Footer en cada hoja
                doc.setFontSize(18);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(150);
                doc.text(`Recibido por: ${usuario}`, 20, pageHeight - 20);
                doc.setTextColor(0);
            }

            insertarEncabezado();

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal'); // ✅ Texto del párrafo sin negritas
            const parrafo = "El Departamento de Activos Tecnológicos procede con la entrega de los equipos tecnológicos que se detallan a continuación, como parte del proceso de gestión y control institucional de recursos. A partir de este momento, dichos equipos quedan bajo la responsabilidad del usuario receptor, quien se compromete a darles un uso adecuado y a velar por su conservación y correcto funcionamiento.";
            const parrafoJustificado = doc.splitTextToSize(parrafo, 170);
            doc.text(parrafoJustificado, 20, y);
            y += parrafoJustificado.length * 6 + 10;

            formularios.forEach(({ inputDetalle, contenedorItems }) => {
                const nombreProducto = inputDetalle.value.trim();
                if (!nombreProducto) return;

                if (y > 270) {
                    doc.addPage();
                    insertarEncabezado();
                }

                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.text(nombreProducto, 20, y);
                y += 6;

                doc.setFont(undefined, 'normal');
                doc.text("ID", 20, y);
                doc.text("ALMACÉN", 80, y);
                y += 6;

                const filas = contenedorItems.querySelectorAll(".fila");
                filas.forEach(fila => {
                    const inputs = fila.querySelectorAll("input");
                    if (inputs.length >= 2) {
                        const id = inputs[0].value.trim();
                        const almacen = inputs[1].value.trim();
                        if (id || almacen) {
                            if (y > 270) {
                                doc.addPage();
                                insertarEncabezado();
                            }
                            doc.text(id, 20, y);
                            doc.text(almacen, 80, y);
                            y += 6;
                        }
                    }
                });

                y += 10;
            });

            doc.save(`acta-${numeroActa}.pdf`);
        };
    }
});



























