let currentDate = new Date();
const monthColors = ["#B3E5FC", "#FF80AB", "#A5D6A7", "#FFD54F", "#81C784", "#FF7043", "#D32F2F", "#FFB74D", "#8D6E63", "#FF5722", "#9575CD", "#2196F3"];
const monthEmojis = ["❄️", "💖", "🌸", "🌼", "🌿", "🌞", "🏖️", "🍉", "🍂", "🎃", "🦃", "🎄"];

const birthdays = {
    "1-15": "🎂 Lila's Birthday",
    "1-27": "🎂 Nithiya's Anjana Birthday",
    "2-12": "🎂 Jeevan's Birthday",
    "2-17": "🎂 Vidhu's Birthday",
    "2-19": "🎂 Kreep's Birthday",
    "4-1": "🎂 Sahu's Birthday",
    "5-15": "🎂 Lucy's Birthday",
    "5-21": "🎂 Aric's Birthday",
    "6-14": "🎂 Rit's Birthday",
    "6-19": "🎂 Iri's Birthday",
    "7-13": "🎂 Ann's Birthday",
    "7-22": "🎂 Ruby's Birthday",
    "8-2": "🎂 Sana's Birthday",
    "8-12": "🎂 Aqua's Birthday",
    "9-26": "🎂 Emi's Birthday",
    "10-11": "🎂 IDK Jun's Birthday",
    "10-25": "🎂 Dweep's Birthday",
    "11-19": "🎂 Eva's Birthday",
    "11-20": "🎂 Tim's Birthday",
    "11-25": "🎂 David's Birthday",
    "12-5": "🎂 julu's Birthday",
    "12-5": "🎂 Theo's Birthday"
};

function renderCalendar() {
    const daysElement = document.getElementById("days");
    const monthYearElement = document.getElementById("month-year");
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Update header
    monthYearElement.innerHTML = `${monthEmojis[currentDate.getMonth()]} <b>${firstDay.toLocaleString('default', { month: 'long' })}</b>`;

    // Update theme
    document.querySelector(".calendar").style.backgroundColor = monthColors[currentDate.getMonth()];

    // Clear previous days
    daysElement.innerHTML = "";

    // Empty spaces before first day
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty");
        daysElement.appendChild(emptyDiv);
    }

    // Add days to calendar
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.innerText = i;
        dayElement.dataset.date = `${currentDate.getMonth() + 1}-${i}`;

        // Highlight today's date
        if (i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth()) {
            dayElement.classList.add("current");
            dayElement.style.backgroundColor = darkenColor(monthColors[currentDate.getMonth()], 0.5);
        }

        // Check for birthdays
        if (birthdays[dayElement.dataset.date]) {
            dayElement.classList.add("birthday");
        }

        dayElement.addEventListener("click", showBirthday);
        daysElement.appendChild(dayElement);
    }
}

function showBirthday(event) {
    const birthdayLabel = document.getElementById("birthday-label");
    const selectedDate = event.target.dataset.date;

    if (birthdays[selectedDate]) {
        birthdayLabel.innerHTML = `🎉 ${birthdays[selectedDate]}`;
        birthdayLabel.style.display = "block"; // Show the label
    } else {
        birthdayLabel.style.display = "none"; // Hide the label if no event
    }
}

function darkenColor(hex, percent) {
    let num = parseInt(hex.slice(1), 16),
        amt = Math.round(2.55 * percent * 100),
        R = (num >> 16) - amt,
        G = ((num >> 8) & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;
    
    return `rgb(${Math.max(R, 0)}, ${Math.max(G, 0)}, ${Math.max(B, 0)})`;
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Initialize calendar
renderCalendar();