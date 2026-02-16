// Estado de la aplicación
        let queryTokens = [];
        let isDarkMode = false;

        // Variables para touch events
        let touchStartX = 0;
        let touchStartY = 0;
        let touchElement = null;
        let ghostElement = null;
        let isDragging = false;

        // Elementos del DOM
        const operatorCards = document.getElementById('operatorCards');
        const dropZone = document.getElementById('dropZone');
        const queryBuilder = document.getElementById('queryBuilder');
        const queryInput = document.getElementById('queryInput');
        const searchBtn = document.getElementById('searchBtn');
        const copyBtn = document.getElementById('copyBtn');
        const clearBtn = document.getElementById('clearBtn');
        const themeToggle = document.getElementById('themeToggle');
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalClose = document.getElementById('modalClose');
        const toast = document.getElementById('toast');

        // Inicializar la aplicación
        function initApp() {
            createOperatorCards();
            setupEventListeners();
            loadTheme();
        }

        // Crear tarjetas de operadores
        function createOperatorCards() {
            operators.forEach(operator => {
                const card = document.createElement('div');
                card.className = 'operator-card';
                card.draggable = true;
                card.dataset.operator = JSON.stringify(operator);
                
                card.innerHTML = `
                    <div class="operator-header">
                        <span class="operator-name">${operator.name}</span>
                        <button class="info-btn" data-operator-name="${operator.name}">ℹ️</button>
                    </div>
                    <div class="operator-description">${operator.description}</div>
                    <div class="operator-example">${operator.example}</div>
                `;
                
                // Añadir event listener específico para el botón de información
                const infoBtn = card.querySelector('.info-btn');
                infoBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    showOperatorInfo(operator.name);
                });
                
                operatorCards.appendChild(card);
            });
        }

        // Configurar event listeners
        function setupEventListeners() {
            // Drag and Drop para desktop
            document.addEventListener('dragstart', handleDragStart);
            document.addEventListener('dragover', handleDragOver);
            document.addEventListener('drop', handleDrop);
            document.addEventListener('dragend', handleDragEnd);

            // Touch events para móviles
            document.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd, { passive: false });

            // Buttons
            searchBtn.addEventListener('click', searchGoogle);
            copyBtn.addEventListener('click', copyQuery);
            clearBtn.addEventListener('click', clearQuery);
            themeToggle.addEventListener('click', toggleTheme);
            modalClose.addEventListener('click', closeModal);

            // Modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        // Drag and Drop handlers
        function handleDragStart(e) {
          // Prevenir drag si se clickea en el botón de información
          if (e.target.classList.contains('info-btn') || e.target.closest('.info-btn')) {
              e.preventDefault();
              return false;
          }
          
          if (e.target.classList.contains('operator-card')) {
              e.target.classList.add('dragging');
              e.dataTransfer.setData('text/plain', e.target.dataset.operator);
          }
      }

        function handleDragOver(e) {
            e.preventDefault();
            if (e.target.closest('#dropZone')) {
                dropZone.classList.add('drag-over');
            }
        }

        function handleDrop(e) {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            if (e.target.closest('#dropZone')) {
                const operatorData = JSON.parse(e.dataTransfer.getData('text/plain'));
                addQueryToken(operatorData);
            }
        }

        function handleDragEnd(e) {
            if (e.target.classList.contains('operator-card')) {
                e.target.classList.remove('dragging');
            }
        }

        // Touch handlers para móviles
        function handleTouchStart(e) {
            // Prevenir drag si se toca el botón de información
            if (e.target.classList.contains('info-btn') || e.target.closest('.info-btn')) {
                return;
            }
            
            const card = e.target.closest('.operator-card');
            if (card) {
                e.preventDefault();
                touchElement = card;
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                
                // Crear elemento ghost
                createGhostElement(card, touch.clientX, touch.clientY);
                
                // Añadir clase visual
                card.classList.add('dragging');
                
                // Vibración haptic si está disponible
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }
        }

        function handleTouchMove(e) {
            if (touchElement && ghostElement) {
                e.preventDefault();
                const touch = e.touches[0];
                
                // Actualizar posición del ghost
                ghostElement.style.left = (touch.clientX - 50) + 'px';
                ghostElement.style.top = (touch.clientY - 30) + 'px';
                
                // Verificar si está sobre el drop zone
                const dropZoneRect = dropZone.getBoundingClientRect();
                const isOverDropZone = touch.clientX >= dropZoneRect.left && 
                                     touch.clientX <= dropZoneRect.right && 
                                     touch.clientY >= dropZoneRect.top && 
                                     touch.clientY <= dropZoneRect.bottom;
                
                if (isOverDropZone) {
                    dropZone.classList.add('drag-over');
                } else {
                    dropZone.classList.remove('drag-over');
                }
                
                isDragging = true;
            }
        }

        function handleTouchEnd(e) {
            if (touchElement && ghostElement) {
                e.preventDefault();
                
                // Verificar si se soltó sobre el drop zone
                const touch = e.changedTouches[0];
                const dropZoneRect = dropZone.getBoundingClientRect();
                const isOverDropZone = touch.clientX >= dropZoneRect.left && 
                                    touch.clientX <= dropZoneRect.right && 
                                    touch.clientY >= dropZoneRect.top && 
                                    touch.clientY <= dropZoneRect.bottom;
                
                if (isOverDropZone && isDragging) {
                    const operatorData = JSON.parse(touchElement.dataset.operator);
                    addQueryToken(operatorData);
                }
                
                // Limpiar
                cleanupTouch();
            }
        }

        // Crear elemento ghost para drag visual
        function createGhostElement(sourceCard, x, y) {
            ghostElement = sourceCard.cloneNode(true);
            ghostElement.style.position = 'fixed';
            ghostElement.style.left = (x - 50) + 'px';
            ghostElement.style.top = (y - 30) + 'px';
            ghostElement.style.width = '200px';
            ghostElement.style.opacity = '0.8';
            ghostElement.style.zIndex = '9999';
            ghostElement.style.pointerEvents = 'none';
            ghostElement.style.transform = 'rotate(5deg) scale(0.9)';
            ghostElement.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
            ghostElement.classList.add('ghost-element');
            
            document.body.appendChild(ghostElement);
        }

        // Limpiar después del touch
        function cleanupTouch() {
            if (touchElement) {
                touchElement.classList.remove('dragging');
                touchElement = null;
            }
            
            if (ghostElement) {
                ghostElement.remove();
                ghostElement = null;
            }
            
            dropZone.classList.remove('drag-over');
            isDragging = false;
            touchStartX = 0;
            touchStartY = 0;
        }

        // Gestión de tokens de consulta
        function addQueryToken(operator) {
            const token = {
                id: Date.now(),
                operator: operator,
                value: ''
            };
            
            queryTokens.push(token);
            updateQueryBuilder();
            updateQueryInput();
            
            // Verificar si hay múltiples operadores del mismo tipo
            checkForMultipleOperators();
            
            // Enfocar el input del token recién añadido
            setTimeout(() => {
                const tokenInput = document.querySelector(`#token-input-${token.id}`);
                if (tokenInput) {
                    tokenInput.focus();
                }
            }, 100);
        }

        function removeQueryToken(tokenId) {
            queryTokens = queryTokens.filter(token => token.id !== tokenId);
            updateQueryBuilder();
            updateQueryInput();
        }

        function updateQueryBuilder() {
            queryBuilder.innerHTML = '';
            
            // Agrupar tokens por tipo para mostrar indicadores
            const groupedTokens = {};
            queryTokens.forEach(token => {
                const operatorName = token.operator.name;
                if (!groupedTokens[operatorName]) {
                    groupedTokens[operatorName] = [];
                }
                groupedTokens[operatorName].push(token);
            });
            
            queryTokens.forEach((token, index) => {
                const tokenElement = document.createElement('div');
                const sameTypeTokens = groupedTokens[token.operator.name];
                const isMultipleSameType = sameTypeTokens.length > 1;
                const isFirstOfType = sameTypeTokens.indexOf(token) === 0;
                const isLastOfType = sameTypeTokens.indexOf(token) === sameTypeTokens.length - 1;
                
                // Añadir clase especial si hay múltiples del mismo tipo
                tokenElement.className = `query-token ${isMultipleSameType ? 'multiple-type' : ''}`;
                
                let tokenHTML = `
                    <span>${token.operator.name}</span>
                    <input 
                        type="text" 
                        class="token-input" 
                        id="token-input-${token.id}"
                        placeholder="valor..."
                        value="${token.value}"
                        onkeyup="updateTokenValue(${token.id}, this.value)"
                        onchange="updateTokenValue(${token.id}, this.value)"
                    >
                    <button class="token-remove" onclick="removeQueryToken(${token.id})">×</button>
                `;
                
                tokenElement.innerHTML = tokenHTML;
                queryBuilder.appendChild(tokenElement);
                
                // Añadir indicador OR si hay múltiples del mismo tipo y no es el último
                if (isMultipleSameType && !isLastOfType) {
                    const orIndicator = document.createElement('div');
                    orIndicator.className = 'or-indicator';
                    orIndicator.textContent = 'OR';
                    queryBuilder.appendChild(orIndicator);
                }
            });
        
            // Actualizar clases del drop zone
            if (queryTokens.length > 0) {
                dropZone.classList.add('has-content');
            } else {
                dropZone.classList.remove('has-content');
            }
        }

        function updateQueryInput() {
            // Agrupar tokens por tipo de operador
            const groupedTokens = {};
            queryTokens.forEach(token => {
                const operatorName = token.operator.name;
                if (!groupedTokens[operatorName]) {
                    groupedTokens[operatorName] = [];
                }
                groupedTokens[operatorName].push(token);
            });
            
            // Construir la consulta
            const queryParts = [];
            
            Object.keys(groupedTokens).forEach(operatorName => {
                const tokens = groupedTokens[operatorName];
                
                if (tokens.length === 1) {
                    // Un solo token de este tipo
                    const token = tokens[0];
                    if (token.value.trim()) {
                        const value = token.value.includes(' ') ? `"${token.value}"` : token.value;
                        queryParts.push(`${operatorName}${value}`);
                    } else {
                        queryParts.push(operatorName);
                    }
                } else {
                    // Múltiples tokens del mismo tipo - usar OR
                    const tokenValues = tokens
                        .filter(token => token.value.trim()) // Solo tokens con valor
                        .map(token => {
                            const value = token.value.includes(' ') ? `"${token.value}"` : token.value;
                            return `${operatorName}${value}`;
                        });
                    
                    // Tokens sin valor
                    const emptyTokens = tokens.filter(token => !token.value.trim());
                    
                    if (tokenValues.length > 0) {
                        if (tokenValues.length === 1) {
                            queryParts.push(tokenValues[0]);
                        } else {
                            queryParts.push(`(${tokenValues.join(' OR ')})`);
                        }
                    }
                    
                    // Añadir tokens vacíos al final
                    emptyTokens.forEach(token => {
                        queryParts.push(token.operator.name);
                    });
                }
            });
            
            queryInput.value = queryParts.join(' ');
        }

        function updateTokenValue(tokenId, value) {
          const token = queryTokens.find(t => t.id === tokenId);
          if (token) {
              token.value = value;
              updateQueryInput();
          }
      }


        // Funciones de acción
        function searchGoogle() {
            const query = queryInput.value.trim();
            if (query) {
                const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.open(googleUrl, '_blank');
            } else {
                showToast('⚠️ Primero construye una consulta');
            }
        }

        function copyQuery() {
            const query = queryInput.value.trim();
            if (query) {
                navigator.clipboard.writeText(query).then(() => {
                    showToast('✅ Consulta copiada al portapapeles');
                }).catch(() => {
                    showToast('❌ Error al copiar');
                });
            } else {
                showToast('⚠️ No hay consulta para copiar');
            }
        }

        function clearQuery() {
            queryTokens = [];
            updateQueryBuilder();
            updateQueryInput();
            showToast('🗑️ Consulta limpiada');
        }

        // Modal
        function showOperatorInfo(operatorName) {
            const operator = operators.find(op => op.name === operatorName);
            if (operator) {
                modalTitle.textContent = operator.name;
                modalBody.innerHTML = `
                    <p><strong>Descripción:</strong> ${operator.description}</p>
                    <p><strong>Sintaxis:</strong> <code>${operator.syntax}</code></p>
                    <p><strong>Ejemplo:</strong> <code>${operator.example}</code></p>
                    <p><strong>Uso:</strong> ${operator.usage}</p>
                `;
                modal.classList.add('show');
            }
        }

        function closeModal() {
            modal.classList.remove('show');
        }

        // Toast notifications
        function showToast(message) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        function checkForMultipleOperators() {
            const operatorCounts = {};
            queryTokens.forEach(token => {
                const operatorName = token.operator.name;
                operatorCounts[operatorName] = (operatorCounts[operatorName] || 0) + 1;
            });
            
            const multipleOperators = Object.keys(operatorCounts).filter(op => operatorCounts[op] > 1);
        }

        // Tema
        function toggleTheme() {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
            saveTheme();
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                isDarkMode = true;
                document.body.classList.add('dark-mode');
                themeToggle.textContent = '☀️';
            }
        }

        function saveTheme() {
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
        
        function showInfoModal() {
            modalTitle.textContent = 'Información de la aplicación';
            modalBody.innerHTML = `
                <p><strong>Google Dorking Helper</strong> es una herramienta educativa diseñada para ayudarte a construir consultas avanzadas de búsqueda en Google.</p>
                <p>Esta aplicación es de código abierto y se proporciona únicamente con fines educativos.</p>
                <p>Recuerda siempre respetar los términos de servicio de Google y las leyes locales al realizar búsquedas.</p>
                <div style="margin-top: 20px; background: rgba(0,0,0,0.05); padding: 15px; border-radius: 8px;">
                    <p>🔐 Esta aplicación no almacena ninguna información personal</p>
                    <p>🔍 Todas las búsquedas se realizan directamente en Google</p>
                </div>
            `;
            modal.classList.add('show');
        }

        // Funciones globales (para onclick)
        window.showOperatorInfo = showOperatorInfo;
        window.removeQueryToken = removeQueryToken;
        window.updateTokenValue = updateTokenValue;

        // Inicializar cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', initApp);