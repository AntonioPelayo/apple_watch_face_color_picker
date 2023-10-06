function loadCSV(filePath) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status == 0) {
                const lines = xhr.responseText.split("\n");
                const colorData = lines.map(line => line.split(','));
                colorData.shift(); // Remove the header

                populateDropdowns(colorData);
            }
        }
    };
    xhr.send(null);
}

function populateDropdowns(colorData) {
    const seasonDropdown = document.getElementById('seasonDropdown');
    const nameDropdown = document.getElementById('nameDropdown');

    const seasons = Array.from(new Set(colorData.map(data => data[1])));
    seasons.unshift("All Seasons"); // Add an "All Seasons" option

    seasons.forEach(season => {
        const option = document.createElement('option');
        option.value = season;
        option.textContent = season;
        seasonDropdown.appendChild(option);
    });

    seasonDropdown.addEventListener('change', function() {
        populateNameDropdown(this.value, colorData);
    });

    populateNameDropdown("All Seasons", colorData);
}

function populateNameDropdown(season, colorData) {
    const nameDropdown = document.getElementById('nameDropdown');
    nameDropdown.innerHTML = ""; // Clear existing options

    let filteredData;
    if (season === "All Seasons") {
        filteredData = colorData;
    } else {
        filteredData = colorData.filter(data => data[0] === season);
    }

    filteredData.forEach(data => {
        const option = document.createElement('option');
        option.value = data[2];
        option.textContent = data[2];
        nameDropdown.appendChild(option);
    });

    nameDropdown.addEventListener('change', function() {
        setBackgroundColorByName(this.value, colorData);
    });
}

function setBackgroundColorByName(name, colorData) {
    const selectedColor = colorData.find(data => data[2] === name);
    if (selectedColor) {
        const [r, g, b] = selectedColor.slice(3);
        document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
}
