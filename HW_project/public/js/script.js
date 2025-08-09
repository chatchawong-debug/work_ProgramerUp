document.addEventListener('DOMContentLoaded', () => {
    const workItemsContainer = document.getElementById('work-items-container');
    const loadingMessage = document.getElementById('loading-message');

    // ต้องอัปเดตข้อมูลในส่วนนี้ด้วยตัวเอง เมื่อมีการเปลี่ยนแปลงไฟล์งาน
    const productCategories = [
        {
            name: "CH 1",
            items: [
                { name: "ch1", path: "files/html/ch1.html"},
                { name: "ch1 - let", path: "files/html/ch1 - let.html"},
                { name: "ch1 - oper", path: "files/html/ch1 - oper.html"},
                { name: "ch1 - prompt", path: "files/html/ch1 - prompt.html"}
            ]
        },
        {
            name: "CH 2",
            items: [
                { name: "ch2", path: "files/html/ch2.html" },
                { name: "ch2 - do - 1", path: "files/html/ch2 - do - 1.html" },
                { name: "ch2 - do - 2", path: "files/html/ch2 - do - 2.html" },
                { name: "ch2 - for - 1", path: "files/html/ch2 - for - 1.html" },
                { name: "ch2 - for - 2", path: "files/html/ch2 - for - 2.html" },
                { name: "ch2 - get - 1", path: "files/html/ch2 - get - 1.html" },
                { name: "ch2 - get - 2", path: "files/html/ch2 - get - 2.html" },
                { name: "ch2 - while - 1", path: "files/html/ch2 - while - 1.html" },
                { name: "ch2 - while - 2", path: "files/html/ch2 - while - 2.html" },
                { name: "ch2 - if", path: "files/html/ch2-if.html" },
                { name: "ch2 - ifelse", path: "files/html/ch2-ifelse.html" }
            ]
        },
        {
            name: "CH 3",
            items: [
                { name: "ch3 - addEventListener", path: "files/html/ch3 - addEventListener.html" },
                { name: "ch3 - filtering", path: "files/html/ch3 - filtering.html" },
                { name: "ch3 - Form Validation", path: "files/html/ch3 - Form Validation.html" },
                { name: "ch3 - inline", path: "files/html/ch3 - inline.html" },
                { name: "ch3 - Shopping Cart Calculator", path: "files/html/ch3 - Shopping Cart Calculator.html" },
                { name: "ch3 - To-Do List", path: "files/html/ch3 - To-Do List.html" },
            ]
        },
        {
            name: "CH 4",
            items: [ 
            ]
        },
        {
            name: "Project",
            items: [
                 { name: "WealthFlow Lite", path: "files/Mini_project/index.htm" }
            ]
        },
        {
            name: "Homework",
            items: [
                { name: "ch1 - prompt", path: "files/html/prompt.html" },
                { name: "ch2 - if else", path: "files/html/ch2-if else.html" },
                { name: "ch2 - stiwch case", path: "files/html/ch2-stiwch case.html" },
            ]
        }
    ];

    // ฟังก์ชันสำหรับสร้างรายการหมวดหมู่และไฟล์ (เหมือนเดิม)
    function renderProductCategories(productCategoriesData) { // เปลี่ยนชื่อ parameter ให้ชัดเจนขึ้น
        workItemsContainer.innerHTML = '';
        if (!productCategoriesData || productCategoriesData.length === 0) {
            workItemsContainer.innerHTML = '<div class="message">Notfound :( </div>';
            return;
        }

        const categoriesGrid = document.createElement('div');
        categoriesGrid.classList.add('categories-grid');
        workItemsContainer.appendChild(categoriesGrid);

        productCategoriesData.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.classList.add('category-card');

            const cardHeader = document.createElement('div');
            cardHeader.classList.add('card-header');
            const categoryName = document.createElement('h3');
            categoryName.textContent = category.name;
            cardHeader.appendChild(categoryName);
            categoryCard.appendChild(cardHeader);

            const itemList = document.createElement('ul');
            itemList.classList.add('item-list');
            itemList.style.display = 'none';

            if (category.items.length === 0) {
                const noItemMessage = document.createElement('li');
                noItemMessage.classList.add('message');
                noItemMessage.textContent = '): Not found :(';
                itemList.appendChild(noItemMessage);
            } else {
                category.items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <a href="${item.path}" target="_blank">
                            ${item.name}
                        </a>
                    `;
                    itemList.appendChild(listItem);
                });
            }
            categoryCard.appendChild(itemList);

            categoryCard.addEventListener('click', () => {
                document.querySelectorAll('.item-list').forEach(list => {
                    if (list !== itemList) {
                        list.style.display = 'none';
                        list.closest('.category-card').classList.remove('expanded');
                    }
                });

                if (itemList.style.display === 'none') {
                    itemList.style.display = 'block';
                    categoryCard.classList.add('expanded');
                } else {
                    itemList.style.display = 'none';
                    categoryCard.classList.remove('expanded');
                }
            });

            categoriesGrid.appendChild(categoryCard);
        });
    }

    // ซ่อนข้อความ Loading และแสดงรายการไฟล์งานทันที
    loadingMessage.style.display = 'none';
    renderProductCategories(productCategories); // เรียกใช้ฟังก์ชันด้วยข้อมูล hardcoded
});