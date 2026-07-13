let currentDate = new Date();
const monthEmojis = ["❄️", "💖", "🌸", "🌼", "🌿", "🌞", "🏖️", "🍉", "🍂", "🎃", "🦃", "🎄"];
let currentUser = null;

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
}

function renderCalendar() {
    const daysElement = document.getElementById("days");
    const monthYearElement = document.getElementById("month-year");
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Update header
    monthYearElement.innerHTML = `${monthEmojis[currentDate.getMonth()]} <b>${firstDay.toLocaleString('default', { month: 'long' })}</b>`;

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
        }

        // Check for events
        const allEvents = getAllEvents();
        if (allEvents[dayElement.dataset.date]) {
            dayElement.classList.add("birthday");
        }

        dayElement.addEventListener("click", handleDayClick);
        daysElement.appendChild(dayElement);
    }
}

function getAllEvents() {
    let customEvents = {};
    if (currentUser) {
        const saved = localStorage.getItem(`events_${currentUser}`);
        if (saved) {
            customEvents = JSON.parse(saved);
        }
    }
    // Merge hardcoded birthdays and custom events
    const merged = { ...birthdays };
    for (const [date, eventName] of Object.entries(customEvents)) {
        if (merged[date]) {
            merged[date] += `<br>✨ ${eventName}`;
        } else {
            merged[date] = `✨ ${eventName}`;
        }
    }
    return merged;
}

function handleDayClick(event) {
    const selectedDate = event.target.dataset.date;
    const allEvents = getAllEvents();
    const birthdayLabel = document.getElementById("birthday-label");

    // Show event details
    if (allEvents[selectedDate]) {
        let displayHtml = allEvents[selectedDate];
        if (!displayHtml.includes("🎉") && !displayHtml.includes("✨")) {
            displayHtml = `🎉 ${displayHtml}`;
        } else if (displayHtml.startsWith("🎂")) {
           displayHtml = `🎉 ${displayHtml}`;
        }
        birthdayLabel.innerHTML = displayHtml;
        birthdayLabel.style.display = "block";
    } else {
        birthdayLabel.style.display = "none";
    }

    // Open Add Event modal if user is logged in
    if (currentUser) {
        document.getElementById("event-date-display").innerText = `Date: ${selectedDate}`;
        document.getElementById("event-date-hidden").value = selectedDate;
        document.getElementById("event-name-input").value = "";
        document.getElementById("event-modal").style.display = "flex";
    }
}

function closeEventModal() {
    document.getElementById("event-modal").style.display = "none";
}

function saveEvent() {
    if (!currentUser) return;
    const date = document.getElementById("event-date-hidden").value;
    const eventName = document.getElementById("event-name-input").value.trim();

    if (eventName && date) {
        // Sanitize input to prevent XSS
        const sanitizedEventName = eventName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let customEvents = {};
        const saved = localStorage.getItem(`events_${currentUser}`);
        if (saved) {
            customEvents = JSON.parse(saved);
        }

        // Append or set
        if (customEvents[date]) {
            customEvents[date] += `, ${sanitizedEventName}`;
        } else {
            customEvents[date] = sanitizedEventName;
        }

        localStorage.setItem(`events_${currentUser}`, JSON.stringify(customEvents));
        closeEventModal();
        renderCalendar(); // Re-render to show the new event dot and update label if it was open

        // Auto-show label for the newly added event
        const birthdayLabel = document.getElementById("birthday-label");
        const updatedEvents = getAllEvents();
        birthdayLabel.innerHTML = updatedEvents[date];
        birthdayLabel.style.display = "block";
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.replace('light-mode', 'dark-mode');
        document.getElementById('theme-icon').innerText = 'light_mode';
    }
}

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        icon.innerText = 'light_mode';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        icon.innerText = 'dark_mode';
        localStorage.setItem('theme', 'light');
    }
}

// Auth Logic
function initAuth() {
    const savedUser = localStorage.getItem('calendar_user');
    if (savedUser) {
        currentUser = savedUser;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    const userGreeting = document.getElementById('user-greeting');

    if (currentUser) {
        userGreeting.innerText = `Hi, ${currentUser}`;
        userGreeting.style.display = 'inline';
        authBtn.innerText = 'Logout';
        authBtn.onclick = logout;
    } else {
        userGreeting.style.display = 'none';
        authBtn.innerText = 'Login';
        authBtn.onclick = openLoginModal;
    }
}

function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function login() {
    const input = document.getElementById('username-input').value.trim();
    if (input) {
        currentUser = input;
        localStorage.setItem('calendar_user', currentUser);
        updateAuthUI();
        closeLoginModal();
        renderCalendar(); // Re-render to show user-specific events
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('calendar_user');
    updateAuthUI();
    renderCalendar();
}

// Initialization
initTheme();
initAuth();
renderCalendar();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}
