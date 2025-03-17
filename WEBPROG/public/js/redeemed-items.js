document.addEventListener("DOMContentLoaded", function () {
    let selectedPawnticketId = null; // Store the item ID when redeeming

    // Get modal elements
    const redeemModal = document.getElementById("redeemModal");
    const closeModal = document.querySelector(".close");
    const confirmRedeemBtn = document.getElementById("confirmRedeem");
    const redeemedValueInput = document.getElementById("redeemedValue");

    // Open Modal
    window.openRedeemModal = function (pawnticketId) {
        selectedPawnticketId = pawnticketId;
        redeemedValueInput.value = ""; // Clear input
        redeemModal.style.display = "block";
    };

    // Close Modal
    closeModal.addEventListener("click", function () {
        redeemModal.style.display = "none";
    });

    // Confirm Redeem
    confirmRedeemBtn.addEventListener("click", async function () {
        const redeemedValue = parseFloat(redeemedValueInput.value.trim());

        if (isNaN(redeemedValue) || redeemedValue <= 0) {
            alert("❌ Please enter a valid redeemed value!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3002/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Pawnticket_ID: selectedPawnticketId, Redeemed_Value: redeemedValue }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("✅ Item redeemed successfully!");
                redeemModal.style.display = "none";
                fetchRedeemedItems(); // Refresh redeemed items table
            } else {
                alert("❌ Error redeeming item: " + result.message);
            }
        } catch (error) {
            console.error("❌ Redeem error:", error);
            alert("⚠️ Network or server error. Please try again.");
        }
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === redeemModal) {
            redeemModal.style.display = "none";
        }
    });
});
