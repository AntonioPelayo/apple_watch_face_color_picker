function loadCSV(filePath) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", filePath, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status == 0) {
                const lines = xhr.responseText.split("\n");
                const colorData = lines.map(line => line.split(','));
                colorData.shift(); // Remove the header

                window.appleWatchColors = colorData.map(data => ({
                    season: data[1],
                    name: data[2],
                    r: parseInt(data[3]),
                    g: parseInt(data[4]),
                    b: parseInt(data[5])
                }));
                populateDropdowns(window.appleWatchColors);
            }
        }
    };
    xhr.send(null);
}

function populateDropdowns(colorData) {
    const seasonDropdown = document.getElementById('seasonDropdown');
    const colorDropdown = document.getElementById('colorDropdown');

    const seasons = Array.from(new Set(colorData.map(data => data.season)));
    seasons.unshift("All Seasons"); // Add an "All Seasons" option

    seasons.forEach(season => {
        const option = document.createElement('option');
        option.value = season;
        option.textContent = season;
        seasonDropdown.appendChild(option);
    });

    seasonDropdown.addEventListener('change', function() {
        populateColorDropdown(this.value, colorData);
    });

    colorDropdown.addEventListener('change', function() {
        updateSeasonDropdown(this.value, colorData);
        setBackgroundColorByName(this.value, colorData);
    });

    populateColorDropdown("All Seasons", colorData);
}

function populateColorDropdown(season, colorData) {
    const colorDropdown = document.getElementById('colorDropdown');
    colorDropdown.innerHTML = ""; // Clear existing options

    let filteredData;
    if (season === "All Seasons") {
        filteredData = colorData;
    } else {
        filteredData = colorData.filter(data => data.season === season);
    }

    filteredData.forEach(data => {
        const option = document.createElement('option');
        option.value = data.name;
        option.textContent = data.name;
        colorDropdown.appendChild(option);
    });

    if (filteredData.length > 0) {
        setBackgroundColorByName(filteredData[0].name, colorData);
        updateSeasonDropdown(filteredData[0].name, colorData);
    }
}

function updateSeasonDropdown(colorName, colorData) {
    const selectedColor = colorData.find(data => data.name === colorName);
    const seasonDropdown = document.getElementById('seasonDropdown');
    if (selectedColor) {
        seasonDropdown.value = selectedColor.season;
    }
}

function setBackgroundColorByName(name, colorData) {
    const selectedColor = colorData.find(data => data.name === name);
    if (selectedColor) {
        document.body.style.backgroundColor = `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`;
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    loadCSV('../data/watch_face_colors.csv');
});