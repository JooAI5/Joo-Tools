(function () {
    window.JooTools = window.JooTools || {};

    window.JooTools.imageConverter = {
        init(container) {
            container.innerHTML = `
                <div class="jt-pro-tool">
                    <div class="jt-tool-head">
                        <div class="jt-tool-symbol">🔄</div>
                        <div>
                            <h2>Image Converter</h2>
                            <p>Convert images to PNG, JPG or WebP directly in your browser.</p>
                        </div>
                    </div>

                    <label class="jt-upload" id="convertDrop">
                        <input id="convertInput" type="file" accept="image/*" hidden>
                        <div class="jt-upload-icon">📁</div>
                        <strong>Choose Image</strong>
                        <span>or drag & drop an image here</span>
                    </label>

                    <div id="convertWorkspace" hidden>
                        <div class="jt-image-preview">
                            <img id="convertPreview" alt="Image preview">
                        </div>

                        <label>
                            Convert to
                            <select id="convertFormat">
                                <option value="image/png">PNG</option>
                                <option value="image/jpeg">JPG</option>
                                <option value="image/webp">WebP</option>
                            </select>
                        </label>

                        <div class="jt-actions">
                            <button id="convertBtn" class="jt-primary">
                                🔄 Convert Image
                            </button>

                            <button id="convertDownload" class="jt-secondary" disabled>
                                ⬇️ Download
                            </button>

                            <button id="convertClear" class="jt-secondary">
                                🗑️ Clear
                            </button>
                        </div>

                        <div id="convertResult" class="jt-result"></div>

                        <canvas id="convertCanvas" hidden></canvas>
                    </div>
                </div>
            `;

            const input = container.querySelector("#convertInput");
            const drop = container.querySelector("#convertDrop");
            const workspace = container.querySelector("#convertWorkspace");
            const preview = container.querySelector("#convertPreview");
            const format = container.querySelector("#convertFormat");
            const convertBtn = container.querySelector("#convertBtn");
            const downloadBtn = container.querySelector("#convertDownload");
            const clearBtn = container.querySelector("#convertClear");
            const result = container.querySelector("#convertResult");
            const canvas = container.querySelector("#convertCanvas");

            let image = null;
            let resultBlob = null;

            function loadImage(file) {
                if (!file || !file.type.startsWith("image/")) {
                    result.textContent = "Please select a valid image.";
                    return;
                }

                const url = URL.createObjectURL(file);

                preview.src = url;
                workspace.hidden = false;
                result.textContent = "";
                downloadBtn.disabled = true;
                resultBlob = null;

                image = new Image();

                image.onload = () => {
                    URL.revokeObjectURL(url);
                };

                image.src = url;
            }

            input.addEventListener("change", e => {
                loadImage(e.target.files[0]);
            });

            drop.addEventListener("dragover", e => {
                e.preventDefault();
                drop.classList.add("drag-active");
            });

            drop.addEventListener("dragleave", () => {
                drop.classList.remove("drag-active");
            });

            drop.addEventListener("drop", e => {
                e.preventDefault();
                drop.classList.remove("drag-active");
                loadImage(e.dataTransfer.files[0]);
            });

            convertBtn.addEventListener("click", () => {
                if (!image) {
                    result.textContent = "Choose an image first.";
                    return;
                }

                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;

                const ctx = canvas.getContext("2d");

                /*
                 * JPG does not support transparency.
                 * Use a white background when converting to JPG.
                 */
                if (format.value === "image/jpeg") {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                ctx.drawImage(image, 0, 0);

                canvas.toBlob(blob => {
                    if (!blob) {
                        result.textContent = "Conversion failed.";
                        return;
                    }

                    resultBlob = blob;
                    downloadBtn.disabled = false;

                    const name =
                        format.value === "image/png" ? "PNG" :
                        format.value === "image/webp" ? "WebP" : "JPG";

                    result.textContent =
                        `Converted successfully • ${canvas.width} × ${canvas.height} • ${name}`;
                }, format.value, 0.92);
            });

            downloadBtn.addEventListener("click", () => {
                if (!resultBlob) return;

                const extension =
                    format.value === "image/png" ? "png" :
                    format.value === "image/webp" ? "webp" : "jpg";

                const url = URL.createObjectURL(resultBlob);
                const a = document.createElement("a");

                a.href = url;
                a.download = `joo-tools-converted-${Date.now()}.${extension}`;

                document.body.appendChild(a);
                a.click();
                a.remove();

                setTimeout(() => URL.revokeObjectURL(url), 1000);
            });

            clearBtn.addEventListener("click", () => {
                image = null;
                resultBlob = null;
                input.value = "";

                preview.removeAttribute("src");
                workspace.hidden = true;
                downloadBtn.disabled = true;
                result.textContent = "";
            });
        }
    };
})();
