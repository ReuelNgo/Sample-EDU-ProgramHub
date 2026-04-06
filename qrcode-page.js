/* QR Code Generator Page Logic */
(function () {
    'use strict';

    let qrCode = null;
    let logoDataUrl = null;

    const getOptions = () => {
        const size = parseInt(document.getElementById('qr-size').value, 10);
        const margin = parseInt(document.getElementById('qr-margin').value, 10);
        const logoSize = parseInt(document.getElementById('qr-logo-size').value, 10) / 100;
        const hideLogoBg = document.getElementById('qr-logo-hide-bg').checked;

        return {
            width: size,
            height: size,
            data: document.getElementById('qr-url').value.trim() || 'https://example.com',
            margin: margin,
            qrOptions: {
                errorCorrectionLevel: document.getElementById('qr-ecc').value,
            },
            dotsOptions: {
                color: document.getElementById('qr-dot-color').value,
                type: document.getElementById('qr-dot-style').value,
            },
            cornersSquareOptions: {
                color: document.getElementById('qr-fg').value,
                type: document.getElementById('qr-corner-style').value,
            },
            cornersDotOptions: {
                color: document.getElementById('qr-fg').value,
                type: document.getElementById('qr-corner-dot-style').value,
            },
            backgroundOptions: {
                color: document.getElementById('qr-bg').value,
            },
            image: logoDataUrl || undefined,
            imageOptions: {
                hideBackgroundDots: hideLogoBg,
                imageSize: logoSize,
                margin: 4,
                crossOrigin: 'anonymous',
            },
        };
    };

    const renderQR = () => {
        const container = document.getElementById('qr-canvas-container');
        const hint = document.getElementById('qr-hint');
        const downloadRow = document.getElementById('qr-download-row');
        const url = document.getElementById('qr-url').value.trim();

        if (!url) {
            hint.textContent = 'Please enter a URL first.';
            return;
        }

        hint.textContent = '';
        container.innerHTML = '';

        const options = getOptions();

        if (qrCode) {
            qrCode.update(options);
            qrCode.append(container);
        } else {
            qrCode = new QRCodeStyling(options);
            qrCode.append(container);
        }

        downloadRow.style.display = 'flex';
    };

    document.addEventListener('DOMContentLoaded', () => {
        // Size slider label
        const sizeSlider = document.getElementById('qr-size');
        const sizeLabel = document.getElementById('qr-size-value');
        sizeSlider.addEventListener('input', () => {
            sizeLabel.textContent = sizeSlider.value;
        });

        // Margin slider label
        const marginSlider = document.getElementById('qr-margin');
        const marginLabel = document.getElementById('qr-margin-value');
        marginSlider.addEventListener('input', () => {
            marginLabel.textContent = marginSlider.value;
        });

        // Logo size slider label
        const logoSizeSlider = document.getElementById('qr-logo-size');
        const logoSizeLabel = document.getElementById('qr-logo-size-value');
        logoSizeSlider.addEventListener('input', () => {
            logoSizeLabel.textContent = logoSizeSlider.value;
        });

        // Logo file input
        const logoInput = document.getElementById('qr-logo');
        const logoOptions = document.getElementById('logo-options');
        const logoClear = document.getElementById('qr-logo-clear');

        logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                logoDataUrl = evt.target.result;
                logoOptions.style.display = 'flex';
                logoClear.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        });

        logoClear.addEventListener('click', () => {
            logoDataUrl = null;
            logoInput.value = '';
            logoOptions.style.display = 'none';
            logoClear.style.display = 'none';
        });

        // Generate button
        document.getElementById('qr-generate').addEventListener('click', renderQR);

        // Allow Enter key in URL input to generate
        document.getElementById('qr-url').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') renderQR();
        });

        // Download buttons
        document.getElementById('qr-download-png').addEventListener('click', () => {
            if (qrCode) qrCode.download({ name: 'qrcode', extension: 'png' });
        });

        document.getElementById('qr-download-svg').addEventListener('click', () => {
            if (qrCode) qrCode.download({ name: 'qrcode', extension: 'svg' });
        });

        // Auto-generate on load with default URL
        renderQR();
    });
})();
