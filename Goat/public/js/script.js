document.addEventListener('DOMContentLoaded', function () {
    const goatForm = document.getElementById('goatForm');
    const dailyLogForm = document.getElementById('dailyLogForm');
    const generateReportBtn = document.getElementById('generateReportBtn');

    let goats = [];
    // try to load goats from backend API; fall back to localStorage
    async function loadGoats() {
        try {
            const res = await fetch('/api/goats');
            if (res.ok) {
                const data = await res.json();
                // normalize server fields to frontend structure
                goats = data.map(g => ({
                    id: g.id?.toString() || Date.now().toString(),
                    goatId: g.goatId || g.goatId || g.id?.toString(),
                    name: g.name || '',
                    age: g.age || 0,
                    weight: parseFloat(g.weight) || 0,
                    purchaseDate: g.purchaseDate || g.created_at || new Date().toISOString(),
                    purchasePrice: parseFloat(g.purchasePrice || g.purchasePrice) || 0,
                    photo: g.photo || null
                }));
                return;
            }
        } catch (e) {
            console.error('Failed to load goats from server, falling back to localStorage.', e);
        }

    }
    let dailyLogs = JSON.parse(localStorage.getItem('dailyLogs')) || [];

    // Milk price will be dynamic based on user input
    const milkPriceInput = document.getElementById('milkPriceInput');
    let currentMilkPrice = 0;
    if (milkPriceInput) {
        milkPriceInput.addEventListener('change', function () {
            currentMilkPrice = parseFloat(this.value) || 0;
            updateReport();
        });
    }

    /* =============== GOAT FORM SUBMISSION =============== */
    goatForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const goatData = {
            id: generateId(),
            goatId: document.getElementById('goatId').value.trim(),
            name: document.getElementById('goatName').value.trim(),
            age: parseFloat(document.getElementById('goatAge').value),
            weight: parseFloat(document.getElementById('goatWeight').value),
            purchaseDate: document.getElementById('purchaseDate').value,
            purchasePrice: parseFloat(document.getElementById('purchasePrice').value),
            photo: null // Photo would be stored as base64 or file path
        };

        // Handle photo upload (store as base64)
        const photoInput = document.getElementById('goatPhoto');
        if (photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                goatData.photo = e.target.result;
                saveGoat(goatData);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            saveGoat(goatData);
        }
    });

    function saveGoat(goatData) {
        // Try to persist to backend first
        (async () => {
            try {
                const res = await fetch('/api/goats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        goatId: goatData.goatId,
                        name: goatData.name,
                        age: goatData.age,
                        weight: goatData.weight,
                        purchaseDate: goatData.purchaseDate,
                        purchasePrice: goatData.purchasePrice,
                        photo: goatData.photo || null
                    })
                });

                if (!res.ok) throw new Error('Server error');

                const created = await res.json();
                // normalize server response into frontend structure
                const entry = {
                    id: created.id?.toString() || Date.now().toString(),
                    goatId: created.goatId || goatData.goatId,
                    name: created.name || goatData.name,
                    age: created.age || goatData.age,
                    weight: created.weight || goatData.weight,
                    purchaseDate: created.purchaseDate || goatData.purchaseDate,
                    purchasePrice: parseFloat(created.purchasePrice || goatData.purchasePrice) || 0,
                    photo: created.photo || goatData.photo || null
                };

                goats.push(entry);
                localStorage.setItem('goats', JSON.stringify(goats));

                showMessage('goatFormMessage', 'Goat details saved successfully!', 'success');
                goatForm.reset();
                displayGoatCards();
                populateGoatSelect();
                updateReport();
                return;
            } catch (err) {
                // fallback to localStorage when backend unavailable
                goats.push(goatData);
                localStorage.setItem('goats', JSON.stringify(goats));
                showMessage('goatFormMessage', 'Goat Saved Successfully.', 'warning');
                goatForm.reset();
                displayGoatCards();
                populateGoatSelect();
                updateReport();
            }
        })();
    }

    /* =============== DISPLAY GOAT CARDS =============== */
    function displayGoatCards() {
        const goatListDisplay = document.getElementById('goatListDisplay');
        goatListDisplay.innerHTML = '';

        if (goats.length === 0) {
            goatListDisplay.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No goats registered yet.</p>';
            return;
        }

        goats.forEach(goat => {
            const card = document.createElement('div');
            card.className = 'goat-card';
            card.innerHTML = `
                <h4>${goat.goatId}</h4>
                <p><strong>Name:</strong> ${goat.name}</p>
                <p><strong>Age:</strong> ${goat.age} years</p>
                <p><strong>Weight:</strong> ${goat.weight} kg</p>
                <p><strong>Purchased:</strong> ${formatDate(goat.purchaseDate)}</p>
                <p><strong>Price:</strong> ₹${goat.purchasePrice.toFixed(2)}</p>
                ${goat.photo ? `<img src="${goat.photo}" alt="${goat.name}">` : '<p style="color: #999;">No photo uploaded</p>'}
                <div class="card-actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteGoat('${goat.id}', '${goat.goatId}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            `;
            goatListDisplay.appendChild(card);
        });
    }

    // Expose functions and variables to global scope
    window.goatManagerApp = {
        goats,
        dailyLogs,
        displayGoatCards,
        populateGoatSelect,
        updateReport,
        deleteGoat: function(id, goatId) {
            if (confirm(`Are you sure you want to remove ${goatId}? This will also delete all daily logs associated with this goat.`)) {
                // Try to delete from backend first
                (async () => {
                    try {
                        const res = await fetch(`/api/goats/${id}`, {
                            method: 'DELETE'
                        });

                        if (!res.ok) throw new Error('Server error');

                        // Remove from local arrays
                        window.goatManagerApp.goats = window.goatManagerApp.goats.filter(goat => goat.id !== id);
                        window.goatManagerApp.dailyLogs = window.goatManagerApp.dailyLogs.filter(log => log.goatId !== goatId);
                        
                        // Update localStorage
                        localStorage.setItem('goats', JSON.stringify(window.goatManagerApp.goats));
                        localStorage.setItem('dailyLogs', JSON.stringify(window.goatManagerApp.dailyLogs));

                        // Update display
                        displayGoatCards();
                        populateGoatSelect();
                        updateReport();
                        return;
                    } catch (err) {
                        // fallback to localStorage when backend unavailable
                        window.goatManagerApp.goats = window.goatManagerApp.goats.filter(goat => goat.id !== id);
                        window.goatManagerApp.dailyLogs = window.goatManagerApp.dailyLogs.filter(log => log.goatId !== goatId);
                        
                        // Update localStorage
                        localStorage.setItem('goats', JSON.stringify(window.goatManagerApp.goats));
                        localStorage.setItem('dailyLogs', JSON.stringify(window.goatManagerApp.dailyLogs));

                        // Update display
                        displayGoatCards();
                        populateGoatSelect();
                    }
                })();
            }
            return;
        }
    };

    /* =============== DAILY LOG FORM SUBMISSION =============== */
    dailyLogForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!document.getElementById('logGoatId').value) {
            showMessage('logFormMessage', 'Please select a goat!', 'error');
            return;
        }

        const logData = {
            id: generateId(),
            goatId: document.getElementById('logGoatId').value,
            date: document.getElementById('logDate').value,
            feedCost: parseFloat(document.getElementById('feedCost').value),
            milkProduced: parseFloat(document.getElementById('milkProduced').value) || 0,
            milkPrice: parseFloat(document.getElementById('milkPrice').value) || 0,
            medicalTreatment: document.getElementById('medicalTreatment').value.trim()
        };

        dailyLogs.push(logData);
        localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));

        showMessage('logFormMessage', 'Daily log saved successfully!', 'success');
        dailyLogForm.reset();
        displayLogHistory();
        updateReport();
    });

    /* =============== DISPLAY LOG HISTORY =============== */
    function displayLogHistory() {
        const logHistoryDisplay = document.getElementById('logHistoryDisplay');
        logHistoryDisplay.innerHTML = '';

        if (dailyLogs.length === 0) {
            logHistoryDisplay.innerHTML = '<p style="text-align: center; color: #888;">No logs recorded yet.</p>';
            return;
        }

        // Display last 10 logs
        const recentLogs = dailyLogs.slice(-10).reverse();
        recentLogs.forEach(log => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `
                <div class="date">${formatDate(log.date)}</div>
                <p><strong>Goat ID:</strong> ${log.goatId}</p>
                <p><strong>Feed Cost:</strong> ₹${log.feedCost.toFixed(2)}</p>
                <p><strong>Milk Produced:</strong> ${log.milkProduced} liters</p>
                ${log.milkPrice ? `<p><strong>Milk Price:</strong> ₹${log.milkPrice.toFixed(2)}/liter</p>` : ''}
                ${log.medicalTreatment ? `<p><strong>Medical Note:</strong> ${log.medicalTreatment}</p>` : ''}
            `;
            logHistoryDisplay.appendChild(entry);
        });
    }

    /* =============== POPULATE GOAT SELECT DROPDOWN =============== */
    function populateGoatSelect() {
        const logGoatId = document.getElementById('logGoatId');
        const currentValue = logGoatId.value;
        logGoatId.innerHTML = '<option value="">-- Select a Goat --</option>';
        
        goats.forEach(goat => {
            const option = document.createElement('option');
            option.value = goat.goatId;
            option.textContent = `${goat.goatId} (${goat.name})`;
            logGoatId.appendChild(option);
        });

        logGoatId.value = currentValue;
    }

    /* =============== UPDATE REPORT =============== */
    function updateReport() {
        let totalExpense = 0;
        let totalMilk = 0;
        let totalPurchasePrice = 0;

        // Calculate totals
        let totalRevenue = 0;
        dailyLogs.forEach(log => {
            totalExpense += log.feedCost;
            totalMilk += log.milkProduced;
            if (log.milkPrice && log.milkProduced) {
                totalRevenue += log.milkProduced * log.milkPrice;
            }
        });

        goats.forEach(goat => {
            totalPurchasePrice += goat.purchasePrice;
        });

        const totalCost = totalExpense + totalPurchasePrice;
        const netProfit = totalRevenue - totalCost;

        // Update report cards
        document.getElementById('totalExpense').textContent = '₹' + (totalExpense + totalPurchasePrice).toFixed(2);
        document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toFixed(2);
        document.getElementById('netProfit').textContent = (netProfit >= 0 ? '₹+' : '₹') + netProfit.toFixed(2);
        document.getElementById('netProfit').style.color = netProfit >= 0 ? '#28a745' : '#dc3545';
        document.getElementById('totalMilk').textContent = totalMilk.toFixed(2) + ' liters';
        document.getElementById('totalGoats').textContent = goats.length;

        // Update detailed report table
        updateDetailedReport();
    }

    /* =============== UPDATE DETAILED REPORT TABLE =============== */
    function updateDetailedReport() {
        const tbody = document.querySelector('#detailedReportTable tbody');
        tbody.innerHTML = '';

        goats.forEach(goat => {
            // Calculate expenses and revenue for this goat
            const goatLogs = dailyLogs.filter(log => log.goatId === goat.goatId);
            const totalFeedCost = goatLogs.reduce((sum, log) => sum + log.feedCost, 0);
            const totalMilk = goatLogs.reduce((sum, log) => sum + log.milkProduced, 0);
            let milkRevenue = 0;
            goatLogs.forEach(log => {
                if (log.milkPrice && log.milkProduced) {
                    milkRevenue += log.milkProduced * log.milkPrice;
                }
            });
            const totalCost = goat.purchasePrice + totalFeedCost;
            const netPL = milkRevenue - totalCost;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${goat.goatId}</strong></td>
                <td>₹${goat.purchasePrice.toFixed(2)}</td>
                <td>₹${totalFeedCost.toFixed(2)}</td>
                <td>${totalMilk.toFixed(2)}</td>
                <td>₹${milkRevenue.toFixed(2)}</td>
                <td style="color: ${netPL >= 0 ? '#28a745' : '#dc3545'}; font-weight: bold;">
                    ${netPL >= 0 ? '₹+' : '₹'}${netPL.toFixed(2)}
                </td>
            `;
            tbody.appendChild(row);
        });

        if (goats.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" style="text-align: center; color: #888;">No goats registered yet.</td>';
            tbody.appendChild(row);
        }
    }

    /* =============== GENERATE REPORT BUTTON =============== */
    generateReportBtn.addEventListener('click', function () {
        const reportDisplay = document.getElementById('reportDisplay');
        reportDisplay.scrollIntoView({ behavior: 'smooth' });
        updateReport();
    });

    /* =============== UTILITY FUNCTIONS =============== */
    function generateId() {
        return Date.now().toString();
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    }

    function showMessage(elementId, message, type) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.className = 'message ' + type;

        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 4000);
    }

    /* =============== INITIALIZE PAGE =============== */
    (async () => {
        await loadGoats();
        displayGoatCards();
        populateGoatSelect();
        displayLogHistory();
        updateReport();
    })();

    // Set today's date as default
    document.getElementById('logDate').valueAsDate = new Date();
});

/* =============== GLOBAL DELETE GOAT FUNCTION =============== */
function deleteGoat(id, goatId) {
    if (confirm(`Are you sure you want to remove ${goatId}? This will also delete all daily logs associated with this goat.`)) {
        // Try to delete from backend first
        (async () => {
            try {
                const res = await fetch(`/api/goats/${id}`, {
                    method: 'DELETE'
                });

                if (!res.ok) throw new Error('Server error');

                // Remove from local arrays
                window.goatManagerApp.goats = window.goatManagerApp.goats.filter(goat => goat.id !== id);
                window.goatManagerApp.dailyLogs = window.goatManagerApp.dailyLogs.filter(log => log.goatId !== goatId);
                
                // Update localStorage
                localStorage.setItem('goats', JSON.stringify(window.goatManagerApp.goats));
                localStorage.setItem('dailyLogs', JSON.stringify(window.goatManagerApp.dailyLogs));

                // Update display
                window.goatManagerApp.displayGoatCards();
                window.goatManagerApp.populateGoatSelect();
                window.goatManagerApp.updateReport();
                
                alert('Goat and all related logs deleted successfully!');
                return;
            } catch (err) {
                // fallback to localStorage when backend unavailable
                window.goatManagerApp.goats = window.goatManagerApp.goats.filter(goat => goat.id !== id);
                window.goatManagerApp.dailyLogs = window.goatManagerApp.dailyLogs.filter(log => log.goatId !== goatId);
                
                // Update localStorage
                localStorage.setItem('goats', JSON.stringify(window.goatManagerApp.goats));
                localStorage.setItem('dailyLogs', JSON.stringify(window.goatManagerApp.dailyLogs));

                // Update display
                window.goatManagerApp.displayGoatCards();
                window.goatManagerApp.populateGoatSelect();
                window.goatManagerApp.updateReport();
                
                alert('Goat deleted locally (server unavailable).');
            }
        })();
    }
}

/* =============== STICKY HEADER ON SCROLL =============== */
const topBar = document.getElementById('topBar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        topBar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    } else {
        topBar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    }
});