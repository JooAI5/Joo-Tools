(function () {
    window.JooTools = window.JooTools || {};

    window.JooTools.imageResizer = {
        init(container) {
            container.innerHTML = `
                <div class="jt-pro-tool">
                    <div class="jt-tool-head">
                        <div class="jt-tool-symbol">📐</div>
                        <div>
                            <h2>Image Resizer</h2>
                            <p>Resize images directly in your browser.</p>
                        </div>
                    </div>

                    <label class="jt-upload" id="resizeDrop">
                        <input id="resizeInput" type="file" accept="image/*" hidden>
                        <div class="jt-upload-icon">📁</div>
                        <strong>Choose Image</strong>
                        <span>or drag & drop an image here</span>
                    </label>

                    <div id="resizeWorkspace" hidden>
                        <div class="jt-image-preview">
                            <img id="resizePreview" alt="Image preview">
                        </div>

                        <div class="jt-grid-2">
                            <label>
                                Width
                                <input id="resizeWidth" type="number" min="1">
                            </label>

                            <label>
                                Height
                                <input id="resizeHeight" type="number" min="1">
                            </label>
                        </div>

                        <label class="jt-check">
                            <input id="resizeRatio" type="checkbox" checked>
                            <span>Keep aspect ratio</span>
                        </label>

                        <label>
                            Output format
                            <select id="resizeFormat">
                                <option value="image/png">PNG</option>
                                <option value="image/jpeg">JPG</option>
                                <option value="image/webp">WebP</option>
                            </select>
                        </label>

                        <div class="jt-actions">
                            <button id="resizeBtn" class="jt-primary">⚡ Resize Image</button>
                            <button id="resizeDownload" class="jt-secondary" disabled>⬇️ Download</button>
                            <button id="resizeClear" class="jt-secondary">🗑️ Clear</button>
                        </div>

                        <div id="resizeResult" class="jt-result"></div>

                        <canvas id="resizeCanvas" hidden></canvas>
                    </div>
                </div>
            `;

            const input = container.querySelector("#resizeInput");
            const drop = container.querySelector("#resizeDrop");
            const workspace = container.querySelector("#resizeWorkspace");
            const preview = container.querySelector("#resizePreview");
            const width = container.querySelector("#resizeWidth");
            const height = container.querySelector("#resizeHeight");
            const ratio = container.querySelector("#resizeRatio");
            const format = container.querySelector("#resizeFormat");
            const resizeBtn = container.querySelector("#resizeBtn");
            const download = container.querySelector("#resizeDownload");
            const clear = container.querySelector("#resizeClear");
            const result = container.querySelector("#resizeResult");
            const canvas = container.querySelector("#resizeCanvas");

            let file = null;
            let image = null;
            let resultBlob = null;
            let originalRatio = 1;

            function loadFile(selected) {
                if (!selected || !selected.type.startsWith("image/")) {
                    result.textContent = "Please choose a valid image.";
                    return;
                }

                file = selected;

                const url = URL.createObjectURL(file);
                preview.src = url;

                image = new Image();

                image.onload = () => {
                    width.value = image.naturalWidth;
                    height.value = image.naturalHeight;
                    originalRatio = image.naturalWidth / image.naturalHeight;

                    workspace.hidden = false;
                    result.textContent = "";
                    download.disabled = true;
                    resultBlob = null;

                    URL.revokeObjectURL(url);
                };

                image.src = url;
            }

            input.addEventListener("change", e => loadFile(e.target.files[0]));

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
                loadFile(e.dataTransfer.files[0]);
            });

            width.addEventListener("input", () => {
                if (ratio.checked && originalRatio) {
                    height.value = Math.max(1, Math.round(Number(width.value) / originalRatio));
                }
            });

            height.addEventListener("input", () => {
                if (ratio.checked && originalRatio) {
                    width.value = Math.max(1, Math.round(Number(height.value) * originalRatio));
                }
            });

            resizeBtn.addEventListener("click", () => {
                if (!image) return;

                const w = parseInt(width.value, 10);
                const h = parseInt(height.value, 10);

                if (!w || !h || w < 1 || h < 1) {
                    result.textContent = "Enter valid dimensions.";
                    return;
                }

                canvas.width = w;
                canvas.height = h;

                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(image, 0, 0, w, h);

                canvas.toBlob(blob => {
                    if (!blob) {
                        result.textContent = "Could not create the resized image.";
                        return;
                    }

                    resultBlob = blob;
                    download.disabled = false;

                    result.textContent =
                        `Done • ${w} × ${h} • ${(blob.size / 1024).toFixed(1)} KB`;
                }, format.value, 0.92);
            });

            download.addEventListener("click", () => {
                if (!resultBlob) return;

                const extension =
                    format.value === "image/png" ? "png" :
                    format.value === "image/webp" ? "webp" : "jpg";

                const url = URL.createObjectURL(resultBlob);
                const a = document.createElement("a");

                a.href = url;
                a.download = `joo-tools-resized-${Date.now()}.${extension}`;
                a.click();

                setTimeout(() => URL.revokeObjectURL(url), 1000);
            });

            clear.addEventListener("click", () => {
                file = null;
                image = null;
                resultBlob = null;
                input.value = "";
                workspace.hidden = true;
                preview.removeAttribute("src");
                download.disabled = true;
                result.textContent = "";
            });
        }
    };
})();
