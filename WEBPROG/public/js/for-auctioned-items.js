document.addEventListener("DOMContentLoaded", function () {
    fetchAuctionedItems(); // Fetch auctioned items from server
});

let selectedItemId = null; // Store selected item ID

// Function to fetch auctioned items from the server
function fetchAuctionedItems() {
    fetch("http://localhost:3002/for-auctioned-items")
        .then(response => response.json())
        .then(data => {
            console.log("📥 Full API Response:", data);

            // If API returns a single object instead of an array, wrap it in an array
            let items = Array.isArray(data) ? data : [data];

            displayAuctionedItems(items);
        })
        .catch(error => console.error("❌ Fetch error:", error));
}


// Function to display auctioned items in the table
function displayAuctionedItems(items) {
    const tableBody = document.querySelector("#auctioned-items-table tbody");

    if (items.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5' class='text-center'>❌ No auctioned items found.</td></tr>";
        return;
    }

    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.Item_ID || "N/A"}</td>
            <td>${item.Description || "N/A"}</td>
            <td>${item.Item_Value || "N/A"}</td>
            <td>${item.Net_Value || "N/A"}</td>
            <td>
                <button class="btn btn-warning sold-btn" data-item-id="${item.Item_ID}">SOLD</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    attachSoldEventListeners();
}

// Attach event listeners to "SOLD" buttons
function attachSoldEventListeners() {
    document.querySelectorAll(".sold-btn").forEach(button => {
        button.addEventListener("click", function () {
            selectedItemId = this.getAttribute("data-item-id");
            openSoldModal(selectedItemId);
        });
    });
}

// Function to open the "Sold" modal
function openSoldModal(itemId) {
    selectedItemId = itemId;
    let soldModal = new bootstrap.Modal(document.getElementById("SoldModal"));
    soldModal.show();
}

// Function to handle "Sold" form submission
document.getElementById("SoldForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const soldPrice = document.getElementById("SoldValue").value.trim();
    const customerId = document.getElementById("customerID").value.trim();

    if (!selectedItemId || !soldPrice || !customerId) {
        alert("❌ Please fill in all required fields.");
        return;
    }

    fetch("http://localhost:3002/for-auctioned-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: selectedItemId, sold_price: soldPrice, customer_id: customerId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("✅ Item sold successfully!");
            fetchAuctionedItems(); // Refresh auctioned items table
            let soldModal = bootstrap.Modal.getInstance(document.getElementById("SoldModal"));
            if (soldModal) soldModal.hide();
        } else {
            alert("❌ Error: " + data.message);
        }
    })
    .catch(error => console.error("❌ Sell error:", error));
});
