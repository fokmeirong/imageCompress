document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewSection = document.getElementById('previewSection');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;

    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // 处理拖拽上传
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
        const files = e.dataTransfer.files;
        handleFile(files[0]);
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
    });

    // 处理压缩质量变化
    quality.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (currentFile) {
            compressImage(currentFile, e.target.value / 100);
        }
    });

    // 处理文件
    function handleFile(file) {
        if (!file || !file.type.match(/image\/(png|jpeg)/i)) {
            alert('请选择 PNG 或 JPG 格式的图片！');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalSize.textContent = formatFileSize(file.size);
            compressImage(file, quality.value / 100);
            previewSection.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(file, compressionRatio) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', compressionRatio);
                compressedImage.src = compressedDataUrl;

                // 计算压缩后的文件大小
                const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
                document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);

                // 设置下载按钮
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = `compressed_${file.name}`;
                    link.href = compressedDataUrl;
                    link.click();
                };
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 