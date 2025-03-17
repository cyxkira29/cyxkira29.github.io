document.addEventListener("DOMContentLoaded", function () {
    // Toggle sidebar function
    function toggleSidebar() {
        document.getElementById("sidebar").classList.toggle("open");
        document.body.classList.toggle("sidebar-open");
    }

    document.querySelector(".menu-icon").addEventListener("click", toggleSidebar);

    // Modal handling
    const modal = document.getElementById("addModal");
    const openModalBtn = document.getElementById("openModal");
    const closeModalBtn = document.querySelector("#addModal .close-btn");
    const addForm = document.getElementById("addForm");
    const itemTable = document.getElementById("item-table");

    openModalBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    document.getElementById('lastNameSearch').addEventListener('input', async function () {
        let lastName = this.value.trim();
        console.log("Searching for last name:", lastName);
    
        let dropdown = document.getElementById('firstNameDropdown');
        dropdown.innerHTML = '<option value="">Select First Name</option>'; // Reset dropdown
    
        if (lastName.length > 1) {
            try {
                const response = await fetch(`http://localhost:3002/fetch_customers?last_name=${encodeURIComponent(lastName)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log("Parsed JSON:", data);
    
                if (data.length === 0) {
                    dropdown.innerHTML += '<option value="">No matches found</option>';
                } else {
                    data.forEach(customer => {
                        let option = document.createElement('option');
                        option.value = customer.Customer_ID;
                        option.textContent = customer.Customer_FirstName;
                        dropdown.appendChild(option);
                    });
                }
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        }
    });
    
    // ✅ Update customer ID field when selecting a first name
    document.getElementById('firstNameDropdown').addEventListener('change', function () {
        let selectedOption = this.options[this.selectedIndex];
        let customerIDField = document.getElementById('customerID');
        customerIDField.value = selectedOption.value || ""; // Set value (not textContent)
    });
    

    // Fetch items
    async function fetchItems() {
        try {
            const response = await fetch("http://localhost:3002/add-items");
            const items = await response.json();
            itemTable.innerHTML = "";

            items.forEach((item, index) => {
                let newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.Pawnticket_ID}</td>
                    <td>${item.Item_Value}</td>
                    <td>${item.Description}</td>
                    <td>${item.Interest}</td>
                    <td>${item.Net_Value}</td>
                    <td>${item.category}</td>
                    <td>${item.Is_Hidden === 1 ? "Hidden" : "Visible"}</td>
                    <td>
                        <button class="edit-btn" data-id="${item.Item_ID}">Edit</button>
                        <button class="delete-btn" data-id="${item.Item_ID}">Delete</button>
                    </td>
                `;
                itemTable.appendChild(newRow);
            });
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    // Add new pawn ticket
    document.getElementById("pawnTicketForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("Submitting form...");

        const selectedCustomerID = document.getElementById("firstNameDropdown").value;
        if (!selectedCustomerID) {
            alert("Please select a customer first!");
            return;
        }

        const formData = {
            customer_id: selectedCustomerID,
            ticket_number: document.getElementById("ticket_number").value,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            item_value: document.getElementById("item_value").value,
            interest: document.getElementById("interest").value,
            net_value: document.getElementById("net_value").value,
            maturity_date: document.getElementById("maturity_date").value,
            expiry_date: document.getElementById("expiry_date").value
        };

        try {
            const response = await fetch("http://localhost:3002/add-items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log(result);

            const responseMessage = document.getElementById("responseMessage");
            if (responseMessage) {
                responseMessage.textContent = result.message;
                responseMessage.style.color = result.status === "success" ? "green" : "red";
            } else {
                console.error("Error: Element with ID 'responseMessage' not found.");
            }

            if (response.ok) {
                fetchItems();
                modal.style.display = "none";
                addForm.reset();
            }
        } catch (error) {
            console.error("Fetch Error: ", error);
            alert("Network Error: Unable to submit data.");
        }
    });

    // Handle item table actions (edit/delete)
    itemTable.addEventListener("click", async function (event) {
        let target = event.target;
        let id = target.getAttribute("data-id");
        let row = target.closest("tr");

        if (target.classList.contains("edit-btn")) {
            if (target.textContent === "Edit") {
                row.cells[3].innerHTML = `<input type="text" value="${row.cells[3].textContent}" class="edit-input">`;
                row.cells[4].innerHTML = `<input type="text" value="${row.cells[4].textContent}" class="edit-input">`;
                row.cells[5].innerHTML = `<input type="text" value="${row.cells[5].textContent}" class="edit-input">`;
                target.textContent = "Save";
            } else {
                let newDescription = row.cells[3].querySelector(".edit-input").value.trim();
                let newInterest = row.cells[4].querySelector(".edit-input").value.trim();
                let newNetValue = row.cells[5].querySelector(".edit-input").value.trim();

                if (newDescription && newInterest && newNetValue) {
                    try {
                        const response = await fetch(`http://localhost:3002/add-items/${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                Description: newDescription,
                                Interest: newInterest,
                                Net_Value: newNetValue,
                            }),
                        });

                        if (response.ok) {
                            fetchItems();
                        } else {
                            const errorData = await response.json();
                            alert("Error updating item: " + errorData.error);
                        }
                    } catch (error) {
                        console.error("Error updating item:", error);
                    }
                } else {
                    alert("Please fill in all fields.");
                }
            }
        } else if (target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this item?")) {
                try {
                    const response = await fetch(`http://localhost:3002/add-items/${id}`, { method: "DELETE" });

                    if (response.ok) {
                        fetchItems();
                    } else {
                        const errorData = await response.json();
                        alert("Error deleting item: " + errorData.error);
                    }
                } catch (error) {
                    console.error("Error deleting item:", error);
                }
            }
        }
    });

    fetchItems();
});
