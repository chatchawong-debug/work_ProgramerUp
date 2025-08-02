document.addEventListener('DOMContentLoaded', () => {
    // === Elements จากหน้าเว็บหลัก ===
    const incomeItemsDiv = document.getElementById('income-items');
    const expenseItemsDiv = document.getElementById('expense-items');
    const addIncomeBtn = document.getElementById('add-income-btn');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const calculateBtn = document.getElementById('calculate-btn');

    // === Elements สำหรับ Pop-up ===
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupBtn = document.querySelector('.close-btn');
    const popupTotalIncomeSpan = document.getElementById('popup-total-income');
    const popupTotalExpensesSpan = document.getElementById('popup-total-expenses');
    const popupBalanceAmountSpan = document.getElementById('popup-balance-amount');
    const popupBalanceMessageDiv = document.getElementById('popup-balance-message');
    const popupAdviceMessageDiv = document.getElementById('popup-advice-message');
    const expenseChartPopupCanvas = document.getElementById('expense-chart-popup');
    let expenseChart = null; // สำหรับเก็บ instance ของ Chart.js (ใช้ร่วมกัน)

    // ฟังก์ชันสำหรับเพิ่มช่องกรอกรายรับ
    function addIncomeInput() {
        const div = document.createElement('div');
        div.classList.add('input-group');
        div.innerHTML = `
            <input type="text" placeholder="แหล่งรายรับ (เช่น เงินเดือน)" class="income-source">
            <input type="number" placeholder="จำนวนเงิน" min="0" class="income-amount">
            <button class="remove-btn">ลบ</button>
        `;
        incomeItemsDiv.appendChild(div);
        div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    }

    // ฟังก์ชันสำหรับเพิ่มช่องกรอกรายจ่าย
    function addExpenseInput() {
        const div = document.createElement('div');
        div.classList.add('input-group');
        div.innerHTML = `
            <input type="text" placeholder="รายการรายจ่าย (เช่น ค่าอาหาร)" class="expense-item">
            <input type="number" placeholder="จำนวนเงิน" min="0" class="expense-amount">
            <select class="expense-category">
                <option value="จำเป็น">ค่าใช้จ่ายจำเป็น</option>
                <option value="ผันแปร">ค่าใช้จ่ายผันแปร</option>
                <option value="หนี้สิน">หนี้สิน</option>
                <option value="ความบันเทิง">ความบันเทิง</option>
                <option value="อื่นๆ">อื่นๆ</option>
            </select>
            <button class="remove-btn">ลบ</button>
        `;
        expenseItemsDiv.appendChild(div);
        div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
    }

    // เพิ่มช่องกรอกเริ่มต้นเมื่อโหลดหน้า
    addIncomeInput();
    addExpenseInput();

    // Event Listeners สำหรับปุ่มเพิ่ม
    addIncomeBtn.addEventListener('click', addIncomeInput);
    addExpenseBtn.addEventListener('click', addExpenseInput);

    // Event Listener สำหรับปุ่มคำนวณ
    calculateBtn.addEventListener('click', () => {
        let totalIncome = 0;
        document.querySelectorAll('.income-amount').forEach(input => {
            totalIncome += parseFloat(input.value) || 0;
        });

        let totalExpenses = 0;
        const expenseCategories = {}; // สำหรับเก็บยอดรวมของแต่ละหมวดหมู่

        document.querySelectorAll('#expense-items .input-group').forEach(group => {
            const amountInput = group.querySelector('.expense-amount');
            const categorySelect = group.querySelector('.expense-category');
            const amount = parseFloat(amountInput.value) || 0;
            const category = categorySelect.value;

            totalExpenses += amount;

            if (expenseCategories[category]) {
                expenseCategories[category] += amount;
            } else {
                expenseCategories[category] = amount;
            }
        });

        const balance = totalIncome - totalExpenses;

        // === อัปเดตข้อมูลใน Pop-up ===
        popupTotalIncomeSpan.textContent = totalIncome.toFixed(2);
        popupTotalExpensesSpan.textContent = totalExpenses.toFixed(2);
        popupBalanceAmountSpan.textContent = balance.toFixed(2);

        popupBalanceMessageDiv.className = 'message';
        if (balance >= 0) {
            popupBalanceMessageDiv.classList.add('positive');
            popupBalanceMessageDiv.innerHTML = `คุณมีเงินเหลือ/เงินออมที่คาดการณ์ **${balance.toFixed(2)}** บาท เยี่ยมมาก!`;
        } else {
            popupBalanceMessageDiv.classList.add('negative');
            popupBalanceMessageDiv.innerHTML = `คุณมีรายจ่ายเกินรายรับที่คาดการณ์ **${Math.abs(balance).toFixed(2)}** บาท กรุณาทบทวนการใช้จ่าย!`;
        }

        popupAdviceMessageDiv.className = 'message';
        if (balance > 0) {
            popupAdviceMessageDiv.classList.add('positive');
            popupAdviceMessageDiv.innerHTML = `เงินเหลือนี้สามารถนำไปออม, ลงทุน, หรือใช้ชำระหนี้เพิ่มเติมเพื่อสร้างความมั่งคั่งได้!`;
        } else if (balance < 0) {
            popupAdviceMessageDiv.classList.add('negative');
            popupAdviceMessageDiv.innerHTML = `ลองทบทวนค่าใช้จ่ายในหมวดหมู่ที่มากที่สุด และพิจารณาหาทางลดค่าใช้จ่ายที่ไม่จำเป็น หรือเพิ่มแหล่งรายได้.`;
        } else {
            popupAdviceMessageDiv.classList.add('positive');
            popupAdviceMessageDiv.innerHTML = `การรักษาสมดุลรายรับรายจ่ายเป็นสิ่งสำคัญ ลองตั้งเป้าหมายการออมเพิ่มเติม.`;
        }

        // อัปเดตกราฟใน Pop-up
        updateExpenseChart(expenseCategories, expenseChartPopupCanvas);

        // แสดง Pop-up
        popupOverlay.classList.add('active');
    });

    // Event Listener สำหรับปิด Pop-up
    closePopupBtn.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
    });

    // ปิด Pop-up เมื่อคลิกนอกพื้นที่ Pop-up content (บน overlay)
    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.classList.remove('active');
        }
    });

    // ฟังก์ชันสำหรับอัปเดตกราฟ Chart.js (ปรับให้รับ canvas element)
    function updateExpenseChart(data, canvasElement) {
        if (expenseChart) {
            expenseChart.destroy(); // ลบกราฟเก่าถ้ามีอยู่
        }

        const labels = Object.keys(data);
        const values = Object.values(data);
        const backgroundColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#E7E9ED', '#8B0000', '#006400', '#FFD700'
        ];

        expenseChart = new Chart(canvasElement, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'สัดส่วนรายจ่ายตามหมวดหมู่'
                    }
                }
            }
        });
    }
});