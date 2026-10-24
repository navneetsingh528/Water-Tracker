/* =========================================
   AQUATRACK - ADVANCED JAVASCRIPT
   ========================================= */

let usageData =
    JSON.parse(localStorage.getItem("waterUsage")) || [];

let currentChartRange = 7;


/* =========================================
   ADD USAGE PAGE
   ========================================= */

const usageForm = document.getElementById("usageForm");

if (usageForm) {

    const activitySelect =
        document.getElementById("activity");

    const waterUsedInput =
        document.getElementById("waterUsed");

    const suggestedUsage = {
        "Drinking": 3,
        "Bathing": 50,
        "Cooking": 10,
        "Washing Clothes": 40,
        "Washing Utensils": 15,
        "Cleaning": 20,
        "Gardening": 30,
        "Other": 0
    };

    if (activitySelect && waterUsedInput) {

        activitySelect.addEventListener("change", function () {

            const selectedActivity =
                activitySelect.value;

            if (
                suggestedUsage[selectedActivity]
                !== undefined
            ) {
                waterUsedInput.value =
                    suggestedUsage[selectedActivity];
            }

        });

    }


    const dateInput =
        document.getElementById("usageDate");

    if (
        dateInput &&
        !dateInput.value
    ) {
        dateInput.value =
            getTodayDate();
    }


    usageForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const activity =
                document.getElementById("activity").value;

            const waterUsed =
                Number(
                    document.getElementById("waterUsed").value
                );

            const usageDate =
                document.getElementById("usageDate").value;

            const notes =
                document.getElementById("notes").value;


            if (
                !activity ||
                !waterUsed ||
                !usageDate
            ) {

                alert(
                    "Please fill all required fields."
                );

                return;
            }


            const newUsage = {

                id: Date.now(),

                activity: activity,

                waterUsed: waterUsed,

                date: usageDate,

                notes: notes

            };


            usageData.push(newUsage);


            localStorage.setItem(
                "waterUsage",
                JSON.stringify(usageData)
            );


            alert(
                "Water usage saved successfully! 💧"
            );


            usageForm.reset();


            if (dateInput) {

                dateInput.value =
                    getTodayDate();

            }


            updateAddUsagePage();

        }
    );


    updateAddUsagePage();

}



/* =========================================
   HISTORY PAGE
   ========================================= */

const historyTable =
    document.querySelector("table tbody");

if (historyTable) {

    historyTable.innerHTML = "";


    if (usageData.length === 0) {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td colspan="4" style="text-align:center;">
                No water usage records yet.
            </td>
        `;

        historyTable.appendChild(row);

    }

    else {

        usageData
            .slice()
            .reverse()
            .forEach(function (usage) {

                const row =
                    document.createElement("tr");

                row.innerHTML = `

                    <td>
                        ${formatDate(usage.date)}
                    </td>

                    <td>
                        ${usage.activity}
                    </td>

                    <td>
                        ${usage.waterUsed} L
                    </td>

                    <td>
                        ✅ Saved
                    </td>

                `;

                historyTable.appendChild(row);

            });

    }

    updateHistoryTotal();

}



/* =========================================
   DASHBOARD
   ========================================= */

updateDashboard();

updateWeeklyStatistics();

updateWaterStreak();

createWaterChart();

setupChartControls();

updateComparison();

updateSmartInsight();

animateDashboardCards();



/* =========================================
   DASHBOARD MAIN FUNCTION
   ========================================= */

function updateDashboard() {

    const todayUsageElement =
        document.getElementById("todayUsage");

    if (!todayUsageElement) {
        return;
    }


    const today =
        getTodayDate();


    const todayTotal =
        getDailyTotal(today);


    /* TODAY USAGE */

    animateNumber(
        todayUsageElement,
        todayTotal,
        " L"
    );


    /* WATER BADGE */

    const badgeElement =
        document.getElementById("waterBadge");


    if (badgeElement) {

        if (todayTotal === 0) {

            badgeElement.textContent =
                "💧 Start tracking";

        }

        else if (todayTotal <= 50) {

            badgeElement.textContent =
                "🌱 Water Saver";

        }

        else if (todayTotal <= 75) {

            badgeElement.textContent =
                "💧 Water Wise";

        }

        else if (todayTotal <= 100) {

            badgeElement.textContent =
                "🏆 Water Champion";

        }

        else {

            badgeElement.textContent =
                "⚠️ High Usage";

        }

    }


    /* PROGRESS */

    const progress =
        Math.min(
            (todayTotal / 100) * 100,
            100
        );


    const progressBar =
        document.getElementById("todayProgress");


    if (progressBar) {

        setTimeout(function () {

            progressBar.style.width =
                progress + "%";

        }, 300);

    }


    /* GOAL PERCENTAGE */

    const goalPercent =
        document.getElementById("goalPercent");


    if (goalPercent) {

        animateNumber(
            goalPercent,
            Math.round(progress),
            "%"
        );

    }


    /* GOAL CIRCLE */

    const goalCircle =
        document.querySelector(".goal-circle");


    if (goalCircle) {

        const degrees =
            progress * 3.6;

        setTimeout(function () {

            goalCircle.style.background =
                `conic-gradient(
                    white ${degrees}deg,
                    rgba(255,255,255,0.15) ${degrees}deg
                )`;

        }, 300);

    }


    /* WATER SAVED */

    const savedElement =
        document.getElementById("waterSaved");


    if (savedElement) {

        const saved =
            Math.max(
                100 - todayTotal,
                0
            );

        animateNumber(
            savedElement,
            saved,
            " L"
        );

    }

}



/* =========================================
   WEEKLY STATISTICS
   ========================================= */

function updateWeeklyStatistics() {

    const averageElement =
        document.getElementById("weeklyAverage");

    if (!averageElement) {
        return;
    }


    let totalWeek = 0;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - i
        );


        const dateString =
            getDateString(date);


        totalWeek +=
            getDailyTotal(dateString);

    }


    const average =
        totalWeek / 7;


    animateNumber(
        averageElement,
        Math.round(average),
        " L"
    );

}



/* =========================================
   WATER STREAK
   ========================================= */

function updateWaterStreak() {

    const streakElement =
        document.getElementById("waterStreak");

    if (!streakElement) {
        return;
    }


    const goal = 100;

    let currentDate =
        new Date();

    let streak = 0;


    while (true) {

        const dateString =
            getDateString(currentDate);


        const dailyTotal =
            getDailyTotal(dateString);


        if (
            dailyTotal > 0 &&
            dailyTotal <= goal
        ) {

            streak++;


            currentDate.setDate(
                currentDate.getDate() - 1
            );

        }

        else {

            break;

        }

    }


    animateNumber(
        streakElement,
        streak,
        streak === 1 ? " Day" : " Days"
    );

}



/* =========================================
   CHART CONTROLS
   ========================================= */

function setupChartControls() {

    const sevenDayBtn =
        document.getElementById("sevenDayBtn");

    const thirtyDayBtn =
        document.getElementById("thirtyDayBtn");


    if (sevenDayBtn) {

        sevenDayBtn.addEventListener(
            "click",
            function () {

                currentChartRange = 7;

                sevenDayBtn.classList.add("active");

                if (thirtyDayBtn) {
                    thirtyDayBtn.classList.remove("active");
                }

                createWaterChart();

            }
        );

    }


    if (thirtyDayBtn) {

        thirtyDayBtn.addEventListener(
            "click",
            function () {

                currentChartRange = 30;

                thirtyDayBtn.classList.add("active");

                if (sevenDayBtn) {
                    sevenDayBtn.classList.remove("active");
                }

                createWaterChart();

            }
        );

    }

}



/* =========================================
   ADVANCED WATER CHART
   ========================================= */

function createWaterChart() {

    const chartCanvas =
        document.getElementById("waterChart");


    if (!chartCanvas) {
        return;
    }


    const labels = [];

    const values = [];

    const today =
        new Date();


    for (
        let i = currentChartRange - 1;
        i >= 0;
        i--
    ) {

        const date =
            new Date(today);

        date.setDate(
            today.getDate() - i
        );


        const dateString =
            getDateString(date);


        const total =
            getDailyTotal(dateString);


        if (currentChartRange === 7) {

            labels.push(
                date.toLocaleDateString(
                    "en-IN",
                    {
                        weekday: "short"
                    }
                )
            );

        }

        else {

            labels.push(
                date.getDate() +
                "/" +
                (date.getMonth() + 1)
            );

        }


        values.push(total);

    }


    if (window.aquaChart) {

        window.aquaChart.destroy();

    }


    const ctx =
        chartCanvas.getContext("2d");


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            330
        );


    gradient.addColorStop(
        0,
        "rgba(0,229,255,0.45)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,229,255,0.02)"
    );


    window.aquaChart =
        new Chart(
            chartCanvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Water Usage",

                            data: values,

                            borderWidth: 3,

                            tension: 0.4,

                            fill: true,

                            backgroundColor:
                                gradient,

                            borderColor:
                                "#ffffff",

                            pointBackgroundColor:
                                "#ffffff",

                            pointBorderColor:
                                "#00c6ff",

                            pointRadius:
                                currentChartRange === 30
                                    ? 3
                                    : 5,

                            pointHoverRadius:
                                8

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        intersect: false,

                        mode: "index"

                    },


                    animation: {

                        duration: 1000,

                        easing: "easeOutQuart"

                    },


                    plugins: {

                        legend: {

                            display: false

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        return (
                                            " Usage: " +
                                            context.parsed.y +
                                            " L"
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        x: {

                            ticks: {

                                maxTicksLimit:
                                    currentChartRange === 30
                                        ? 10
                                        : 7

                            }

                        },


                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function (value) {

                                        return (
                                            value +
                                            " L"
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );


    updateChartTotal(values);

}



/* =========================================
   CHART TOTAL
   ========================================= */

function updateChartTotal(values) {

    const totalElement =
        document.getElementById("chartTotal");


    if (!totalElement) {
        return;
    }


    const total =
        values.reduce(
            function (sum, value) {
                return sum + value;
            },
            0
        );


    totalElement.textContent =
        "Total: " + total + " L";

}



/* =========================================
   TODAY VS WEEKLY AVERAGE
   ========================================= */

function updateComparison() {

    const comparisonText =
        document.getElementById("comparisonText");

    const comparisonValue =
        document.getElementById("comparisonValue");


    if (
        !comparisonText ||
        !comparisonValue
    ) {
        return;
    }


    const todayTotal =
        getDailyTotal(
            getTodayDate()
        );


    let weeklyTotal = 0;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - i
        );


        weeklyTotal +=
            getDailyTotal(
                getDateString(date)
            );

    }


    const weeklyAverage =
        weeklyTotal / 7;


    if (weeklyAverage === 0) {

        comparisonText.textContent =
            "Start tracking your usage to compare today's performance.";

        comparisonValue.textContent =
            "--";

        return;

    }


    const difference =
        todayTotal - weeklyAverage;


    const percentage =
        Math.round(
            Math.abs(
                (difference / weeklyAverage) * 100
            )
        );


    if (difference > 0) {

        comparisonText.textContent =
            "Today's usage is higher than your weekly average.";

        comparisonValue.textContent =
            "+" + percentage + "%";

    }

    else if (difference < 0) {

        comparisonText.textContent =
            "Great! Today's usage is lower than your weekly average.";

        comparisonValue.textContent =
            "-" + percentage + "%";

    }

    else {

        comparisonText.textContent =
            "Today's usage is exactly around your weekly average.";

        comparisonValue.textContent =
            "0%";

    }

}



/* =========================================
   SMART INSIGHT
   ========================================= */

function updateSmartInsight() {

    const insight =
        document.getElementById("waterInsight");

    const description =
        document.getElementById("insightDescription");


    if (!insight) {
        return;
    }


    const todayTotal =
        getDailyTotal(
            getTodayDate()
        );


    let weeklyTotal = 0;


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date();

        date.setDate(
            date.getDate() - i
        );


        weeklyTotal +=
            getDailyTotal(
                getDateString(date)
            );

    }


    const weeklyAverage =
        weeklyTotal / 7;


    if (todayTotal === 0) {

        insight.textContent =
            "Start your water journey today 💧";

        if (description) {

            description.textContent =
                "Add your first water usage record and start understanding your daily habits.";

        }

    }

    else if (todayTotal <= 50) {

        insight.textContent =
            "Excellent! You're conserving water 🌱";

        if (description) {

            description.textContent =
                "Your recorded usage is currently within a low-consumption range.";

        }

    }

    else if (
        weeklyAverage > 0 &&
        todayTotal < weeklyAverage
    ) {

        insight.textContent =
            "You're doing better than your average! 📉";

        if (description) {

            description.textContent =
                "Today's recorded usage is below your recent weekly average.";

        }

    }

    else if (todayTotal <= 100) {

        insight.textContent =
            "You're within your daily goal 🏆";

        if (description) {

            description.textContent =
                "Keep monitoring your activities to maintain consistent water habits.";

        }

    }

    else {

        insight.textContent =
            "Today's usage is above your goal ⚠️";

        if (description) {

            description.textContent =
                "Review your activity records and look for opportunities to reduce unnecessary water use.";

        }

    }

}



/* =========================================
   DASHBOARD CARD ANIMATION
   ========================================= */

function animateDashboardCards() {

    const cards =
        document.querySelectorAll(
            ".dashboard-cards .card"
        );


    cards.forEach(
        function (card, index) {

            card.style.opacity = "0";

            card.style.transform =
                "translateY(25px)";


            setTimeout(
                function () {

                    card.style.transition =
                        "opacity 0.6s ease, transform 0.6s ease";

                    card.style.opacity =
                        "1";

                    card.style.transform =
                        "translateY(0)";

                },
                120 * index
            );

        }
    );

}



/* =========================================
   NUMBER ANIMATION
   ========================================= */

function animateNumber(
    element,
    target,
    suffix
) {

    if (!element) {
        return;
    }


    const start =
        Number(
            element.dataset.number || 0
        );


    element.dataset.number =
        target;


    const duration = 700;

    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const value =
            Math.round(
                start +
                (target - start) *
                eased
            );


        element.textContent =
            value + suffix;


        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }


    requestAnimationFrame(update);

}



/* =========================================
   ADD USAGE PAGE UPDATE
   ========================================= */

function updateAddUsagePage() {

    const todayElement =
        document.getElementById(
            "formTodayUsage"
        );

    const remainingElement =
        document.getElementById(
            "formRemaining"
        );


    if (
        !todayElement &&
        !remainingElement
    ) {
        return;
    }


    const today =
        getTodayDate();


    const todayTotal =
        getDailyTotal(today);


    const remaining =
        Math.max(
            100 - todayTotal,
            0
        );


    if (todayElement) {

        todayElement.textContent =
            todayTotal + " L";

    }


    if (remainingElement) {

        remainingElement.textContent =
            remaining + " L";

    }

}



/* =========================================
   HISTORY TOTAL
   ========================================= */

function updateHistoryTotal() {

    const summaryCard =
        document.querySelector(
            ".summary-card h1"
        );


    if (!summaryCard) {
        return;
    }


    const todayTotal =
        getDailyTotal(
            getTodayDate()
        );


    summaryCard.textContent =
        todayTotal + " L";

}



/* =========================================
   GET DAILY TOTAL
   ========================================= */

function getDailyTotal(dateString) {

    return usageData

        .filter(
            function (item) {

                return item.date === dateString;

            }
        )

        .reduce(
            function (total, item) {

                return (
                    total +
                    Number(item.waterUsed)
                );

            },
            0
        );

}



/* =========================================
   GET TODAY DATE
   ========================================= */

function getTodayDate() {

    return getDateString(
        new Date()
    );

}



/* =========================================
   GET DATE STRING
   ========================================= */

function getDateString(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}



/* =========================================
   FORMAT DATE
   ========================================= */

function formatDate(dateString) {

    const parts =
        dateString.split("-");


    if (parts.length !== 3) {

        return dateString;

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}