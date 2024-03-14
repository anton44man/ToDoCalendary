const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const tasks = [];

function drawCalendar(month, year) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const calendarTable = document.getElementById("calendar-table");
    const monthYear = document.getElementById("month-year");

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    monthYear.textContent = `${months[month]} ${year}`;

    calendarTable.innerHTML = "";

    const headerRow = document.createElement("tr");

    days.forEach(day => {
        const th = document.createElement("th");
        th.textContent = day;
        headerRow.appendChild(th);
    });

    calendarTable.appendChild(headerRow);

    let currentDate = firstDayOfMonth;
    const daysInMonth = lastDayOfMonth.getDate();
    const startColor = "#b6d7a8";
    const endColor = "#ffee77";

    while (currentDate <= lastDayOfMonth) {
        const row = document.createElement("tr");

        for (let i = 0; i < 7; i++) {
            const day = currentDate.getDay();
            const date = currentDate.getDate();

            if (i < day || date > daysInMonth) {
                const td = document.createElement("td");
                td.classList.add("empty");
                row.appendChild(td);
            } else {
                const td = document.createElement("td");
                td.textContent = date;

                const percentage = (date - 1) / daysInMonth;
                const color = gradientColor(percentage, startColor, endColor);
                td.style.backgroundColor = color;

                if (currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() === new Date().getMonth() && date === new Date().getDate()) {
                    td.classList.add("today");
                }

                const task = getTaskByDate(currentDate);
                if (task) {
                    td.textContent += `\n${task}`;
                    const taskIndicator = document.createElement("div");
                    taskIndicator.classList.add("task-indicator");
                    td.appendChild(taskIndicator);
                }

                td.addEventListener("click", () => {
                    openModal(currentDate);
                });

                row.appendChild(td);
                currentDate.setDate(date + 1);
            }
        }

        const calendarBody = document.createElement("tbody");
        calendarBody.appendChild(row);
        calendarTable.appendChild(calendarBody);
    }

    function gradientColor(percentage, startColor, endColor) {
        const startRGB = hexToRgb(startColor);
        const endRGB = hexToRgb(endColor);

        const rDelta = endRGB.r - startRGB.r;
        const gDelta = endRGB.g - startRGB.g;
        const bDelta = endRGB.b - startRGB.b;

        const r = Math.round(startRGB.r + (rDelta * percentage));
        const g = Math.round(startRGB.g + (gDelta * percentage));
        const b = Math.round(startRGB.b + (bDelta * percentage));
return `rgb(${r}, ${g}, ${b})`;
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }



    function openModal(date) {
        const modal = document.getElementById("modal");
        const modalDay = document.getElementById("modal-day");
        const modalTask = document.getElementById("modal-task");
        const modalSave = document.getElementById("modal-save");

        modalDay.textContent = `Tasks for ${months[month]}`;
        modalTask.value = getTaskByDate(date) || "";
        modal.style.display = "block";

        modalSave.addEventListener("click", () => {
            const task = modalTask.value;
            if (task.trim().length > 0) {
                saveTask(date, task);
                modal.style.display = "none";
            }
        });

        window.addEventListener("click", (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }

    function saveTask(date, task) {
        const taskIndex = tasks.findIndex(taskObj => taskObj.date.toDateString() === date.toDateString());

        if (taskIndex === -1) {
            tasks.push({ date, task });
        } else {
            tasks[taskIndex] = { date, task };
        }

        drawCalendar(currentMonth, currentYear);
    }

    function getTaskByDate(date) {
        return tasks.find(task => task.date.toDateString() === date.toDateString())?.task;
    }}

drawCalendar(currentMonth, currentYear);


//-----------------------------------------------------//

const form = document.getElementById('addTaskForm');
const input = document.getElementById('newTaskInput');
const list = document.getElementById('taskList');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value.trim()) return;

    const task = document.createElement('li');
    task.classList.add('task');

    const taskName = document.createElement('span');
    taskName.classList.add('task-name');
    taskName.textContent = input.value.trim();
    task.appendChild(taskName);

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete-button');
    task.appendChild(completeButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    task.appendChild(deleteButton);

    list.appendChild(task);
    input.value = '';

    completeButton.addEventListener('click', () => {
        task.classList.toggle('completed');
    });

    deleteButton.addEventListener('click', () => {
        list.removeChild(task);
    });
});