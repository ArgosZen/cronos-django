document.addEventListener('DOMContentLoaded', () => {
            // Set dynamic formatted date in header
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date().toLocaleDateString('es-ES', options);
            const dateEl = document.getElementById('live-date');
            if (dateEl) {
                dateEl.textContent = `EDICIÓN ESPECIAL // ${today.toUpperCase()}`;
            }

            // Terminal input listener
            const termInput = document.getElementById('terminal-input');
            if (termInput) {
                termInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        processCommand(this.value);
                        this.value = '';
                    }
                });
            }
        });

        // Terminal command processor logic
        function processCommand(cmd) {
            const output = document.getElementById('terminal-output');
            const cleanCmd = cmd.trim().toLowerCase();
            
            const userP = document.createElement('p');
            userP.className = 'text-green-400';
            userP.textContent = `$ ${cmd}`;
            output.appendChild(userP);

            const respP = document.createElement('p');
            respP.className = 'text-green-500';

            switch(cleanCmd) {
                case 'help':
                    respP.innerHTML = 'Comandos: <br>• <b>status</b>: Estado de nodos<br>• <b>about</b>: Credenciales Cronos<br>• <b>clear</b>: Limpiar terminal<br>• <b>version</b>: Ver build';
                    break;
                case 'status':
                    respP.textContent = 'NODOS ACTIVOS: 14/14 // FIREWALL: ACTIVO // ENCRIPTACIÓN: PGP 4096-bit';
                    break;
                case 'about':
                    respP.textContent = 'CRONOS: Investigador de ciberseguridad enfocado en arquitecturas resilientes y auditoría de protocolos.';
                    break;
                case 'version':
                    respP.textContent = 'CRONOS_CLI v1.0.4-stable (Build Retro)';
                    break;
                case 'clear':
                    output.innerHTML = '<p class="text-green-600"># Terminal limpiada.</p>';
                    return;
                case '':
                    respP.textContent = '';
                    break;
                default:
                    respP.textContent = `Comando no reconocido: '${cleanCmd}'. Escribe 'help'.`;
            }

            output.appendChild(respP);
            output.scrollTop = output.scrollHeight;
        }

        // Modal functions for opening/closing full article text
        function openArticleModal(title, text) {
            const modal = document.getElementById('article-modal');
            const content = document.getElementById('modal-content');
            
            content.innerHTML = `
                <div class="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Reporte de Archivo Desclasificado</div>
                <h2 class="font-newspaper font-bold text-2xl uppercase mb-3 border-b border-black pb-2">${title}</h2>
                <p class="text-sm leading-relaxed text-justify mb-4">${text}</p>
                <p class="text-sm leading-relaxed text-justify mb-4">La seguridad absoluta no existe, pero la mitigación proactiva y el análisis constante de patrones en la red reducen la superficie de ataque drásticamente. Este documento forma parte de las investigaciones periódicas del archivo de Cronos.</p>
                <div class="border-t border-dashed border-black pt-3 flex justify-between items-center text-xs">
                    <span>ESTADO: VERIFICADO POR CRONOS</span>
                    <span class="font-bold">[INTEGRIDAD OK]</span>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }

        function closeArticleModal() {
            const modal = document.getElementById('article-modal');
            modal.classList.add('hidden');
        }

        // Category filter simulation for archives list
        function filterCategory(cat) {
            const output = document.getElementById('terminal-output');
            if (output) {
                const p = document.createElement('p');
                p.className = 'text-green-300';
                p.textContent = `> Filtrando archivos por categoría: [${cat.toUpperCase()}]`;
                output.appendChild(p);
                output.scrollTop = output.scrollHeight;
            }
        }

        // Newsletter subscription handler
        async function handleNewsletter(e) {
            e.preventDefault();
            const form = document.getElementById('newsletter-form');
            const emailInput = document.getElementById('newsletter-email');
            const msg = document.getElementById('newsletter-msg');
            const token = form.querySelector('[name=csrfmiddlewaretoken]').value;
            const datos = new FormData();
            datos.append('email', emailInput.value);

            let texto = 'Error de conexión. Intente de nuevo.';
            let ok = false;
            try {
                const resp = await fetch(form.dataset.url, {
                    method: 'POST',
                    headers: { 'X-CSRFToken': token },
                    body: datos
                });
                const data = await resp.json();
                texto = data.mensaje;
                ok = data.ok;
            } catch (err) {
                console.error(err);
            }

            msg.textContent = texto;
            msg.className = 'text-xs mt-2 text-center font-bold text-black bg-white border border-black p-1';
            msg.classList.remove('hidden');
            if (ok) { emailInput.value = ''; }
            setTimeout(() => { msg.classList.add('hidden'); }, 5000);
        }

        function handleNewsletterLocal(e) {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const msg = document.getElementById('newsletter-msg');
            
            if (emailInput && emailInput.value) {
                msg.textContent = '¡Suscripción registrada con éxito en el archivo criptográfico!';
                msg.className = 'text-xs mt-2 text-center font-bold text-black bg-white border border-black p-1';
                msg.classList.remove('hidden');
                emailInput.value = '';
                
                setTimeout(() => {
                    msg.classList.add('hidden');
                }, 5000);
            }
        }

// Eventos de los artículos
document.addEventListener('DOMContentLoaded', () => {
    const articleButtons = [
        {
            id: 'article-btn-1',
            title: 'La Persistencia Silenciosa',
            text: 'El pasado martes, mientras realizábamos auditorías de rutina...'
        },
        {
            id: 'article-btn-2',
            title: 'Psicología del Engaño',
            text: 'Los cortafuegos más avanzados y los cifrados de curva elíptica...'
        },
        {
            id: 'article-btn-3',
            title: 'Decrypting The Vault',
            text: 'Un desglose paso a paso de cómo realizamos ingeniería inversa...'
        }
    ];

    articleButtons.forEach(article => {
        const button = document.getElementById(article.id);
        if (button) {
            button.addEventListener('click', () => {
                openArticleModal(article.title, article.text);
            });
        }
    });

    // Filtros del archivo histórico
    const categories = ['todos', 'vulnerabilidades', 'social', 'ctf', 'hardware'];

    categories.forEach(category => {
        const link = document.getElementById(`filter-${category}`);
        if (link) {
            link.addEventListener('click', event => {
                event.preventDefault();
                filterCategory(category);
            });
        }
    });

    // Formulario del boletín
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
    }

    // Botón para cerrar el modal
    const closeButton = document.querySelector('#article-modal button');
    if (closeButton) {
        closeButton.addEventListener('click', closeArticleModal);
    }
});
