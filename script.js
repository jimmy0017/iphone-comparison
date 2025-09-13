document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const modelSelect = document.getElementById('model');
    const storageSelect = document.getElementById('storage');
    const currencySelect = document.getElementById('currency');
    const resultDiv = document.getElementById('result');

    let data = [];
    let countryChoices, modelChoices, storageChoices;

    fetch('prices.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            populateFilters();
            initChoices();
            updateResult();
        });

    function populateFilters() {
        const countries = [...new Set(data.map(item => item['国家/地区']))];
        const models = [...new Set(data.map(item => item['型号']))];
        const storages = [...new Set(data.map(item => item['空间']))];

        populateSelect(countrySelect, countries);
        populateSelect(modelSelect, models);
        populateSelect(storageSelect, storages);
    }

    function populateSelect(selectElement, options) {
        options.forEach(option => {
            if (option) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
            }
        });
    }

    function initChoices() {
        const choicesOptions = {
            removeItemButton: true,
        };
        countryChoices = new Choices(countrySelect, choicesOptions);
        modelChoices = new Choices(modelSelect, choicesOptions);
        storageChoices = new Choices(storageSelect, choicesOptions);

        countrySelect.addEventListener('change', updateResult);
        modelSelect.addEventListener('change', updateResult);
        storageSelect.addEventListener('change', updateResult);
    }

    function updateResult() {
        const selectedCountries = countryChoices.getValue(true);
        const selectedModels = modelChoices.getValue(true);
        const selectedStorages = storageChoices.getValue(true);
        const selectedCurrency = currencySelect.value;

        const results = data.filter(item =>
            (selectedCountries.length === 0 || selectedCountries.includes(item['国家/地区'])) &&
            (selectedModels.length === 0 || selectedModels.includes(item['型号'])) &&
            (selectedStorages.length === 0 || selectedStorages.includes(item['空间']))
        );

        if (results.length > 0) {
            const headers = Object.keys(results[0]);
            let tableHTML = '<table class="table table-striped table-bordered">';
            tableHTML += '<thead class="table-dark">';
            tableHTML += '<tr>';
            headers.forEach(header => {
                tableHTML += `<th>${header}</th>`;
            });
            tableHTML += '</tr></thead>';
            tableHTML += '<tbody>';
            results.forEach((result, index) => {
                tableHTML += '<tr>';
                headers.forEach(header => {
                    if (header === '基础频段（相较美国）') {
                        const collapseId = `collapse-${index}`;
                        tableHTML += `<td>`;
                        tableHTML += `<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">`;
                        tableHTML += `Show/Hide`;
                        tableHTML += `</button>`;
                        tableHTML += `<div class="collapse" id="${collapseId}">`;
                        tableHTML += result[header];
                        tableHTML += `</div>`;
                        tableHTML += `</td>`;
                    } else {
                        tableHTML += `<td>${result[header]}</td>`;
                    }
                });
                tableHTML += '</tr>';
            });
            tableHTML += '</tbody></table>';
            resultDiv.innerHTML = tableHTML;
        } else {
            resultDiv.innerHTML = '<p>No data found for the selected combination.</p>';
        }
    }

    currencySelect.addEventListener('change', updateResult);
});
