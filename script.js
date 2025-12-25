const balanceEL = document.getElementById("balance");
const incomeEL = document.getElementById("income");
const expenseEL = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let myChart;

// Indian Currency Formatting
function formatCurrency(num) {
    return num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
}

function updateChart(income, expense) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, Math.abs(expense)],
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } }
        }
    });
}

function updateUI() {
    list.innerHTML = "";
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        const sign = t.type === "income" ? "+" : "-";
        const item = document.createElement("li");
        item.classList.add(t.type === "income" ? "plus" : "minus");
        
        item.innerHTML = `
            <div>
                <strong>${t.text}</strong><br>
                <small>${sign} ₹${formatCurrency(t.amount)}</small>
            </div>
            <button class="delete-btn" onclick="removeTransaction(${t.id})">Delete</button>
        `;
        list.appendChild(item);

        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    const total = income - expense;
    balanceEL.innerText = `₹${formatCurrency(total)}`;
    incomeEL.innerText = `+₹${formatCurrency(income)}`;
    expenseEL.innerText = `-₹${formatCurrency(expense)}`;

    updateChart(income, expense);
}

function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === "" || amount.value.trim() === "") return;

    const transaction = {
        id: Math.floor(Math.random() * 1000000),
        text: text.value,
        amount: parseFloat(amount.value),
        type: type.value
    };

    transactions.push(transaction);
    updateLocalStorage();
    updateUI();
    text.value = "";
    amount.value = "";
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    updateUI();
}

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener("submit", addTransaction);
updateUI();