(function () {
    window.JooTools = window.JooTools || {};

    window.JooTools.imageCompressor = {
        init(container) {
            container.innerHTML = `
                <div class="tool-workspace image-compressor-tool">
                    <div class="tool-intro">
                        <div class="tool-icon">🖼️</div>
                        <div>
                            <h2>Image Compressor</h2>
                            <p>Compress images directly in your browser without uploading them.</p>
                        </div>
                    </div>

                    <label class="upload-zone" id="imageCompressDrop">
                        <input type="file" id="imageCompressInput" accept="image/*" hidden>
                        <div class="upload-icon">📁</div>
                        <strong>Choose an image</strong>
                        <span>or drag & drop it here</span>
                    </label>

                    <div id="imageCompressPanel" hidden>
                        <div class="image-preview-box">
                            <img id="imageCompressPreview" alt="Preview">
                        </div>

                        <div class="tool-control">
                            <label for="imageQuality">
                                Quality
                                <strong id="imageQualityValue">80%</strong>
                            </label>
                            <input id="imageQuality" type="range" min="10" max="100" value="80">
                        </div>

                        <div class="image-stats">
                            <div>
                                <span>Original</span>
                                <strong id="imageOriginalSize">—</strong>
                            </div>
                            <div>
                                <span>Compressed</span>
                                <strong id="imageCompressedSize">—</strong>
                            </div>
                            <div>
                                <span>Saved</span>
                                <strong id="imageSavedSize">—</strong>
                            </div>
                        </div>

                        <div class="tool-actions">
                            <button id="imageCompressBtn" class="primary-btn">⚡ Compress</button>
                            <button id="imageCompressDownload" class="secondary-btn" disabled>⬇️ Download</button>
                            <button id="imageCompressClear" class="secondary-btn">🗑️ Clear</button>
                        </div>
                    </div>

                    <canvas id="imageCompressCanvas" hidden></canvas>
                </div>
            `;

            const input = container.querySelector("#imageCompressInput");
            const drop = container.querySelector("#imageCompressDrop");
            const panel = container.querySelector("#imageCompressPanel");
            const preview = container.querySelector("#imageCompressPreview");
            const quality = container.querySelector("#imageQuality");
            const qualityValue = container.querySelector("#imageQualityValue");
            const compressBtn = container.querySelector("#imageCompressBtn");
            const downloadBtn = container.querySelector("#imageCompressDownload");
            const clearBtn = container.querySelector("#imageCompressClear");

            const originalSize = container.querySelector("#imageOriginalSize");
            const compressedSize = container.querySelector("#imageCompressedSize");
            const savedSize = container.querySelector("#imageSavedSize");
            const canvas = container.querySelector("#imageCompressCanvas");

            let file = null;
            let resultBlob = null;

            const formatSize = bytes => {
                if (!bytes) return "0 B";
                const units = ["B", "KB", "MB", "GB"];
                const i = Math.min(
                    Math.floor(Math.log(bytes) / Math.log(1024)),
                    units.length - 1
                );
                return `${(bytes / Math.pow(1024, i)).toFixed(i ? 2 : 0)} ${units[i]}`;
            };

            const loadImage = selectedFile => {
                if (!selectedFile || !selectedFile.type.startsWith("image/")) {
                    alert("Please select a valid image.");
                    return;
                }

                file = selectedFile;
                resultBlob = null;
                downloadBtn.disabled = true;

                preview.src = URL.createObjectURL(file);
                panel.hidden = false;
                originalSize.textContent = formatSize(file.size);
                compressedSize.textContent = "—";
                savedSize.textContent = "—";
            };

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

            quality.addEventListener("input", () => {
                qualityValue.textContent = `${quality.value}%`;
            });

            compressBtn.addEventListener("click", () => {
                if (!file) return;

                const img = new Image();

                img.onload = () => {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;

                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(
                        blob => {
                            if (!blob) {
                                alert("Compression failed.");
                                return;
                            }

                            resultBlob = blob;

                            compressedSize.textContent = formatSize(blob.size);

                            const saved = Math.max(
                                0,
                                ((file.size - blob.size) / file.size) * 100
                            );

                            savedSize.textContent = `${saved.toFixed(1)}%`;

                            downloadBtn.disabled = false;
                        },
                        "image/jpeg",
                        Number(quality.value) / 100
                    );
                };

                img.src = URL.createObjectURL(file);
            });

            downloadBtn.addEventListener("click", () => {
                if (!resultBlob) return;

                const url = URL.createObjectURL(resultBlob);
                const a = document.createElement("a");

                a.href = url;
                a.download = `joo-tools-compressed-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                a.remove();

                setTimeout(() => URL.revokeObjectURL(url), 1000);
            });

            clearBtn.addEventListener("click", () => {
                file = null;
                resultBlob = null;
                input.value = "";
                preview.removeAttribute("src");
                panel.hidden = true;
                downloadBtn.disabled = true;
            });
        }
    };
})();
