document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("preview");
    const resultado = document.getElementById("resultado");
    const loader = document.getElementById("loader");
    const prediccionText = document.getElementById("prediccion");
    const confianzaText = document.getElementById("confianza");
    const detallesDiv = document.getElementById("detalles");
    const predictBtn = document.getElementById("predictBtn");

    // Drag & drop
    dropZone.addEventListener("dragover", function (e) {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", function () {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", function (e) {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            mostrarPreview(files[0]);
        }
    });

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            mostrarPreview(fileInput.files[0]);
        }
    });

    function mostrarPreview(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }

    predictBtn.addEventListener("click", function () {
        const file = fileInput.files[0];
        if (!file) {
            alert("Selecciona una imagen.");
            return;
        }

        loader.style.display = "block";
        resultado.style.display = "none";

        const formData = new FormData();
        formData.append("file", file);

        fetch("http://192.168.1.64:5000/predict", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                loader.style.display = "none";

                if (data.error) {
                    alert("Error al hacer la predicción:\n" + data.error);
                    return;
                }

                prediccionText.textContent = data.class;
                confianzaText.textContent = data.confidence.toFixed(2) + "%";
                resultado.style.display = "block";

                const clases = ["coches_img", "plane_img", "train_img"];
                detallesDiv.innerHTML = "<h3>Detalles:</h3>";
                data.raw.forEach((prob, idx) => {
                    const porcentaje = (prob * 100).toFixed(2);
                    let emoji = "🔍";
                    if (clases[idx].includes("coche")) emoji = "🚗";
                    else if (clases[idx].includes("plane")) emoji = "✈️";
                    else if (clases[idx].includes("train")) emoji = "🚆";

                    detallesDiv.innerHTML += `<p>${emoji} ${clases[idx]}: <strong>${porcentaje}%</strong></p>`;
                });
            })
            .catch((error) => {
                loader.style.display = "none";
                alert("Error al hacer la predicción:\n" + error.message);
            });
    });
});
