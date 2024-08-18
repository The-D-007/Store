document.addEventListener("DOMContentLoaded", () => {
  const cartItems = [];
  const cartItemsContainer = document.getElementById("cartItems");
  const clearCartButton = document.getElementById("clearCart");
  const checkoutButton = document.getElementById("checkout");
  const ordersButton = document.getElementById("allOrdersView");
  const logoutButton = document.getElementById("logoutButton");

  function renderCartItems() {
    cartItemsContainer.innerHTML = "";
    cartItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - $${item.price}`;
      cartItemsContainer.appendChild(li);
    });
  }

  function addToCart(event) {
    if (!document.getElementById("welcomeMessage").innerText) {
      return;
    }
    const product = event.target.closest(".product");
    const name = product.querySelector("h2").innerText;
    const price = product.querySelector("p").innerText.replace("Price: $", "");

    const item = { name, price };
    cartItems.push(item);
    renderCartItems();
  }


  function clearCart() {
    cartItems.length = 0;
    renderCartItems();
  }
  function checkout() {
    fetch("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems }),
    })
      .then((response) => response.text())
      .then((html) => {
        document.open();
        document.write(html);
        document.close();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        alert("Error during checkout");
      });
  }
  
  function logout() {
    sessionStorage.clear();
    document.getElementById("welcomeMessage").innerText = "";
  }

  document.querySelectorAll(".login.add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });

  logoutButton.addEventListener("click", logout);
  clearCartButton.addEventListener("click", clearCart);
    checkoutButton.addEventListener("click", checkout);
    ordersButton.addEventListener('click', () => {
        if (!document.getElementById('welcomeMessage').innerText) {
            return;
        }
        window.location.href = 'allOrders';
    });
  renderCartItems();

  var modal = document.getElementById("userDetailsModal");
  var span = document.getElementById("cross");

  document.querySelectorAll(".login").forEach((button) => {
    button.onclick = function () {
      if (!sessionStorage.getItem("userName")) {
        modal.style.display = "block";
      }
    };
  });

  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  document
    .getElementById("userDetailsForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const address = document.getElementById("address").value;
      const city = document.getElementById("city").value;
      const province = document.getElementById("province").value;
      const phone = document.getElementById("phone").value;
      const email = document.getElementById("email").value;

      fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          address: address,
          city: city,
          province: province,
          phone: phone,
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.userDetails) {
            document.getElementById("phoneWrong").style.display = "block";
            document.getElementById("phoneWrong").innerText = "Please enter 10 digits phone number.";
            return;
        }
          sessionStorage.setItem("userName", data.userDetails.name);
          document.getElementById(
            "welcomeMessage"
          ).innerText = `Welcome, ${data.userDetails.name}`;
          modal.style.display = "none";
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });
  
    const userName = sessionStorage.getItem("userName");
    if (userName) {
      document.getElementById("welcomeMessage").innerText = `Welcome, ${userName}`;
    }
});
