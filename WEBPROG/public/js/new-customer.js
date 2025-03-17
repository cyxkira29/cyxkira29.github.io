document.addEventListener("DOMContentLoaded", () => {
    if (typeof fetchCustomers === "function") {
        fetchCustomers();
    } else {
        console.error("❌ fetchCustomers is not defined!");
    }

    // Ensure form exists before adding event listener
    const form = document.getElementById("pawnForm");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            // ✅ Form validation to prevent empty fields
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
                const response = await fetch("http://localhost:3002/new-customer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCustomer)
                });

                const data = await response.json();
                alert(data.message);
                document.getElementById("pawnForm").reset();
                fetchCustomers();
            } catch (error) {
                console.error("❌ Error adding customer:", error);
            }
        });
    }
});

// ✅ Fetch customers and display them in a table
async function fetchCustomers() {
    try {
        const response = await fetch("http://localhost:3002/new-customer"); 
        const customers = await response.json();

        const customerTableBody = document.getElementById("customerTableBody");
        if (!customerTableBody) {
            console.error("❌ Element with ID 'customerTableBody' not found!");
            return;
        }

        customerTableBody.innerHTML = ""; // Clear existing table rows

        customers.forEach((customer) => {
            const formattedBirthday = customer.Customer_Birthday
                ? new Date(customer.Customer_Birthday).toISOString().split("T")[0]
                : "N/A";

            const row = `<tr>
                <td>${customer.Customer_ID}</td>
                <td>${customer.Customer_FirstName}</td>
                <td>${customer.Customer_MiddleInitial || ""}</td>
                <td>${customer.Customer_LastName}</td>
                <td>${customer.Customer_Gender}</td>
                <td>${customer.Customer_Address}</td>
                <td>${formattedBirthday}</td>
                <td>${customer.Customer_Nationality}</td>
                <td>${customer.Status}</td>
                <td>
                    <button class="btn btn-sm btn-warning toggle-status" 
                        data-id="${customer.Customer_ID}" 
                        data-status="${customer.Status === 'Active' ? 'Inactive' : 'Active'}">
                        ${customer.Status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-danger delete-customer" data-id="${customer.Customer_ID}">
                        Delete
                    </button>
                </td>
            </tr>`;
            
            customerTableBody.innerHTML += row;
        });

        console.log("✅ Customers loaded successfully!");
    } catch (error) {
        console.error("❌ Error fetching customers:", error);
    }
}

// ✅ Event listener for delete buttons
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-customer")) {
        const customerID = event.target.dataset.id;

        if (confirm("⚠️ Are you sure you want to delete this customer?")) {
            deleteCustomer(customerID);
        }
    }
});

// ✅ Update customer status (Activate/Deactivate)
async function updateCustomerStatus(customerID, newStatus) {
    try {
        const response = await fetch(`http://localhost:3002/new-customer/${customerID}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();
        alert(data.message);
        fetchCustomers(); // Reload customers after updating status
    } catch (error) {
        console.error("❌ Error updating customer status:", error);
    }
}

// ✅ Fix event listener for dynamically loaded buttons
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("toggle-status")) {
        updateCustomerStatus(event.target.dataset.id, event.target.dataset.status);
    }
});


// ✅ Function to delete customer
async function deleteCustomer(customerID) {
    try {
        const response = await fetch(`http://localhost:3002/delete-customer/${customerID}`, {
            method: "DELETE",
        });

        const data = await response.json();
        alert(data.message);
        fetchCustomers(); // Reload the customer list
    } catch (error) {
        console.error("❌ Error deleting customer:", error);
    }
}
