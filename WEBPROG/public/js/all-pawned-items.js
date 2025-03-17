document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Document Loaded!");

    const searchBar = document.getElementById("searchBar");
    const categoryFilter = document.getElementById("categoryFilter");
    const clearFilters = document.getElementById("clearFilters");
    const pawnedItemsTableBody = document.getElementById("pawnedItemsTableBody");
    const redeemedItemsTableBody = document.getElementById("redeemedItemsTableBody");
    const redeemedItemsTab = document.getElementById("redeemedItemsTab");

    if (!pawnedItemsTableBody || !redeemedItemsTableBody) {
        console.error("❌ Table body elements not found.");
        return;
    }

    // Function to fetch filtered pawned items
    function fetchFilteredItems() {
        fetch("http://localhost:3002/all-pawned-items")
            .then(response => response.json())
            .then(items => {
                console.log("📥 Fetched Pawned Items:", items);
                if (Array.isArray(items) && items.length > 0) {
                    displayPawnedItems(items);
                    fetchRedeemedItems(items);
                } else {
                    pawnedItemsTableBody.innerHTML = "<tr><td colspan='9' class='text-center'>❌ No items found.</td></tr>";
                }
            })
            .catch(error => console.error("❌ Fetch error:", error));
    }

    // Function to fetch redeemed items
    function fetchRedeemedItems() {
        fetch("http://localhost:3002/redeem-items")
            .then(response => response.json())
            .then(items => {
                console.log("📥 Fetched Redeemed Items:", items);
                redeemedItemsTableBody.innerHTML = "";
                if (Array.isArray(items) && items.length > 0) {
                    items.forEach(item => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${item.Redeemed_ID || "N/A"}</td>
                            <td>${item.Pawnticket_ID || "N/A"}</td>
                            <td>${item.Item_Value || "N/A"}</td>
                            <td>${item.Description || "N/A"}</td>
                            <td>${item.Category || "N/A"}</td>
                            <td>${item.Redeemed_Value || "N/A"}</td>
                            <td>${item.Redeemed_Date ? new Date(item.Redeemed_Date).toLocaleDateString() : "N/A"}</td>
                        `;
                        redeemedItemsTableBody.appendChild(row);
                    });
                } else {
                    redeemedItemsTableBody.innerHTML = "<tr><td colspan='7' class='text-center'>❌ No redeemed items found.</td></tr>";
                }
            })
            .catch(error => console.error("❌ Fetch error:", error));
    }

    // Fetch redeemed items when the tab is clicked
    if (redeemedItemsTab) {
        redeemedItemsTab.addEventListener("click", fetchRedeemedItems);
    }

    // Function to display pawned items in the table
    function displayPawnedItems(items) {
        pawnedItemsTableBody.innerHTML = "";
        items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.Item_ID || "N/A"}</td>
                <td>${item.Pawnticket_ID || "N/A"}</td>
                <td>${item.Item_Value || "N/A"}</td>
                <td>${item.Description || "N/A"}</td>
                <td>${item.Interest ? item.Interest + "%" : "N/A"}</td>
                <td>${item.Net_Value || "N/A"}</td>
                <td>${item.category || "N/A"}</td>
                <td>${formatDate(item.Maturity_Date)}</td>
                <td>${formatDate(item.Expiry_Date)}</td>
                <td>
                                    <button class="btn btn-warning move-btn" 
                                        data-item-id="${item.Item_ID}" 
                                        data-pawnticket-id="${item.Pawnticket_ID}">
                                        Delete
                                    </button>

                                    <button class="btn btn-primary update-btn" 
                                        data-item-id="${item.Item_ID}" 
                                        data-pawnticket-id="${item.Pawnticket_ID}"  
                                        data-bs-toggle="modal" data-bs-target="#updateModal">
                                        Redeem
                                    </button>
                                </td>
            `;
            pawnedItemsTableBody.appendChild(row);
        });
    }

    function formatDate(dateString) {
        return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    }
    

    // Attach search & filter functionality
    if (searchBar && categoryFilter && clearFilters) {
        searchBar.addEventListener("input", fetchFilteredItems);
        categoryFilter.addEventListener("change", fetchFilteredItems);
        clearFilters.addEventListener("click", function () {
            searchBar.value = "";
            categoryFilter.value = "";
            fetchFilteredItems();
        });
    }
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const customerId = this.getAttribute("data-id");
    
                // Populate modal fields with existing data
                document.getElementById("editCustomerId").value = customerId;
                document.getElementById("editFirstName").value = this.getAttribute("data-firstname");
                document.getElementById("editMiddleInitial").value = this.getAttribute("data-middleinitial");
                document.getElementById("editLastName").value = this.getAttribute("data-lastname");
                document.getElementById("editGender").value = this.getAttribute("data-gender");
                document.getElementById("editAddress").value = this.getAttribute("data-address");
                document.getElementById("editBirthday").value = this.getAttribute("data-birthday");
                document.getElementById("editNationality").value = this.getAttribute("data-nationality");
                document.getElementById("editStatus").value = this.getAttribute("data-status");
    
                // Show the modal
                let editModal = new bootstrap.Modal(document.getElementById("editCustomerModal"));
                editModal.show();
            });
        });
    });
    
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", function () {
                const customerId = this.getAttribute("data-id");
    
                // Populate modal fields with existing data
                document.getElementById("editCustomerId").value = customerId;
                document.getElementById("editFirstName").value = this.getAttribute("data-firstname");
                document.getElementById("editMiddleInitial").value = this.getAttribute("data-middleinitial");
                document.getElementById("editLastName").value = this.getAttribute("data-lastname");
                document.getElementById("editGender").value = this.getAttribute("data-gender");
                document.getElementById("editAddress").value = this.getAttribute("data-address");
                document.getElementById("editBirthday").value = this.getAttribute("data-birthday");
                document.getElementById("editNationality").value = this.getAttribute("data-nationality");
                document.getElementById("editStatus").value = this.getAttribute("data-status");
    
                // Show the modal
                let editModal = new bootstrap.Modal(document.getElementById("editCustomerModal"));
                editModal.show();
            });
        });
    });
    
    

    // Initial data load
    fetchFilteredItems();

    // Move to Auction Event Listeners
    function attachMoveToAuctionEventListeners() {
        document.querySelectorAll(".move-btn").forEach(button => {
            button.addEventListener("click", function () {
                const itemId = this.getAttribute("data-item-id");
                if (!itemId) {
                    alert("❌ Missing Item ID!");
                    return;
                }
                openAuctionModal(itemId);
            });
        });
    }

    function openAuctionModal(itemId) {
        const auctionModalElement = document.getElementById("AuctionModal");
        if (!auctionModalElement) {
            console.error("❌ AuctionModal not found!");
            return;
        }
        selectedItemId = itemId;
        const auctionModal = new bootstrap.Modal(auctionModalElement);
        auctionModal.show();
    }

    // Handle Auction Submission
    const auctionForm = document.getElementById("AuctionForm");
    if (auctionForm) {
        auctionForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const auctionPrice = document.getElementById("AuctionValue").value.trim();

            if (!auctionPrice || isNaN(auctionPrice) || auctionPrice <= 0) {
                alert("❌ Please enter a valid auction price.");
                return;
            }

            fetch("http://localhost:3002/all-pawned-items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item_id: selectedItemId, auction_price: auctionPrice })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        alert("✅ Item moved to auction successfully!");
                        fetchFilteredItems();
                        let auctionModal = bootstrap.Modal.getInstance(document.getElementById("AuctionModal"));
                        if (auctionModal) auctionModal.hide();
                    } else {
                        alert("❌ Error: " + data.message);
                    }
                })
                .catch(error => console.error("❌ Move to auction error:", error));
        });
    }

    // Update Event Listeners
    function attachUpdateEventListeners() {
        document.querySelectorAll(".update-btn").forEach(button => {
            button.addEventListener("click", function () {
                const itemId = this.getAttribute("data-item-id");
                const pawnticketId = this.getAttribute("data-pawnticket-id");

                console.log("🔄 Selected Item ID:", itemId);
                document.getElementById("confirmRedeemBtn").setAttribute("data-item-id", itemId);
                document.getElementById("confirmRenewBtn").setAttribute("data-item-id", itemId);
                document.getElementById("confirmRedeemBtn").setAttribute("data-pawnticket-id", pawnticketId);
                document.getElementById("confirmRenewBtn").setAttribute("data-pawnticket-id", pawnticketId);

                let selectionModal = new bootstrap.Modal(document.getElementById("selectionModal"));
                selectionModal.show();
            });
        });
    }

    // Handle Redeem Button
    const confirmRedeemBtn = document.getElementById("confirmRedeemBtn");
    if (confirmRedeemBtn) {
        confirmRedeemBtn.addEventListener("click", function () {
            closeModal("selectionModal");
            const pawnticketId = this.getAttribute("data-pawnticket-id");

            if (!pawnticketId) {
                alert("❌ Error: Pawnticket ID is missing!");
                return;
            }

            document.getElementById("redeemForm").setAttribute("data-pawnticket-id", pawnticketId);
            setTimeout(() => {
                let RedeemModal = new bootstrap.Modal(document.getElementById("RedeemModal"));
                RedeemModal.show();
            }, 300);
        });
    }

    function closeModal(modalId) {
        let modalElement = document.getElementById(modalId);
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
    }
    document.addEventListener("DOMContentLoaded", function () {
        console.log("✅ Document Loaded!");
    
        const pawnedItemsTableBody = document.getElementById("pawnedItemsTableBody");
    
        if (!pawnedItemsTableBody) {
            console.error("❌ Table body element not found.");
            return;
        }
    
        // ✅ Function to delete an item
        async function deleteItem(itemId) {
            if (!itemId) {
                alert("❌ Error: Invalid Item ID.");
                return;
            }
    
            const confirmation = confirm("Are you sure you want to delete this item?");
            if (!confirmation) return;
    
            try {
                const response = await fetch(`http://localhost:3002/pawned-items/${itemId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    alert(result.message);
                    fetchPawnedItems(); // Refresh table
                } else {
                    alert(`❌ Error: ${result.error}`);
                }
            } catch (error) {
                console.error("❌ Error deleting item:", error);
                alert("❌ Failed to delete item. Please try again.");
            }
        }
    
        // ✅ Event Delegation for Delete Button
        pawnedItemsTableBody.addEventListener("click", function (event) {
            if (event.target.classList.contains("move-btn")) {
                const itemId = event.target.dataset.itemId;
                deleteItem(itemId);
            }
        });
    
        // ✅ Function to fetch and display pawned items
        async function fetchPawnedItems() {
            try {
                const response = await fetch("http://localhost:3002/all-pawned-items");
                const items = await response.json();
    
                if (Array.isArray(items)) {
                    displayPawnedItems(items);
                } else {
                    console.error("❌ Unexpected response:", items);
                    alert("❌ Error fetching pawned items.");
                }
            } catch (error) {
                console.error("❌ Error fetching pawned items:", error);
            }
        }
    
        // ✅ Function to display items in the table
        function displayPawnedItems(items) {
            pawnedItemsTableBody.innerHTML = "";
            items.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.Item_ID || "N/A"}</td>
                    <td>${item.Pawnticket_ID || "N/A"}</td>
                    <td>${item.Item_Value || "N/A"}</td>
                    <td>${item.Description || "N/A"}</td>
                    <td>${item.Interest ? item.Interest + "%" : "N/A"}</td>
                    <td>${item.Net_Value || "N/A"}</td>
                    <td>${item.category || "N/A"}</td>
                    <td>${formatDate(item.Maturity_Date)}</td>
                    <td>${formatDate(item.Expiry_Date)}</td>
                    <td>
                        <button class="btn btn-warning move-btn" 
                            data-item-id="${item.Item_ID}">
                            Delete
                        </button>
    
                        <button class="btn btn-primary update-btn" 
                            data-item-id="${item.Item_ID}" 
                            data-pawnticket-id="${item.Pawnticket_ID}"  
                            data-bs-toggle="modal" data-bs-target="#updateModal">
                            Redeem
                        </button>
                    </td>
                `;
                pawnedItemsTableBody.appendChild(row);
            });
        }
    
        function formatDate(dateString) {
            return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
        }
    
        // ✅ Initial data load
        fetchPawnedItems();
    });
    
});
