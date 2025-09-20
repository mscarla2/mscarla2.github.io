// Handles the custom strategy creation modal

function setupStrategyEditor() {
    const modal = document.getElementById('strategy-modal');
    const openBtn = document.getElementById('custom-strategy-btn');
    const closeBtn = document.querySelector('.modal-close');
    const background = document.querySelector('.modal-background');
    const saveBtn = document.getElementById('save-strategy-btn');

    if (!modal || !openBtn || !closeBtn || !background || !saveBtn) {
        return;
    }
    
    const openModal = () => modal.classList.add('is-active');
    const closeModal = () => modal.classList.remove('is-active');

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    background.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', () => {
        const name = document.getElementById('strategy-name').value;
        const description = document.getElementById('strategy-desc').value;
        const rulesCode = document.getElementById('strategy-rules').value;

        if (!name || !rulesCode) {
            alert('Strategy Name and Rules cannot be empty.');
            return;
        }

        try {
            // Use Function constructor to safely parse the rules
            // The code should return an object of functions.
            const getRules = new Function(`
                const rulesCode = () => { ${rulesCode} };
                return rulesCode();
            `);
            
            const newStrategy = {
                id: name.toLowerCase().replace(/\s+/g, '_'),
                name: name,
                description: description,
                params: [], // Custom strategies via this editor don't have configurable params for simplicity
                rules: getRules() // Execute the function to get the rules object
            };
            
            // Validate that the rules object has the correct structure
            if (typeof newStrategy.rules.entryLong !== 'function') {
                 throw new Error("The provided code must return an object with an 'entryLong' function.");
            }

            addCustomStrategy(newStrategy);
            renderStrategyOptions(); // Refresh the dropdown
            
            // Select the new strategy
            const select = document.getElementById('strategy-select');
            select.value = newStrategy.id;
            renderStrategyParams();

            closeModal();
        } catch (error) {
            alert('Error parsing strategy rules. Make sure it is valid JavaScript that returns an object like { entryLong, exitLong, ... }.\n\n' + error);
            console.error("Strategy parsing error:", error);
        }
    });
}

window.addEventListener("DOMContentLoaded", setupStrategyEditor);