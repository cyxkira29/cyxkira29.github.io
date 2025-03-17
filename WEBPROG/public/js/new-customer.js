const API_URL = "http://localhost:3002/new-customer"; // Replace with your actual API URL

document.addEventListener("DOMContentLoaded", () => {
    loadCustomers(); // Load customers on page load

    const form = document.getElementById("pawnForm");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const firstname = document.getElementById("firstname").value.trim();
            const lastname = document.getElementById("lastname").value.trim();

            if (!firstname || !lastname) {
                alert("⚠️ First name and last name are required!");
                return;
            }

            const newCustomer = {
                Customer_FirstName: firstname,
                Customer_MiddleInitial: document.getElementById("middle_initial").value.trim(),
                Customer_LastName: lastname,
                Customer_Birthday: document.getElementById("birthday").value.trim(),
                Customer_Address: document.getElementById("address").value.trim(),
                Customer_Nationality: document.getElementById("nationality").value.trim(),
                Customer_Gender: document.getElementById("gender").value
            };

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCustomer)
                });

                const data = await response.json();
                alert(data.message);
                form.reset();
                loadCustomers();
            } catch (error) {
                console.error("❌ Error adding customer:", error);
            }
        });
    }
});

// Function to fetch and display customers
async function loadCustomers() {
    try {
        const response = await fetch(API_URL);
        const customers = await response.json();

        const customerTableBody = document.getElementById("customerTableBody");
        if (!customerTableBody) {
            console.error("❌ Element with ID 'customerTableBody' not found!");
            return;
        }

        customerTableBody.innerHTML = ""; // Clear table before loading new data

        customers.forEach((customer, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${customer.Customer_FirstName}</td>
                <td>${customer.Customer_MiddleInitial || ""}</td>
                <td>${customer.Customer_LastName}</td>
                <td>${customer.Customer_Gender}</td>
                <td>${customer.Customer_Address}</td>
                <td>${customer.Customer_Birthday ? new Date(customer.Customer_Birthday).toISOString().split("T")[0] : "N/A"}</td>
                <td>${customer.Customer_Nationality}</td>
                <td>${customer.Status}</td>
                <td>
                    <button class="btn btn-sm btn-warning toggle-status" data-id="${customer.Customer_ID}" data-status="${customer.Status === 'Active' ? 'Inactive' : 'Active'}">
                        Status
                    </button>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${customer.Customer_ID}" 
                        data-firstname="${customer.Customer_FirstName}"
                        data-middleinitial="${customer.Customer_MiddleInitial || ''}"
                        data-lastname="${customer.Customer_LastName}"
                        data-gender="${customer.Customer_Gender}"
                        data-address="${customer.Customer_Address}"
                        data-birthday="${customer.Customer_Birthday}"
                        data-nationality="${customer.Customer_Nationality}"
                        data-status="${customer.Status}">
                        Edit
                    </button>
                </td>
            `;
            customerTableBody.appendChild(row);
        });

        console.log("✅ Customers loaded successfully!");
    } catch (error) {
        console.error("❌ Error fetching customers:", error);
    }
}

// Update customer status
async function updateCustomerStatus(customerID, newStatus) {
    try {
        const response = await fetch(`http://localhost:3002/new-customer/${customerID}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();
        alert(data.message);
        loadCustomers();
    } catch (error) {
        console.error("❌ Error updating customer status:", error);
    }
}

// Handle dynamic clicks for edit and status toggle
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("toggle-status")) {
        updateCustomerStatus(event.target.dataset.id, event.target.dataset.status);
    } else if (event.target.classList.contains("edit-btn")) {
        openEditModal(event.target.dataset);
    }
});

// Open Edit Modal
function openEditModal(customer) {
    document.getElementById("editCustomerId").value = customer.id;
    document.getElementById("editFirstName").value = customer.firstname;
    document.getElementById("editMiddleInitial").value = customer.middleinitial;
    document.getElementById("editLastName").value = customer.lastname;
    document.getElementById("editGender").value = customer.gender;
    document.getElementById("editAddress").value = customer.address;
    document.getElementById("editBirthday").value = customer.birthday;
    document.getElementById("editNationality").value = customer.nationality;
    document.getElementById("editStatus").value = customer.status;

    document.getElementById("editCustomerModal").style.display = "block";
}

// Close Edit Modal (Fix for null reference issue)
const closeEditButton = document.querySelector(".close-edit");
if (closeEditButton) {
    closeEditButton.addEventListener("click", function () {
        document.getElementById("editCustomerModal").style.display = "none";
    });
}

// Handle Edit Customer Form Submission (Fix for null reference issue)
const editCustomerForm = document.getElementById("editCustomerForm");
if (editCustomerForm) {
    editCustomerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const customerId = document.getElementById("editCustomerId").value;
        const updatedCustomer = {
            Customer_FirstName: document.getElementById("editFirstName").value.trim(),
            Customer_MiddleInitial: document.getElementById("editMiddleInitial").value.trim(),
            Customer_LastName: document.getElementById("editLastName").value.trim(),
            Customer_Gender: document.getElementById("editGender").value.trim(),
            Customer_Address: document.getElementById("editAddress").value.trim(),
            Customer_Birthday: document.getElementById("editBirthday").value.trim(),
            Customer_Nationality: document.getElementById("editNationality").value.trim(),
            Status: document.getElementById("editStatus").value.trim()
        };

        try {
            const response = await fetch(`${API_URL}/${customerId}/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCustomer),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Customer updated successfully!");
                document.getElementById("editCustomerModal").style.display = "none";
                loadCustomers();
            } else {
                alert("Error updating customer: " + data.error);
            }
        } catch (error) {
            console.error("❌ Error updating customer:", error);
        }
    });
}

console.log("✅ new-customer.js loaded successfully!");
